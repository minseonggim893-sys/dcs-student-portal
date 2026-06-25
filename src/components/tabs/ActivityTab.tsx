"use client";
import { useStudentData } from "@/hooks/useStudentData";
import { Project } from "@/types/student";

const STATUS_COLOR: Record<string, string> = {
  "완료": "var(--green)",
  "진행중": "var(--blue)",
  "대기": "var(--amber)",
  "중단": "var(--red)",
};

function statusColor(status: string) {
  return STATUS_COLOR[status] ?? "var(--muted)";
}

function ProjectCard({ proj }: { proj: Project }) {
  const color = statusColor(proj.status);
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <p style={styles.group}>{proj.group}</p>
          <p style={styles.role}>{proj.role}</p>
        </div>
        <span style={{ ...styles.statusBadge, background: color }}>{proj.status}</span>
      </div>
      <p style={styles.task}>{proj.task}</p>
      <p style={styles.dept}>{proj.dept}</p>
    </div>
  );
}

export default function ActivityTab() {
  const { data, loading, error } = useStudentData();

  if (loading) return <Skeleton />;
  if (error) return <p style={{ padding: "24px", color: "var(--red)" }}>{error}</p>;
  if (!data) return null;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>활동</h2>
      {data.projects.length === 0 ? (
        <p style={styles.empty}>프로젝트 기록이 없습니다.</p>
      ) : (
        data.projects.map((p, i) => <ProjectCard key={i} proj={p} />)
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {[120, 120].map((h, i) => (
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
  group: { fontSize: "16px", fontWeight: 700, color: "var(--ink)" },
  role: { fontSize: "13px", color: "var(--amber)", fontWeight: 600, marginTop: "2px" },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "999px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },
  task: { fontSize: "14px", color: "var(--ink)", marginBottom: "8px", lineHeight: 1.5 },
  dept: { fontSize: "12px", color: "var(--muted)" },
};
