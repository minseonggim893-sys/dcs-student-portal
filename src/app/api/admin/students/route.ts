import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import { Client } from "@notionhq/client";

function verifyAdmin(): boolean {
  const token = cookies().get("dcs_admin")?.value;
  if (!token) return false;
  const expected = createHmac("sha256", process.env.SESSION_SECRET!)
    .update("admin")
    .digest("hex");
  return token === expected;
}

export async function GET() {
  if (!verifyAdmin()) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }

  const notion = new Client({ auth: process.env.NOTION_TOKEN! });
  const dbId = process.env.NOTION_DB_STUDENT ?? "fa0720157b854804996afde47a615067";

  const results = [];
  let cursor: string | undefined;

  do {
    const res = await notion.databases.query({
      database_id: dbId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const page of res.results) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = (page as any).properties;
      results.push({
        hakbun:      p["학번"]?.rich_text?.[0]?.plain_text ?? "",
        dept:        p["학과"]?.select?.name ?? "",
        grade:       p["학년"]?.number ?? null,
        classNo:     p["반"]?.number ?? null,
        number:      p["번호"]?.number ?? null,
        achievement: p["성취도"]?.select?.name ?? "",
        totalScore:  p["환산총점"]?.number ?? null,
        needCounsel: p["상담필요"]?.checkbox ?? false,
        careerHope:  p["희망진로"]?.select?.name ?? "",
      });
    }

    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  // 실명은 절대 포함하지 않음
  return NextResponse.json({ students: results });
}
