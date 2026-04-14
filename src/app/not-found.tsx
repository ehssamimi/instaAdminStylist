/**
 * v0 by Vercel.
 * @see https://v0.app/t/yWYpaHrdyyX
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 Page Not Found</h1>
          <p className="text-gray-500">Sorry, we couldn&#x27;t find the page you&#x27;re looking for.</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-md border border-gray-200 border-gray-200 bg-white shadow-sm px-8 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900      "
          prefetch={false}
        >
          Return to website
        </Link>
      </div>
    </div>
  )
}
