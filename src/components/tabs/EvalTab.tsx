"use client";
import { useStudentData } from "@/hooks/useStudentData";
import { Evaluation } from "@/types/student";

function ScoreBar({ label, value, max = 100, color }: { label: string; value: number | null; max?: number; color: string }) {
  const pct = value !== null ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "13px", color: "var(--muted)" }}>{label}</span>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>
          {value !== null ? value : "-"}
        </span>
      </div>
      <div style={{ height: "6px", background: "#E0E8F0", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "999px" }} />
      </div>
    </div>
  );
}

function EvalCard({ ev }: { ev: Evaluation }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={styles.dept}>{ev.dept}</span>
        <span style={styles.date}>{new Date(ev.createdTime).toLocaleDateString("ko-KR")}</span>
      </div>
      <ScoreBar label="이론" value={ev.theory} color="var(--blue)" />
      <ScoreBar label="실기" value={ev.practice} color="var(--green)" />
      <ScoreBar label="환산총점" value={ev.totalScore} color="var(--primary)" />
      {ev.feedback && (
        <div style={styles.feedback}>
          <p style={styles.feedbackLabel}>선생님 피드백</p>
          <p style={styles.feedbackText}>{ev.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default function EvalTab() {
  const { data, loading, error } = useStudentData();

  if (loading) return <Skeleton />;
  if (error) return <p style={{ padding: "24px", color: "var(--red)" }}>{error}</p>;
  if (!data) return null;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>평가</h2>
      {data.evaluations.length === 0 ? (
        <p style={styles.empty}>평가 기록이 없습니다.</p>
      ) : (
        data.evaluations.map((ev, i) => <EvalCard key={i} ev={ev} />)
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[160, 160].map((h, i) => (
        <div key={i} style={{ height: h, borderRadius: "var(--radius)", background: "#E0E8F0" }} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  heading: { fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" },
  empty: { color: "var(--muted)", fontSize: "14px", textAlign: "center", marginTop: "40px" },
  card: { background: "var(--card)", borderRadius: "var(--radius)", padding: "20px" },
  dept: { fontSize: "15px", fontWeight: 700, color: "var(--blue)" },
  date: { fontSize: "12px", color: "var(--muted)" },
  feedback: {
    marginTop: "16px",
    padding: "12px",
    background: "var(--bg)",
    borderRadius: "12px",
  },
  feedbackLabel: { fontSize: "12px", color: "var(--muted)", marginBottom: "4px" },
  feedbackText: { fontSize: "14px", color: "var(--ink)", lineHeight: 1.5 },
};
