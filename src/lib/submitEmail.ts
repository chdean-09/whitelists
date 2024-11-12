'use server'

import prisma from './db';
import { emailTypeSchema } from './schema';

export default async function submitEmail(prevState: unknown, formData: FormData): Promise<{
  message: string | null;
  ok: boolean;
}> {
  try {
    const email = formData.get('email') as string;

    const validation = emailTypeSchema.safeParse(email);
    
    if (!validation.success) {
      const errorMessage = validation.error.errors[0].message;
      throw new Error(errorMessage);
    }

    const emailExists = await prisma.whitelisted.findFirst({
      where: {
        email: email
      }
    })

    if (emailExists) {
      throw new Error('Email is already whitelisted')
    }

    await prisma.whitelisted.create({
      data: {
        email: email
      }
    })

    return { message: 'Whitelisted email saved successfully!', ok: true }
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, ok: false }
    } else {
      console.log(error)
      return { message: 'An error occurred', ok: false }
    }
  }
}