import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/"
  revalidatePath(path)
  revalidateTag("medicament")
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
