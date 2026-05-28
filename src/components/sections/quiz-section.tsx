import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"

const questions = [
  // Пирамиды и архитектура
  {
    topic: "🏛️ Пирамиды",
    question: "Какая пирамида является самой высокой и единственным сохранившимся чудом света?",
    options: ["Пирамида Хефрена", "Пирамида Джосера", "Пирамида Хеопса", "Пирамида Микерина"],
    correct: 2,
    fact: "Пирамида Хеопса высотой 146 м была построена около 2560 г. до н.э. В ней около 2,3 миллиона каменных блоков.",
  },
  {
    topic: "🏛️ Пирамиды",
    question: "Сколько примерно лет строилась пирамида Хеопса?",
    options: ["5 лет", "20 лет", "100 лет", "50 лет"],
    correct: 1,
    fact: "Строительство заняло около 20 лет. Ежедневно трудились десятки тысяч рабочих, которых кормили и лечили за государственный счёт.",
  },
  {
    topic: "🏛️ Пирамиды",
    question: "Что находится у подножия пирамид Гизы?",
    options: ["Храм Карнак", "Большой Сфинкс", "Долина Царей", "Город Фивы"],
    correct: 1,
    fact: "Большой Сфинкс — статуя высотой 20 м с телом льва и головой фараона. Это один из крупнейших монолитных памятников в мире.",
  },
  {
    topic: "🏛️ Пирамиды",
    question: "Что символизировала форма пирамиды для египтян?",
    options: ["Горы на горизонте", "Лучи солнца, падающие на землю", "Волны Нила", "Крылья орла"],
    correct: 1,
    fact: "Египтяне верили, что по лучам солнца, которые символизирует пирамида, душа фараона поднимается на небо к богу Ра.",
  },
  // Иероглифы и письменность
  {
    topic: "𓂀 Иероглифы",
    question: "Сколько различных иероглифов использовали египтяне?",
    options: ["Около 30", "Около 100", "Более 700", "Более 5000"],
    correct: 2,
    fact: "В египетском письме насчитывается более 700 иероглифов. Часть из них обозначала звуки, часть — целые слова или понятия.",
  },
  {
    topic: "𓂀 Иероглифы",
    question: "Кто расшифровал египетские иероглифы в 1822 году?",
    options: ["Говард Картер", "Наполеон Бонапарт", "Жан-Франсуа Шампольон", "Генрих Шлиман"],
    correct: 2,
    fact: "Шампольон использовал Розеттский камень — плиту с одним текстом на трёх языках. Греческий текст помог понять значение иероглифов.",
  },
  {
    topic: "𓂀 Иероглифы",
    question: "Из чего делали папирус?",
    options: ["Из коры дуба", "Из шкуры животных", "Из стеблей болотного растения", "Из глины"],
    correct: 2,
    fact: "Папирус делали из болотного растения. Стебли разрезали, укладывали слоями и прессовали. Английское слово paper (бумага) произошло от слова «папирус».",
  },
  {
    topic: "𓂀 Иероглифы",
    question: "Как называли людей, умевших писать в Древнем Египте?",
    options: ["Жрецы", "Писцы", "Визири", "Вельможи"],
    correct: 1,
    fact: "Писцы были очень уважаемы в обществе. Они записывали законы, религиозные тексты и хозяйственные отчёты. Обучение длилось много лет.",
  },
  // Боги и религия
  {
    topic: "☀️ Боги",
    question: "Кто был богом солнца в Древнем Египте?",
    options: ["Анубис", "Осирис", "Гор", "Ра"],
    correct: 3,
    fact: "Ра плыл по небу на солнечной барке днём и путешествовал через загробный мир ночью. Утром он рождался заново.",
  },
  {
    topic: "☀️ Боги",
    question: "Бог с головой шакала, проводник душ в загробный мир — это...",
    options: ["Осирис", "Анубис", "Тот", "Сет"],
    correct: 1,
    fact: "Анубис — страж загробного мира. Именно он наблюдал за взвешиванием сердца умершего на суде Осириса.",
  },
  {
    topic: "☀️ Боги",
    question: "Что взвешивали на суде Осириса после смерти человека?",
    options: ["Душу", "Сердце", "Мозг", "Кошелёк с золотом"],
    correct: 1,
    fact: "Сердце взвешивали на весах против пера богини Маат. Если человек жил честно — сердце было лёгким и он попадал в рай.",
  },
  {
    topic: "☀️ Боги",
    question: "Сколько богов было в египетском пантеоне?",
    options: ["Около 12", "Около 50", "Около 100", "Более 2000"],
    correct: 3,
    fact: "Египтяне почитали более 2000 богов. Каждый отвечал за свою сферу: урожай, разлив Нила, мудрость, войну, магию и многое другое.",
  },
  // Фараоны и история
  {
    topic: "👑 Фараоны",
    question: "Сколько лет правил Рамзес II?",
    options: ["Около 20 лет", "Около 40 лет", "Около 66 лет", "Около 90 лет"],
    correct: 2,
    fact: "Рамзес II правил с 1279 по 1213 г. до н.э. — около 66 лет. Он построил множество храмов, включая знаменитый Абу-Симбел.",
  },
  {
    topic: "👑 Фараоны",
    question: "В каком возрасте Тутанхамон стал фараоном?",
    options: ["В 5 лет", "В 9 лет", "В 16 лет", "В 20 лет"],
    correct: 1,
    fact: "Тутанхамон стал фараоном в 9 лет и умер около 19 лет. Его гробницу нашёл археолог Говард Картер в 1922 году нетронутой.",
  },
  {
    topic: "👑 Фараоны",
    question: "Что произошло с Египтом после смерти Клеопатры VII?",
    options: [
      "Египет завоевали греки",
      "Египет стал провинцией Рима",
      "Власть перешла к жрецам",
      "Началась новая династия фараонов",
    ],
    correct: 1,
    fact: "После смерти Клеопатры в 30 г. до н.э. Египет вошёл в состав Римской империи. Это завершило тысячелетнюю эпоху фараонов.",
  },
]

