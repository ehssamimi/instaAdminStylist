'use client'

import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import OtpInput from 'react-otp-input'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { emailSchema, passwordSchema } from '@/lib/validation-schemas'
import { authApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'

// Schema for email validation
const emailFormSchema = z.object({
  email: emailSchema,
})

// Schema for reset password validation
const resetPasswordSchema = z.object({
  password: passwordSchema,
  password_confirmation: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
})

type Step = 'email' | 'otp' | 'resetPassword'

export default function ForgetPasswordPreview() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otpError, setOtpError] = useState('')

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  })

  const { isSubmitting: isEmailSubmitting } = emailForm.formState
  const { isSubmitting: isResetSubmitting } = resetPasswordForm.formState

  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    try {
      const response = await authApi.forgotPassword(values.email)
      toast.success((response as { message: string }).message)
      setEmail(values.email)
      setStep('otp')
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send OTP. Please try again.'

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        errorMessage = apiError.response?.data?.message || errorMessage
      }
      toast.error(errorMessage)
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 4) {
      setOtpError('Please enter a valid 4-digit OTP')
      return
    }

    setIsVerifying(true)
    setOtpError('')

    try {
      const response = await authApi.verifyPasswordResetOtp({
        email: email,
        otp: otp,
      })
      toast.success('OTP verified successfully!')
      setResetToken(response.reset_token)
      setStep('resetPassword')
    } catch (error) {
      console.error('OTP verification error:', error)
      let errorMessage = 'Invalid OTP. Please try again.'

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        errorMessage = apiError.response?.data?.message || errorMessage
      }
      setOtpError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  async function onResetPasswordSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      const response = await authApi.resetPassword({
        reset_token: resetToken,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })
      toast.success(response.message || 'Password reset successfully!')
      router.push('/admin-login')
    } catch (error) {
      console.error('Reset password error:', error)
      let errorMessage = 'Failed to reset password. Please try again.'

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        errorMessage = apiError.response?.data?.message || errorMessage
      }
      toast.error(errorMessage)
    }
  }

  async function handleResendOtp() {
    setIsResending(true)
    try {
      await authApi.forgotPassword(email)
      toast.success('OTP sent to your email')
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  function getTitle() {
    switch (step) {
      case 'email':
        return 'Forgot Password'
      case 'otp':
        return 'Verify OTP'
      case 'resetPassword':
        return 'Reset Password'
    }
  }

  function getDescription() {
    switch (step) {
      case 'email':
        return 'Enter your email address to receive an OTP to reset your password.'
      case 'otp':
        return `A verification code has been sent to ${email}`
      case 'resetPassword':
        return 'Enter your new password below.'
    }
  }

  return (
    <div className="flex min-h-[40vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-8">
                <div className="grid gap-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="johndoe@mail.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isEmailSubmitting}>
                    {isEmailSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <OtpInput
                  value={otp}
                  onChange={(value) => {
                    setOtp(value)
                    setOtpError('')
                  }}
                  numInputs={4}
                  renderSeparator={<span className="mx-1">-</span>}
                  renderInput={(props) => <input {...props} />}
                  inputStyle={{
                    width: '3rem',
                    height: '3rem',
                    margin: '0 0.5rem',
                    fontSize: '1rem',
                    borderRadius: 4,
                    border: '2px solid rgba(0,0,0,0.3)',
                  }}
                />
              </div>

              {otpError && (
                <p className="text-sm text-red-500 text-center">{otpError}</p>
              )}

              <Button
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={isVerifying || otp.length !== 4}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className="text-sm text-gray-600 text-center">
                {`Didn't get an email? `}
                <span
                  className="text-primary cursor-pointer underline"
                  onClick={handleResendOtp}
                >
                  {isResending ? 'Sending...' : 'Send again'}
                </span>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setOtpError('')
                }}
              >
                Back to Email
              </Button>
            </div>
          )}

          {step === 'resetPassword' && (
            <Form {...resetPasswordForm}>
              <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-6">
                <div className="grid gap-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="password">New Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            placeholder="Enter new password"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetPasswordForm.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="password_confirmation">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password_confirmation"
                            placeholder="Confirm new password"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isResetSubmitting}>
                    {isResetSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
