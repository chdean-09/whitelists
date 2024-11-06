'use server'

import csv from 'csvtojson';
import prisma from './db';
import { csvArraySchema } from './schema';

export default async function submitCSV(prevState: unknown, formData: FormData): Promise<{
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

    await prisma.whitelisted.createMany({
      data: jsonArray,
    })

    return { message: 'Whitelisted emails saved successfully!', ok: true }
  } catch (error) {
    console.log(error);
    return { message: 'Having trouble saving the whitelisted emails', ok: false }
  }
}