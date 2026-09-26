// Social preview for the GitHub repository (Settings → General → Social preview).
// 1280×640 px: typst compile --root . --ignore-system-fonts --font-path cv/fonts \
//   --ppi 144 .github/assets/social-preview.typ .github/assets/social-preview.png
#let bg = rgb("#0E0E10")
#let text-main = rgb("#EDEDEF")
#let muted = rgb("#8B8B92")
#let accent = rgb("#E5484D")
#let border = rgb(255, 255, 255, 20)

#set page(width: 640pt, height: 320pt, margin: 0pt, fill: bg)
#set text(font: "Satoshi", fill: text-main)

// The dashboard's red glow, top left and bottom right.
#place(dx: -160pt, dy: -200pt, circle(radius: 240pt,
  fill: gradient.radial(accent.transparentize(72%), accent.transparentize(100%))))
#place(dx: 380pt, dy: 140pt, circle(radius: 220pt,
  fill: gradient.radial(accent.transparentize(80%), accent.transparentize(100%))))

// The dashboard screenshot, bleeding off the right edge.
#place(dx: 318pt, dy: 44pt, box(
  width: 460pt, height: 288pt, radius: 12pt, clip: true, stroke: 0.75pt + border,
  image("dashboard.webp", width: 100%),
))

#place(dx: 44pt, dy: 0pt, box(width: 258pt, height: 320pt, align(horizon)[
  #text(size: 40pt, weight: "bold", tracking: -0.02em)[figielak#text(fill: accent)[\_]]
  #v(12pt)
  #text(size: 17pt, weight: "medium")[Personal site with a live dashboard]
  #v(4pt)
  #text(size: 11.5pt, fill: muted)[Bento grid fed by GitHub, Last.fm, WakaTime,
    the weather and a homelab — Astro on Cloud Run behind Cloudflare.]
  #v(18pt)
  #text(font: "Geist Mono", size: 10pt, fill: muted, tracking: 0.08em)[
    #box(circle(radius: 3pt, fill: rgb("#46A758")), baseline: -1pt) #h(4pt) FIGIELAK.DEV]
]))
