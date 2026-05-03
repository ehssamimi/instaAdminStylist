import { NextResponse } from "next/server"
import { backendApiBaseFromEnv } from "@/lib/backend-api-url"

/**
 * Proxies `GET /api/admin/users/:id/bookings` → backend `GET .../api/admin/users/:id/bookings`.
 * Forwards query (`page`, `limit`, …) and `Authorization`.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const apiBase = backendApiBaseFromEnv()
  if (!apiBase) {
    return NextResponse.json(
      { success: false, message: "NEXT_PUBLIC_API_URL is not set" },
      { status: 500 }
    )
  }

  const incoming = new URL(request.url)
  const target = new URL(`${apiBase}/admin/users/${encodeURIComponent(id)}/bookings`)
  /** Backend rejects `?id=` — user id is path-only; strip accidental duplicates from clients/tools. */
  incoming.searchParams.forEach((value, key) => {
    if (key === "id") return
    target.searchParams.set(key, value)
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
      "Content-Type":
        res.headers.get("Content-Type") ?? "application/json",
    },
  })
}

export const runtime = "edge"
