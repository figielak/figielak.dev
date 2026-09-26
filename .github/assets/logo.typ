// The site's logo as an SVG for the README: `figielak` and a red terminal cursor.
// typst compile --root . --ignore-system-fonts --font-path cv/fonts \
//   --input theme=dark .github/assets/logo.typ .github/assets/logo-dark.svg
#let ink = if sys.inputs.at("theme", default: "dark") == "dark" { rgb("#EDEDEF") } else { rgb("#0E0E10") }
#set page(width: auto, height: auto, margin: (x: 2pt, y: 0pt), fill: none)
#set text(font: "Satoshi", weight: "bold", size: 48pt, fill: ink, tracking: -0.02em,
  top-edge: "ascender", bottom-edge: "descender")
figielak#text(fill: rgb("#E5484D"))[\_]
