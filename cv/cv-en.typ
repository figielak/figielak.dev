#import "template.typ": *

#show: cv.with(
  lang: "en",
  name: "Krystian Figiela",
  role: "Student · Data & Software Developer · Rzeszów",
  status: [Open to internships (Data / Backend)],
  contact: (
    link-mono("mailto:krystian.figiela000@gmail.com", "krystian.figiela000@gmail.com"),
    link-mono("tel:+48696273167", "+48 696 273 167"),
    link-mono("https://figielak.dev/en/", "figielak.dev"),
    link-mono("https://github.com/figielak", "github.com/figielak"),
    link-mono("https://www.linkedin.com/in/krystian-figiela/", "linkedin.com/in/krystian-figiela"),
  ),
  consent: [I hereby consent to the processing of my personal data for the purposes necessary for the
    recruitment process, in accordance with Regulation (EU) 2016/679 of the European Parliament and
    of the Council of 27 April 2016 on the protection of natural persons with regard to the
    processing of personal data and on the free movement of such data, and repealing Directive
    95/46/EC (GDPR).],
)

#section[About][
  I study Data Engineering and Analysis at Rzeszów University of Technology. I've been programming
  since technical school, from small tools to my own homelab.
]

#section[Experience][
  #entry("02.2026–05.2026", [Junior Implementation Consultant], org: [BMM],
    meta: [Głogów Małopolski · 4 months])[
    I analysed hospital processes, configured document workflow and approval paths to match them,
    and trained and supported staff after go-live.
  ]
  #entry("2025–present", [Machine Learning Science Club], meta: [Rzeszów University of Technology],
    current: true)[
    Team projects in data analysis and machine learning (data preparation, building and evaluating
    models) and hackathons.
  ]
  #entry("2023, 2024", [Internship], org: [MF-COMP], meta: [2 months])[
    Alongside hardware diagnostics and repair, I built a Python program for the service that
    automated taking in repair requests and was used every day.
  ]
]

#section[Projects][
  #entry(link("https://figielak.dev/en/", "figielak.dev"), [Personal site with a live dashboard],
    meta: [Astro · TypeScript · Docker · Google Cloud Run · Cloudflare · Firestore])[
    A profile page and a dashboard with live data (GitHub, WakaTime, Last.fm, weather, homelab) from
    its own API endpoints; deployed from GitHub Actions to Cloud Run.
  ]
  #entry("Homelab", [Homelab stats agent], meta: [Docker · Raspberry Pi · Linux])[
    A container on a Raspberry Pi that collects machine load, service uptime and ad blocking every
    minute and pushes anonymised data to the dashboard.
  ]
]

#section[Skills][
  #row("Backend", pills(("Python", "FastAPI", "Flask", "Pandas")))
  #row("Automation", pills(("GitHub Actions",)))
  #row("Database", pills(("SQL", "Firestore")))
  #row("DevOps", pills(("Docker", "Linux", "Google Cloud Run", "Cloudflare")))
  #row("AI", pills(("Claude", "Copilot")))
  #row("Tools", pills(("Git",)))
]

#section[Education][
  #entry("2025–present", [Data Engineering and Analysis],
    meta: [Rzeszów University of Technology · Rzeszów], current: true)[]
  #entry("2020–2025", [IT Technician], meta: [Zespół Szkół Technicznych · Leżajsk])[]
]

#section[Languages][
  Polish — native · English — B1
]
