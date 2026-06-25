"use client";
import { useStudentData } from "@/hooks/useStudentData";

function gradeColor(score: number | null) {
  if (score === null) return "var(--muted)";
  if (score >= 80) return "var(--green)";
  if (score >= 60) return "var(--amber)";
  return "var(--red)";
}

function gradeLabel(score: number | null) {
  if (score === null) return "-";
  if (score >= 80) return "우수";
  if (score >= 60) return "보통";
  return "미흡";
}

export default function HomeTab() {
  const { data, loading, error } = useStudentData();

  if (loading) return <Skeleton />;
  if (error) return <p style={{ padding: "24px", color: "var(--red)" }}>{error}</p>;
  if (!data) return null;

  const score = data.totalScore;
  const color = gradeColor(score);
  const gaugePct = Math.min(100, Math.max(0, (score ?? 0)));

  return (
    <div style={styles.page}>
      {/* 인사 + 총점 카드 */}
      <div style={styles.heroCard}>
        <p style={styles.greeting}>{data.nickname}님, 안녕하세요 👋</p>
        <p style={styles.deptBadge}>{data.dept} · {data.grade}학년 {data.classNo}반 {data.number}번</p>

        <div style={styles.scoreRow}>
          <span style={{ ...styles.scoreNum, color }}>
            {score !== null ? score.toFixed(1) : "-"}
          </span>
          <span style={{ ...styles.gradePill, background: color }}>
            {gradeLabel(score)}
          </span>
        </div>
        <div style={styles.gaugeTrack}>
          <div style={{ ...styles.gaugeFill, width: `${gaugePct}%`, background: color }} />
        </div>
        <p style={styles.gaugeLabel}>{data.achieveLevel}</p>
      </div>

      {/* 자격증 */}
      {data.certName && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>자격증</h3>
          <p style={styles.cardBody}>{data.certName}</p>
          <span style={{ ...styles.badge, background: data.certStatus === "취득" ? "var(--green)" : "var(--amber)" }}>
            {data.certStatus}
          </span>
        </div>
      )}

      {/* 관찰영역 */}
      {data.observeAreas.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>관찰영역</h3>
          <div style={styles.tagRow}>
            {data.observeAreas.map((a) => (
              <span key={a} style={styles.tag}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* 상담 예정 배너 */}
      {data.needCounsel && (
        <div style={{ ...styles.card, background: "#FFF4EF", borderLeft: "4px solid var(--primary)" }}>
          <p style={{ color: "var(--primary)", fontWeight: 600 }}>🔔 상담이 예정되어 있습니다.</p>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>상담 탭에서 확인하세요.</p>
        </div>
      )}

      {/* 진로 */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>진로</h3>
        <p style={styles.cardBody}>{data.careerHope || data.careerType || "-"}</p>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[180, 80, 80].map((h, i) => (
        <div key={i} style={{ height: h, borderRadius: "var(--radius)", background: "#E0E8F0" }} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "20px", display: "flex", flexDirection: "column", gap: "12px" },
  heroCard: {
    background: "var(--card)",
    borderRadius: "var(--radius)",
    padding: "24px 20px",
  },
  greeting: { fontSize: "20px", fontWeight: 700, color: "var(--ink)" },
  deptBadge: { fontSize: "13px", color: "var(--muted)", marginTop: "4px", marginBottom: "20px" },
  scoreRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  scoreNum: { fontSize: "48px", fontWeight: 800, lineHeight: 1 },
  gradePill: {
    padding: "4px 12px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 700,
  },
  gaugeTrack: {
    height: "8px",
    background: "#E0E8F0",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  gaugeFill: { height: "100%", borderRadius: "999px", transition: "width 0.6s ease" },
  gaugeLabel: { fontSize: "13px", color: "var(--muted)" },
  card: {
    background: "var(--card)",
    borderRadius: "var(--radius)",
    padding: "20px",
  },
  cardTitle: { fontSize: "13px", color: "var(--muted)", marginBottom: "8px", fontWeight: 600 },
  cardBody: { fontSize: "16px", fontWeight: 600, color: "var(--ink)" },
  badge: {
    display: "inline-block",
    marginTop: "8px",
    padding: "3px 10px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 600,
  },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: {
    padding: "4px 10px",
    background: "var(--bg)",
    borderRadius: "999px",
    fontSize: "13px",
    color: "var(--ink)",
    fontWeight: 500,
  },
};
