import { TopBar } from "@/components/layout/TopBar";
import { ChatWindow } from "@/components/assistant/ChatWindow";
import { getSession } from "@/lib/auth/session";

export default async function AssistantPage() {
  const session = await getSession();

  if (!session) {
    return (
      <>
        <TopBar title="AI Assistant" />
        <p className="mt-6 text-sm text-muted-foreground">Sign in to use the AI assistant.</p>
      </>
    );
  }

  return (
    <>
      <TopBar title="AI Assistant" subtitle="Natural-language search over your hotel's live operational data" dataSource="real" />
      <div className="mt-6">
        <ChatWindow token={session.token} role={session.role} />
      </div>
    </>
  );
}
