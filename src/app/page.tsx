import { redirect } from "next/navigation";
import { getSessionHakbun } from "@/lib/session";
import AuthPage from "@/components/AuthPage";

export default function Home() {
  const hakbun = getSessionHakbun();
  if (hakbun) redirect("/portal");
  return <AuthPage />;
}
