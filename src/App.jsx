import { useState, useRef, useEffect } from "react";

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
    src: "/audio/get-away-freestyle.mp3",
    title: "GET AWAY (FREESTYLE)",
    artist: "AI KING",
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
  { name: "Instagram", abbr: "IG", url: "https://instagram.com/OfficialAIKING" },
  { name: "TikTok", abbr: "TT", url: "https://tiktok.com/@KingAI.Jay" },
  { name: "YouTube", abbr: "YT", url: "https://youtube.com/@OfficalAIKING" },
  { name: "X", abbr: "X", url: "https://x.com/OfficialAIKING" },
];

const STREAMING = [
  { name: "Spotify", url: "#" },
  { name: "Apple Music", url: "#" },
  { name: "Tidal", url: "#" },
  { name: "YouTube Music", url: "#" },
  { name: "Amazon Music", url: "#" },
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

function fmtTime(s) {
  if (!s || isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function LocalPlayer({ src, title, artist }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => setError(true));
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerShell>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
        onError={() => setError(true)}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 22px" }}>
        {/* Big play / pause */}
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

        {/* Track info + progress */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: 4, color: "#FFFFFF",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{title}</div>
          <div style={{
            fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 3, color: "#FFD700",
            marginBottom: 12, marginTop: 2,
          }}>{artist}</div>

          {/* Progress bar */}
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
              ? <span style={{ color: "#FF1493" }}>FILE NOT FOUND — CHECK public/audio/</span>
              : <span>{fmtTime(duration)}</span>}
          </div>
        </div>

        {/* Volume — hidden on small screens */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#AAA", flexShrink: 0 }}
             className="ai-king-volume">
          <VolumeIcon size={16} />
          <input
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            style={{
              width: 70, accentColor: "#FF1493", cursor: "pointer",
            }}
          />
        </div>
      </div>
    </PlayerShell>
  );
}

function MusicPlayer() {
  const { type } = MUSIC_PLAYER;

  if (type === "local") {
    const { src, title, artist } = MUSIC_PLAYER.local;
    if (!src || src === "/audio/preview.mp3") {
      return <PlaceholderPanel
        hint="DROP AN MP3 INTO public/audio/ AND UPDATE"
        codePath="MUSIC_PLAYER.local.src" />;
    }
    return <LocalPlayer src={src} title={title} artist={artist} />;
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

function EmailSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    // TODO: Connect to Mailchimp, ConvertKit, or your email service
    console.log("New subscriber:", email);
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

      {/* Miami sunset horizon — bottom of viewport */}
      <div style={{
        position: "fixed", left: 0, right: 0, bottom: 0, height: 360,
        background: "linear-gradient(180deg, transparent 0%, rgba(75,0,130,0.18) 25%, rgba(255,20,147,0.20) 55%, rgba(255,99,71,0.18) 80%, rgba(255,165,0,0.15) 100%)",
        pointerEvents: "none", zIndex: 0,
        animation: "sunsetPulse 8s ease-in-out infinite",
      }} />

      {/* Ambient red glow — top right */}
      <div style={{
        position: "fixed", top: "-20%", right: "-10%",
        width: "55%", height: "55%",
        background: "radial-gradient(circle, rgba(226,54,54,0.10) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      {/* Miami magenta glow — opposite side */}
      <div style={{
        position: "fixed", top: "10%", left: "-15%",
        width: "50%", height: "55%",
        background: "radial-gradient(circle, rgba(255,20,147,0.09) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0,
      }} />

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
          {["MUSIC", "ABOUT", "LINKS"].map(s => (
            <span key={s} onClick={() => setSection(s.toLowerCase())} style={{
              fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 3,
              color: section === s.toLowerCase() ? "#FF1493" : "#999",
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
              color: "#B8B8B8", maxWidth: 480, margin: "0 auto",
            }}>INDEPENDENT HIP-HOP. UNFILTERED. DIRECT TO YOU.</p>

            {/* ===== MUSIC PLAYER ===== */}
            <div style={{ marginTop: 50 }}>
              <p style={{
                fontFamily: "JetBrains Mono", fontSize: 10, fontWeight: 700, letterSpacing: 5,
                color: "#FF1493", marginBottom: 14, animation: "neonFlicker 5s infinite",
              }}>▶ NOW PLAYING</p>
              <MusicPlayer />
            </div>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 50, flexWrap: "wrap" }}>
              <button onClick={() => setSection("music")} style={{
                padding: "16px 40px", background: "#E23636", border: "none",
                fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 5, color: "#FFFFFF", cursor: "pointer",
                boxShadow: "0 0 32px rgba(226,54,54,0.55)",
              }}>FULL CATALOG</button>
              <button onClick={() => setSection("links")} style={{
                padding: "16px 40px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.35)",
                fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 5, color: "#EEE", cursor: "pointer",
              }}>ALL LINKS</button>
            </div>

            <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
              {SOCIALS.map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{
                  fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 700,
                  letterSpacing: 3, color: "#AAAAAA", textDecoration: "none",
                  padding: "10px 16px", border: "1px solid #2a2a2a", transition: "all 0.25s",
                }}>{s.abbr}</a>
              ))}
            </div>
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
              <MusicPlayer />
            </div>

            <div style={{ border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.02)" }}>
              {TRACKS.map((t, i) => <TrackRow key={t.id} track={t} index={i} />)}
            </div>
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 3, color: "#888", marginBottom: 14 }}>
                STREAM EVERYWHERE
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {STREAMING.map(s => (
                  <a key={s.name} href={s.url} style={{
                    fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 2,
                    color: "#AAAAAA", textDecoration: "none", padding: "6px 12px",
                    border: "1px solid #2a2a2a", transition: "all 0.2s",
                  }}>{s.name.toUpperCase()}</a>
                ))}
              </div>
            </div>
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
          <div style={{ padding: "80px 0", animation: "fadeUp 0.6s ease", maxWidth: 440, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <Crown size={36} />
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: 38, letterSpacing: 6, color: "#FFFFFF", marginTop: 10 }}>ALL LINKS</h2>
            </div>
            {[
              ...SOCIALS,
              ...STREAMING.map(s => ({ name: s.name, url: s.url })),
            ].map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{
                display: "block", padding: "16px 24px", marginBottom: 8,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.03)",
                textDecoration: "none", textAlign: "center",
                fontFamily: "Bebas Neue", fontSize: 19, letterSpacing: 4, color: "#EEEEEE",
                transition: "all 0.25s",
              }}>{link.name.toUpperCase()}</a>
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
    </div>
  );
}
