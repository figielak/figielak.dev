# figielak: logo

## 1. Znak

- **Idea:** mała litera f i kursor terminala, czyli napis `figielak_` zwinięty do pierwszej litery.
- **Mała litera** jest częścią znaku: nick pisze się `figielak`, nigdy `Figielak`.
- **Wersje:** poziomy (podstawowy), pionowy, sam symbol, sam napis `figielak_`.

| Plik | Do czego |
|---|---|
| `svg/figielak-symbol-color.svg`, `-reversed.svg` | symbol na jasnym / ciemnym tle |
| `svg/figielak-symbol-small.svg`, `-small-reversed.svg` | symbol poniżej 32 px (grubsze kreski, wyższy kursor) |
| `svg/figielak-horizontal-*.svg` | symbol z napisem w jednej linii, wspólna linia bazowa |
| `svg/figielak-stacked-*.svg` | symbol nad napisem |
| `svg/figielak-wordmark-*.svg` | sam napis z kursorem (jak w nawigacji) |
| `svg/*-black.svg`, `*-white.svg` | jeden kolor: druk, grawer, tło w kolorze |
| `png/` | to samo w PNG z przezroczystym tłem; `figielak-avatar.png` na profile |
| `web/` | favicon, ikony aplikacji, `site.webmanifest`, `head-snippet.html` |
| `presentation/` | plansza z mockupami (`board.html`, `slides/`) |

Wersja `reversed` ma kreski cieńsze o 5%, bo jasny znak na ciemnym tle wygląda grubiej.

## 2. Pole ochronne

Wokół znaku zostaje wolne pole o szerokości **czerwonego kursora** z każdej strony. Pole skaluje się razem ze znakiem.

## 3. Minimalny rozmiar

| Wersja | Ekran | Druk |
|---|---|---|
| Poziomy | 96 px szerokości | 25 mm |
| Pionowy | 64 px szerokości | 18 mm |
| Symbol | 16 px (poniżej 32 px plik `-small`) | 6 mm |

## 4. Kolor

Te same wartości co tokeny strony (`src/styles/tokens.css`).

| Nazwa | Token | HEX | RGB | CMYK (orientacyjnie) |
|---|---|---|---|---|
| Grafit | `--bg` | `#0E0E10` | 14 14 16 | 0 0 0 100 |
| Jasny | `--text` | `#EDEDEF` | 237 237 239 | 1 1 0 6 |
| Akcent | `--accent` | `#FF2445` | 255 36 69 | 0 86 73 0 |

Wartości CMYK są przeliczone, nie sprawdzone na wydruku. Przed drukiem dobierz je (albo Pantone) z wzornika.

**Dozwolone pary:** grafit z czerwonym kursorem na bieli · jasny z czerwonym kursorem na graficie ·
cały czarny na bieli · cały biały na ciemnym tle lub zdjęciu.
Czerwony jest tylko kursor. Litera nigdy nie jest czerwona, a znak nie stoi na czerwonym tle.

## 5. Typografia

Napis to Satoshi Bold (Fontshare, licencja FFL w `cv/fonts/Satoshi-FFL.txt`), zamieniony na krzywe.
Litera f w symbolu jest narysowana od zera: trzon 40, poprzeczka 36, łuk o promieniu 76 na siatce 256.

## 6. Czego nie robić

Nie rozciągać · nie zmieniać kolorów poza paletą · nie obracać · nie dodawać cieni, konturów ani gradientów ·
nie zmieniać proporcji symbolu do napisu · nie zamieniać f na wielkie F · nie odtwarzać napisu, wpisując go fontem.

## 7. Źródło

`build.py` generuje pliki w `svg/` (obrysy Satoshi bierze z `.github/assets/logo-dark.svg`):
`python3 brand/build.py brand/svg`. Wersje jednokolorowe, PNG-i i ikony powstały skryptami skilla logo-design.

Znak nie był sprawdzany pod kątem kolizji ze znakami towarowymi.
