import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/utils";
import { format } from "date-fns";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const getDoshaResult = () => {
  try {
    const r = localStorage.getItem("dosha_result");
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
};
const getLogs = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem("wellness_logs") || "[]");
  } catch {
    return [];
  }
};
const avg = (arr: number[]) => (arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null);

const doshaPill: Record<string, string> = {
  Vata: "rounded-full border border-dosha-vata/30 bg-dosha-vata/15 px-3 py-0.5 text-xs font-semibold text-dosha-vata",
  Pitta: "rounded-full border border-dosha-pitta/30 bg-dosha-pitta/15 px-3 py-0.5 text-xs font-semibold text-dosha-pitta",
  Kapha: "rounded-full border border-dosha-kapha/30 bg-dosha-kapha/15 px-3 py-0.5 text-xs font-semibold text-dosha-kapha",
};

const QUICK = [
  "Why am I low on energy?",
  "What should I eat today?",
  "Help me sleep better",
  "My dosha feels imbalanced",
];

const TypingDots = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-2 w-2 animate-bounce rounded-full bg-primary/40"
        style={{ animationDelay: `${i * 150}ms` }}
      />
    ))}
  </div>
);

const WellnessCoach = () => {
  const { user, token } = useAuth();
  const doshaResult = getDoshaResult();
  const dosha = doshaResult?.dominant || localStorage.getItem("userDosha") || "Unknown";
  const logs = getLogs().slice(-7);
  const energyAvg = avg(logs.map((l: any) => l.energy).filter(Boolean));
  const sleepAvg = avg(logs.map((l: any) => l.sleep).filter(Boolean));
  const moodAvg = avg(logs.map((l: any) => l.mood).filter(Boolean));

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const name = user?.name || user?.username || "Friend";

  useEffect(() => {
    document.title = "Vaidya — AyurWell";
  }, []);

  useEffect(() => {
    if (!token || historyLoaded) return;
    fetch(`${API_BASE_URL}/api/coach/history/`, { headers: { Authorization: `Token ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(
            data.map((m: any) => ({
              role: m.role,
              content: m.content,
              ts: new Date(m.created_at).getTime(),
            })),
          );
        }
        setHistoryLoaded(true);
      })
      .catch(() => setHistoryLoaded(true));
  }, [token, historyLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const authHeader = token ? `Token ${token}` : "";
      const res = await fetch(`${API_BASE_URL}/api/coach/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(authHeader ? { Authorization: authHeader } : {}) },
        body: JSON.stringify({
          message: trimmed,
          dosha,
          energy_avg: energyAvg,
          sleep_avg: sleepAvg,
          mood_avg: moodAvg,
          conversation_history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, ts: Date.now() }]);
        if (!firstMessageSent && token) {
          setFirstMessageSent(true);
          fetch(`${API_BASE_URL}/api/gamification/check/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
          }).catch(() => {});
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I'm having trouble connecting right now. Please try again.", ts: Date.now() },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Check that the backend is running, or try again shortly.",
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      taRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const empty = messages.length === 0 && !loading;

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-surface md:h-[calc(100vh-4rem)]">
      <header className="ayur-card flex h-16 flex-shrink-0 items-center justify-between rounded-none border-b border-primary/10 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/dashboard" className="text-gray-500 hover:text-primary" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="truncate font-semibold text-gray-900 dark:text-gray-100">Vaidya — AI Wellness Coach</span>
        </div>
        {dosha !== "Unknown" && <span className={doshaPill[dosha] ?? doshaPill.Kapha}>{dosha}</span>}
        <span className="hidden text-xs text-gray-400 sm:inline">Powered by Claude AI</span>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {empty && (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-md">
              <Leaf className="h-8 w-8" />
            </div>
            <h2 className="font-display text-xl text-primary-dark dark:text-gray-100">
              Namaste! I&apos;m Vaidya 🙏
            </h2>
            <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
              Your personal Ayurvedic wellness coach. Ask me anything about your health journey.
            </p>
            <div className="mt-8 grid max-w-sm grid-cols-2 gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:bg-[#0f3460] dark:text-gray-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {!empty &&
          messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm md:max-w-md ${
                    isUser ? "rounded-br-sm bg-primary text-white" : "rounded-bl-sm border border-primary/10 bg-white dark:bg-[#0f3460]"
                  }`}
                >
                  {!isUser && i === 0 && (
                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                        <Leaf className="h-4 w-4" />
                      </span>
                      Vaidya
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={`mt-1 text-[10px] ${isUser ? "text-right text-white/70" : "text-gray-400"}`}>
                    {format(new Date(msg.ts), "h:mm a")}
                  </p>
                </div>
              </div>
            );
          })}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-primary/10 bg-white dark:bg-[#0f3460] md:max-w-md">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!empty && (
        <div className="flex gap-2 overflow-x-auto border-t border-primary/10 bg-white px-4 py-2 dark:bg-[#0f3460]">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(q)}
              className="flex-shrink-0 whitespace-nowrap rounded-full border border-gray-200 px-3 py-1 text-xs text-primary hover:bg-primary/5 disabled:opacity-50 dark:border-white/10"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-primary/10 bg-white p-4 dark:bg-[#0f3460]">
        <div className="mx-auto flex max-w-3xl gap-2">
          <textarea
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={loading}
            placeholder="Ask Vaidya anything about your wellness..."
            className="ayur-input max-h-32 min-h-[44px] flex-1 resize-none rounded-full py-2.5"
          />
          <button
            type="button"
            disabled={!input.trim() || loading}
            onClick={() => sendMessage(input)}
            className="ayur-btn-primary flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full p-0 disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-gray-400">Hi {name} — wellness guidance only, not medical advice.</p>
      </div>
    </div>
  );
};

export default WellnessCoach;
