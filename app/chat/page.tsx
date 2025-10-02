import { requireAuth } from "@/app/lib/auth-helper";
import { ChatInterface } from "@/app/components/chat/chat-interface";

export default async function ChatPage() {
  const session = await requireAuth();

  return <ChatInterface user={session.user} />;
}

