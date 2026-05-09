import { NextResponse } from "next/server"
import { backendApiBaseFromEnv } from "@/lib/backend-api-url"

/** Proxies POST /api/admin/reviews/approve-all to the backend. */
export async function POST(request: Request) {
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: "NEXT_PUBLIC_API_URL is not set" },
      { status: 500 }
    )
  }

  const url = `${apiBase}/admin/reviews/approve-all`
  const auth = request.headers.get("authorization")
  const bodyText = await request.text()

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...(auth ? { Authorization: auth } : {}),
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: bodyText || "{}",
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
