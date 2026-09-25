// Layout shared by cv-pl.typ and cv-en.typ (koncept.md §10).
// The site's type and accent on paper: Satoshi for text, Geist Mono for
// labels and dates, one red accent. Light background for print and ATS.

#let ink = rgb("#0E0E10")
#let muted = rgb("#5C5C63")
#let rule = rgb("#DCDCE0")
#let accent = rgb("#E5484D")

#let period-width = 30mm

#let label(body) = text(
  font: "Geist Mono",
  size: 7.5pt,
  weight: "medium",
  tracking: 0.08em,
  fill: muted,
  upper(body),
)

#let section(title, body) = {
  block(above: 16pt, below: 8pt, {
    grid(
      columns: (auto, 1fr),
      column-gutter: 6pt,
      align: horizon,
      box(width: 5pt, height: 5pt, radius: 1pt, fill: accent),
      label(title),
    )
    v(-2pt)
    line(length: 100%, stroke: 0.5pt + rule)
  })
  body
}

// One row: date or category on the left, content on the right.
#let row(left, body) = grid(
  columns: (period-width, 1fr),
  column-gutter: 10pt,
  row-gutter: 0pt,
  text(font: "Geist Mono", size: 8.5pt, fill: muted, left), body,
)

#let entry(period, title, org: none, meta: none, current: false, body) = block(below: 10pt, row(
    if current { text(fill: accent, period) } else { period },
    {
      text(weight: "medium", size: 10.5pt, title)
      if org != none { text(fill: muted, [ · #org]) }
      if meta != none {
        linebreak()
        text(size: 8.5pt, fill: muted, meta)
      }
      if body != none and body != [] {
        v(3pt, weak: true)
        set list(marker: text(fill: muted, [–]), indent: 0pt, body-indent: 6pt, spacing: 3pt)
        body
      }
    },
))

#let pills(items) = items.map(it => box(
    inset: (x: 5pt, y: 2.5pt),
    radius: 3pt,
    stroke: 0.5pt + rule,
    text(size: 8.5pt, it),
  )).join(h(3pt))

// Boxed, so a long address moves to the next line whole instead of breaking.
#let link-mono(url, shown) = box(link(url, text(font: "Geist Mono", size: 8.5pt, shown)))

#let cv(
  lang: "pl",
  name: "",
  role: "",
  status: none,
  contact: (),
  consent: none,
  body,
) = {
  set document(title: name + " — CV", author: name)
  set text(lang: lang, font: "Satoshi", size: 9.5pt, fill: ink, number-type: "lining")
  set par(leading: 0.55em, spacing: 0.8em, justify: false)
  set block(spacing: 0.8em)
  set page(
    paper: "a4",
    margin: (x: 16mm, top: 15mm, bottom: if consent != none { 24mm } else { 15mm }),
    footer: if consent != none {
      set text(size: 6.5pt, fill: muted)
      set par(justify: true, leading: 0.45em)
      consent
    },
    footer-descent: 30%,
  )
  show link: set text(fill: ink)

  text(size: 24pt, weight: "bold", tracking: -0.01em, name)
  v(4pt, weak: true)
  text(size: 11pt, fill: muted, role)
  if status != none {
    h(8pt)
    box(
      inset: (x: 6pt, y: 3pt),
      radius: 8pt,
      stroke: 0.5pt + rule,
      [#box(circle(radius: 2.2pt, fill: rgb("#46A758")), baseline: -0.5pt) #h(1pt) #text(size: 8.5pt, status)],
    )
  }
  v(8pt, weak: true)
  // The separator opens the next item, so a wrapped line never ends with a dot.
  let sep = text(fill: muted, [·])
  contact.first()
  for item in contact.slice(1) {
    h(5pt)
    box[#sep#h(5pt)#item]
  }

  body
}
