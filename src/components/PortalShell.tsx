"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const TABS = [
  { href: "/portal/home",     label: "홈",   icon: "⬤",  color: "var(--primary)" },
  { href: "/portal/eval",     label: "평가",  icon: "◆",  color: "var(--blue)" },
  { href: "/portal/growth",   label: "성장",  icon: "▲",  color: "var(--green)" },
  { href: "/portal/activity", label: "활동",  icon: "★",  color: "var(--amber)" },
  { href: "/portal/counsel",  label: "상담",  icon: "♥",  color: "var(--red)" },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <span style={styles.logo}>대전도시과학고</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>로그아웃</button>
      </header>

      <main style={styles.main}>{children}</main>

      <nav style={styles.nav}>
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link key={tab.href} href={tab.href} style={styles.tabLink}>
              <span style={{ ...styles.tabIcon, color: active ? tab.color : "var(--muted)" }}>
                {tab.icon}
              </span>
              <span style={{ ...styles.tabLabel, color: active ? tab.color : "var(--muted)", fontWeight: active ? 700 : 400 }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    maxWidth: "480px",
    margin: "0 auto",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
    position: "relative",
  },
  header: {
    padding: "16px 20px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--card)",
    borderBottom: "1px solid #E0E8F0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: { fontSize: "16px", fontWeight: 700, color: "var(--ink)" },
  logoutBtn: {
    fontSize: "13px",
    color: "var(--muted)",
    background: "transparent",
    padding: "4px 8px",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: "80px",
  },
  nav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    background: "var(--card)",
    borderTop: "1px solid #E0E8F0",
    padding: "8px 0 env(safe-area-inset-bottom, 8px)",
    zIndex: 20,
  },
  tabLink: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    textDecoration: "none",
  },
  tabIcon: { fontSize: "18px" },
  tabLabel: { fontSize: "11px" },
};
