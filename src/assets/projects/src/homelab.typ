// Cover of the Homelab project: how a request reaches a service, and how stats leave the Pi,
// in the site's style (github.com/figielak/homelab). No host names, domains or IPs.
// 1600×1000 px: typst compile --root . --ignore-system-fonts --font-path cv/fonts --ppi 144 \
//   src/assets/projects/src/homelab.typ src/assets/projects/homelab.png
#let bg = rgb("#0E0E10")
#let surface = rgb("#161618")
#let inset = rgb("#111113")
#let border = rgb(255, 255, 255, 20)
#let border-strong = rgb(255, 255, 255, 40)
#let text-main = rgb("#EDEDEF")
#let muted = rgb("#8B8B92")
#let accent = rgb("#FF2445")

#set page(width: 800pt, height: 500pt, margin: 0pt, fill: bg)
#set text(font: "Satoshi", fill: text-main, size: 13pt)

#place(dx: -220pt, dy: -260pt, circle(radius: 320pt,
  fill: gradient.radial(accent.transparentize(70%), accent.transparentize(100%))))
#place(dx: 420pt, dy: 180pt, circle(radius: 300pt,
  fill: gradient.radial(accent.transparentize(84%), accent.transparentize(100%))))

#let mono(body, fill: muted, size: 8.5pt) = text(font: "Geist Mono", size: size, fill: fill,
  tracking: 0.08em, upper(body))
#let chip(body) = box(fill: inset, stroke: 0.6pt + border, radius: 20pt, inset: (x: 7pt, y: 4pt),
  text(size: 10.5pt, body))
#let node(x, y, w, h, label, body, note: none) = place(dx: x, dy: y, block(width: w, height: h,
  fill: surface, stroke: 0.6pt + border, radius: 12pt, inset: 12pt, spacing: 0pt)[
  #mono(label) \
  #v(2pt)
  #body
  #if note != none [ \ #text(size: 10pt, fill: muted, note)]
])
// Horizontal arrow from x1 to x2 at height y; `left` points it back.
#let arrow(x1, x2, y, label: none, left: false) = {
  place(dx: x1, dy: y, line(length: x2 - x1, stroke: 1pt + muted))
  let head = if left { polygon(fill: muted, (6pt, 0pt), (0pt, 3.5pt), (6pt, 7pt)) }
    else { polygon(fill: muted, (0pt, 0pt), (6pt, 3.5pt), (0pt, 7pt)) }
  place(dx: if left { x1 } else { x2 - 6pt }, dy: y - 3.5pt, head)
  if label != none { place(dx: x1, dy: y - 16pt, box(width: x2 - x1, align(center, mono(label, size: 7pt)))) }
}

#place(dx: 36pt, dy: 30pt, mono(fill: text-main, size: 9.5pt)[
  #text(fill: accent)[■] #h(3pt) Homelab · no ports open to the internet])

// Request path: device → Tailscale → Caddy → containers.
#node(36pt, 120pt, 120pt, 84pt, [Client], [Laptop, phone])
#arrow(156pt, 186pt, 162pt)
#node(186pt, 120pt, 140pt, 84pt, [Access], [Tailscale], note: [private VPN])
#arrow(326pt, 402pt, 162pt, label: [HTTPS])

// The Pi and everything running on it.
#place(dx: 382pt, dy: 76pt, block(width: 390pt, height: 384pt, stroke: 0.8pt + border-strong,
  radius: 16pt, inset: (x: 16pt, y: 14pt), mono(fill: text-main)[Raspberry Pi 4 · ARM64 · Docker]))
#node(402pt, 120pt, 130pt, 84pt, [Proxy], [Caddy], note: [TLS, routing])
#arrow(532pt, 552pt, 162pt)
#node(552pt, 120pt, 200pt, 190pt, [Containers], [
  #set par(leading: 0.9em)
  #chip[Mealie] #chip[Uptime Kuma] #chip[Beszel] #chip[Calibre-Web] #chip[MeTube]
  #chip[Opengist] #chip[Quartz]
])
#node(402pt, 226pt, 130pt, 84pt, [DNS], [AdGuard Home], note: [ad blocking])

// Stats leave the Pi on their own: an outbound push, nothing comes in.
#node(402pt, 346pt, 350pt, 94pt, [Agent], [dashboard-agent],
  note: [CPU, RAM, disks · services · traffic · DNS])
#arrow(196pt, 402pt, 393pt, label: [push · every 60 s], left: true)
#node(36pt, 351pt, 160pt, 84pt, [Site], [figielak.dev], note: [/dashboard])
