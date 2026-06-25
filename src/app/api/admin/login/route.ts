import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";

function signAdmin(): string {
  return createHmac("sha256", process.env.SESSION_SECRET!)
    .update("admin")
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const { id, password } = await req.json();

  if (id !== process.env.ADMIN_ID || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  cookies().set("dcs_admin", signAdmin(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
