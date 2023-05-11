import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  revalidateTag("medicament")
  revalidatePath("/")
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
