import { useState, useEffect, useRef } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"

const AUTH_URL = "https://functions.poehali.dev/f7767f09-767b-41a5-b45f-13d12fac7c79"
const MESSAGES_URL = "https://functions.poehali.dev/963a2825-0318-46c9-8b60-16aa610d4eab"

interface User {
  id: number
  name: string
  role: "teacher" | "student"
  login: string
}

interface Message {
  id: number
  text: string
  created_at: string
  name: string
  role: "teacher" | "student"
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
}

export function ChatSection() {
  const { ref, isVisible } = useReveal(0.1)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem("egypt_chat_user")
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })
  const [mode, setMode] = useState<"login" | "register">("login")
  const [form, setForm] = useState({ name: "", login: "", password: "" })
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadMessages = async () => {
    const res = await fetch(MESSAGES_URL)
    if (res.ok) {
      const data = await res.json()
      setMessages(data)
    }
  }

  useEffect(() => {
    if (!user) return
    loadMessages()
    pollRef.current = setInterval(loadMessages, 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthLoading(true)
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAuthError(data.error || "Ошибка")
      } else {
        localStorage.setItem("egypt_chat_user", JSON.stringify(data))
        setUser(data)
      }
    } catch {
      setAuthError("Ошибка соединения")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !user) return
    setSending(true)
    try {
      await fetch(MESSAGES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, text: text.trim() }),
      })
      setText("")
      await loadMessages()
    } finally {
      setSending(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("egypt_chat_user")
    setUser(null)
    setMessages([])
  }

  // Group messages by date
  const grouped: { date: string; msgs: Message[] }[] = []
  for (const m of messages) {
    const d = formatDate(m.created_at)
    const last = grouped[grouped.length - 1]
    if (last && last.date === d) last.msgs.push(m)
    else grouped.push({ date: d, msgs: [m] })
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start flex-col px-6 pt-20 pb-6 md:px-12 lg:px-16"
    >
      <div
        className={`mb-4 shrink-0 transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
      >
        <div className="flex items-end justify-between">
          <div>
            <h2 className="mb-1 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Беседа
            </h2>
            <p className="font-mono text-sm text-foreground/60">/ Общайся с учителем и одноклассниками</p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-foreground">{user.name}</p>
                <p className="font-mono text-xs text-foreground/40">
                  {user.role === "teacher" ? "👨‍🏫 Учитель" : "🎒 Ученик"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="font-mono text-xs text-foreground/30 hover:text-foreground/60 transition-colors"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>

      {!user ? (
        /* Auth form */
        <div
          className={`flex flex-1 items-center justify-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="w-full max-w-sm">
            <div className="mb-6 flex gap-1 rounded-lg border border-foreground/10 bg-foreground/5 p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setAuthError("") }}
                  className={`flex-1 rounded-md py-2 font-mono text-xs transition-all duration-200 ${
                    mode === m
                      ? "bg-amber-400/20 text-amber-300"
                      : "text-foreground/50 hover:text-foreground/70"
                  }`}
                >
                  {m === "login" ? "Войти" : "Зарегистрироваться"}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="mb-1 block font-mono text-xs text-foreground/60">Имя</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Как тебя зовут?"
                    className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-amber-400/50 focus:outline-none"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block font-mono text-xs text-foreground/60">Логин</label>
                <input
                  type="text"
                  required
                  value={form.login}
                  onChange={(e) => setForm({ ...form, login: e.target.value })}
                  placeholder="Придумай логин"
                  className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-amber-400/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-xs text-foreground/60">Пароль</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••"
                  className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-amber-400/50 focus:outline-none"
                />
              </div>
              {authError && (
                <p className="font-mono text-xs text-red-400">{authError}</p>
              )}
              <div className="pt-2">
                <MagneticButton variant="primary" size="lg" className="w-full">
                  {authLoading ? "..." : mode === "login" ? "Войти" : "Создать аккаунт"}
                </MagneticButton>
              </div>
              {mode === "login" && (
                <p className="text-center font-mono text-xs text-foreground/40">
                  Учитель: логин <span className="text-foreground/60">teacher</span>, пароль <span className="text-foreground/60">egypt2024</span>
                </p>
              )}
            </form>
          </div>
        </div>
      ) : (
        /* Chat */
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto py-2 pr-2" style={{ scrollbarWidth: "thin" }}>
            {messages.length === 0 && (
              <p className="py-8 text-center font-mono text-sm text-foreground/30">
                Сообщений пока нет. Напиши первым! 𓂀
              </p>
            )}
            {grouped.map((group) => (
              <div key={group.date}>
                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-foreground/10" />
                  <span className="font-mono text-xs text-foreground/30">{group.date}</span>
                  <div className="h-px flex-1 bg-foreground/10" />
                </div>
                {group.msgs.map((msg) => {
                  const isMe = msg.name === user.name
                  const isTeacher = msg.role === "teacher"
                  return (
                    <div
                      key={msg.id}
                      className={`mb-2 flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                          isTeacher
                            ? "bg-amber-400/20 text-amber-300"
                            : "bg-foreground/10 text-foreground/60"
                        }`}
                      >
                        {isTeacher ? "👨‍🏫" : msg.name[0]?.toUpperCase()}
                      </div>
                      <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                        <div className="mb-0.5 flex items-baseline gap-2">
                          <span
                            className={`font-mono text-xs ${
                              isTeacher ? "text-amber-400/70" : "text-foreground/40"
                            }`}
                          >
                            {msg.name}
                          </span>
                          {isTeacher && (
                            <span className="rounded-full bg-amber-400/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-400/60">
                              учитель
                            </span>
                          )}
                        </div>
                        <div
                          className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                            isMe
                              ? "rounded-tr-sm bg-amber-400/15 text-foreground"
                              : "rounded-tl-sm bg-foreground/8 text-foreground/90"
                          }`}
                          style={{ backgroundColor: isMe ? undefined : "rgba(255,255,255,0.05)" }}
                        >
                          {msg.text}
                        </div>
                        <span className="mt-0.5 font-mono text-[10px] text-foreground/25">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="mt-3 flex shrink-0 gap-3 border-t border-foreground/10 pt-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напиши сообщение..."
              maxLength={1000}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!text.trim() || sending}
              className="shrink-0 rounded-lg bg-amber-400/20 px-4 py-2 font-mono text-xs text-amber-300 transition-all hover:bg-amber-400/30 disabled:opacity-30"
            >
              {sending ? "..." : "Отправить"}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
