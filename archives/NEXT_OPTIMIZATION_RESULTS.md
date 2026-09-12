# NEXT.txt: toteutus ja mittaustulokset

## Toteutettu

- Siirtobufferien tyhjennys ja native-luku nollaavat loogisen koon, eivät kapasiteettia. Projection- ja SequencePoint-lukijat palauttavat synkronisesti kulutettavan lainatun näkymän.
- Paikallisen päivityksen tulos on kiinteä 12 sanan native-array. TypeScript käyttää olemassa olevaa suoraa 12 sanan lukijaa: ei `subarray`-väliview'tä eikä `Array.from`-kutsua paikalliseen tulokseen.
- Insert lähettää rajaindeksin suoraan WASMille. Native tunnistaa tailin; erillinen pituuskysely poistui.
- Projectorin 17 SoA-kenttää jakavat yhden varauksen, koon ja geometrisen kapasiteetin. Stage ja split tarkistavat kapasiteetin kerran ja kirjoittavat suoraan indekseihin. SoA-layout säilyy; Footagea ei kopioida.
- Paikallisen insertin tunnettu näkyvä sijainti palautuu lähimpien jumpien päivityksen jälkeen. Jos sibling-järjestys siirsi insertin pois annetun parentin vierestä, käytetään edelleen yleistä sijainnin selvitystä.
- Julkisia TypeScript-signatuureja, main.cpp:n kutsuvälittäjiä, paikallista pending-käytäntöä tai GC-semanttiikkaa ei muutettu.
- C++-fixtuurit käyttävät loogista Strip-määrää. Vanhat session-counter-odotukset päivitettiin jo olemassa olevaan Projector-kohtaiseen malliin. Virheellisen paikallisen replace-indeksin validointioletus poistettiin testistä; validointia ei lisätty runtimeen.

## Menetelmä

Lähtöversio: `bcc27a6`. Sen C++- ja TypeScript-lähteet rakennettiin erilliseen `temp/next-baseline`-hakemistoon. Molemmissa käytettiin samaa Emscripten 5.0.7:n optimoitua WASM-asetusta (`-O3 -DNDEBUG -msimd128`) ja tsdownin julkista ESM-entryä. Node: 24.16.0, Windows.

Jokaisesta versiosta ajettiin kolme erillistä prosessia. Lopullisen vertailun toisella kierroksella ajojärjestys käännettiin. Taulukot näyttävät kolmen ajon mediaanien mediaanin; muutos on ajan muutos, joten negatiivinen on nopeampi. Agentin testejä tai käännöksiä ei ajettu mittausten rinnalla.

Koneen kuorma ja ajojen hajonta vaikuttavat tuloksiin. Prosentit eivät ole yleisiä suorituskykytakuita. Raakamittaukset, p95-arvot ja maksimit ovat tiedostossa `benchmark/results/next.json`.

## Julkinen TypeScript: paikalliset reunainsertit

100 000 aloitus-Strippiä, 1 024 lämmittelyä, 8 192 mitattua inserttiä per tapaus. Kasvava Projector; ei uudelleeninitialisointia operaatioiden välillä. Lopullinen pituus ja reunojen Footage tarkistetaan.

| Tapaus | Ennen µs | Jälkeen µs | Ajan muutos |
| --- | ---: | ---: | ---: |
| head | 4.70 | 3.80 | -19.1 % |
| tail | 2.50 | 1.40 | -44.0 % |
| alternating | 3.30 | 3.20 | -3.0 % |

Tail-insertin p95: 4.80 → 2.80 µs. Kaikki jakaumat eivät parantuneet: vuorottelevan tapauksen p95 kasvoi 5.80 → 8.00 µs. Head-ajossa esiintyi myös noin 9 ms yksittäinen poikkeama.

## Julkinen TypeScript: 256 000 Stripin lista

`benchmark/latency.ts`: satunnaiset paikalliset operaatiot ja erilaiset merge-tapaukset.

| Operaatio | Ennen µs | Jälkeen µs | Ajan muutos |
| --- | ---: | ---: | ---: |
| find | 3.70 | 3.60 | -2.7 % |
| insert | 11.00 | 8.40 | -23.6 % |
| remove | 12.60 | 12.30 | -2.4 % |
| replace | 19.40 | 15.60 | -19.6 % |
| merge-new-tail | 26.70 | 31.30 | 17.2 % |
| merge-new-head | 16657.90 | 13707.80 | -17.7 % |
| merge-duplicate | 1.40 | 1.30 | -7.1 % |

Myös huonommat tulokset on säilytetty: tämän lyhyen `merge-new-tail`-tapauksen mediaani kasvoi. Se lisää 128 eri sisarusta samaan riippuvuuteen; palautettava muuttunut suffix kasvaa. `merge-new-head` palauttaa suuren osan listan sisällöstä eikä ole yhden alkion patchin mittaus. Duplicate-merge mittaa jo tunnetun operaation ohitusta.

### Erikseen lämmitetty uusi tail-merge

