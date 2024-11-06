import { z } from 'zod';

const csvTypeSchema = z.object({
  email: z
    .string({
      required_error: 'Email address is missing',
    })
    .email({
      message: 'Invalid email address',
    }),
});

export const csvArraySchema = z.array(csvTypeSchema);

export const emailTypeSchema = z.coerce.string()
  .email({
    message: "Invalid email address",
  });