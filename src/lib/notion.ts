import { Client } from "@notionhq/client";

export const notion = new Client({ auth: process.env.NOTION_TOKEN! });

const DB = {
  STUDENT: process.env.NOTION_DB_STUDENT ?? "fa0720157b854804996afde47a615067",
  EVAL:    process.env.NOTION_DB_EVAL    ?? "b97e1c3095fc4d0e902afa9846be3444",
  RECORD:  process.env.NOTION_DB_RECORD  ?? "9a695e717a28412782c89233df76e695",
  PROJECT: process.env.NOTION_DB_PROJECT ?? "916a7322d3474b66a6712d31e3a858ca",
  COUNSEL: process.env.NOTION_DB_COUNSEL ?? "b1a5dba60eab4dacb5ef90db5c6e4086",
};

function hakbunFilter(hakbun: string) {
  return { property: "학번", rich_text: { equals: hakbun } };
}

function getText(prop: { type: string; rich_text?: Array<{ plain_text: string }>; title?: Array<{ plain_text: string }> }): string {
  if (prop.type === "rich_text") return prop.rich_text?.map((t) => t.plain_text).join("") ?? "";
  if (prop.type === "title") return prop.title?.map((t) => t.plain_text).join("") ?? "";
  return "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSelect(prop: any): string { return prop?.select?.name ?? ""; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNumber(prop: any): number | null { return prop?.number ?? null; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCheckbox(prop: any): boolean { return prop?.checkbox ?? false; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMultiSelect(prop: any): string[] { return prop?.multi_select?.map((s: { name: string }) => s.name) ?? []; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDate(prop: any): string { return prop?.date?.start ?? ""; }

export async function getStudentInfo(hakbun: string) {
  const res = await notion.databases.query({
    database_id: DB.STUDENT,
    filter: hakbunFilter(hakbun),
    page_size: 1,
  });
  if (!res.results.length) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (res.results[0] as any).properties;
  return {
    dept:        getSelect(p["학과"]),
    grade:       getNumber(p["학년"]),
    classNo:     getNumber(p["반"]),
    number:      getNumber(p["번호"]),
    careerType:  getSelect(p["진로대분류"]),
    careerHope:  getSelect(p["희망진로"]),
    achievement: getSelect(p["성취도"]),
    achieveLevel:getSelect(p["성취수준"]),
    totalScore:  getNumber(p["환산총점"]),
    certStatus:  getSelect(p["자격증취득"]),
    certName:    getText(p["대표자격증"]),
    needCounsel: getCheckbox(p["상담필요"]),
    observeAreas:getMultiSelect(p["관찰영역"]),
  };
}

export async function verifyStudentExists(name: string, hakbun: string): Promise<boolean> {
  const res = await notion.databases.query({
    database_id: DB.STUDENT,
    filter: {
      and: [
        { property: "학번", rich_text: { equals: hakbun } },
        { property: "성명", title: { equals: name } },
      ],
    },
    page_size: 1,
  });
  return res.results.length > 0;
}

export async function getEvaluations(hakbun: string) {
  const res = await notion.databases.query({
    database_id: DB.EVAL,
    filter: hakbunFilter(hakbun),
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.results.map((r: any) => {
    const p = r.properties;
    return {
      theory:       getNumber(p["이론"]),
      practice:     getNumber(p["실기"]),
      totalScore:   getNumber(p["환산총점"]),
      achievement:  getSelect(p["성취도"]),
      achieveLevel: getSelect(p["성취수준"]),
      certStatus:   getSelect(p["자격증취득"]),
      dept:         getSelect(p["학과"]),
      feedback:     getText(p["피드백"]),
      createdTime:  r.created_time,
    };
  });
}

export async function getRecords(hakbun: string) {
  const res = await notion.databases.query({
    database_id: DB.RECORD,
    filter: hakbunFilter(hakbun),
    sorts: [{ property: "일자", direction: "descending" }],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.results.map((r: any) => {
    const p = r.properties;
    return {
      date:        getDate(p["일자"]),
      content:     getText(p["내용"]),
      observeArea: getSelect(p["관찰영역"]),
      dept:        getSelect(p["학과"]),
    };
  });
}

export async function getProjects(hakbun: string) {
  const res = await notion.databases.query({
    database_id: DB.PROJECT,
    filter: hakbunFilter(hakbun),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.results.map((r: any) => {
    const p = r.properties;
    return {
      group:   getText(p["모둠"]),
      role:    getSelect(p["역할"]),
      task:    getText(p["담당과업"]),
      status:  getSelect(p["진행상태"]),
      dept:    getSelect(p["학과"]),
    };
  });
}

export async function getCounsels(hakbun: string) {
  const res = await notion.databases.query({
    database_id: DB.COUNSEL,
    filter: hakbunFilter(hakbun),
    sorts: [{ property: "상담일", direction: "descending" }],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.results.map((r: any) => {
    const p = r.properties;
    return {
      title:      getText(p["제목"]),
      type:       getSelect(p["상담유형"]),
      content:    getText(p["상담내용"]),
      followUp:   getText(p["후속조치"]),
      date:       getDate(p["상담일"]),
    };
  });
}

export async function createCounselRequest(
  hakbun: string,
  type: string,
  content: string,
  studentPageId?: string,
) {
  const today = new Date().toISOString().split("T")[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: Record<string, any> = {
    제목:    { title: [{ text: { content: `[신청] ${type} 상담` } }] },
    학번:    { rich_text: [{ text: { content: hakbun } }] },
    상담유형:{ select: { name: type } },
    상담내용:{ rich_text: [{ text: { content } }] },
    상담일:  { date: { start: today } },
  };
  if (studentPageId) {
    properties["학생"] = { relation: [{ id: studentPageId }] };
  }
  await notion.pages.create({ parent: { database_id: DB.COUNSEL }, properties });
}
