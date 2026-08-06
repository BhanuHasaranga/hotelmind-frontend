import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

// See app/(app)/layout.tsx for why this redirect lives here (server
// component, Node.js runtime) instead of in proxy.ts.
export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
