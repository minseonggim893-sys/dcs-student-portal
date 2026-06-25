# dcs-student-portal

대전도시과학고 학생 포털 — Next.js 14 App Router

---

## 기술 스택

- Next.js 14 + TypeScript (strict)
- Notion API (@notionhq/client v2, 학생 데이터 읽기)
- Supabase (service_role, 계정 관리)
- bcryptjs (비밀번호 해시) / SHA-256 (이름 해시)
- HMAC-SHA256 httpOnly 쿠키 세션
- 순수 CSS + Pretendard CDN

---

## 로컬 개발

```bash
cd dcs-student-portal
cp .env.example .env.local
# .env.local 키 값 채우기
npm install
npm run dev
```

---

## 환경변수

| 변수 | 설명 |
|---|---|
| `NOTION_TOKEN` | Notion Integration Token |
| `NOTION_DB_STUDENT` | 학생 종합현황 DB ID |
| `NOTION_DB_EVAL` | 전공평가 DB ID |
| `NOTION_DB_RECORD` | 생기부 DB ID |
| `NOTION_DB_PROJECT` | 프로젝트 DB ID |
| `NOTION_DB_COUNSEL` | 상담기록 DB ID |
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 (절대 공개 금지) |
| `SESSION_SECRET` | 32자 이상 랜덤 문자열 |

---

## Supabase 테이블

```sql
create table student_accounts (
  id uuid primary key default gen_random_uuid(),
  hakbun text unique not null,
  name_hash text not null,
  password_hash text not null,
  nickname text not null,
  created_at timestamptz default now()
);

alter table student_accounts enable row level security;
```

---

## Vercel 배포

1. Vercel 대시보드에서 레포 연결
2. Environment Variables에 `.env.example` 항목 입력
3. Deploy

배포 전 확인:
```bash
npm run build  # 에러 0 확인
```

---

## 보안 원칙

- 학생 실명은 화면에 절대 미표시 (닉네임만)
- 모든 키는 서버 전용 (NEXT_PUBLIC_ 접두사 금지)
- Supabase RLS 반드시 활성화
