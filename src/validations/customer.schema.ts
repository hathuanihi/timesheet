import { z } from 'zod';
import {
  CLIENT_ADDRESS_MAX,
  CLIENT_CODE_MAX,
  CLIENT_NAME_MAX,
} from '@/constants/validationRules';

export const addClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(CLIENT_NAME_MAX, `Max ${CLIENT_NAME_MAX} chars`),
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(CLIENT_CODE_MAX, `Max ${CLIENT_CODE_MAX} chars`),
  address: z
    .string()
    .trim()
    .max(CLIENT_ADDRESS_MAX, `Max ${CLIENT_ADDRESS_MAX} chars`)
    .optional()
    .or(z.literal('')),
});

export type AddClientValues = z.infer<typeof addClientSchema>;
