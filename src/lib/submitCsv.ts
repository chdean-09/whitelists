'use server'

import csv from 'csvtojson';
import prisma from './db';
import { csvTypeSchema, emailTypeSchema } from './schema';

export default async function submitCSV(prevState: unknown, formData: FormData): Promise<{
  invalids?: {
    email: string;
  }[];
  duplicates?: {
    email: string;
  }[];
  message: string | null;
  ok: boolean;
}> {
  try {
    const csvFile = formData.get('csvFile') as File;

    if (
      csvFile.type !== "text/csv" &&
      csvFile.type !== "application/vnd.ms-excel"
    ) {
      throw new Error('Invalid file type. Please upload a CSV file');
    }

    const fileText = await csvFile.text();

    const jsonArray = await csv().fromString(fileText);

    const validateHeaderColumn = csvTypeSchema.safeParse(jsonArray[0])

    if (
      !validateHeaderColumn.success &&
      validateHeaderColumn.error.errors[0].message === 'Email address is missing'
    ) {
      throw new Error('Invalid csv header column. Ensure a column is named "email"');
    }

    const duplicates: { email: string }[] = [];
    const invalids: { email: string }[] = [];

    for (const item of jsonArray) {
      const email = item.email;

      const validatedEmail = emailTypeSchema.safeParse(email);

      if (!validatedEmail.success) {
        invalids.push({ email: email });
        continue;
      }

      const emailExists = await prisma.whitelisted.findFirst({
        where: { email: item.email }
      });

      if (emailExists) {
        duplicates.push({ email: item.email });
        continue;
      } else {
        await prisma.whitelisted.create({
          data: {
            email: item.email
          }
        })
      }
    }

    if (duplicates.length === jsonArray.length) {
      return {
        message: 'All emails are already whitelisted',
        ok: false
      }
    } else if (invalids.length === jsonArray.length) {
      return {
        message: 'All emails are invalid. Double check the format',
        ok: false
      }
    } else if (duplicates.length + invalids.length === jsonArray.length) {
      return {
        duplicates: duplicates,
        invalids: invalids,
        message: 'All emails are either invalid or duplicates, no emails are whitelisted',
        ok: false
      }
    } else if (invalids.length > 0 && duplicates.length > 0) {
      return {
        invalids: invalids,
        duplicates: duplicates,
        message: 'Some emails are either invalid or duplicates, but the rest are added successfully',
        ok: true
      }
    } else if (duplicates.length > 0) {
      return {
        duplicates: duplicates,
        message: 'Some emails are already whitelisted, but the rest are added successfully',
        ok: true
      }
    } else if (invalids.length > 0) {
      return {
        invalids: invalids,
        message: 'Some emails are invalid, but the rest are added successfully',
        ok: true
      }
    } else {
      return {
        message: 'All emails now whitelisted successfully!',
        ok: true
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, ok: false }
    } else {
      console.log(error)
      return { message: 'An error occurred', ok: false }
    }
  }
}