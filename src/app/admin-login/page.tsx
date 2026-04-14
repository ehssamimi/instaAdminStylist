"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Mail, CircleHelp, Lock } from 'lucide-react'
import OtpInput from 'react-otp-input';

import {
  Form,
  FormField,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { FormItemInput } from '@/components/ui/form-item-input'

import { loginFormSchema } from '@/lib/validation-schemas'
import { authApi } from '@/lib/api'
import { persistSession, clearRefreshToken, updateAccessToken } from '@/lib/jwt-utils'
import Image from 'next/image';

const formSchema = loginFormSchema
const LoginPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'otp'>('login')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [email, setEmail] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
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
          const redirectPath = '/dashboard'
          router.push(redirectPath)
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
    } finally {
      setIsLoading(false)
    }
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
    } catch (error) {
      console.error('OTP verification error:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Verification failed. Please try again.'
      setOtpError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
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
                        <Link
                          href="/forgot-password"
                          className="font-satoshi text-base font-bold not-italic leading-[130%] text-neutral-black_01 underline decoration-solid decoration-auto decoration-skip-ink-none underline-offset-auto [text-underline-position:from-font] hover:opacity-90"
                        >
                          Forgot Password?
                        </Link>
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