const RESULTS = [
  {
    min: 0, max: 5, emoji: "🏺",
    title: "Начинающий исследователь",
    text: "Египет ещё хранит от тебя много тайн. Прочитай теорию и попробуй снова!",
  },
  {
    min: 6, max: 9, emoji: "𓂀",
    title: "Знаток иероглифов",
    text: "Неплохо! Ты знаешь основы. Ещё чуть-чуть — и станешь настоящим египтологом!",
  },
  {
    min: 10, max: 12, emoji: "⚱️",
    title: "Мудрец Египта",
    text: "Отлично! Ты хорошо разбираешься в истории Древнего Египта.",
  },
  {
    min: 13, max: 14, emoji: "🌟",
    title: "Великий жрец",
    text: "Превосходно! Твои знания достойны самого великого жреца Египта.",
  },
  {
    min: 15, max: 15, emoji: "👑",
    title: "Фараон знаний!",
    text: "Безупречно! Все 15 из 15 — ты знаешь историю Египта как настоящий фараон!",
  },
]

export function QuizSection() {
  const { ref, isVisible } = useReveal(0.2)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showFact, setShowFact] = useState(false)
  const [finished, setFinished] = useState(false)

  const question = questions[current]
  const score = answers.filter(Boolean).length
  const result = RESULTS.find((r) => score >= r.min && score <= r.max) ?? RESULTS[0]

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    setShowFact(true)
    setAnswers((prev) => [...prev, idx === question.correct])
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowFact(false)
    }
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setShowFact(false)
    setFinished(false)
  }

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div
          className={`mb-6 transition-all duration-700 md:mb-8 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-1 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Тест
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Проверь свои знания — 15 вопросов</p>
        </div>

        {!finished ? (
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Progress */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-foreground/40">
                  {current + 1} / {questions.length}
                </span>
                <span className="rounded-full bg-foreground/10 px-2 py-0.5 font-mono text-xs text-foreground/50">
                  {question.topic}
                </span>
              </div>
              <div className="flex gap-0.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-3 rounded-full transition-all duration-300 ${
                      i < answers.length
                        ? answers[i]
                          ? "bg-amber-400"
                          : "bg-foreground/20"
                        : i === current
                          ? "bg-foreground/50"
                          : "bg-foreground/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="mb-5 font-sans text-lg font-light leading-snug text-foreground md:text-xl">
              {question.question}
            </p>

            <div className="mb-4 grid gap-2 md:grid-cols-2 md:gap-3">
              {question.options.map((opt, i) => {
                let cls =
                  "cursor-pointer rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-2.5 text-left font-sans text-sm text-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/10"

                if (selected !== null) {
                  if (i === question.correct) {
                    cls = "rounded-lg border border-amber-400/60 bg-amber-400/10 px-4 py-2.5 text-left font-sans text-sm text-amber-300"
                  } else if (i === selected && selected !== question.correct) {
                    cls = "rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-2.5 text-left font-sans text-sm text-foreground/30 line-through"
                  } else {
                    cls = "rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-2.5 text-left font-sans text-sm text-foreground/30"
                  }
                }

                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)}>
                    <span className="mr-2 font-mono text-xs text-foreground/30">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {showFact && (
              <div className="mb-4 animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 duration-300">
                <p className="font-mono text-xs text-foreground/50">𓂀 Интересный факт</p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/80">{question.fact}</p>
              </div>
            )}

            {selected !== null && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <MagneticButton variant="primary" size="lg" onClick={handleNext}>
                  {current + 1 >= questions.length ? "Посмотреть результат" : "Следующий вопрос →"}
                </MagneticButton>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="mb-6 text-5xl">{result.emoji}</div>
            <h3 className="mb-2 font-sans text-3xl font-light text-foreground md:text-4xl">{result.title}</h3>
            <p className="mb-5 max-w-md text-base leading-relaxed text-foreground/80">{result.text}</p>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-sans text-6xl font-light text-amber-400">{score}</span>
              <span className="font-mono text-sm text-foreground/50">из {questions.length}</span>
            </div>

            {/* Score breakdown by topic */}
            <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
              {["🏛️ Пирамиды", "𓂀 Иероглифы", "☀️ Боги", "👑 Фараоны"].map((topic, ti) => {
                const topicQuestions = questions.filter((q) => q.topic === topic)
                const topicCorrect = topicQuestions.filter((q, qi) => {
                  const globalIdx = questions.indexOf(q)
                  return answers[globalIdx] === true
                }).length
                return (
                  <div key={ti} className="rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2 text-center">
                    <p className="text-base">{topic.split(" ")[0]}</p>
                    <p className="font-mono text-xs text-foreground/50 mt-0.5">
                      {topicCorrect}/{topicQuestions.length}
                    </p>
                  </div>
                )
              })}
            </div>

            <MagneticButton variant="primary" size="lg" onClick={handleRestart}>
              Пройти ещё раз
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  )
}
