"use client";
import { useState } from "react";
import { useStudentData } from "@/hooks/useStudentData";
import { Counsel } from "@/types/student";

const TYPE_COLOR: Record<string, string> = {
  "진로": "var(--primary)",
  "학업": "var(--blue)",
  "생활": "var(--green)",
  "기타": "var(--muted)",
};

const COUNSEL_TYPES = ["진로", "학업", "생활", "기타"];

function CounselCard({ c }: { c: Counsel }) {
  const color = TYPE_COLOR[c.type] ?? "var(--muted)";
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ ...styles.typeBadge, background: color }}>{c.type}</span>
        <span style={styles.date}>{c.date}</span>
      </div>
      <p style={styles.content}>{c.content}</p>
      {c.followUp && (
        <div style={styles.followUp}>
          <span style={styles.followUpLabel}>후속조치</span>
          <p style={styles.followUpText}>{c.followUp}</p>
        </div>
      )}
    </div>
  );
}

function BottomSheet({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState("진로");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/counsel-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(data.error ?? "오류 발생"); return; }
    setDone(true);
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.sheetHandle} />
        <h3 style={styles.sheetTitle}>상담 신청</h3>
        {done ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔔</p>
            <p style={{ fontWeight: 700, color: "var(--ink)" }}>신청이 접수되었습니다!</p>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>선생님이 확인 후 연락드릴게요.</p>
            <button style={styles.closeBtn} onClick={onClose}>닫기</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.typeRow}>
              {COUNSEL_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  style={{
                    ...styles.typeBtn,
                    background: type === t ? "var(--primary)" : "var(--bg)",
                    color: type === t ? "#fff" : "var(--ink)",
                  }}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              style={styles.textarea}
              placeholder="상담 내용을 입력해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
            {err && <p style={styles.err}>{err}</p>}
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "신청 중..." : "신청하기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CounselTab() {
  const { data, loading, error } = useStudentData();
  const [showSheet, setShowSheet] = useState(false);

  if (loading) return <Skeleton />;
  if (error) return <p style={{ padding: "24px", color: "var(--red)" }}>{error}</p>;
  if (!data) return null;

  return (
    <div style={styles.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={styles.heading}>상담</h2>
        <button style={styles.requestBtn} onClick={() => setShowSheet(true)}>+ 신청</button>
      </div>

      {data.counsels.length === 0 ? (
        <p style={styles.empty}>상담 기록이 없습니다.</p>
      ) : (
        data.counsels.map((c, i) => <CounselCard key={i} c={c} />)
      )}

      {showSheet && <BottomSheet onClose={() => setShowSheet(false)} />}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[100, 100].map((h, i) => (
        <div key={i} style={{ height: h, borderRadius: "var(--radius)", background: "#E0E8F0" }} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  heading: { fontSize: "18px", fontWeight: 700, color: "var(--ink)" },
  empty: { color: "var(--muted)", fontSize: "14px", textAlign: "center", marginTop: "40px" },
  requestBtn: {
    padding: "8px 16px",
    background: "var(--red)",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 700,
  },
  card: { background: "var(--card)", borderRadius: "var(--radius)", padding: "20px" },
  typeBadge: {
    padding: "3px 10px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
  },
  date: { fontSize: "12px", color: "var(--muted)" },
  content: { fontSize: "14px", color: "var(--ink)", lineHeight: 1.5 },
  followUp: {
    marginTop: "12px",
    padding: "10px 12px",
    background: "var(--bg)",
    borderRadius: "10px",
  },
  followUpLabel: { fontSize: "11px", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: "4px" },
  followUpText: { fontSize: "13px", color: "var(--ink)" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(14,27,44,0.4)",
    zIndex: 100,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  sheet: {
    background: "var(--card)",
    borderRadius: "24px 24px 0 0",
    padding: "20px 24px 40px",
    width: "100%",
    maxWidth: "480px",
  },
  sheetHandle: {
    width: "40px",
    height: "4px",
    background: "#E0E8F0",
    borderRadius: "999px",
    margin: "0 auto 20px",
  },
  sheetTitle: { fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginBottom: "20px" },
  typeRow: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  typeBtn: {
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid #E0E8F0",
    fontSize: "15px",
    color: "var(--ink)",
    background: "var(--bg)",
    resize: "none",
    marginBottom: "12px",
    fontFamily: "inherit",
  },
  err: { fontSize: "13px", color: "var(--red)", marginBottom: "8px" },
  submitBtn: {
    width: "100%",
    padding: "16px",
    background: "var(--red)",
    color: "#fff",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: 700,
  },
  closeBtn: {
    marginTop: "16px",
    padding: "12px 32px",
    background: "var(--bg)",
    color: "var(--ink)",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: 600,
  },
};
