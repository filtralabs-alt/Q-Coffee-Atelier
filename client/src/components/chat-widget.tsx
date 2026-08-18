import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function ChatWidget() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isSending) return;

    setInput("");
    setError(false);
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setIsSending(true);

    try {
      const res = await apiRequest("POST", "/api/chat", { message });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setError(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-5 space-y-3" data-testid="card-chat-widget">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-primary" />
        <div>
          <h3 className="font-semibold text-sm">{t("chat.title")}</h3>
          <p className="text-xs text-muted-foreground">{t("chat.subtitle")}</p>
        </div>
      </div>

      {messages.length > 0 && (
        <div ref={scrollRef} className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm rounded-lg px-3 py-2 leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground ml-6"
                  : "bg-muted mr-6"
              }`}
              data-testid={`chat-message-${msg.role}-${i}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <p className="text-sm text-muted-foreground">{t("chat.empty")}</p>
      )}

      {error && <p className="text-sm text-destructive">{t("chat.error")}</p>}

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={t("chat.placeholder")}
          disabled={isSending}
          data-testid="input-chat-message"
        />
        <Button
          onClick={handleSend}
          disabled={isSending || !input.trim()}
          size="icon"
          data-testid="button-chat-send"
        >
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
}
