import React, { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://chatbot-2-weac.onrender.com";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icons = {
  Chat: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Minimize: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Location: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Users: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Tag: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Bot: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
};

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  technical: { emoji: "💻", color: "#7828ff", bg: "rgba(120,40,255,0.12)", label: "Technical" },
  career:    { emoji: "💼", color: "#1a89ff", bg: "rgba(26,137,255,0.12)", label: "Career" },
  cultural:  { emoji: "🎭", color: "#e040fb", bg: "rgba(224,64,251,0.12)", label: "Cultural" },
  sports:    { emoji: "🏆", color: "#00c853", bg: "rgba(0,200,83,0.12)",   label: "Sports" },
  academic:  { emoji: "🎓", color: "#ff9100", bg: "rgba(255,145,0,0.12)",  label: "Academic" },
};

// ─── Quick reply sets ─────────────────────────────────────────────────────────
const QUICK_REPLIES = {
  main: [
    { label: "💻 Technical Events", value: "Show technical events" },
    { label: "💼 Career Events",    value: "Show career events" },
    { label: "🎭 Cultural Events",  value: "Show cultural events" },
    { label: "🏆 Sports Events",    value: "Show sports events" },
    { label: "🎓 Academic Events",  value: "Show academic events" },
    { label: "🔥 Trending",         value: "Show trending events" },
    { label: "📋 All Events",       value: "All events" },
  ],
  afterEvents: [
    { label: "🏠 Main Menu",        value: "__menu__" },
    { label: "🔥 Trending Events",  value: "Show trending events" },
    { label: "📋 All Events",       value: "All events" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fillPercent = (e) => Math.round((e.registered / e.capacity) * 100);

const FillBar = ({ pct, color }) => (
  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 4, height: 4, marginTop: 6 }}>
    <div style={{ width: `${pct}%`, background: color, borderRadius: 4, height: "100%", transition: "width 0.6s ease" }} />
  </div>
);

// ─── EventCard ────────────────────────────────────────────────────────────────
const EventCard = ({ event, onRegister }) => {
  const cfg = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.academic;
  const pct = fillPercent(event);
  const isFull = event.registered >= event.capacity;

  return (
    <div className="cb-event-card" style={{ "--cat-color": cfg.color, "--cat-bg": cfg.bg }}>
      <div className="cb-event-header">
        <span className="cb-event-badge" style={{ background: cfg.bg, color: cfg.color }}>
          {cfg.emoji} {cfg.label}
        </span>
        <span className="cb-event-price">{event.price}</span>
      </div>
<h4 className="cb-event-name">{event.name || event.title}</h4>      <p className="cb-event-desc">{event.description}</p>
      <div className="cb-event-meta">
        <span><Icons.Calendar /> {event.date}</span>
        <span><Icons.Location /> {event.location.split(",")[0]}</span>
        <span><Icons.Users /> {event.registered}/{event.capacity}</span>
      </div>
      <FillBar pct={pct} color={cfg.color} />
      <div className="cb-event-footer">
        <div className="cb-tags">
          {event.tags.slice(0, 3).map(t => (
            <span key={t} className="cb-tag"><Icons.Tag /> {t}</span>
          ))}
        </div>
        <button
          className={`cb-register-btn ${isFull ? "cb-register-full" : ""}`}
          onClick={() => !isFull && onRegister(event)}
          disabled={isFull}
        >
          {isFull ? "Full" : "Register →"}
        </button>
      </div>
    </div>
  );
};

// ─── TypingIndicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="cb-msg cb-msg-bot">
    <div className="cb-avatar"><Icons.Bot /></div>
    <div className="cb-bubble cb-typing">
      <span /><span /><span />
    </div>
  </div>
);

