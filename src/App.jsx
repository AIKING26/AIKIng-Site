import { useState, useRef, useEffect } from "react";
import { track } from "@vercel/analytics";

/*
  ========================================
  AI KING — CONFIGURATION
  ========================================
  Update these values with your real info:
*/

// MUSIC PLAYER — Multi-source. Pick ONE `type` and fill in that section.
//
//   "local"      → Self-hosted MP3 in this repo's public/audio/ folder.
//                  Custom player UI, full control, zero third-party branding,
//                  unlimited control over unreleased tracks. RECOMMENDED.
//
//   "soundcloud" → SoundCloud unlisted/private track. Built-in waveform UI.
//                  Good if you want fans to be able to like/repost.
//
//   "spotify"    → Spotify track embed. Only works once track is publicly released.
//
//   "youtube"    → YouTube video embed. Works for music videos / lyric videos.
//
const MUSIC_PLAYER = {
  type: "local",

  // ---- type: "local" ----
  // 1) Drop your MP3 into  public/audio/  (e.g. public/audio/preview.mp3)
  // 2) Reference it below. The path starts at /audio/...
  // 3) Push to GitHub → Vercel auto-redeploys.
  local: {
    artist: "AI KING",
    tracks: [
      { src: "/audio/get-away-freestyle.mp3", title: "GET AWAY (FREESTYLE)" },
      { src: "/audio/east-sign.mp3",          title: "EAST SIGN" },
      { src: "/audio/to-the-sky.mp3",         title: "TO THE SKY" },
      { src: "/audio/meant-pussy.mp3",        title: "MEANT PUSSY" },
    ],
  },

  // ---- type: "soundcloud" ----
  // Paste the full track URL from SoundCloud (private/unlisted tracks work fine):
  soundcloud: {
    url: "https://soundcloud.com/officialaiking/your-track",
  },

  // ---- type: "spotify" ----
  // Paste the full track URL from Spotify, e.g. https://open.spotify.com/track/XXXXXXXXX
  spotify: {
    url: "https://open.spotify.com/track/YOUR_TRACK_ID",
  },

  // ---- type: "youtube" ----
  // Paste ONLY the video ID (the part after v= in the URL), e.g. "dQw4w9WgXcQ"
  youtube: {
    videoId: "YOUR_VIDEO_ID",
  },
};

// CONVERTKIT — Email list integration
// Read from Vite env vars at build time. Set these in:
//   • Local dev:  create .env.local with VITE_CONVERTKIT_API_KEY=... and VITE_CONVERTKIT_FORM_ID=...
//   • Vercel:     Project Settings → Environment Variables → add both
// If either is missing, the modal/footer signup still works visually but
// the email isn't saved (a console warning fires).
//
// Where to find these in ConvertKit:
//   API_KEY: Account → Settings → Advanced → API Key (the v3 public key, safe in browser)
//   FORM_ID: Grow → Landing Pages & Forms → click your form → it's the number in the URL
//            (kit.com/forms/XXXXXXX/edit ← that's your form ID)
const CONVERTKIT = {
  apiKey: import.meta.env.VITE_CONVERTKIT_API_KEY || "",
  formId: import.meta.env.VITE_CONVERTKIT_FORM_ID || "",
};

async function subscribeToConvertKit(email) {
  if (!CONVERTKIT.apiKey || !CONVERTKIT.formId) {
    console.warn(
      "ConvertKit not configured — set VITE_CONVERTKIT_API_KEY and VITE_CONVERTKIT_FORM_ID as env vars. Email not saved:",
      email
    );
    return { ok: false, reason: "not_configured" };
  }
  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT.formId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: CONVERTKIT.apiKey, email }),
      }
    );
    if (!res.ok) {
      console.error("ConvertKit error:", await res.text());
      return { ok: false, reason: "api_error" };
    }
    return { ok: true };
  } catch (err) {
    console.error("ConvertKit fetch failed:", err);
    return { ok: false, reason: "network" };
  }
}

// YOUTUBE WATCH SECTION — paste your music-video YouTube ID below (just
// the ID, the part after v= in the URL, e.g. "dQw4w9WgXcQ").
// Leave as the placeholder string to hide the section entirely.
const WATCH_VIDEO = {
  youtubeId: "PASTE_YOUTUBE_ID_HERE",
  title: "OFFICIAL VIDEO",
};

// STRIPE: Create Payment Links in your Stripe Dashboard for each track
// Go to: dashboard.stripe.com → Payment Links → Create
const STRIPE_LINKS = {
  track1: "https://buy.stripe.com/YOUR_LINK_HERE",
  track2: "https://buy.stripe.com/YOUR_LINK_HERE",
  track3: "https://buy.stripe.com/YOUR_LINK_HERE",
};

const TRACKS = [
  { id: 1, title: "See It All, Be It All", status: "COMING SOON", price: null, stripeLink: STRIPE_LINKS.track1 },
  { id: 2, title: "How Long?", status: "COMING SOON", price: null, stripeLink: STRIPE_LINKS.track2 },
  { id: 3, title: "All The Time", status: "COMING SOON", price: null, stripeLink: STRIPE_LINKS.track3 },
];

const SOCIALS = [
  { name: "Instagram", icon: "instagram", url: "https://instagram.com/OfficialAIKING" },
  { name: "TikTok",    icon: "tiktok",    url: "https://tiktok.com/@KingAI.Jay" },
  { name: "YouTube",   icon: "youtube",   url: "https://youtube.com/@OfficalAIKING" },
  { name: "X",         icon: "x",         url: "https://x.com/OfficialAIKING" },
];

const STREAMING = [
  { name: "Spotify",       icon: "spotify",       url: "#" },
  { name: "Apple Music",   icon: "appleMusic",    url: "#" },
  { name: "Tidal",         icon: "tidal",         url: "#" },
  { name: "YouTube Music", icon: "youtubeMusic",  url: "#" },
  { name: "Amazon Music",  icon: "amazonMusic",   url: "#" },
];

