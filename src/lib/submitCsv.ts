'use server'

import csv from 'csvtojson';
import prisma from './db';

interface csvType {
  email: string
}

export default async function submitCSV(prevState: unknown, formData: FormData): Promise<{
  message: string | null;
  ok: boolean;
}> {
  const csvFile = formData.get('csvFile');

  if (csvFile && csvFile instanceof File) {
    try {
      const fileText = await csvFile.text();

      const jsonArray: csvType[] = await csv().fromString(fileText);
      const some: csvType[] = [
        { email: '' }, { email: 'sd' }
      ]

      await prisma.whitelisted.createMany({
        data: some
      })

      return { message: 'Whitelisted emails saved successfully', ok: true }
    } catch (error) {
      console.error(error);
      return { message: 'Having trouble saving the whitelisted emails', ok: false }
    }
  } else {
    console.error("No file selected or file type is incorrect.");
    return { message: 'No file selected or file type is incorrect.', ok: false }
  }
}