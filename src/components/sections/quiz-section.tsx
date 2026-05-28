import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { MagneticButton } from "@/components/magnetic-button"

const questions = [
  {
    question: "Какая пирамида является самой высокой из трёх пирамид Гизы?",
    options: ["Пирамида Хефрена", "Пирамида Хеопса", "Пирамида Микерина", "Пирамида Джосера"],
    correct: 1,
    fact: "Пирамида Хеопса высотой 146 м — единственное из семи чудес света, сохранившееся до наших дней.",
  },
  {
    question: "Как называлась египетская система письма с рисуночными знаками?",
    options: ["Клинопись", "Руны", "Иероглифы", "Пиктограммы"],
    correct: 2,
    fact: "Египетские иероглифы использовались более 3500 лет. Их расшифровал Жан-Франсуа Шампольон в 1822 году.",
  },
  {
    question: "Кто был богом солнца в Древнем Египте?",
    options: ["Анубис", "Осирис", "Гор", "Ра"],
    correct: 3,
    fact: "Ра — верховный бог солнца. Египтяне верили, что каждый день он проплывает по небу на солнечной барке.",
  },
  {
    question: "На каком материале египтяне писали тексты?",
    options: ["Пергамент", "Папирус", "Береста", "Глиняные таблички"],
    correct: 1,
    fact: "Папирус изготавливали из стеблей болотного растения. Слово «бумага» в английском (paper) произошло от слова «папирус».",
  },
  {
    question: "Что такое саркофаг?",
    options: [
      "Египетский храм",
      "Камень для жертвоприношений",
      "Гробница для мумии фараона",
      "Корабль для путешествий по Нилу",
    ],
    correct: 2,
    fact: "Саркофаги часто делали из камня или золота и украшали иероглифами с молитвами и заклинаниями из Книги мёртвых.",
  },
]

const RESULTS = [
  { min: 0, max: 1, emoji: "🏺", title: "Начинающий исследователь", text: "Египет ещё хранит от тебя много тайн. Прочитай материалы и попробуй ещё раз!" },
  { min: 2, max: 3, emoji: "𓂀", title: "Знаток иероглифов", text: "Неплохо! Ты уже знаешь основы. Ещё немного — и станешь настоящим египтологом!" },
  { min: 4, max: 4, emoji: "⚱️", title: "Мудрец Египта", text: "Очень хорошо! Ты хорошо разбираешься в истории Древнего Египта." },
  { min: 5, max: 5, emoji: "👑", title: "Фараон знаний!", text: "Великолепно! Ты знаешь историю Древнего Египта как настоящий фараон!" },
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
          className={`mb-8 transition-all duration-700 md:mb-12 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Тест
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Проверь свои знания</p>
        </div>

        {!finished ? (
          <div
            className={`transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-foreground/40">
                Вопрос {current + 1} из {questions.length}
              </span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-6 rounded-full transition-all duration-300 ${
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

            <p className="mb-6 font-sans text-lg font-light leading-snug text-foreground md:mb-8 md:text-2xl">
              {question.question}
            </p>

            <div className="mb-6 grid gap-3 md:grid-cols-2 md:gap-4">
              {question.options.map((opt, i) => {
                let cls =
                  "group relative cursor-pointer rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-left font-sans text-sm text-foreground transition-all duration-200 hover:border-foreground/30 hover:bg-foreground/10 md:text-base"

                if (selected !== null) {
                  if (i === question.correct) {
                    cls =
                      "relative rounded-lg border border-amber-400/60 bg-amber-400/10 px-4 py-3 text-left font-sans text-sm text-amber-300 md:text-base"
                  } else if (i === selected && selected !== question.correct) {
                    cls =
                      "relative rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-left font-sans text-sm text-foreground/40 line-through md:text-base"
                  } else {
                    cls =
                      "relative rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 text-left font-sans text-sm text-foreground/40 md:text-base"
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
              <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 duration-300">
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
            className={`transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 text-5xl">{result.emoji}</div>
              <h3 className="mb-2 font-sans text-3xl font-light text-foreground md:text-4xl">{result.title}</h3>
              <p className="mb-4 max-w-md text-base leading-relaxed text-foreground/80">{result.text}</p>
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-6xl font-light text-amber-400">{score}</span>
                <span className="font-mono text-sm text-foreground/50">из {questions.length} правильных</span>
              </div>
            </div>

            <div className="flex gap-3">
              <MagneticButton variant="primary" size="lg" onClick={handleRestart}>
                Пройти ещё раз
              </MagneticButton>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
