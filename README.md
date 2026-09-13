<p align="center">
  <img src="assets/images/logo-original.png" alt="Iso Café" width="180">
</p>

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/lang-English-1f6feb?style=flat-square" alt="English"></a>
  <a href="README.pt-br.md"><img src="https://img.shields.io/badge/lang-Portugu%C3%AAs-2ea043?style=flat-square" alt="Português"></a>
</p>

<h3 align="center">Turn a coffee visit into a story worth sharing.</h3>

<p align="center">
  <img src="https://img.shields.io/badge/status-prototype-orange" alt="Prototype">
  <img src="https://img.shields.io/badge/experience-mobile--first-3b2b20" alt="Mobile first">
</p>

<p align="center">
  <a href="https://rodrigogmartins.github.io/isocaferg"><img src="assets/images/qr-code.png" width="220" alt="QR code for the Iso Café experience"></a><br>
  <a href="https://rodrigogmartins.github.io/isocaferg"><strong>Open the Iso Café experience</strong></a><br>
  Scan with a phone camera for a simple demonstration to the owners.
</p>

---

## Why

A café visit can reach beyond the table: a customer's shared photo introduces the place to their friends. This project connects that action to a short, personal experience that fits the brand.

The business goal is to **test a way to reduce customer acquisition cost (CAC), encourage customer-generated content and increase engagement among existing visitors**. Lower CAC is a hypothesis to measure during a pilot, not a result already demonstrated.

## What

**A gamified photography experience: share your coffee, develop an instant photo and discover a handwritten dedication on the back.**

The customer posts an Instagram Story tagging **@isocaferg**, taps “Já publiquei” (“I've posted”) and moves a photo on the screen. The image gradually develops. Turning the card reveals a handwritten result and, when a prize is awarded, a code to show at the counter.

Photography connects the desired action — capturing and sharing a visit — with the idea of keeping a memory.

## How

1. **Share:** the QR code opens a page inviting the customer to post a Story and tag the café.
2. **Develop:** moving the photo from side to side brings it into focus; development requires movement and takes at least **4 seconds**.
3. **Turn:** “Virar foto” (“Turn photo”) presents the dedication in gradually appearing handwriting.
4. **Discover:** the date, message and any prize code stay on the back of the same card.
5. **Present:** winners show the photo and code to the team.

The layout adapts to phones, including landscape. Mouse and keyboard also work, and the experience respects reduced-motion preferences.

## What the café gets from a pilot

- **An acquisition hypothesis to test:** encourage referrals through customer posts and compare incentive costs with new customers attributed to the campaign.
- **More participation during a visit:** a short, tactile interaction that invites customers to complete the experience.
- **A memorable identity:** photography, cream paper, coffee tones and a personal dedication.
- **An easy demonstration:** a QR code and a browser, with no app installation for customers.

### Measuring impact

| Goal | Suggested metric | Pilot collection |
|---|---|---|
| Engagement | Completed experiences ÷ started experiences | Instrument start, development and flip events |
| Sharing | Stories mentioning the café | Review account mentions |
| Acquisition | New customers attributed to the campaign | Ask about the source at the counter |
| CAC | Campaign and reward costs ÷ attributed new customers | Record actual costs, redemptions and new customers |
| Return visits | Participating customers who return | Consent-based follow-up at the counter |

Compare against a baseline period or reference group. Link visits and participations do not automatically represent new customers. **The prototype does not yet collect these metrics automatically.**

---

## Quick start

**Requirements:** a modern browser. Python 3 is an optional way to serve the files; there is no build, npm dependency or backend.

From the project folder:

~~~bash
python -m http.server 8000
~~~

Open [http://localhost:8000](http://localhost:8000). On Windows, you can also use:

~~~powershell
py -3 -m http.server 8000
~~~

For a quick preview, open `index.html` directly in a browser. A local server is preferable when checking behavior against hosting.

To test on a phone, connect the computer and phone to the same Wi-Fi network and open `http://COMPUTER-IP:8000` on the phone while the server is running.

Images and QR assets are local. Fonts load from Google Fonts; offline, the browser uses the fallback fonts defined in CSS.

## Configuration

Edit [assets/js/app.js](assets/js/app.js):

| Setting | Current value | Purpose |
|---|---|---|
| `TEST_MODE` | `true` | Allow repeated experiences after reloading |
| `PHOTO_REVEAL_MIN_MS` | `4000` | Minimum development time |
| `PHOTO_TRAVEL_MULTIPLIER` | `8.5` | Required movement; higher = more movement |
| `DISCOUNT_TEXT` | `R$ 2` + `de desconto` | Updates the tag, prize name and dedication |
| `prizes` | Table below | Outcome probabilities |
| `photoAssets` | `assets/images/` | Photo and description for each outcome |

| Outcome | Probability |
|---|---:|
| A coffee on the house | 10% |
| A dessert | 5% |
| R$ 2 discount | 15% |
| No prize | 70% |

Each participation draws its outcome once. Moving or flipping the photo does not change the prize or code. If you edit probabilities, keep their sum at **1 (100%)**.

With `TEST_MODE = false`, the current `localStorage` lock restricts participation in that browser **without daily expiration**. Clearing browser data removes the lock.

## Structure

~~~text
index.html
assets/
  css/styles.css
  js/app.js
  images/
    logo-original.png
    cafe.png
    sobremesa.png
    desconto.png
    cafeteria.png
    qr-code.png
    qr-code.svg
README.md
README.pt-br.md
~~~

- [index.html](index.html): structure and content.
- [styles.css](assets/css/styles.css): layout, colors and animations.
- [app.js](assets/js/app.js): draw, development, flip and dedication.
- `assets/images/`: images and QR code.

## Presenting and publishing

The QR code encodes exactly **https://rodrigogmartins.github.io/isocaferg**. That address must be published for it to work on the owners' phones; generating the QR code does not publish the site.

To host with GitHub Pages, publish this project root in the corresponding repository, keeping `index.html` and `assets/` together. Relative paths support the `/isocaferg/` address.

Use the [PNG QR code](assets/images/qr-code.png) for sharing or the [SVG](assets/images/qr-code.svg) for printing. Preserve the clear margin around it.

## Project status and next steps

This is a working browser prototype. The scratch card has been removed; instant-photo development is the main experience.

- “Já publiquei” is customer confirmation; there is no Instagram API verification of Stories.
- The draw, participation lock and codes are local. Codes are not registered on a server or marked as redeemed.
- Photos are AI-generated illustrations, not documentation of the real café or products. Replace them with official photos when available.
- The original logo is preserved. CSS filters and blending make the mark dark and visually remove its gray background on the page. The file is not yet a transparent PNG; an official export can replace it.
- Analytics, reward inventory, redemption validation and server-side participation rules are next steps for running a campaign and measuring its impact.

**Pilot proposal:** present to the owners, validate with customers, measure sharing and redemption, and decide the next iteration based on results.
