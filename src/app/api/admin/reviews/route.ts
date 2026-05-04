import { NextResponse } from "next/server"
import { backendApiBaseFromEnv } from "@/lib/backend-api-url"

/** Proxies GET /api/admin/reviews to backend GET /api/admin/reviews. */
export async function GET(request: Request) {
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: "NEXT_PUBLIC_API_URL is not set" },
      { status: 500 }
    )
  }

  const incoming = new URL(request.url)
  const target = new URL(`${apiBase}/admin/reviews`)
  incoming.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value)
  })

  const auth = request.headers.get("authorization")

  const res = await fetch(target.toString(), {
    method: "GET",
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      Accept: "application/json",
    },
    cache: "no-store",
  })

  const body = await res.text()
  return new NextResponse(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json",
    },
  })
}

export const runtime = "edge"

