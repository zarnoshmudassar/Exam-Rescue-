# Exam Rescue Website

Static website for the Exam Rescue brand (Instagram: @examrescue01). Both forms
(Free Planner + Contact) open WhatsApp (+92 345 5407001) with a pre-filled
message when submitted — no server/backend needed.

## Files
- `index.html` — page content
- `style.css` — styling (Navy #172554 / Blue #2563EB / Poppins font)
- `script.js` — mobile menu + WhatsApp form handling
- `vercel.json` — Vercel static site config

## 1. GitHub par upload karna (naya repo)

1. https://github.com par jaake **New repository** banayein (e.g. `exam-rescue`), **Public** ya **Private** — dono chalega. "Add README" mat check karein (hum apna README use karenge).
2. Apne computer par is folder ko terminal mein kholein aur ye commands chalayein:

```bash
git init
git add .
git commit -m "Exam Rescue website with WhatsApp forms"
git branch -M main
git remote add origin https://github.com/<your-username>/exam-rescue.git
git push -u origin main
```

(`<your-username>` ki jagah apna GitHub username likhein.)

## 2. Vercel par deploy karna

1. https://vercel.com par login karein (GitHub account se login karna sabse aasan hai).
2. **Add New → Project** par click karein.
3. Apna newly-created `exam-rescue` GitHub repo import karein.
4. Framework preset: **Other** (ye static HTML site hai, build command ki zaroorat nahi).
5. **Deploy** dabayein — 1-2 minute mein live link mil jayega (e.g. `exam-rescue.vercel.app`).

Iske baad, jab bhi aap `main` branch par naya commit push karenge, Vercel
automatically redeploy kar dega.

## WhatsApp number change karna ho to

`script.js` mein sirf ye line edit karein:

```js
const WHATSAPP_NUMBER = "923455407001";
```

Number hamesha country code ke sath, bina `+` aur bina leading `0` ke likhein
(Pakistan ke liye `92` se shuru).

## Note

Forms client-side WhatsApp redirect use karte hain (`wa.me` link) — jab user
form submit karega, unka WhatsApp app/web khulega with a ready-made message,
aur unhe sirf "Send" dabana hoga. Isme koi backend, database ya API key
required nahi, aur bilkul free hai.
