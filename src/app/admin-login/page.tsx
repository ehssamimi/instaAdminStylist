"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import OtpInput from 'react-otp-input';

import {
  Form,
  FormField,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { FormItemInput } from '@/components/ui/form-item-input'

import { emailSchema, loginFormSchema } from '@/lib/validation-schemas'
import { authApi } from '@/lib/api'
import { persistSession, clearRefreshToken, updateAccessToken } from '@/lib/jwt-utils'
import Image from 'next/image';

const formSchema = loginFormSchema
const forgotEmailSchema = z.object({
  email: emailSchema,
})

const LoginPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'otp' | 'forgot-password'>('login')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [forgotResendTimer, setForgotResendTimer] = useState(0)
  const [isForgotSending, setIsForgotSending] = useState(false)
  const [isForgotResending, setIsForgotResending] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const forgotForm = useForm<z.infer<typeof forgotEmailSchema>>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Use our API client for login
      const response = await authApi.login({
        email: values.email.toLowerCase(),
        password: values.password,
      })

      if (response?.accessToken) {
        persistSession(response.accessToken, response.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.user))
        document.cookie = `user=${JSON.stringify(response.user)}; path=/`
        if (response.user?.type === "admin") {
          toast.success('Login successful!')
          router.push('/dashboard')
          // Keep loading until the dashboard route mounts (this page unmounts).
          return
        }
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.'

      // Type guard to check if error has the expected structure
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        errorMessage = apiError.response?.data?.message || errorMessage
      }
      toast.error(errorMessage)
    }
    setIsLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      setOtpError('Verification code must have 4 digits')
      return
    }

    setIsLoading(true)
    setOtpError('')
    try {
      const response = await authApi.verifyEmailOtp({
        email: email.toLowerCase(),
        otp: otp,
        device_name: "Portal"
      })

      clearRefreshToken()
      updateAccessToken(response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      document.cookie = `user=${JSON.stringify(response.user)}; path=/`
      toast.success('Login successful!')

      const redirectPath = response.user?.name === "Super Admin"
        ? '/dashboard'
        : '/dashboard/my-coverage'
      router.push(redirectPath)
      return
    } catch (error) {
      console.error('OTP verification error:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Verification failed. Please try again.'
      setOtpError(errorMessage)
      toast.error(errorMessage)
    }
    setIsLoading(false)
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setIsResending(true)
    try {
      await authApi.resendEmailOtp({ email })
      toast.success('Verification code sent to your email')
      setResendTimer(60)
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const handleBackToLogin = () => {
    setMode('login')
    setOtp('')
    setOtpError('')
    setResendTimer(0)
  }

  const openForgotPassword = () => {
    const loginEmail = form.getValues('email')
    if (loginEmail) {
      forgotForm.setValue('email', loginEmail)
    }
    setMode('forgot-password')
  }

  const handleBackFromForgotPassword = () => {
    setMode('login')
    setForgotResendTimer(0)
  }

  async function onForgotSubmit(values: z.infer<typeof forgotEmailSchema>) {
    setIsForgotSending(true)
    try {
      const response = await authApi.forgotPassword(values.email.toLowerCase())
      toast.success(
        (response as { message?: string }).message ??
          'If an account exists for this email, you will receive reset instructions shortly.',
      )
      setForgotResendTimer(60)
    } catch (error) {
      let errorMessage = 'Could not send reset email. Please try again.'
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        errorMessage = apiError.response?.data?.message ?? errorMessage
      }
      toast.error(errorMessage)
    } finally {
      setIsForgotSending(false)
    }
  }

  const handleForgotResend = async () => {
    if (forgotResendTimer > 0) return
    const addr = forgotForm.getValues('email')
    const parsed = emailSchema.safeParse(addr)
    if (!parsed.success) {
      toast.error('Enter a valid email address first.')
      return
    }
    setIsForgotResending(true)
    try {
      await authApi.forgotPassword(parsed.data.toLowerCase())
      toast.success('Reset instructions sent again.')
      setForgotResendTimer(60)
    } catch (error) {
      let errorMessage = 'Could not resend email. Please try again.'
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        errorMessage = apiError.response?.data?.message ?? errorMessage
      }
      toast.error(errorMessage)
    } finally {
      setIsForgotResending(false)
    }
  }

  // Clear OTP error when user starts typing
  useEffect(() => {
    if (otp.length > 0) {
      setOtpError('')
    }
  }, [otp])

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  useEffect(() => {
    if (forgotResendTimer <= 0) return
    const interval = setInterval(() => {
      setForgotResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [forgotResendTimer])

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      {/* Header */}
      <header className="py-6 px-8 bg-surface border-b border-border-soft">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className='flex justify-center items-center '>
            <Image src="/logo.svg" alt="Insta Styling" width={180} height={32} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="rounded-2xl overflow-hidden flex flex-col md:flex-row">

          {/* Login Form / OTP Form */}
          <div className="p-8 md:p-12 flex-grow-0 flex-shrink-0 basis-[560px] bg-white">
            {mode === 'login' ? (
              <>
                <h1 className="text-3xl font-satoshi font-bold text-center text-gray-900 mb-6">Login</h1>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItemInput
                            id="email"
                            label="Email"
                            placeholder="matias@touchzenmedia.com"
                            type="email"
                            autoComplete="email"
                            leftIcon={<Mail className="h-4 w-4" />}
                            className="h-[var(--height-form-field)]"
                            {...field}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItemInput
                            id="password"
                            label="Password"
                            placeholder="********"
                            autoComplete="current-password"
                            passwordToggle
                            className="h-[var(--height-form-field)]"
                            {...field}
                          />
                        )}
                      />
                    </div>

                    <div className="flex w-full flex-col gap-4">
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={openForgotPassword}
                          className="font-satoshi text-base font-bold not-italic leading-[130%] text-neutral-black_01 underline decoration-solid decoration-auto decoration-skip-ink-none underline-offset-auto [text-underline-position:from-font] hover:opacity-90"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <Button type="submit"
                        className="w-full font-satoshi  text-base h-12 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors "
                        disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Logging in...' : 'Login'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            ) : mode === 'forgot-password' ? (
              <div className="space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100"
                    aria-hidden
                  >
                    <Mail className="h-8 w-8 text-brand-600" strokeWidth={1.75} />
                  </div>
                  <h1 className="font-satoshi text-3xl font-bold text-neutral-black_03 mb-3">
                    Reset Your Password
                  </h1>
                  <p className="font-satoshi text-base font-normal leading-[150%] text-gray-600 max-w-sm">
                    Enter your email and we&apos;ll send you instructions to set a new one.
                  </p>
                </div>

                <Form {...forgotForm}>
                  <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-6">
                    <FormField
                      control={forgotForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItemInput
                          id="forgot-email"
                          label="Email"
                          placeholder="matias@touchzenmedia.com"
                          type="email"
                          autoComplete="email"
                          leftIcon={<Mail className="h-4 w-4" />}
                          className="h-[var(--height-form-field)]"
                          {...field}
                        />
                      )}
                    />

                    <p className="text-center font-satoshi text-sm text-gray-600">
                      {`Didn't get an email?`}{' '}
                      {forgotResendTimer > 0 ? (
                        <span className="text-gray-400">Resend in {forgotResendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleForgotResend}
                          disabled={isForgotResending}
                          className="font-semibold text-brand-600 underline decoration-solid underline-offset-2 hover:opacity-90 disabled:opacity-60"
                        >
                          {isForgotResending ? 'Sending…' : 'Resend'}
                        </button>
                      )}
                    </p>

                    <div className="flex w-full flex-col gap-3 pt-2">
                      <Button
                        type="submit"
                        className="w-full font-satoshi text-base h-12 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                        disabled={isForgotSending}
                      >
                        {isForgotSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isForgotSending ? 'Sending…' : 'Send Reset Link'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full font-satoshi text-base h-12 rounded-lg border-gray-300 bg-white font-semibold text-neutral-black_03 hover:bg-gray-50"
                        onClick={handleBackFromForgotPassword}
                      >
                        Back to Login
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  onClick={handleBackToLogin}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </button>

                <h1 className="text-3xl font-bold text-gray-900">Confirm Email</h1>
                <p className="text-gray-600">A verification code has been sent to <span className="font-medium">{email}</span></p>

                <div>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      width: '4rem',
                      height: '4rem',
                      margin: '8px',
                      fontSize: '1rem',
                      borderRadius: 4,
                      border: '2px solid #F5F5F5',
                    }}
                  />
                </div>
                {otpError && <p className="text-sm text-red-500">{otpError}</p>}

                <div className="text-sm text-gray-600">
                  {`Didn't get an email?`}{' '}
                  {resendTimer > 0 ? (
                    <span className="text-gray-400">
                      Resend in {resendTimer}s
                    </span>
                  ) : (
                    <span
                      className="text-neutral-black_03 cursor-pointer underline"
                      onClick={handleResendOtp}
                    >
                      {isResending ? 'Sending...' : 'Send again'}
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Verifying...' : 'Continue'}
                  </Button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 insta styling. all rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
