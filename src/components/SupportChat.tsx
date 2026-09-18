import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { loadSession } from "@/lib/wallet-auth";
import {
  DEFAULT_CHAT_LABEL,
  readWalletTotal,
  shouldShowChat,
  type ChatMode,
  type SupportMessage,
} from "@/lib/support";
import { supportMarkUserRead, supportSend, supportState } from "@/lib/support.functions";

/**
 * Floating support control, fixed to the bottom-right on every page. Visible
 * once the wallet has moved more than $200 in total, or when forced on.
 */
export function SupportChat() {
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<ChatMode>("auto");
  const [label, setLabel] = useState<string>(DEFAULT_CHAT_LABEL);
  const [unread, setUnread] = useState(0);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [total, setTotal] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const bottom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const session = loadSession();
    setAddress(session?.address ?? "");
    setUsername(session?.username ?? "");
    setTotal(readWalletTotal(session?.address ?? ""));
  }, []);

  const load = useCallback(async () => {
    if (!address) return;
    try {
      const res = await supportState({ data: { wallet_address: address, username } });
      setMode(res.mode);
      setLabel(res.label || DEFAULT_CHAT_LABEL);
      setUnread(res.unread);
      setMessages(res.messages);
    } catch {
      /* silent */
    }
  }, [address, username]);

  useEffect(() => {
    if (!address) return;
    void load();
    const id = setInterval(() => {
      setTotal(readWalletTotal(address));
      void load();
    }, 20_000);
    return () => clearInterval(id);
  }, [address, load]);

  useEffect(() => {
    if (open) bottom.current?.scrollIntoView({ block: "end" });
  }, [open, messages.length]);

  const openChat = useCallback(() => {
    setOpen(true);
    setUnread(0);
    if (address) void supportMarkUserRead({ data: { wallet_address: address } }).catch(() => {});
  }, [address]);

  useEffect(() => {
    const handler = () => openChat();
    window.addEventListener("prime:open-support", handler);
    return () => window.removeEventListener("prime:open-support", handler);
  }, [openChat]);

  const send = useCallback(async () => {
    const body = draft.trim();
    if (!body || !address || sending) return;
    setSending(true);
    try {
      await supportSend({ data: { wallet_address: address, username, body } });
      setDraft("");
      await load();
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  }, [draft, address, username, sending, load, setDraft]);

  if (!address) return null;
  if (!shouldShowChat(mode, total)) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[110] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {!open && (
        <button
          type="button"
          onClick={openChat}
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-2xl transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={label || "Contact support"}
          title={label || "Contact support"}
        >
          <MessageCircle className="h-5 w-5 text-primary" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div className="flex h-[min(26rem,calc(100dvh-2rem))] w-[20rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageCircle className="h-4 w-4 text-primary" /> {label}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close support chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Send us a message and our team will reply here.
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.sender === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <p
                  className={
                    m.sender === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground"
                      : "max-w-[85%] whitespace-pre-wrap rounded-lg border border-border px-3 py-2 text-xs text-foreground"
                  }
                >
                  {m.body}
                </p>
              </div>
            ))}
            <div ref={bottom} />
          </div>

          <div className="flex items-end gap-2 border-t border-border p-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              rows={2}
              placeholder="Type your message…"
              className="min-h-[2.5rem] flex-1 resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={sending || !draft.trim()}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              aria-label="Send message"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
