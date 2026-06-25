import { NextRequest, NextResponse } from "next/server";
import { getSessionHakbun } from "@/lib/session";
import { createCounselRequest } from "@/lib/notion";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const hakbun = getSessionHakbun();
  if (!hakbun) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { type, content } = await req.json();
    if (!type || !content) {
      return NextResponse.json({ error: "유형과 내용을 입력해주세요." }, { status: 400 });
    }

    await createCounselRequest(hakbun, type, content);
    revalidatePath("/api/me");

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[counsel-request]", e);
    return NextResponse.json({ error: "상담 신청 중 오류가 발생했습니다." }, { status: 500 });
  }
}
