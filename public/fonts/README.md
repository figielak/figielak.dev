# Fonts

Satoshi is not available on Fontsource, so it is self-hosted (koncept.md §6).

Drop the variable file here as:

    public/fonts/Satoshi-Variable.woff2

Get it from https://www.fontshare.com/fonts/satoshi (Download family → the
variable `.woff2`, weights 400–700). Until the file exists, `@font-face` in
`src/styles/global.css` fails to load and the stack falls through to the
system sans — everything still renders, just not in the target typeface.