// ========================================

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600&family=Cinzel:wght@600;800&display=swap');`;

const keyframes = `
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes glow{0%,100%{text-shadow:0 0 25px rgba(226,54,54,.55),0 0 60px rgba(255,20,147,.15)}50%{text-shadow:0 0 55px rgba(226,54,54,.95),0 0 110px rgba(255,20,147,.45),0 0 160px rgba(255,165,0,.18)}}
@keyframes neonFlicker{0%,100%{opacity:1;text-shadow:0 0 8px currentColor,0 0 18px currentColor}45%{opacity:.55}48%{opacity:.95}50%{opacity:.4}52%{opacity:1}}
@keyframes grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-2%,-1%)}40%{transform:translate(1%,2%)}60%{transform:translate(-1%,1%)}80%{transform:translate(2%,-1%)}}
@keyframes crownFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(2deg)}}
@keyframes globeSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes sunsetPulse{0%,100%{opacity:.6}50%{opacity:.85}}
@keyframes palmSway{0%,100%{transform:rotate(0deg)}50%{transform:rotate(1.2deg)}}
@keyframes scrollMarquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
a:hover{color:#FF1493 !important;border-color:rgba(255,20,147,0.55) !important}
button:hover{opacity:0.94;transform:translateY(-1px)}
button{transition:all 0.2s ease}
::selection{background:rgba(255,20,147,0.45);color:#fff}
`;

function Crown({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ animation: "crownFloat 3s ease-in-out infinite" }}>
      <path d="M8 48L4 20L18 32L32 12L46 32L60 20L56 48H8Z" fill="#E23636" opacity="0.95"/>
      <path d="M8 48H56V54H8V48Z" fill="#E23636"/>
      <circle cx="4" cy="20" r="3" fill="#FFD700"/>
      <circle cx="32" cy="12" r="3" fill="#FFD700"/>
      <circle cx="60" cy="20" r="3" fill="#FFD700"/>
    </svg>
  );
}

function Globe({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "inline-block", verticalAlign: "middle", animation: "globeSpin 90s linear infinite" }}>
      <defs>
        <radialGradient id="globe-grad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#FFE56A"/>
          <stop offset="100%" stopColor="#B8860B"/>
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#globe-grad)" opacity="0.15"/>
      <circle cx="32" cy="32" r="28" fill="none" stroke="#FFD700" strokeWidth="1.4"/>
      <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="#FFD700" strokeWidth="0.9" opacity="0.85"/>
      <ellipse cx="32" cy="32" rx="14" ry="28" fill="none" stroke="#FFD700" strokeWidth="0.9" opacity="0.85"/>
      <ellipse cx="32" cy="32" rx="22" ry="28" fill="none" stroke="#FFD700" strokeWidth="0.6" opacity="0.6"/>
      <line x1="4" y1="32" x2="60" y2="32" stroke="#FFD700" strokeWidth="0.6" opacity="0.7"/>
      <line x1="32" y1="4" x2="32" y2="60" stroke="#FFD700" strokeWidth="0.6" opacity="0.7"/>
    </svg>
  );
}

function PalmTree({ side = "left" }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, [side]: -10,
      width: 220, height: 380, pointerEvents: "none", zIndex: 1,
      transform: side === "right" ? "scaleX(-1)" : "none",
      animation: "palmSway 7s ease-in-out infinite",
      transformOrigin: "bottom center",
      filter: "drop-shadow(0 0 12px rgba(255,20,147,0.18))",
    }}>
      <svg width="100%" height="100%" viewBox="0 0 220 380">
        {/* Trunk */}
        <path d="M108 380 Q112 280 116 200 Q120 130 124 80"
          stroke="#000" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M108 380 Q112 280 116 200 Q120 130 124 80"
          stroke="#1a0a14" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Fronds — 7 leaves radiating from crown */}
        <g fill="#000">
          <path d="M124 80 Q70 50 10 60 Q50 60 90 88 Q115 92 124 80Z"/>
          <path d="M124 80 Q180 50 215 75 Q175 70 138 92 Q126 86 124 80Z"/>
          <path d="M124 80 Q95 30 50 18 Q90 50 112 76 Q120 80 124 80Z"/>
          <path d="M124 80 Q145 30 195 18 Q160 50 132 76 Q126 80 124 80Z"/>
          <path d="M124 80 Q120 25 125 5 Q126 35 126 75 Q125 80 124 80Z"/>
          <path d="M124 80 Q60 80 5 110 Q60 90 100 88 Q120 86 124 80Z"/>
          <path d="M124 80 Q190 80 218 115 Q175 88 145 90 Q128 86 124 80Z"/>
        </g>
        {/* Coconuts cluster */}
        <circle cx="118" cy="78" r="3.5" fill="#1a0a08"/>
        <circle cx="126" cy="82" r="3.5" fill="#1a0a08"/>
        <circle cx="122" cy="86" r="3.5" fill="#1a0a08"/>
      </svg>
    </div>
  );
}

const PlayerShell = ({ children }) => (
  <div style={{
    maxWidth: 640, margin: "0 auto",
    border: "1px solid rgba(255,20,147,0.35)",
    boxShadow: "0 0 60px rgba(255,20,147,0.18), 0 0 120px rgba(226,54,54,0.12), inset 0 0 0 1px rgba(255,215,0,0.08)",
    background: "rgba(0,0,0,0.65)",
  }}>{children}</div>
);

const PlaceholderPanel = ({ codePath, hint }) => (
  <div style={{
    maxWidth: 640, margin: "0 auto", padding: "28px 24px",
    border: "1px dashed rgba(255,20,147,0.4)",
    background: "linear-gradient(135deg, rgba(255,20,147,0.04), rgba(255,165,0,0.04))",
    textAlign: "center",
  }}>
    <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 3, color: "#FF1493", margin: 0 }}>
      ▶ {hint} <code style={{ color: "#FFD700" }}>{codePath}</code>
    </p>
    <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 2, color: "#AAA", marginTop: 10 }}>
      Push the change → Vercel auto-redeploys.
    </p>
  </div>
);

const PlayIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);
const PauseIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>
  </svg>
);
const VolumeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/>
  </svg>
);
const PrevIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
  </svg>
);
const NextIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
  </svg>
);
const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
  </svg>
);

const BRAND_ICONS = {
  instagram: (
    <g>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
    </g>
  ),
  tiktok: (
    <path fill="currentColor" d="M19.6 6.3a4.7 4.7 0 0 1-3.5-4V2h-3v13.5a2.7 2.7 0 1 1-2.7-2.7v-3a5.7 5.7 0 1 0 5.7 5.7V8.7a8 8 0 0 0 4.7 1.5V7.2a4.6 4.6 0 0 1-1.2-.9z"/>
  ),
  youtube: (
    <g>
      <rect x="2" y="6" width="20" height="12" rx="3.5" fill="currentColor"/>
      <polygon points="10,9.5 16,12 10,14.5" fill="#0a0a0a"/>
    </g>
  ),
  x: (
    <path fill="currentColor" d="M18.2 2.25h3.3l-7.2 8.26 8.5 11.24h-6.6l-5.2-6.82-5.96 6.82H1.7l7.7-8.83L1.25 2.25h6.83l4.7 6.23zm-1.16 17.5h1.83L7.08 4.13H5.12z"/>
  ),
  spotify: (
    <g>
      <circle cx="12" cy="12" r="10" fill="#1DB954"/>
      <path d="M7 9.7c3-1 7-.8 10 .7M7.5 12c2.5-.8 6-.6 8.4.8M8 14.5c2-.6 4.5-.4 6 .6"
        stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </g>
  ),
  appleMusic: (
    <g>
      <defs>
        <linearGradient id="am-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FA233B"/>
          <stop offset="100%" stopColor="#FB5C74"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#am-grad)"/>
      <path d="M14 7l-5 1.2v6.5a1.9 1.9 0 1 1-1-1.7v-5l5-1.2v-1z" fill="#fff"/>
    </g>
  ),
  tidal: (
    <g>
      <path d="M5 9l3-3 3 3-3 3zM13 9l3-3 3 3-3 3zM9 13l3-3 3 3-3 3z" fill="currentColor"/>
    </g>
  ),
  youtubeMusic: (
    <g>
      <circle cx="12" cy="12" r="10" fill="#FF0000"/>
      <polygon points="10,8.5 17,12 10,15.5" fill="#fff"/>
    </g>
  ),
  amazonMusic: (
    <g>
      <circle cx="12" cy="12" r="10" fill="#00A8E1"/>
      <circle cx="12" cy="11" r="3.5" fill="#fff"/>
      <polygon points="11,9.3 14.2,11 11,12.7" fill="#00A8E1"/>
      <path d="M5.5 16.5c4 2.5 9 2.5 13 0" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </g>
  ),
};

function BrandIcon({ name, size = 22 }) {
  const icon = BRAND_ICONS[name];
  if (!icon) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "inline-block", flexShrink: 0, verticalAlign: "middle" }}>
      {icon}
    </svg>
  );
}

// Brand-official colors for each platform's link tile.
// `bg` can be a solid color or a gradient string. `text` is the foreground.
const BRAND_COLORS = {
  instagram:    { bg: "linear-gradient(135deg, #515BD4 0%, #833AB4 30%, #DD2A7B 60%, #F58529 100%)", text: "#FFFFFF", glow: "rgba(221,42,123,0.45)" },
  tiktok:       { bg: "#010101",                                                                       text: "#FFFFFF", glow: "rgba(37,244,238,0.35)", border: "#25F4EE" },
  youtube:      { bg: "#FF0000",                                                                       text: "#FFFFFF", glow: "rgba(255,0,0,0.45)" },
  x:            { bg: "#000000",                                                                       text: "#FFFFFF", glow: "rgba(255,255,255,0.18)", border: "rgba(255,255,255,0.35)" },
  spotify:      { bg: "#1DB954",                                                                       text: "#0A0A0A", glow: "rgba(29,185,84,0.45)" },
  appleMusic:   { bg: "linear-gradient(135deg, #FA233B 0%, #FB5C74 100%)",                            text: "#FFFFFF", glow: "rgba(250,35,59,0.45)" },
  tidal:        { bg: "#000000",                                                                       text: "#FFFFFF", glow: "rgba(255,255,255,0.25)", border: "rgba(255,255,255,0.55)" },
  youtubeMusic: { bg: "linear-gradient(135deg, #FF0000 0%, #B30000 100%)",                            text: "#FFFFFF", glow: "rgba(255,0,0,0.45)" },
  amazonMusic:  { bg: "#00A8E1",                                                                       text: "#FFFFFF", glow: "rgba(0,168,225,0.45)" },
};

// Consistent gold-on-black scheme, used for social tiles to keep them
// visually unified (and tie into the "THE WORLD IS YOURS" gold accent).
const GOLD_THEME = {
  bg: "#0A0808",
  text: "#FFD700",
  glow: "rgba(255,215,0,0.32)",
  border: "#FFD700",
};

