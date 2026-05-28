import { useState } from "react"
import { useReveal } from "@/hooks/use-reveal"

const TOPICS = [
  {
    id: 0,
    emoji: "🏛️",
    title: "Пирамиды и архитектура",
    short: "Как строились великие пирамиды",
    direction: "top",
    color: "amber",
    theory: [
      {
        heading: "Что такое пирамида?",
        text: "Пирамиды — это монументальные гробницы египетских фараонов. Их форма символизировала лучи солнца, падающие на землю. Египтяне верили, что через эти лучи фараон после смерти поднимается на небо к богу Ра.",
      },
      {
        heading: "Три великие пирамиды Гизы",
        text: "Самый известный комплекс — три пирамиды в Гизе. Пирамида Хеопса (146 м) — единственное из семи чудес света, дожившее до наших дней. Рядом — пирамиды Хефрена (136 м) и Микерина (65 м). У подножия стоит Большой Сфинкс — огромная статуя с телом льва и головой фараона.",
      },
      {
        heading: "Как строили?",
        text: "Строительство пирамиды Хеопса заняло около 20 лет. В работе участвовали десятки тысяч рабочих. Огромные каменные блоки весом до 2,5 тонн доставляли на санях и по специальным насыпям. Всего в пирамиде Хеопса около 2,3 миллиона таких блоков.",
      },
      {
        heading: "Внутри пирамиды",
        text: "Внутри пирамиды — длинные коридоры и камеры. В главной погребальной камере стоял саркофаг фараона. Стены покрывали иероглифами с молитвами и заклинаниями, которые должны были помочь фараону в загробной жизни.",
      },
    ],
  },
  {
    id: 1,
    emoji: "𓂀",
    title: "Иероглифы и письменность",
    short: "Система письма Древнего Египта",
    direction: "right",
    color: "amber",
    theory: [
      {
        heading: "Что такое иероглифы?",
        text: "Иероглифы — это система письма, в которой знаки обозначают звуки, слоги или целые слова. Слово «иероглиф» в переводе с греческого означает «священные письмена». Египтяне использовали более 700 различных иероглифов.",
      },
      {
        heading: "Папирус",
        text: "Египтяне писали на папирусе — материале из стеблей одноимённого болотного растения. Стебли разрезали, укладывали слоями крест-накрест и прессовали. Получались прочные листы, из которых сворачивали свитки. Слово «бумага» в английском (paper) произошло именно от слова «папирус».",
      },
      {
        heading: "Розеттский камень",
        text: "Долгое время иероглифы были непонятны учёным. В 1799 году солдаты Наполеона нашли в Египте каменную плиту с одним и тем же текстом на трёх языках: иероглифами, демотическим письмом и греческим. Это помогло французскому учёному Жану-Франсуа Шампольону в 1822 году расшифровать иероглифы.",
      },
      {
        heading: "Писцы",
        text: "Людей, умевших писать, называли писцами. Они были очень уважаемы в египетском обществе. Писцы записывали законы, религиозные тексты, хозяйственные отчёты. Обучение грамоте начиналось с детства и длилось много лет.",
      },
    ],
  },
  {
    id: 2,
    emoji: "☀️",
    title: "Боги и религия",
    short: "Пантеон богов Древнего Египта",
    direction: "left",
    color: "amber",
    theory: [
      {
        heading: "Много богов",
        text: "Египтяне верили в множество богов — более 2000! Каждый бог отвечал за свою область: солнце, смерть, плодородие, мудрость. Богов изображали с телом человека и головой животного — это показывало их особые качества.",
      },
      {
        heading: "Главные боги",
        text: "Ра — бог солнца, плывущий по небу на солнечной барке. Осирис — бог загробного мира и возрождения. Исида — богиня магии и материнства. Анубис — бог с головой шакала, проводник душ в загробный мир. Гор — бог неба с головой сокола, покровитель фараонов.",
      },
      {
        heading: "Храмы",
        text: "Для богов строили огромные храмы. Самые знаменитые — Карнакский и Луксорский в городе Фивы. Храм считался домом бога: там жили жрецы, которые кормили статую бога, одевали её и проводили ритуалы. Простые люди обычно не заходили внутрь.",
      },
      {
        heading: "Суд Осириса",
        text: "Египтяне верили: после смерти душа попадает на суд Осириса. Там её сердце взвешивают на весах — напротив лежит перо богини Маат (справедливости). Если человек жил честно, сердце лёгкое и душа попадает в рай. Если нет — сердце пожирало чудовище Амамат.",
      },
    ],
  },
  {
    id: 3,
    emoji: "👑",
    title: "Фараоны и история",
    short: "Великие правители Египта",
    direction: "bottom",
    color: "amber",
    theory: [
      {
        heading: "Кто такой фараон?",
        text: "Фараон — это верховный правитель Египта. Египтяне считали его живым богом на земле — сыном Ра. Фараон управлял страной, командовал армией и был верховным жрецом. Власть передавалась по наследству. Всего в истории Египта было более 170 фараонов.",
      },
      {
        heading: "Рамзес II Великий",
        text: "Рамзес II правил около 66 лет (1279–1213 до н.э.) и стал одним из самых знаменитых фараонов. При нём было построено множество храмов, в том числе Абу-Симбел — скальный храм с четырьмя 20-метровыми статуями самого фараона. Он участвовал в знаменитой битве при Кадеше.",
      },
      {
        heading: "Тутанхамон",
        text: "Тутанхамон стал фараоном в 9 лет и умер около 19 лет. Он был бы забыт, если бы в 1922 году археолог Говард Картер не нашёл его нетронутую гробницу в Долине Царей. Внутри оказались тысячи сокровищ, включая знаменитую золотую маску фараона.",
      },
      {
        heading: "Клеопатра VII",
        text: "Клеопатра VII (69–30 до н.э.) — последняя царица Египта из династии Птолемеев. Она была очень образована: знала 9 языков, разбиралась в математике и философии. После её смерти Египет стал провинцией Римской империи, что завершило тысячелетнюю историю фараонов.",
      },
    ],
  },
]

