# Hero / Feature Photos

Save your photos here to make them part of the site's styling.

## Required filenames

The site code expects these exact paths:

| Path | What it's used for |
|---|---|
| `public/images/hero-bw.jpg` | Hero section background (the black & white photo) |
| `public/images/portrait-red.jpg` | Secondary feature block (the red-shirt photo) |

Until both files exist at these paths, the site falls back to a deep
crimson/black gradient — still looks intentional, just no portraits.

## How to save them

1. Right-click each photo in your chat / camera roll → **Save image as…**
2. Save to:
   - `C:\Users\JayMu\Downloads\AIKING_Website_Deploy\aiking-site\public\images\hero-bw.jpg`
   - `C:\Users\JayMu\Downloads\AIKING_Website_Deploy\aiking-site\public\images\portrait-red.jpg`
3. Push to GitHub. Vercel auto-redeploys.

## Format tips

- **JPG at quality 80–85** is plenty (smaller files, no visible difference)
- Target **under 500 KB per image** for fast loads on mobile
- If you want to swap to PNG/WebP later, just rename the file paths in
  [`src/App.jsx`](../../src/App.jsx) — search for `hero-bw.jpg` and
  `portrait-red.jpg`.