// ─── Message ──────────────────────────────────────────────────────────────────
const Message = ({ msg, onRegister, onQuickReply }) => {
  const isUser = msg.role === "user";

  const renderContent = () => {
    const { intent, data, text } = msg;

    if (text) return <p className="cb-text">{text}</p>;

    if (intent === "greeting" || intent === "help" || intent === "unknown" || intent === "registration_help") {
      return <p className="cb-text" style={{ whiteSpace: "pre-line" }}>{data}</p>;
    }

    if (intent === "registration") {
      return (
        <div className="cb-success-msg">
          <Icons.Check />
          <span>{data}</span>
        </div>
      );
    }

    if (intent === "registration_failed") {
      return <p className="cb-text">{data}</p>;
    }

    if (intent === "event_details" && typeof data === "object" && !Array.isArray(data)) {
      return <EventCard event={data} onRegister={onRegister} />;
    }

    if (Array.isArray(data)) {
      return (
        <div className="cb-events-list">
          {data.map(ev => <EventCard key={ev.id} event={ev} onRegister={onRegister} />)}
        </div>
      );
    }

    return <p className="cb-text">{String(data)}</p>;
  };

  if (isUser) {
    return (
      <div className="cb-msg cb-msg-user">
        <div className="cb-bubble cb-bubble-user">{msg.text}</div>
      </div>
    );
  }

  return (
    <div className="cb-msg cb-msg-bot">
      <div className="cb-avatar"><Icons.Bot /></div>
      <div className="cb-bot-content">
        <div className="cb-bubble cb-bubble-bot">{renderContent()}</div>
        {msg.quickReplies && (
          <div className="cb-quick-replies">
            {msg.quickReplies.map(qr => (
              <button key={qr.value} className="cb-qr-btn" onClick={() => onQuickReply(qr)}>
                {qr.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Chatbot ─────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "bot",
        intent: "greeting",
        data: "👋 Hey there! I'm your University Event Assistant.\n\nI can help you discover events, get details, and register — all in one place!",
        quickReplies: QUICK_REPLIES.main,
      },
    ]);
    const t = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const addBotMessage = useCallback((botData, rawResponse) => {
    const intent = rawResponse.intent || "unknown";
    let data = rawResponse.response;
    let quickReplies = null;

    const listIntents = ["upcoming_events", "trending_events", "all_events", "technical_events",
      "career_events", "cultural_events", "sports_events", "academic_events", "recommended_events"];

    if (listIntents.includes(intent)) {
      quickReplies = QUICK_REPLIES.afterEvents;
    } else if (intent === "greeting" || intent === "help") {
      quickReplies = QUICK_REPLIES.main;
    } else if (intent === "registration") {
      quickReplies = QUICK_REPLIES.main;
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: "bot",
      intent,
      data,
      quickReplies,
    }]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    // Special: show menu
    if (text === "__menu__") {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "bot",
        intent: "greeting",
        data: "What would you like to explore? 🎉",
        quickReplies: QUICK_REPLIES.main,
      }]);
      return;
    }

    setMessages(prev => [...prev, { id: Date.now(), role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const json = await res.json();
      if (!open) setUnread(u => u + 1);
      addBotMessage(null, json);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "bot",
        intent: "unknown",
        data: "⚠️ Couldn't connect to the server. Please try again shortly.",
        quickReplies: QUICK_REPLIES.main,
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, open, addBotMessage]);

  const handleRegister = useCallback(async (event) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "bot",
        intent: json.success ? "registration" : "registration_failed",
        data: json.success ? `✅ Successfully registered for "${event.name}"!` : `❌ ${json.error}`,
        quickReplies: QUICK_REPLIES.main,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: "bot",
        intent: "registration_failed",
        data: "⚠️ Registration failed. Please try again.",
        quickReplies: QUICK_REPLIES.main,
      }]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      <style>{CSS}</style>

      {/* FAB */}
      <button
        className={`cb-fab ${pulse ? "cb-fab-pulse" : ""} ${open ? "cb-fab-open" : ""}`}
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        aria-label="Open chat"
      >
        {open ? <Icons.Close /> : <Icons.Chat />}
        {!open && unread > 0 && <span className="cb-badge">{unread}</span>}
      </button>

      {/* Window */}
      <div className={`cb-window ${open ? "cb-window-open" : ""} ${minimized ? "cb-window-min" : ""}`}>
        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-info">
            <div className="cb-header-avatar">
              <Icons.Bot />
              <span className="cb-online-dot" />
            </div>
            <div>
              <div className="cb-header-name">Event Assistant</div>
              <div className="cb-header-status">Online · University Events</div>
            </div>
          </div>
          <div className="cb-header-actions">
            <button className="cb-hbtn" onClick={() => setMinimized(m => !m)} aria-label="Minimize">
              <Icons.Minimize />
            </button>
            <button className="cb-hbtn" onClick={() => setOpen(false)} aria-label="Close">
              <Icons.Close />
            </button>
          </div>
        </div>

        {/* Body */}
        {!minimized && (
          <>
            <div className="cb-body">
              {messages.map(msg => (
                <Message
                  key={msg.id}
                  msg={msg}
                  onRegister={handleRegister}
                  onQuickReply={(qr) => sendMessage(qr.value)}
                />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="cb-input-area">
              <input
                ref={inputRef}
                className="cb-input"
                placeholder="Ask about events…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                className="cb-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <Icons.Send />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap');

  :root {
    --cb-grad: linear-gradient(135deg, #7828ff 0%, #1a89ff 100%);
    --cb-purple: #7828ff;
    --cb-blue: #1a89ff;
    --cb-dark: #0d0d1a;
    --cb-panel: #13131f;
    --cb-card: #1a1a2e;
    --cb-border: rgba(255,255,255,0.08);
    --cb-text: #e8e8f0;
    --cb-muted: #888;
    --cb-radius: 16px;
    --cb-font: 'DM Sans', sans-serif;
    --cb-font-display: 'Sora', sans-serif;
  }

  /* FAB */
  .cb-fab {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: var(--cb-grad);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 8px 32px rgba(120,40,255,0.45);
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
    z-index: 9999;
  }
  .cb-fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(120,40,255,0.55); }
  .cb-fab-open { transform: scale(0.92); box-shadow: 0 4px 20px rgba(120,40,255,0.3); }
  .cb-fab-pulse::before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(120,40,255,0.5);
    animation: cbPulse 2s ease-out infinite;
  }
  @keyframes cbPulse {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  .cb-badge {
    position: absolute;
    top: 0; right: 0;
    background: #ff3d71;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 18px; height: 18px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--cb-dark);
  }

  /* Window */
  .cb-window {
    position: fixed;
    bottom: 100px;
    right: 28px;
    width: 380px;
    max-height: 620px;
    background: var(--cb-panel);
    border-radius: var(--cb-radius);
    border: 1px solid var(--cb-border);
    box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(120,40,255,0.15);
    display: flex;
    flex-direction: column;
    font-family: var(--cb-font);
    color: var(--cb-text);
    transform: scale(0.85) translateY(20px);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(.34,1.2,.64,1);
    z-index: 9998;
    overflow: hidden;
  }
  .cb-window-open {
    transform: scale(1) translateY(0);
    opacity: 1;
    pointer-events: all;
  }
  .cb-window-min { max-height: 64px; }

  @media (max-width: 440px) {
    .cb-window { width: calc(100vw - 24px); right: 12px; bottom: 90px; }
    .cb-fab { bottom: 16px; right: 16px; }
  }

  /* Header */
  .cb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(120,40,255,0.2) 0%, rgba(26,137,255,0.15) 100%);
    border-bottom: 1px solid var(--cb-border);
    flex-shrink: 0;
  }
  .cb-header-info { display: flex; align-items: center; gap: 10px; }
  .cb-header-avatar {
    width: 38px; height: 38px;
    background: var(--cb-grad);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    position: relative;
  }
  .cb-online-dot {
    position: absolute;
    bottom: 1px; right: 1px;
    width: 9px; height: 9px;
    background: #00e676;
    border-radius: 50%;
    border: 2px solid var(--cb-panel);
  }
  .cb-header-name { font-family: var(--cb-font-display); font-size: 14px; font-weight: 600; }
  .cb-header-status { font-size: 11px; color: var(--cb-muted); margin-top: 1px; }
  .cb-header-actions { display: flex; gap: 4px; }
  .cb-hbtn {
    width: 30px; height: 30px;
    border: none;
    background: rgba(255,255,255,0.06);
    border-radius: 8px;
    color: var(--cb-muted);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .cb-hbtn:hover { background: rgba(255,255,255,0.12); color: var(--cb-text); }

  /* Body */
  .cb-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scroll-behavior: smooth;
  }
  .cb-body::-webkit-scrollbar { width: 4px; }
  .cb-body::-webkit-scrollbar-track { background: transparent; }
  .cb-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  /* Messages */
  .cb-msg { display: flex; gap: 8px; animation: cbFadeIn 0.25s ease; }
  @keyframes cbFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .cb-msg-user { flex-direction: row-reverse; }
  .cb-msg-bot { align-items: flex-start; }
  .cb-avatar {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, rgba(120,40,255,0.3), rgba(26,137,255,0.3));
    border: 1px solid rgba(120,40,255,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: #a879ff;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .cb-bot-content { display: flex; flex-direction: column; gap: 8px; max-width: calc(100% - 40px); }
  .cb-bubble { border-radius: 14px; font-size: 13.5px; line-height: 1.55; }
  .cb-bubble-user {
    background: var(--cb-grad);
    color: #fff;
    padding: 10px 14px;
    border-bottom-right-radius: 4px;
    max-width: 260px;
    word-break: break-word;
  }
  .cb-bubble-bot {
    background: var(--cb-card);
    border: 1px solid var(--cb-border);
    color: var(--cb-text);
    padding: 12px 14px;
    border-bottom-left-radius: 4px;
    width: 100%;
  }
  .cb-text { margin: 0; }

  /* Typing */
  .cb-typing {
    display: flex; gap: 5px;
    padding: 12px 16px;
    align-items: center;
  }
  .cb-typing span {
    width: 7px; height: 7px;
    background: rgba(120,40,255,0.6);
    border-radius: 50%;
    animation: cbDot 1.2s ease-in-out infinite;
  }
  .cb-typing span:nth-child(2) { animation-delay: 0.2s; }
  .cb-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes cbDot {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* Success */
  .cb-success-msg {
    display: flex; align-items: center; gap: 8px;
    font-size: 13.5px;
    color: #00e676;
  }

  /* Quick replies */
  .cb-quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .cb-qr-btn {
    background: rgba(120,40,255,0.15);
    border: 1px solid rgba(120,40,255,0.35);
    color: #c19eff;
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 12px;
    font-family: var(--cb-font);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .cb-qr-btn:hover {
    background: rgba(120,40,255,0.3);
    border-color: rgba(120,40,255,0.6);
    color: #fff;
    transform: translateY(-1px);
  }

  /* Event list */
  .cb-events-list { display: flex; flex-direction: column; gap: 10px; }

  /* Event card */
  .cb-event-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 12px;
    border-left: 3px solid var(--cat-color);
    transition: background 0.2s;
  }
  .cb-event-card:hover { background: rgba(255,255,255,0.06); }
  .cb-event-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .cb-event-badge {
    font-size: 10.5px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 20px;
    font-family: var(--cb-font-display);
    letter-spacing: 0.02em;
  }
  .cb-event-price {
    font-size: 11px;
    font-weight: 600;
    color: #00e676;
    background: rgba(0,230,118,0.1);
    padding: 2px 8px;
    border-radius: 20px;
  }
  .cb-event-name {
    margin: 0 0 4px;
    font-family: var(--cb-font-display);
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    line-height: 1.35;
  }
  .cb-event-desc {
    margin: 0 0 8px;
    font-size: 12px;
    color: var(--cb-muted);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .cb-event-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 11.5px;
    color: #aaa;
    margin-bottom: 2px;
  }
  .cb-event-meta span { display: flex; align-items: center; gap: 4px; }
  .cb-event-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
  .cb-tags { display: flex; gap: 4px; flex-wrap: wrap; }
  .cb-tag {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: #999;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    display: flex; align-items: center; gap: 3px;
  }
  .cb-register-btn {
    background: var(--cb-grad);
    border: none;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    font-family: var(--cb-font);
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .cb-register-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .cb-register-full {
    background: rgba(255,255,255,0.1);
    cursor: not-allowed;
    color: #666;
  }

  /* Input */
  .cb-input-area {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border-top: 1px solid var(--cb-border);
    background: rgba(0,0,0,0.2);
    flex-shrink: 0;
  }
  .cb-input {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: var(--cb-text);
    font-family: var(--cb-font);
    font-size: 13.5px;
    padding: 9px 13px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .cb-input::placeholder { color: var(--cb-muted); }
  .cb-input:focus {
    border-color: rgba(120,40,255,0.5);
    background: rgba(255,255,255,0.08);
  }
  .cb-send {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: var(--cb-grad);
    border: none;
    color: #fff;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: opacity 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .cb-send:hover:not(:disabled) { opacity: 0.85; transform: scale(1.05); }
  .cb-send:disabled { opacity: 0.35; cursor: not-allowed; }
`;

export default Chatbot;