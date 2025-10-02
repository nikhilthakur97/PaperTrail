import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // TypeScript doesn't know that redirect() throws, so we need to help it
  // After the redirect check, we know session.user exists
  return { ...session, user: session.user! };
}

