# Builds the figielak logo masters (symbol, small-size cut, wordmark, lockups).
# From the repo root: python3 brand/build.py brand/svg
import re, os, sys
SRC = '.github/assets/logo-dark.svg'  # Satoshi outlines come from the Typst-built README logo
OUT = sys.argv[1]
INK, LIGHT, RED = '#0E0E10', '#EDEDEF', '#FF2445'
os.makedirs(OUT, exist_ok=True)

def symbol(ink, stem=40, bar=36, cur=(148, 76, 32), cross=(36, 164, 100), ox=0, oy=0, s=1):
    """Lowercase f on a 256 grid: stem centred on x=96, hook centre x=152, top y=20, baseline y=232."""
    l, r = 96 - stem / 2, 96 + stem / 2
    R = 152 - l                      # outer hook radius
    cx0, cx1, cy = cross
    cu_x, cu_w, cu_h = cur
    d = (f'M{l:g} 232 V{20 + R:g} A{R:g} {R:g} 0 0 1 152 20 H180 V{20 + bar:g} H152 '
         f'A{152 - r:g} {R - bar:g} 0 0 0 {r:g} {20 + R:g} V232 Z M{cx0} {cy} H{cx1} V{cy + bar} H{cx0} Z')
    t = f' transform="translate({ox:g} {oy:g}) scale({s:g})"' if (ox or oy or s != 1) else ''
    return [f'<g id="symbol"{t}><path fill="{ink}" d="{d}"/>'
            f'<rect x="{cu_x}" y="{232 - cu_h}" width="{cu_w}" height="{cu_h}" rx="8" fill="{RED}"/></g>']

def wordmark(ink, x, baseline, s, cursor=False):
    """`figielak` in Satoshi Bold, outlined by Typst (48 pt source, baseline 0, y up)."""
    svg = open(SRC).read()
    syms = dict(re.findall(r'<symbol id="(\w+)"[^>]*><path d="([^"]+)"', svg))
    g = re.search(r'<g transform="matrix\(1 0 0 -1 2 48.48\)">(.*?)</g>', svg).group(1)
    out = [f'<g id="wordmark" transform="translate({x:g} {baseline:g}) scale({s:g})">']
    for ref, gx in re.findall(r'href="#(\w+)" x="([\d.]+)"', g):
        out.append(f'<path fill="{ink}" transform="translate({gx} 0) scale(1 -1)" d="{syms[ref]}"/>')
    if cursor:  # the symbol's cursor at wordmark scale: on the baseline, as thick as the letters' bars
        out.append(f'<rect x="157" y="-5" width="17" height="5" rx="1.25" fill="{RED}"/>')
    out.append('</g>')
    return out

def write(name, body, w=256, h=256):
    open(f'{OUT}/{name}.svg', 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" '
        f'role="img" aria-labelledby="t"><title id="t">figielak logo</title>\n' + '\n'.join(body) + '\n</svg>\n')

WW = 155.0  # width of `figielak` at scale 1
for tone, ink in (('color', INK), ('reversed', LIGHT)):
    thin = dict(stem=38, bar=34) if tone == 'reversed' else {}   # light on dark reads heavier
    write(f'figielak-symbol-{tone}', symbol(ink, **thin))
    # horizontal: shared baseline, wordmark x-height = half the symbol
    s = 3.4
    write(f'figielak-horizontal-{tone}', symbol(ink, **thin) + wordmark(ink, 264, 232, s), w=264 + WW * s + 24, h=288)
    # stacked: symbol over the centred wordmark
    s = 2.2
    w = WW * s + 48
    write(f'figielak-stacked-{tone}', symbol(ink, ox=w / 2 - 130 * .75, oy=8, s=.75, **thin)
          + wordmark(ink, 24, 304, s), w=w, h=344)
    s = 4
    write(f'figielak-wordmark-{tone}', wordmark(ink, 16, 160, s, cursor=True), w=175 * s + 32, h=208)
# small-size cut (16-32 px): heavier strokes, taller cursor, wider gaps
write('figielak-symbol-small', symbol(INK, stem=48, bar=44, cur=(156, 76, 44), cross=(28, 168, 104)))
write('figielak-symbol-small-reversed', symbol(LIGHT, stem=48, bar=44, cur=(156, 76, 44), cross=(28, 168, 104)))
