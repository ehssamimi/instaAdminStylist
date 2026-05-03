'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'

import { Form, FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { FormItemInput } from '@/components/ui/form-item-input'
import { strongPasswordSchema } from '@/lib/validation-schemas'
import { authApi } from '@/lib/api'

const resetPasswordFormSchema = z
  .object({
    password: strongPasswordSchema,
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token =
    searchParams.get('token') ??
    searchParams.get('reset_token') ??
    ''
  const hasValidToken = token.trim().length > 0

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    if (!token.trim()) {
      toast.error('This reset link is invalid or expired. Request a new one from the login page.')
      return
    }

    try {
      const response = await authApi.resetPassword({
        token: token.trim(),
        password: values.password,
      })

      if (response.success === false) {
        toast.error(
          response.message?.trim() ||
            'Could not set your password. Try again or request a new reset link.'
        )
        return
      }

      toast.success('Password set. Please log in.')
      router.push('/admin-login')
    } catch (error) {
      let errorMessage = 'Could not reset password. Please try again.'
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        errorMessage = apiError.response?.data?.message ?? errorMessage
      }
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <header className="py-6 px-8 bg-surface  ">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex justify-center items-center">
            <Image src="/logo.svg" alt="Insta Styling" width={180} height={32} />
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="rounded-xl overflow-hidden flex flex-col md:flex-row">
          <div className="py-[60px] px-6  flex-grow-0 flex-shrink-0 basis-[480px] bg-white">
            <div className="mx-auto flex max-w-md flex-col items-center text-center">
              <h1 className="font-satoshi text-3xl font-bold text-neutral-black_03 mb-5">
                Create New Password
              </h1>
              <p className="font-satoshi text-base text-gray-700 mb-5 leading-relaxed">
                Your new password must be different from the previous one.
              </p>
            </div>

            {!hasValidToken ? (
              <div
                className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-satoshi text-sm text-amber-900"
                role="alert"
              >
                This link is missing a valid token. Open the reset link from your email, or request a
                new one from{' '}
                <Link href="/admin-login" className="font-semibold underline underline-offset-2">
                  Sign in
                </Link>
                .
              </div>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItemInput
                        id="new-password"
                        label="New Password"
                        placeholder="************"
                        autoComplete="new-password"
                        passwordToggle
                         className="h-[var(--height-form-field)]"
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItemInput
                        id="confirm-new-password"
                        label="Confirm New Password"
                        placeholder="************"
                        autoComplete="new-password"
                        passwordToggle
                         className="h-[var(--height-form-field)]"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="flex w-full flex-col gap-3  ">
                  <Button
                    type="submit"
                    className="w-full font-satoshi text-base h-12 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    disabled={isSubmitting || !hasValidToken}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Resetting…' : 'Reset Password'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full font-satoshi text-base h-12 rounded-lg border-gray-300 bg-white font-semibold text-neutral-black_03 hover:bg-gray-50"
                    asChild
                  >
                    <Link href="/admin-login">Back to Sign In</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <footer className="py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 insta styling. all rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
