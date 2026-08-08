import { TopBar } from "@/components/layout/TopBar";
import { ChatWindow } from "@/components/assistant/ChatWindow";
import { getSession } from "@/lib/auth/session";
import { isMocked } from "@/lib/adapters/config";

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

  const mocked = isMocked("aiAssistant");

  return (
    <>
      <TopBar
        title="AI Assistant"
        subtitle={
          mocked
            ? "Scripted demo of natural-language search over hotel operational data"
            : "Natural-language search over your hotel's live operational data"
        }
        dataSource={mocked ? "mock" : "real"}
      />
      <div className="mt-6">
        <ChatWindow token={session.token} role={session.role} mocked={mocked} />
      </div>
    </>
  );
}
