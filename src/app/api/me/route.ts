import { NextResponse } from "next/server";
import { getSessionHakbun } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";
import {
  getStudentInfo,
  getEvaluations,
  getRecords,
  getProjects,
  getCounsels,
} from "@/lib/notion";

export const revalidate = 60;

export async function GET() {
  const hakbun = getSessionHakbun();
  if (!hakbun) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const [{ data: accData }, studentInfo, evaluations, records, projects, counsels] =
      await Promise.all([
        supabase.from("student_accounts").select("nickname").eq("hakbun", hakbun).single(),
        getStudentInfo(hakbun),
        getEvaluations(hakbun),
        getRecords(hakbun),
        getProjects(hakbun),
        getCounsels(hakbun),
      ]);

    if (!studentInfo) {
      return NextResponse.json({ error: "학생 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 실명(성명) 필드는 절대 응답에 포함하지 않음
    return NextResponse.json({
      nickname: accData?.nickname ?? "",
      ...studentInfo,
      evaluations,
      records,
      projects,
      counsels,
    });
  } catch (e) {
    console.error("[me]", e);
    return NextResponse.json({ error: "데이터 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
