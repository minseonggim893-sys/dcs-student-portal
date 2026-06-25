import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabase } from "@/lib/supabase";
import { verifyStudentExists } from "@/lib/notion";
import { setSessionCookie, hashName } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { name, hakbun, nickname, password } = await req.json();

    if (!name || !hakbun || !nickname || !password) {
      return NextResponse.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
    }

    const exists = await verifyStudentExists(name, hakbun);
    if (!exists) {
      return NextResponse.json({ error: "학생 정보를 찾을 수 없습니다. 이름과 학번을 확인해주세요." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("student_accounts")
      .select("id")
      .eq("hakbun", hakbun)
      .single();
    if (existing) {
      return NextResponse.json({ error: "이미 가입된 학번입니다." }, { status: 409 });
    }

    const nameHash = hashName(name);
    const passwordHash = await bcrypt.hash(password, 12);

    const { error } = await supabase.from("student_accounts").insert({
      hakbun,
      name_hash: nameHash,
      password_hash: passwordHash,
      nickname,
    });
    if (error) throw error;

    setSessionCookie(hakbun);

    return NextResponse.json({ ok: true, nickname });
  } catch (e) {
    console.error("[register]", e);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
