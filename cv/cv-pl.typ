#import "template.typ": *

#show: cv.with(
  lang: "pl",
  name: "Krystian Figiela",
  role: "Student · Data & Software Developer · Rzeszów",
  status: [Otwarty na staż (Data / Backend)],
  contact: (
    link-mono("mailto:krystian.figiela000@gmail.com", "krystian.figiela000@gmail.com"),
    link-mono("tel:+48696273167", "+48 696 273 167"),
    link-mono("https://figielak.dev", "figielak.dev"),
    link-mono("https://github.com/figielak", "github.com/figielak"),
    link-mono("https://www.linkedin.com/in/krystian-figiela/", "linkedin.com/in/krystian-figiela"),
  ),
  consent: [Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do
    realizacji procesu rekrutacji (zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE)
    2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem
    danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy
    95/46/WE (RODO)).],
)

#section[O mnie][
  Studiuję Inżynierię i Analizę Danych na Politechnice Rzeszowskiej. Programuję od technikum,
  od małych narzędzi po własny homelab.
]

#section[Doświadczenie][
  #entry("02.2026–05.2026", [Młodszy konsultant wdrożeniowy], org: [BMM],
    meta: [Głogów Małopolski · 4 miesiące])[
    Analizowałem procesy w szpitalach, konfigurowałem pod nie ścieżki obiegu i akceptacji
    dokumentów, a po wdrożeniu szkoliłem i wspierałem personel.
  ]
  #entry("2025–obecnie", [Koło Naukowe Machine Learning], meta: [Politechnika Rzeszowska],
    current: true)[
    Zespołowe projekty z analizy danych i uczenia maszynowego (przygotowanie danych, budowa
    i ocena modeli) oraz udział w hackathonach.
  ]
  #entry("2023, 2024", [Praktyki zawodowe], org: [MF-COMP], meta: [2 miesiące])[
    Obok diagnostyki i naprawy sprzętu stworzyłem dla serwisu program w Pythonie automatyzujący
    przyjmowanie zgłoszeń, z którego korzystano na co dzień.
  ]
]

#section[Projekty][
  #entry(link("https://figielak.dev", "figielak.dev"), [Strona osobista z żywym dashboardem],
    meta: [Astro · TypeScript · Docker · Google Cloud Run · Cloudflare · Firestore])[
    Wizytówka i dashboard z danymi na żywo (GitHub, WakaTime, Last.fm, pogoda, homelab) z własnych
    endpointów API; deploy z GitHub Actions na Cloud Run.
  ]
  #entry("Homelab", [Agent statystyk homelaba], meta: [Docker · Raspberry Pi · Linux])[
    Kontener na Raspberry Pi, który co minutę zbiera zużycie maszyny, uptime usług i blokadę reklam
    i wysyła zanonimizowane dane na dashboard.
  ]
]

#section[Umiejętności][
  #row("Backend", pills(("Python", "FastAPI", "Flask", "Pandas")))
  #row("Automatyzacja", pills(("GitHub Actions",)))
  #row("Bazy danych", pills(("SQL", "Firestore")))
  #row("DevOps", pills(("Docker", "Linux", "Google Cloud Run", "Cloudflare")))
  #row("AI", pills(("Claude", "Copilot")))
  #row("Narzędzia", pills(("Git",)))
]

#section[Edukacja][
  #entry("2025–obecnie", [Inżynieria i Analiza Danych], meta: [Politechnika Rzeszowska · Rzeszów],
    current: true)[]
  #entry("2020–2025", [Technik informatyk], meta: [Zespół Szkół Technicznych · Leżajsk])[]
]

#section[Języki][
  Polski — ojczysty · Angielski — B1
]
