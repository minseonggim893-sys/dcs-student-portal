"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [hakbun, setHakbun] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [hakbunHint, setHakbunHint] = useState("");
  const [needHakbun, setNeedHakbun] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = mode === "login" ? "/api/login" : "/api/register";
    const body =
      mode === "login"
        ? { name, password, hakbun: needHakbun ? hakbunHint : undefined }
        : { name, hakbun, nickname, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (data.needHakbun) {
      setNeedHakbun(true);
      setError(data.error ?? "");
      return;
    }
    if (!res.ok || !data.ok) {
      setError(data.error ?? "오류가 발생했습니다.");
      return;
    }
    router.push("/portal/home");
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>대전도시과학고</h1>
        <p style={styles.sub}>학생 포털</p>

        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
            onClick={() => { setMode("login"); setError(""); setNeedHakbun(false); }}
          >
            로그인
          </button>
          <button
            style={{ ...styles.tab, ...(mode === "register" ? styles.tabActive : {}) }}
            onClick={() => { setMode("register"); setError(""); setNeedHakbun(false); }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          {mode === "register" && (
            <input
              style={styles.input}
              type="text"
              placeholder="학번 (예: 10101)"
              value={hakbun}
              onChange={(e) => setHakbun(e.target.value)}
              required
            />
          )}
          {mode === "register" && (
            <input
              style={styles.input}
              type="text"
              placeholder="닉네임 (화면에 표시될 이름)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          )}
          <input
            style={styles.input}
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {needHakbun && (
            <input
              style={styles.input}
              type="text"
              placeholder="학번을 입력해주세요"
              value={hakbunHint}
              onChange={(e) => setHakbunHint(e.target.value)}
              required
            />
          )}
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? "처리 중..." : mode === "login" ? "로그인" : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: "20px",
  },
  card: {
    background: "var(--card)",
    borderRadius: "var(--radius)",
    padding: "32px 24px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 4px 24px rgba(14,27,44,0.08)",
  },
  title: {
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--ink)",
    textAlign: "center",
  },
  sub: {
    fontSize: "14px",
    color: "var(--muted)",
    textAlign: "center",
    marginTop: "4px",
    marginBottom: "24px",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    background: "var(--bg)",
    borderRadius: "12px",
    padding: "4px",
  },
  tab: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    background: "transparent",
    color: "var(--muted)",
    fontSize: "14px",
    fontWeight: 600,
  },
  tabActive: {
    background: "var(--card)",
    color: "var(--ink)",
    boxShadow: "0 2px 8px rgba(14,27,44,0.08)",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid #E0E8F0",
    fontSize: "16px",
    color: "var(--ink)",
    background: "var(--bg)",
  },
  btn: {
    padding: "16px",
    borderRadius: "12px",
    background: "var(--primary)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 700,
    marginTop: "4px",
  },
  error: {
    fontSize: "13px",
    color: "var(--red)",
    textAlign: "center",
  },
};
