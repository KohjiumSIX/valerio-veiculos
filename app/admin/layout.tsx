import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import { isAdminEmail } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/login");
  }

  return <>{children}</>;
}