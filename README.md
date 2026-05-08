# AI KING — Official Website

## What's Inside
- React + Vite website with dark hip-hop aesthetic
- Crown branding, film grain overlay, animated text
- Direct-to-consumer music store (Stripe Payment Links)
- Email capture for Inner Circle mailing list
- Link-in-bio page (replace Linktree)
- All social handles pre-connected

---

## DEPLOYMENT GUIDE (Step by Step)

### Step 1: Create a GitHub Account (if you don't have one)
1. Go to **github.com** → Sign up (free)
2. Verify your email

### Step 2: Create a New Repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `aiking-site`
3. Keep it **Public** (free hosting on Vercel requires this, or use Private with Vercel Pro)
4. Click **Create repository**

### Step 3: Upload These Files
1. On the repository page, click **"uploading an existing file"**
2. Drag and drop ALL files from this folder:
   - `index.html`
   - `package.json`
   - `vite.config.js`
   - `src/` folder (contains `main.jsx` and `App.jsx`)
3. Click **Commit changes**

### Step 4: Deploy on Vercel
1. Go to **vercel.com** → Sign in with GitHub
2. Click **Add New → Project**
3. Select **"Personal Project"** (Hobby tier, free)
4. Import the `aiking-site` repository
5. Framework Preset: **Vite** (should auto-detect)
6. Click **Deploy**
7. Wait 1-2 minutes — your site is live!

### Step 5: Add Your Domain
1. In Vercel dashboard → your project → **Settings → Domains**
2. Type: `officialaiking.com`
3. Vercel will show you DNS settings
4. If you buy the domain through Vercel: it auto-connects
5. If you buy elsewhere (Namecheap/GoDaddy): add the DNS records Vercel shows you

---

## STRIPE SETUP (For Selling Music)

### Create Payment Links
1. Go to **dashboard.stripe.com**
2. Click **Payment Links** → **Create payment link**
3. Add a product: "See It All, Be It All" → set your price (e.g., $1.49)
4. Click **Create link** → copy the URL
5. Repeat for each track

### Connect to Your Site
1. Open `src/App.jsx`
2. Find the `STRIPE_LINKS` section at the top
3. Replace `YOUR_LINK_HERE` with your real Stripe Payment Link URLs:

```javascript
const STRIPE_LINKS = {
  track1: "https://buy.stripe.com/abc123",  // See It All, Be It All
  track2: "https://buy.stripe.com/def456",  // How Long?
  track3: "https://buy.stripe.com/ghi789",  // All The Time
};
```

4. Also update each track's `status` from `"COMING SOON"` to `"OUT NOW"` and add a `price`
5. Push the changes to GitHub — Vercel auto-redeploys

---

## UPDATING YOUR SITE

Any time you push changes to GitHub, Vercel automatically redeploys.

### To add new tracks:
Add to the `TRACKS` array in `src/App.jsx`:
```javascript
{ id: 4, title: "New Track Name", status: "OUT NOW", price: 1.49, stripeLink: "https://buy.stripe.com/..." },
```

### To update streaming links:
Find the `STREAMING` array and replace `"#"` with your real links.

### To update your bio:
Find the `section === "about"` block and replace the placeholder text.

---

## EMAIL LIST SETUP (Optional but Recommended)

The email signup currently logs to console. To actually collect emails:

### Option A: ConvertKit (Free up to 10k subscribers)
1. Sign up at **convertkit.com**
2. Create a form → get API endpoint
3. Replace the `handleSubmit` function with a fetch call to ConvertKit

### Option B: Mailchimp (Free up to 500 contacts)
1. Sign up at **mailchimp.com**
2. Create an audience → get API key
3. Same process — replace `handleSubmit`

---

## FILE STRUCTURE
```
aiking-site/
├── index.html          ← HTML entry (SEO tags, favicon)
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
└── src/
    ├── main.jsx        ← React bootstrap
    └── App.jsx         ← YOUR SITE (edit this file)
```

---

Built for AI KING. Go independent and win. 👑
