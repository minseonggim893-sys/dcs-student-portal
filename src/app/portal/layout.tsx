import { redirect } from "next/navigation";
import { getSessionHakbun } from "@/lib/session";
import PortalShell from "@/components/PortalShell";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const hakbun = getSessionHakbun();
  if (!hakbun) redirect("/");
  return <PortalShell>{children}</PortalShell>;
}
