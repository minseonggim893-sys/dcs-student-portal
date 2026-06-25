"use client";
import { useStudentData } from "@/hooks/useStudentData";
import { GrowthRecord } from "@/types/student";

const AREA_COLORS: Record<string, string> = {
  "진로": "var(--primary)",
  "학업": "var(--blue)",
  "생활": "var(--green)",
  "인성": "var(--amber)",
};

function areaColor(area: string) {
  return AREA_COLORS[area] ?? "var(--muted)";
}

function RecordItem({ rec }: { rec: GrowthRecord }) {
  const color = areaColor(rec.observeArea);
  return (
    <div style={styles.item}>
      <div style={{ ...styles.dot, background: color }} />
      <div style={styles.itemContent}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ ...styles.areaTag, color, borderColor: color }}>{rec.observeArea}</span>
          <span style={styles.date}>{rec.date}</span>
        </div>
        <p style={styles.content}>{rec.content}</p>
      </div>
    </div>
  );
}

export default function GrowthTab() {
  const { data, loading, error } = useStudentData();

  if (loading) return <Skeleton />;
  if (error) return <p style={{ padding: "24px", color: "var(--red)" }}>{error}</p>;
  if (!data) return null;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>성장 기록</h2>
      {data.records.length === 0 ? (
        <p style={styles.empty}>생기부 기록이 없습니다.</p>
      ) : (
        <div style={styles.timeline}>
          {data.records.map((r, i) => <RecordItem key={i} rec={r} />)}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {[80, 100, 80].map((h, i) => (
        <div key={i} style={{ height: h, borderRadius: "12px", background: "#E0E8F0" }} />
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "20px" },
  heading: { fontSize: "18px", fontWeight: 700, color: "var(--ink)", marginBottom: "16px" },
  empty: { color: "var(--muted)", fontSize: "14px", textAlign: "center", marginTop: "40px" },
  timeline: { display: "flex", flexDirection: "column", gap: "0" },
  item: { display: "flex", gap: "12px", paddingBottom: "20px" },
  dot: { width: "10px", height: "10px", borderRadius: "50%", marginTop: "5px", flexShrink: 0 },
  itemContent: {
    flex: 1,
    background: "var(--card)",
    borderRadius: "12px",
    padding: "14px 16px",
  },
  areaTag: {
    fontSize: "12px",
    fontWeight: 600,
    border: "1.5px solid",
    borderRadius: "999px",
    padding: "2px 8px",
  },
  date: { fontSize: "12px", color: "var(--muted)" },
  content: { fontSize: "14px", color: "var(--ink)", lineHeight: 1.6 },
};
