"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Student {
  hakbun: string;
  dept: string;
  grade: number | null;
  classNo: number | null;
  number: number | null;
  achievement: string;
  totalScore: number | null;
  needCounsel: boolean;
  careerHope: string;
}

function gradeColor(score: number | null) {
  if (score === null) return "#999";
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--amber)";
  return "var(--red)";
}

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setLoginError(d.error ?? "오류 발생");
      return;
    }
    setAuthed(true);
    loadStudents();
  }

  async function loadStudents() {
    setLoading(true);
    const res = await fetch("/api/admin/students");
    if (res.status === 401) { setAuthed(false); return; }
    const data = await res.json();
    setStudents(data.students ?? []);
    setLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setStudents([]);
  }

  useEffect(() => {
    // 쿠키 있으면 바로 로드 시도
    fetch("/api/admin/students").then(async (r) => {
      if (r.ok) {
        const data = await r.json();
        setStudents(data.students ?? []);
        setAuthed(true);
      }
    });
  }, []);

  const filtered = students.filter(
    (s) =>
      s.hakbun.includes(search) ||
      s.dept.includes(search) ||
      s.careerHope.includes(search)
  );

  if (!authed) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>관리자 로그인</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              style={styles.input}
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {loginError && <p style={styles.error}>{loginError}</p>}
            <button style={styles.btn} type="submit">로그인</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>학생 목록</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={styles.count}>총 {students.length}명</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <input
        style={styles.search}
        type="text"
        placeholder="학번 · 학과 · 희망진로 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p style={{ color: "var(--muted)", textAlign: "center", marginTop: "40px" }}>불러오는 중...</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["학번", "학과", "학년", "반", "번호", "환산총점", "성취도", "희망진로", "상담"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.hakbun} style={styles.tr}>
                  <td style={styles.td}>{s.hakbun}</td>
                  <td style={styles.td}>{s.dept}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>{s.grade}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>{s.classNo}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>{s.number}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span style={{ color: gradeColor(s.totalScore), fontWeight: 700 }}>
                      {s.totalScore ?? "-"}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>{s.achievement}</td>
                  <td style={styles.td}>{s.careerHope}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {s.needCounsel && <span style={styles.counselDot}>●</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "40px" }}>검색 결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
  },
  loginCard: {
    background: "var(--card)",
    borderRadius: "var(--radius)",
    padding: "40px 32px",
    width: "100%",
    maxWidth: "360px",
    boxShadow: "0 4px 24px rgba(14,27,44,0.08)",
  },
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
    minHeight: "100vh",
    background: "var(--bg)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { fontSize: "22px", fontWeight: 700, color: "var(--ink)" },
  count: { fontSize: "14px", color: "var(--muted)" },
  logoutBtn: {
    padding: "8px 16px",
    background: "var(--bg)",
    color: "var(--muted)",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
  },
  search: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #E0E8F0",
    fontSize: "15px",
    color: "var(--ink)",
    background: "var(--card)",
    marginBottom: "16px",
  },
  tableWrap: {
    background: "var(--card)",
    borderRadius: "var(--radius)",
    overflow: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 16px",
    fontSize: "12px",
    color: "var(--muted)",
    fontWeight: 600,
    textAlign: "left",
    borderBottom: "1px solid #E0E8F0",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #F0F4F8" },
  td: { padding: "12px 16px", fontSize: "14px", color: "var(--ink)", whiteSpace: "nowrap" },
  counselDot: { color: "var(--red)", fontSize: "16px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid #E0E8F0",
    fontSize: "15px",
    color: "var(--ink)",
    background: "var(--bg)",
  },
  btn: {
    padding: "14px",
    background: "var(--primary)",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 700,
  },
  error: { fontSize: "13px", color: "var(--red)", textAlign: "center" },
};
