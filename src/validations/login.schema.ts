import { z } from 'zod';

export const loginSchema = z.object({
  userNameOrEmailAddress: z
    .string()
    .trim()
    .min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberClient: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