function BrandLink({ link, size = "lg", theme }) {
  const c = theme === "gold"
    ? GOLD_THEME
    : (BRAND_COLORS[link.icon] || { bg: "#222", text: "#fff", glow: "rgba(255,255,255,0.1)" });
  const dims = size === "sm"
    ? { padX: 14, padY: 10, fontSize: 11, iconSize: 18, gap: 9, letter: 2 }
    : { padX: 22, padY: 14, fontSize: 14, iconSize: 22, gap: 12, letter: 3 };
  return (
    <a
      href={link.url} target="_blank" rel="noreferrer"
      aria-label={link.name} title={link.name}
      style={{
        display: "inline-flex", alignItems: "center", gap: dims.gap,
        padding: `${dims.padY}px ${dims.padX}px`,
        background: c.bg, color: c.text,
        border: c.border ? `1px solid ${c.border}` : "1px solid rgba(255,255,255,0.10)",
        textDecoration: "none",
        fontFamily: "JetBrains Mono", fontSize: dims.fontSize, fontWeight: 700, letterSpacing: dims.letter,
        boxShadow: `0 0 24px ${c.glow}, 0 4px 18px rgba(0,0,0,0.4)`,
        transition: "transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, background 0.18s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        if (theme === "gold") {
          e.currentTarget.style.background = "#FFD700";
          e.currentTarget.style.color = "#0A0808";
        } else {
          e.currentTarget.style.filter = "brightness(1.1)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        if (theme === "gold") {
          e.currentTarget.style.background = c.bg;
          e.currentTarget.style.color = c.text;
        } else {
          e.currentTarget.style.filter = "brightness(1)";
        }
      }}
    >
      <BrandIcon name={link.icon} size={dims.iconSize} />
      <span>{link.name.toUpperCase()}</span>
    </a>
  );
}

