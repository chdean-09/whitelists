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
  const csvFile = formData.get('csvFile') as File;

  try {
    const fileText = await csvFile.text();

    const jsonArray = await csv().fromString(fileText);
    const validation = csvArraySchema.safeParse(jsonArray);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0].message;
      return { message: errorMessage, ok: false };
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
    console.log(error);
    return { message: 'Having trouble saving the whitelisted emails', ok: false }
  }
}