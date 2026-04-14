import { z } from 'zod'

// Login form validation schema
// - email: required, valid format
// - password: required, min 6 chars
export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export const emailSchema = z.string().trim().min(1, 'Email is required').email('Enter a valid email address')

export const passwordSchema = z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters')

export type LoginFormValues = z.infer<typeof loginFormSchema>
