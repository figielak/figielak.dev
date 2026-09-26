// Cover of the Homelab project: its layers in the site's style (github.com/figielak/homelab).
// Views crop covers from the top left, so everything that matters sits there.
// 1600×1000 px: typst compile --root . --ignore-system-fonts --font-path cv/fonts --ppi 144 \
//   src/assets/projects/src/homelab.typ src/assets/projects/homelab.png
#let bg = rgb("#0E0E10")
#let surface = rgb("#161618")
#let inset = rgb("#111113")
#let border = rgb(255, 255, 255, 20)
#let text-main = rgb("#EDEDEF")
#let muted = rgb("#8B8B92")
#let accent = rgb("#E5484D")

#set page(width: 800pt, height: 500pt, margin: 0pt, fill: bg)
#set text(font: "Satoshi", fill: text-main, size: 12pt)

#place(dx: -220pt, dy: -260pt, circle(radius: 320pt,
  fill: gradient.radial(accent.transparentize(70%), accent.transparentize(100%))))
#place(dx: 420pt, dy: 180pt, circle(radius: 300pt,
  fill: gradient.radial(accent.transparentize(84%), accent.transparentize(100%))))

#let mono(body, fill: muted, size: 8.5pt) = text(font: "Geist Mono", size: size, fill: fill,
  tracking: 0.08em, upper(body))
#let chip(body) = box(fill: inset, stroke: 0.6pt + border, radius: 20pt, inset: (x: 8pt, y: 5pt), body)
#let layer(label, body) = block(width: 100%, fill: surface, stroke: 0.6pt + border, radius: 12pt,
  inset: (x: 14pt, y: 11pt), spacing: 7pt,
  grid(columns: (64pt, 1fr), align: (left + horizon, left + horizon), mono(label), body))

#place(dx: 36pt, dy: 30pt, box(width: 470pt)[
  #mono(fill: text-main, size: 9.5pt)[#text(fill: accent)[■] #h(3pt) Raspberry Pi 4 · ARM64 · Docker Compose]
  #v(10pt)
  #set par(leading: 0.5em)
  #layer[Access][#chip[LAN] #h(4pt) #chip[Tailscale VPN]]
  #layer[Edge][#chip[Caddy · HTTPS] #h(4pt) #chip[AdGuard Home · DNS]]
  #layer[Apps][
    #chip[Mealie] #chip[Uptime Kuma] #chip[Beszel] #chip[Calibre-Web]
    #v(-2pt)
    #chip[MeTube] #chip[Opengist] #chip[Quartz]
  ]
  #layer[Push][#chip[dashboard-agent] #h(4pt) #text(fill: muted)[→] #h(4pt) #chip[figielak.dev · 60 s]]
])
