# Audio Files

Drop your MP3 / WAV / OGG files in this folder.

They'll be served at `/audio/FILENAME.mp3` once Vercel deploys.

## How to use

1. Save your track here, e.g. `public/audio/preview.mp3`
2. Open `src/App.jsx`
3. Find the `MUSIC_PLAYER` block at the top
4. Update `local.src` to match your filename:

   ```js
   local: {
     src: "/audio/preview.mp3",   // ← change this
     title: "PREVIEW DROP",
     artist: "AI KING",
   }
   ```

5. Push to GitHub → Vercel auto-redeploys → player goes live

## Tips

- **MP3 at 192kbps** is the sweet spot — small files (~1.5MB per minute), universal browser support
- **Don't commit your master WAVs** — keep the repo lean
- **For unreleased tracks**, `MUSIC_PLAYER.type = "local"` is the safest choice — file lives on your own domain, no third-party can take it down
- **For multiple tracks**, you can swap `MUSIC_PLAYER.type = "soundcloud"` and use a SoundCloud playlist URL instead
