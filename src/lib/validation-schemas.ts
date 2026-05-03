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

/** Email-link reset / verify-password: match backend-friendly rules on the client. */
export const strongPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(9, 'Password must be more than 8 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[0-9]/, 'Include at least one number')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character')

export type LoginFormValues = z.infer<typeof loginFormSchema>
