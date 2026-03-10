import Markdown from "react-markdown";
import { Shield, User } from "lucide-react";

interface MessageBubbleProps {
  message: {
    role: "user" | "model";
    text: string;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-4 max-w-4xl mx-auto ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${
          isUser
            ? "bg-gray-800 border-gray-700 text-gray-300"
            : "bg-[var(--color-fab-accent)]/10 border-[var(--color-fab-accent)]/30 text-[var(--color-fab-accent)]"
        }`}
      >
        {isUser ? <User size={20} /> : <Shield size={20} />}
      </div>

      <div
        className={`flex-1 overflow-hidden rounded-2xl p-5 ${
          isUser
            ? "bg-gray-900/50 border border-gray-800"
            : "bg-[var(--color-fab-surface)] border border-[var(--color-fab-border)]"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isUser
                ? "text-gray-500"
                : "text-[var(--color-fab-accent)] glow-text"
            }`}
          >
            {isUser ? "OPERATOR" : "FAB_SYSTEM"}
          </span>
        </div>

        <div className="prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-gray-800 prose-pre:font-mono prose-a:text-[var(--color-fab-accent)] text-sm leading-relaxed">
          <Markdown>{message.text}</Markdown>
        </div>
      </div>
    </div>
  );
}