`benchmark/merge-tail.ts`: 256 000 aloitus-Strippiä, 8 192 lämmittelyä ja 32 768 mitattua uutta, peräkkäin riippuvaa tail-inserttiä. Jokaisen mergen Change tarkistetaan: täsmälleen oikea uusi indeksi ja Footage. Lopullinen näkymän pituus ja tail tarkistetaan.

| Operaatio | Ennen µs | Jälkeen µs | Ajan muutos |
| --- | ---: | ---: | ---: |
| public-merge-new-tail-chain | 4.40 | 4.10 | -6.8 % |

Ero on pieni ja ajokohtainen suunta vaihtelee. Näistä mittauksista ei pidä päätellä yleistä merge-nopeutusta.

### Findin gate-osuma

Miljoona julkista `find`-kutsua yhden kelloparin sisällä, 100 000 Stripin listassa. Tarkistussumma varmistaa palautetun Footagen. Ennen 15.46 ns/kutsu, jälkeen 16.48 ns/kutsu. Gate-hit ei allokoi; findille ei osoitettu nopeutusta. Yksittäisten kutsujen kellotus ei sovellu tämän hintaluokan tarkkaan mittaamiseen.

## Native-komponentit nykyisellä Projectorilla

`benchmark/components.cpp` suoritetaan WASMina Nodessa. 100 000 aloitus-Strippiä, 8 192 näytettä. Stage, apply ja find mitataan erikseen peräkkäisissä tail-inserteissä; split jakaa olemassa olevia lähdestrippejä. Sijainnit ja suffixien pituudet tarkistetaan.

| Komponentti | Ennen ns | Jälkeen ns | Ajan muutos |
| --- | ---: | ---: | ---: |
| clock_pair | 200.00 | 200.00 | 0.0 % |
| stage_strip | 500.00 | 300.00 | -40.0 % |
| apply_insert | 300.00 | 300.00 | 0.0 % |
| find_projection_frame_index_of | 2800.00 | 2600.00 | -7.1 % |
| split_strip | 400.00 | 300.00 | -25.0 % |

Komponenttiluvut sisältävät kellotuksen hinnan. Noin 200 ns kelloparin mediaanin vuoksi 300 ns tulosta ei saa esittää tarkkana 100 ns operaation mittauksena. Find-komponentti käyttää yleistä sijainninhakua; julkisen paikallisen updaten tunnettu-sijainti-polku sisältyy TypeScript-mittauksiin.

## Profilointi ja hylätty kokeilu

Kiinteän lukijan jälkeen CPU-profiilin suurin mitattujen insert-kutsujen kustannus oli `find_projection_frame_index_of`: noin kolme neljäsosaa näytteistetystä ajasta. Lähimpien jump-ankkurien välin läpikäynti on siis edelleen merkittävä kustannus. Yleinen TypeScriptin projection-lukija ei enää kuulu paikallisen insertin polkuun.

SoA-kenttien väliin kokeiltiin 64 tavun lisävälistystä kolmella A/B-ajolla. Tulos ei ollut johdonmukaisesti parempi: esimerkiksi head-mediaani kasvoi noin 6 % ja satunnaisen insertin noin 10 %. Kokeilu poistettiin. Lopullinen varaus ei sisällä tätä lisävälistystä.

## Varmennus ja rajat

- WASM- ja TypeScript-buildit sekä `tsc --noEmit` läpäisivät.
- Kaikki 21 Vitest-tiedostoa: 130 testiä läpäisi, mukana unit-, convergence- ja stress-testit.
- 22 itsenäistä C++-testiohjelmaa käännettiin ja suoritettiin WASMina.
- Uusi SoA-testi tarkistaa kaikkien 17 kentän säilymisen kasvurajoilla, osoitteen pysymisen kapasiteetin sisällä, splitin kasvurajalla sekä Projectorin siirron. Se läpäisi myös UBSanin.
- Bufferitestit tarkistavat kapasiteetin uudelleenkäytön, kiinteän tuloksen, tyhjän loogisen tilan ja synkronisen kulutuksen.
- Navigointitestit tarkistavat jumpien molemminpuoliset pituudet, rakenteelliset etäisyydet ja näkyvän Footagen pitkissä editointijonoissa.
- SoA-kasvatus tekee edelleen O(n)-kopioinnin kasvurajalla. Containment-taululla ja JS-tuloksilla on omat varauksensa. Kaikille operaatioille ei saavutettu miljoonan kutsun sekuntinopeutta eikä alle 20 µs worst-case -takuuta.

## Uudelleenajo

```powershell
npm run build:wasm
npx tsdown
node --experimental-strip-types benchmark/gate.ts 100000
node --experimental-strip-types benchmark/latency.ts 256000
node --experimental-strip-types benchmark/merge-tail.ts 256000
node --experimental-strip-types benchmark/gate-hit.ts 100000
em++ benchmark/components.cpp -std=c++23 -O3 -msimd128 -sENVIRONMENT=node -sSINGLE_FILE=1 -sALLOW_MEMORY_GROWTH=1 -o temp/components.cjs
node temp/components.cjs 100000
```