function fmtTime(s) {
  if (!s || isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function LocalPlayer({ tracks, artist, autoplay = false }) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [error, setError] = useState(false);
  // Once true, switching tracks (or external autoplay trigger) starts playback
  const [shouldPlay, setShouldPlay] = useState(false);
  // Per-session play tracking — fire one analytics event per track,
  // not on every pause/resume. Counts are visible in the Vercel
  // dashboard under Analytics → Custom Events.
  const playedTracksRef = useRef(new Set());

  const current = tracks[currentIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // External autoplay handoff (e.g. user dismissed email modal)
  useEffect(() => {
    if (autoplay) setShouldPlay(true);
  }, [autoplay]);

  // When the source changes (track switch) or shouldPlay flips on, attempt playback
  useEffect(() => {
    setCurrentTime(0);
    setError(false);
    if (shouldPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentIndex, shouldPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else {
      setShouldPlay(true);
      audioRef.current.play().catch(() => setError(true));
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const next = () => { setShouldPlay(true); setCurrentIndex(i => (i + 1) % tracks.length); };
  const prev = () => { setShouldPlay(true); setCurrentIndex(i => (i - 1 + tracks.length) % tracks.length); };
  const select = (i) => { setShouldPlay(true); setCurrentIndex(i); };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (currentIndex < tracks.length - 1) {
      setShouldPlay(true);
      setCurrentIndex(i => i + 1);
    }
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  const ctrlBtn = {
    flexShrink: 0, width: 36, height: 36, borderRadius: "50%",
    background: "transparent", border: "1px solid rgba(255,255,255,0.18)",
    color: "#DDD", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0,
  };

  return (
    <PlayerShell>
      <audio
        ref={audioRef}
        src={current.src}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => {
          setIsPlaying(true);
          // Track unique play per session — pause/resume doesn't double-count
          const key = current.src;
          if (!playedTracksRef.current.has(key)) {
            playedTracksRef.current.add(key);
            try {
              track("track_play", { title: current.title, src: current.src });
            } catch (e) { /* Vercel Analytics not available — silently ignore */ }
          }
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        onError={() => setError(true)}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 22px", flexWrap: "wrap" }}>
        <button onClick={prev} aria-label="Previous track" style={ctrlBtn}>
          <PrevIcon size={16} />
        </button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{
            flexShrink: 0,
            width: 60, height: 60, borderRadius: "50%",
            background: "#E23636", border: "none", color: "#FFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 0 24px rgba(226,54,54,0.6), 0 0 48px rgba(255,20,147,0.25)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
        </button>

        <button onClick={next} aria-label="Next track" style={ctrlBtn}>
          <NextIcon size={16} />
        </button>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{
            fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: 4, color: "#FFFFFF",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            textAlign: "left",
          }}>{current.title}</div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginTop: 2, marginBottom: 12,
          }}>
            <span style={{
              fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 3, color: "#FFD700",
            }}>{artist}</span>
            <span style={{
              fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 2, color: "#666",
            }}>{String(currentIndex + 1).padStart(2, "0")} / {String(tracks.length).padStart(2, "0")}</span>
          </div>

          <div
            onClick={handleSeek}
            style={{
              position: "relative", height: 6, background: "rgba(255,255,255,0.12)",
              cursor: "pointer", borderRadius: 3, overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", inset: 0, width: `${progressPct}%`,
              background: "linear-gradient(90deg, #E23636 0%, #FF1493 60%, #FFA500 100%)",
              boxShadow: "0 0 12px rgba(255,20,147,0.6)",
              transition: "width 0.1s linear",
            }} />
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 6,
            fontFamily: "JetBrains Mono", fontSize: 10, color: "#BBB", letterSpacing: 1,
          }}>
            <span>{fmtTime(currentTime)}</span>
            {error
              ? <span style={{ color: "#FF1493" }}>FILE NOT FOUND</span>
              : <span>{fmtTime(duration)}</span>}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#AAA", flexShrink: 0 }}>
          <VolumeIcon size={16} />
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            style={{ width: 70, accentColor: "#FF1493", cursor: "pointer" }}
          />
        </div>
      </div>

      {tracks.length > 1 && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {tracks.map((t, i) => {
            const active = i === currentIndex;
            return (
              <div key={t.src} onClick={() => select(i)} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "11px 22px",
                borderBottom: i < tracks.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: active ? "rgba(255,20,147,0.08)" : "transparent",
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  fontFamily: "JetBrains Mono", fontSize: 11, fontWeight: 700,
                  color: active ? "#FF1493" : "#666", width: 18, textAlign: "center",
                }}>
                  {active && isPlaying ? "♪" : String(i + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontFamily: "Bebas Neue", fontSize: 15, letterSpacing: 3,
                  color: active ? "#FFFFFF" : "#AAA", flex: 1,
                }}>{t.title}</span>
                {active && (
                  <span style={{
                    fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 2,
                    color: "#FF1493", animation: isPlaying ? "neonFlicker 5s infinite" : "none",
                  }}>{isPlaying ? "PLAYING" : "SELECTED"}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PlayerShell>
  );
}

function MusicPlayer({ autoplay = false }) {
  const { type } = MUSIC_PLAYER;

  if (type === "local") {
    const { tracks, artist } = MUSIC_PLAYER.local;
    if (!tracks || tracks.length === 0) {
      return <PlaceholderPanel
        hint="DROP MP3s INTO public/audio/ AND ADD THEM TO"
        codePath="MUSIC_PLAYER.local.tracks" />;
    }
    return <LocalPlayer tracks={tracks} artist={artist} autoplay={autoplay} />;
  }

  if (type === "soundcloud") {
    const { url } = MUSIC_PLAYER.soundcloud;
    if (!url || url.includes("your-track") || url.includes("YOUR_")) {
      return <PlaceholderPanel
        hint="PASTE YOUR SOUNDCLOUD URL IN"
        codePath="MUSIC_PLAYER.soundcloud.url" />;
    }
    const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23E23636&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    return (
      <PlayerShell>
        <iframe width="100%" height={320} scrolling="no" frameBorder="no"
          allow="autoplay" src={src} title="AI KING — SoundCloud"
          style={{ display: "block", border: 0 }} />
      </PlayerShell>
    );
  }

  if (type === "spotify") {
    const { url } = MUSIC_PLAYER.spotify;
    const id = url?.split("/track/")[1]?.split("?")[0];
    if (!id || id === "YOUR_TRACK_ID") {
      return <PlaceholderPanel
        hint="PASTE YOUR SPOTIFY TRACK URL IN"
        codePath="MUSIC_PLAYER.spotify.url" />;
    }
    return (
      <PlayerShell>
        <iframe width="100%" height={152} scrolling="no" frameBorder="no"
          allow="encrypted-media"
          src={`https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`}
          title="AI KING — Spotify"
          style={{ display: "block", border: 0 }} />
      </PlayerShell>
    );
  }

  if (type === "youtube") {
    const { videoId } = MUSIC_PLAYER.youtube;
    if (!videoId || videoId === "YOUR_VIDEO_ID") {
      return <PlaceholderPanel
        hint="PASTE YOUR YOUTUBE VIDEO ID IN"
        codePath="MUSIC_PLAYER.youtube.videoId" />;
    }
    return (
      <PlayerShell>
        <iframe width="100%" height={360} scrolling="no" frameBorder="no"
          allow="autoplay; encrypted-media"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="AI KING — YouTube"
          style={{ display: "block", border: 0 }} />
      </PlayerShell>
    );
  }

  return <PlaceholderPanel
    hint="UNKNOWN PLAYER TYPE — SET ONE OF: local | soundcloud | spotify | youtube IN"
    codePath="MUSIC_PLAYER.type" />;
}

function TrackRow({ track, index }) {
  const [hover, setHover] = useState(false);
  const available = track.status === "OUT NOW";

  const handleBuy = (e) => {
    e.stopPropagation();
    if (track.stripeLink && track.stripeLink !== "https://buy.stripe.com/YOUR_LINK_HERE") {
      window.open(track.stripeLink, "_blank");
    }
  };

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "36px 1fr auto auto",
        gap: 16, alignItems: "center", padding: "18px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: hover ? "rgba(226,54,54,0.08)" : "transparent",
        transition: "background 0.25s",
        animation: `slideR 0.5s ease ${index * 0.08}s both`,
      }}>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#666", letterSpacing: 1 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div style={{ fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: 3, color: "#FFFFFF" }}>
        {track.title}
      </div>
      <span style={{
        fontFamily: "JetBrains Mono", fontSize: 10, fontWeight: 700, letterSpacing: 3,
        color: available ? "#FF1493" : "#888",
        animation: !available ? "pulse 2.5s ease-in-out infinite" : "none",
      }}>{track.status}</span>
      {track.price ? (
        <button onClick={handleBuy} style={{
          background: hover ? "#E23636" : "transparent",
          border: "1px solid #E23636", color: hover ? "#0A0A0A" : "#FF6B6B",
          padding: "8px 20px", fontSize: 11, fontWeight: 700, letterSpacing: 2,
          fontFamily: "JetBrains Mono", cursor: "pointer", transition: "all 0.25s",
        }}>BUY ${track.price.toFixed(2)}</button>
      ) : (
        <span style={{
          fontFamily: "JetBrains Mono", fontSize: 10, color: "#888", letterSpacing: 1,
          padding: "8px 16px", border: "1px solid #2a2a2a",
        }}>NOTIFY ME</span>
      )}
    </div>
  );
}

function WatchSection() {
  const { youtubeId, title } = WATCH_VIDEO;
  const isPlaceholder = !youtubeId || youtubeId === "PASTE_YOUTUBE_ID_HERE";
  if (isPlaceholder) return null; // Hide entirely until a real video ID is set
  return (
    <div style={{ marginTop: 60 }}>
      <p style={{
        fontFamily: "JetBrains Mono", fontSize: 10, fontWeight: 700, letterSpacing: 5,
        color: "#DC143C", marginBottom: 14,
      }}>▶ WATCH — {title}</p>
      <div style={{
        position: "relative", maxWidth: 720, margin: "0 auto",
        paddingBottom: "56.25%", height: 0, overflow: "hidden",
        border: "1px solid rgba(220,20,60,0.35)",
        boxShadow: "0 0 60px rgba(220,20,60,0.18), 0 0 120px rgba(139,0,0,0.12)",
      }}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={`AI KING — ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            border: 0, display: "block",
          }}
        />
      </div>
    </div>
  );
}

function EmailModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // Wired to ConvertKit. Set VITE_CONVERTKIT_API_KEY + VITE_CONVERTKIT_FORM_ID
  // env vars in Vercel (and .env.local for local dev). See CONVERTKIT config
  // block at top of this file for details.
  const handleSubmit = async () => {
    if (!email) return;
    const result = await subscribeToConvertKit(email);
    if (!result.ok && result.reason !== "not_configured") {
      // Still show success to the user — don't punish them for our backend
      // hiccup. The error is logged for us to investigate.
    }
    setDone(true);
    setTimeout(onClose, 1600);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: "fadeUp 0.4s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: 520, width: "100%",
          padding: "44px 36px 36px",
          background: "linear-gradient(180deg, rgba(15,5,16,0.98) 0%, rgba(8,4,10,0.98) 100%)",
          border: "1px solid rgba(255,20,147,0.4)",
          boxShadow: "0 0 80px rgba(255,20,147,0.35), 0 0 160px rgba(226,54,54,0.2), inset 0 0 0 1px rgba(255,215,0,0.12)",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 14,
            width: 36, height: 36, borderRadius: "50%",
            background: "transparent", border: "1px solid rgba(255,255,255,0.18)",
            color: "#CCC", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", padding: 0,
          }}
        >
          <CloseIcon size={16} />
        </button>

        <div style={{ marginBottom: 14 }}><Crown size={56} /></div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 30, height: 1, background: "linear-gradient(90deg, transparent, #FFD700)" }} />
          <Globe size={18} />
          <span style={{
            fontFamily: "Cinzel, serif", fontSize: 11, fontWeight: 800, letterSpacing: 6,
            color: "#FFD700", textShadow: "0 0 14px rgba(255,215,0,0.5)",
          }}>THE WORLD IS YOURS</span>
          <Globe size={18} />
          <div style={{ width: 30, height: 1, background: "linear-gradient(270deg, transparent, #FFD700)" }} />
        </div>

        <h2 style={{
          fontFamily: "Bebas Neue", fontSize: 38, letterSpacing: 6, color: "#FFFFFF",
          margin: 0, marginBottom: 10, lineHeight: 1,
          textShadow: "0 0 24px rgba(226,54,54,0.5)",
        }}>JOIN THE INNER CIRCLE</h2>

        <p style={{
          fontFamily: "JetBrains Mono", fontSize: 11, color: "#BBB",
          letterSpacing: 1.5, marginBottom: 26, lineHeight: 1.7,
        }}>
          Unreleased tracks. First-access drops. Direct from AI KING.<br/>
          No spam. Leave any time.
        </p>

        {!done ? (
          <>
            <div style={{ display: "flex", marginBottom: 14 }}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="YOUR@EMAIL.COM"
                type="email"
                autoFocus
                style={{
                  flex: 1, padding: "16px 20px", background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.20)", borderRight: "none",
                  color: "#FFFFFF", fontSize: 12, letterSpacing: 2,
                  fontFamily: "JetBrains Mono", outline: "none",
                }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  padding: "16px 28px", background: "#E23636", border: "1px solid #E23636",
                  color: "#FFFFFF", fontSize: 12, fontWeight: 700, letterSpacing: 3,
                  fontFamily: "JetBrains Mono", cursor: "pointer",
                  boxShadow: "0 0 24px rgba(226,54,54,0.5)",
                }}
              >JOIN</button>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent", border: "none",
                fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 3,
                color: "#777", cursor: "pointer", textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >SKIP FOR NOW</button>
          </>
        ) : (
          <div style={{
            padding: 18, border: "1px solid #FF1493",
            fontFamily: "JetBrains Mono", fontSize: 12, letterSpacing: 2, color: "#FF1493",
          }}>
            ✓ YOU'RE IN THE CIRCLE. WATCH YOUR INBOX.
          </div>
        )}
      </div>
    </div>
  );
}

function EmailSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // Wired to ConvertKit (same as EmailModal). See CONVERTKIT config at top.
  const handleSubmit = async () => {
    if (!email) return;
    await subscribeToConvertKit(email);
    setDone(true);
  };

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
      <Crown size={40} />
      <h3 style={{ fontFamily: "Bebas Neue", fontSize: 32, letterSpacing: 6, color: "#FFFFFF", marginBottom: 6, marginTop: 12 }}>
        THE INNER CIRCLE
      </h3>
      <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#A0A0A0", letterSpacing: 1, marginBottom: 28 }}>
        Unreleased tracks. First access drops. Direct from AI KING.
      </p>
      {!done ? (
        <div style={{ display: "flex", maxWidth: 480, margin: "0 auto" }}>
          <input value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="YOUR@EMAIL.COM"
            type="email"
            style={{
              flex: 1, padding: "16px 20px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.18)", borderRight: "none",
              color: "#FFFFFF", fontSize: 12, letterSpacing: 2,
              fontFamily: "JetBrains Mono", outline: "none",
            }} />
          <button onClick={handleSubmit} style={{
            padding: "16px 32px", background: "#E23636", border: "1px solid #E23636",
            color: "#FFFFFF", fontSize: 12, fontWeight: 700, letterSpacing: 3,
            fontFamily: "JetBrains Mono", cursor: "pointer",
            boxShadow: "0 0 24px rgba(226,54,54,0.45)",
          }}>JOIN</button>
        </div>
      ) : (
        <div style={{ padding: 18, border: "1px solid #FF1493", fontFamily: "JetBrains Mono", fontSize: 12, letterSpacing: 2, color: "#FF1493" }}>
          ✓ YOU'RE IN THE CIRCLE. WATCH YOUR INBOX.
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState("home");
  // Initial state computed at first render — modal shows IMMEDIATELY on
  // first visit (no delay). Returning visitors (localStorage flag set)
  // skip the modal entirely.
  const [showEmailModal, setShowEmailModal] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("aiking_email_seen");
  });
  const [autoplayUnlocked, setAutoplayUnlocked] = useState(false);

  // For returning visitors: autoplay is gated on the next user click
  // anywhere (browser policy — can't autoplay audio without a gesture).
  useEffect(() => {
    if (showEmailModal) return; // First-visit flow — modal dismiss handles autoplay unlock
    const onFirstClick = () => setAutoplayUnlocked(true);
    document.addEventListener("click", onFirstClick, { once: true });
    return () => document.removeEventListener("click", onFirstClick);
  }, []);

  const dismissEmailModal = () => {
    setShowEmailModal(false);
    setAutoplayUnlocked(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("aiking_email_seen", "1");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0A0A0A 0%, #060409 45%, #0F0510 100%)",
      color: "#E8E8E8", fontFamily: "Inter, sans-serif", position: "relative",
      overflow: "hidden",
    }}>
      <style>{fonts}{keyframes}</style>

      {/* Film grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.045,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        animation: "grain 0.4s steps(3) infinite",
      }} />

      {/* Crimson horizon — bottom of viewport (deeper, less neon than before) */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, height: 360,
        background: "linear-gradient(180deg, transparent 0%, rgba(50,8,12,0.20) 25%, rgba(139,0,0,0.22) 55%, rgba(178,34,52,0.18) 80%, rgba(220,75,30,0.12) 100%)",
        pointerEvents: "none", zIndex: 0,
        animation: "sunsetPulse 8s ease-in-out infinite",
      }} />

      {/* Ambient blood-red glow — top right */}
      <div style={{
        position: "fixed", top: "-20%", right: "-10%",
        width: "55%", height: "55%",
        background: "radial-gradient(circle, rgba(178,34,52,0.14) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Deep crimson bloom — opposite side */}
      <div style={{
        position: "fixed", top: "10%", left: "-15%",
        width: "50%", height: "55%",
        background: "radial-gradient(circle, rgba(139,0,0,0.10) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Hero photo background — fixed, only on landing.
          Save photo to public/images/hero-bw.webp. If missing, the dark
          gradient overlay alone still looks intentional. */}
      {section === "home" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(180deg, rgba(8,6,6,0.78) 0%, rgba(8,6,6,0.82) 45%, rgba(20,6,8,0.96) 100%), url('/images/hero-bw.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center 18%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#080606",
        }} />
      )}

      {/* Music section photo background — fixed, only on /music */}
      {section === "music" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(180deg, rgba(8,6,6,0.88) 0%, rgba(14,4,6,0.92) 100%), url('/images/portrait-red.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0A0606",
        }} />
      )}

      {/* Palm trees — only on landing */}
      {section === "home" && (
        <>
          <PalmTree side="left" />
          <PalmTree side="right" />
        </>
      )}

      {/* ===== NAVIGATION ===== */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 36px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,6,12,0.92)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,20,147,0.10)",
      }}>
        <div onClick={() => setSection("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <Crown size={26} />
          <span style={{ fontFamily: "Bebas Neue", fontSize: 28, letterSpacing: 8, color: "#E23636", textShadow: "0 0 18px rgba(226,54,54,0.45)" }}>AI KING</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {/* ABOUT and LINKS hidden for now — re-enable by adding them back to this array */}
          {["MUSIC"].map(s => (
            <span key={s} onClick={() => setSection(s.toLowerCase())} style={{
              fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 3,
              color: section === s.toLowerCase() ? "#DC143C" : "#999",
              cursor: "pointer", transition: "color 0.2s",
            }}>{s}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>

        {/* ===== HERO ===== */}
        {section === "home" && (
          <div style={{ textAlign: "center", padding: "90px 0 80px", position: "relative", animation: "fadeUp 0.8s ease" }}>
            <div style={{ marginBottom: 18 }}><Crown size={64} /></div>

            <h1 style={{
              fontFamily: "Bebas Neue", fontSize: "clamp(60px, 12vw, 130px)",
              letterSpacing: "0.18em", lineHeight: 0.92, color: "#FFFFFF",
              animation: "glow 4s ease-in-out infinite", margin: "0 0 22px",
            }}>AI KING</h1>

            {/* THE WORLD IS YOURS — engraved-globe homage */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
              <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #FFD700)" }} />
              <Globe size={24} />
              <span style={{
                fontFamily: "Cinzel, serif", fontSize: 14, fontWeight: 800, letterSpacing: 8,
                color: "#FFD700", textShadow: "0 0 18px rgba(255,215,0,0.55), 0 0 36px rgba(255,165,0,0.25)",
              }}>THE WORLD IS YOURS</span>
              <Globe size={24} />
              <div style={{ width: 60, height: 1, background: "linear-gradient(270deg, transparent, #FFD700)" }} />
            </div>

            <p style={{
              fontFamily: "JetBrains Mono", fontSize: 12, letterSpacing: 5,
              color: "#C8C8C8", maxWidth: 480, margin: "0 auto",
            }}>INDEPENDENT HIP-HOP. UNFILTERED. DIRECT TO YOU.</p>

            {/* ===== SOCIAL LINKS (moved above the player) ===== */}
            <div style={{ marginTop: 48 }}>
              <p style={{
                fontFamily: "JetBrains Mono", fontSize: 9, fontWeight: 700, letterSpacing: 5,
                color: "#DC143C", marginBottom: 16,
              }}>— FOLLOW —</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                {SOCIALS.map(s => <BrandLink key={s.name} link={s} size="lg" theme="gold" />)}
              </div>
            </div>

            {/* ===== STREAMING LINKS — hidden until real URLs available.
                To re-enable: uncomment the block below AND fill in real
                URLs in the STREAMING array near the top of this file. =====
            <div style={{ marginTop: 28 }}>
              <p style={{
                fontFamily: "JetBrains Mono", fontSize: 9, fontWeight: 700, letterSpacing: 5,
                color: "#DC143C", marginBottom: 16,
              }}>— STREAM —</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {STREAMING.map(s => <BrandLink key={s.name} link={s} size="sm" />)}
              </div>
            </div>
            */}

            {/* ===== MUSIC PLAYER ===== */}
            <div style={{ marginTop: 48 }}>
              <p style={{
                fontFamily: "JetBrains Mono", fontSize: 10, fontWeight: 700, letterSpacing: 5,
                color: "#DC143C", marginBottom: 14, animation: "neonFlicker 5s infinite",
              }}>▶ NOW PLAYING</p>
              <MusicPlayer autoplay={autoplayUnlocked} />
            </div>

            {/* ===== WATCH (YouTube video) — auto-hides if no video ID set ===== */}
            <WatchSection />
          </div>
        )}

        {/* ===== MUSIC / CATALOG (only on /music) ===== */}
        {section === "music" && (
          <div style={{ padding: "60px 0 70px", animation: "fadeUp 0.6s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: 38, letterSpacing: 6, color: "#FFFFFF", margin: 0 }}>CATALOG</h2>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.12)" }} />
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 2, color: "#888" }}>VIA TUNECORE</span>
            </div>

            {/* Featured player at top of catalog */}
            <div style={{ marginBottom: 40 }}>
              <MusicPlayer autoplay={autoplayUnlocked} />
            </div>

            <div style={{ border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.02)" }}>
              {TRACKS.map((t, i) => <TrackRow key={t.id} track={t} index={i} />)}
            </div>
            {/* STREAM EVERYWHERE row — hidden until real URLs available.
                To re-enable: uncomment and fill in the STREAMING array urls.
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 3, color: "#AAA", marginBottom: 14 }}>
                STREAM EVERYWHERE
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {STREAMING.map(s => <BrandLink key={s.name} link={s} size="sm" />)}
              </div>
            </div>
            */}
          </div>
        )}

        {/* ===== ABOUT ===== */}
        {section === "about" && (
          <div style={{ padding: "80px 0", animation: "fadeUp 0.6s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <Crown size={28} />
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: 44, letterSpacing: 6, color: "#FFFFFF", margin: 0 }}>THE STORY</h2>
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 1.9, color: "#C8C8C8", maxWidth: 620, fontWeight: 300 }}>
              <p>[Your story goes here. Who is AI KING? Where did the name come from? What drives your music? Talk about your sound, your city, your vision. Keep it raw and authentic — fans connect with the real.]</p>
              <p style={{ marginTop: 20 }}>[What's coming next — the upcoming drops, collaborations, the bigger picture. Give people a reason to follow the journey from day one.]</p>
            </div>
            <div style={{
              marginTop: 44, padding: 26, border: "1px solid rgba(255,20,147,0.20)",
              background: "rgba(255,20,147,0.04)", display: "flex", gap: 40, flexWrap: "wrap",
            }}>
              {[
                ["DISTRIBUTION", "TuneCore"],
                ["BOOKING", "DM on Instagram"],
                ["MANAGEMENT", "Self-managed"],
              ].map(([label, val]) => (
                <div key={label}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, color: "#FF1493" }}>{label}</span>
                  <p style={{ fontFamily: "Inter", fontSize: 14, color: "#DCDCDC", margin: "4px 0 0" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== LINKS (Link-in-Bio) ===== */}
        {section === "links" && (
          <div style={{ padding: "80px 0", animation: "fadeUp 0.6s ease", maxWidth: 460, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <Crown size={36} />
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: 38, letterSpacing: 6, color: "#FFFFFF", marginTop: 10 }}>ALL LINKS</h2>
            </div>

            <div style={{
              fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 4, color: "#FF1493",
              marginBottom: 14, marginTop: 8,
            }}>— SOCIAL —</div>

            {SOCIALS.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 22px", marginBottom: 10,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.03)",
                textDecoration: "none",
                fontFamily: "Bebas Neue", fontSize: 20, letterSpacing: 4, color: "#FFFFFF",
                transition: "all 0.25s",
              }}>
                <BrandIcon name={link.icon} size={26} />
                <span style={{ flex: 1 }}>{link.name.toUpperCase()}</span>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#FF1493", letterSpacing: 2 }}>→</span>
              </a>
            ))}

            <div style={{
              fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 4, color: "#FF1493",
              marginBottom: 14, marginTop: 32,
            }}>— STREAMING —</div>

            {STREAMING.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 22px", marginBottom: 10,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.03)",
                textDecoration: "none",
                fontFamily: "Bebas Neue", fontSize: 20, letterSpacing: 4, color: "#FFFFFF",
                transition: "all 0.25s",
              }}>
                <BrandIcon name={link.icon} size={26} />
                <span style={{ flex: 1 }}>{link.name.toUpperCase()}</span>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#FF1493", letterSpacing: 2 }}>→</span>
              </a>
            ))}
          </div>
        )}

        {/* ===== EMAIL SIGNUP ===== */}
        <div style={{ padding: "60px 0 80px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <EmailSignup />
        </div>

        {/* ===== FOOTER ===== */}
        <footer style={{ textAlign: "center", padding: "36px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12, opacity: 0.7 }}>
            <Globe size={14} />
            <span style={{ fontFamily: "Cinzel, serif", fontSize: 9, fontWeight: 700, letterSpacing: 5, color: "#B8860B" }}>
              THE WORLD IS YOURS
            </span>
            <Globe size={14} />
          </div>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, color: "#666" }}>
            © 2026 AI KING — ALL RIGHTS RESERVED — POWERED BY INDEPENDENCE
          </p>
        </footer>
      </div>

      {/* ===== EMAIL TAKE-OVER MODAL ===== */}
      {showEmailModal && <EmailModal onClose={dismissEmailModal} />}
    </div>
  );
}
