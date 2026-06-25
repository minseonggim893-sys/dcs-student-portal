import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabase, StudentAccount } from "@/lib/supabase";
import { setSessionCookie, hashName } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { name, password, hakbun: hakbunHint } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "이름과 비밀번호를 입력해주세요." }, { status: 400 });
    }

    const nameHash = hashName(name);
    const supabase = getSupabase();

    const { data: candidates, error } = await supabase
      .from("student_accounts")
      .select("*")
      .eq("name_hash", nameHash);
    if (error) throw error;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: "이름 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const matched: StudentAccount[] = [];
    for (const acc of candidates as StudentAccount[]) {
      const ok = await bcrypt.compare(password, acc.password_hash);
      if (ok) matched.push(acc);
    }

    if (matched.length === 0) {
      return NextResponse.json({ error: "이름 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    if (matched.length > 1) {
      if (!hakbunHint) {
        return NextResponse.json({ needHakbun: true, error: "동명이인이 확인되었습니다. 학번을 추가로 입력해주세요." }, { status: 200 });
      }
      const target = matched.find((a) => a.hakbun === hakbunHint);
      if (!target) {
        return NextResponse.json({ error: "학번이 일치하지 않습니다." }, { status: 401 });
      }
      setSessionCookie(target.hakbun);
      return NextResponse.json({ ok: true, nickname: target.nickname });
    }

    setSessionCookie(matched[0].hakbun);
    return NextResponse.json({ ok: true, nickname: matched[0].nickname });
  } catch (e) {
    console.error("[login]", e);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
