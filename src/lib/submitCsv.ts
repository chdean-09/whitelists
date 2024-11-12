'use server'

import csv from 'csvtojson';
import prisma from './db';
import { csvArraySchema } from './schema';

export default async function submitCSV(prevState: unknown, formData: FormData): Promise<{
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
    const validation = csvArraySchema.safeParse(jsonArray);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0].message;
      throw new Error(errorMessage);
    }

    const validatedEmails = jsonArray as { email: string; }[]

    const duplicates: { email: string }[] = [];

    for (const item of validatedEmails) {
      const emailExists = await prisma.whitelisted.findFirst({
        where: { email: item.email }
      });

      if (emailExists) {
        duplicates.push({ email: item.email });
      } else {
        await prisma.whitelisted.create({
          data: {
            email: item.email
          }
        })
      }
    }

    if (duplicates.length === validatedEmails.length) {
      return { message: 'All emails are already whitelisted', ok: false }
    } else if (duplicates.length > 0) {
      return { duplicates: duplicates, message: 'Some emails were added successfully, but some were already whitelisted.', ok: true }
    } else {
      return { message: 'All emails now whitelisted successfully!', ok: true }
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