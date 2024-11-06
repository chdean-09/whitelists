'use server'

import prisma from './db';
import { emailTypeSchema } from './schema';

export default async function submitEmail(prevState: unknown, formData: FormData): Promise<{
  message: string | null;
  ok: boolean;
}> {
  const email = formData.get('email') as string;

  const validation = emailTypeSchema.safeParse(email);
  
  if (!validation.success) {
    const errorMessage = validation.error.errors[0].message;
    return { message: errorMessage, ok: false };
  }

  try {
    await prisma.whitelisted.create({
      data: {
        email: email
      }
    })

    return { message: 'Whitelisted email saved successfully!', ok: true }
  } catch (error) {
    console.log(error);
    return { message: 'Having trouble saving the whitelisted email', ok: false }
  }
}