export function ServicesSection() {
  const { ref, isVisible } = useReveal(0.2)
  const [activeTopic, setActiveTopic] = useState<number | null>(null)
  const [activeCard, setActiveCard] = useState(0)

  const topic = activeTopic !== null ? TOPICS[activeTopic] : null

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        {!topic ? (
          <>
            <div
              className={`mb-8 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
                Теория
              </h2>
              <p className="font-mono text-sm text-foreground/60 md:text-base">/ Выбери тему и читай</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {TOPICS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTopic(t.id); setActiveCard(0) }}
                  className={`group flex items-start gap-4 rounded-xl border border-foreground/10 bg-foreground/5 p-5 text-left transition-all duration-500 hover:border-amber-400/40 hover:bg-foreground/10 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className="mt-0.5 text-2xl">{t.emoji}</span>
                  <div>
                    <p className="font-mono text-xs text-foreground/40 mb-1">0{i + 1}</p>
                    <h3 className="mb-1 font-sans text-lg font-light text-foreground md:text-xl group-hover:text-amber-300 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-sm text-foreground/60">{t.short}</p>
                    <p className="mt-2 font-mono text-xs text-amber-400/70 group-hover:text-amber-400 transition-colors">
                      {t.theory.length} карточки →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-400">
            <div className="mb-6 flex items-center gap-4 md:mb-8">
              <button
                onClick={() => setActiveTopic(null)}
                className="font-mono text-xs text-foreground/40 hover:text-foreground/80 transition-colors"
              >
                ← Все темы
              </button>
              <span className="font-mono text-xs text-foreground/20">/</span>
              <span className="font-mono text-xs text-foreground/60">{topic.title}</span>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col gap-2">
                {topic.theory.map((card, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
                    className={`rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                      activeCard === i
                        ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                        : "border-foreground/10 bg-foreground/5 text-foreground/60 hover:border-foreground/20 hover:text-foreground/80"
                    }`}
                  >
                    <span className="font-mono text-xs opacity-50 mr-2">0{i + 1}</span>
                    <span className="text-sm">{card.heading}</span>
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-5 md:p-6">
                <h3 className="mb-3 font-sans text-xl font-light text-amber-300 md:text-2xl">
                  {topic.theory[activeCard].heading}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/85 md:text-base">
                  {topic.theory[activeCard].text}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-foreground/30">
                    {activeCard + 1} / {topic.theory.length}
                  </span>
                  {activeCard < topic.theory.length - 1 ? (
                    <button
                      onClick={() => setActiveCard((c) => c + 1)}
                      className="font-mono text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                    >
                      Далее →
                    </button>
                  ) : (
                    <span className="font-mono text-xs text-amber-400/50">Тема изучена ✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
