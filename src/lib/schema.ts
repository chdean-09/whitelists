import { z } from 'zod';

export const csvTypeSchema = z.object({
  email: z
    .string({
      required_error: 'Email address is missing',
    })
});

export const emailTypeSchema = z.coerce.string()
  .email({
    message: "Invalid email address",
  });