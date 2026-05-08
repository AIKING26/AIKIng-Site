import { useState, useEffect, useRef } from "react";

/*
  =============================================
  AI KING — LINK-IN-BIO LANDING PAGE
  =============================================
  
  CONFIGURATION: Update these with your real links
  
  MUSIC PLAYER: Add your audio file URLs below.
  Options for hosting your audio:
  1. SoundCloud embed URLs (free)
  2. Direct .mp3 links hosted on Google Drive, Dropbox, or S3
  3. Spotify embed (see STREAMING_EMBEDS below)
  
  STRIPE: Add your Stripe Payment Links when ready
*/

const CONFIG = {
  artistName: "AI KING",
  tagline: "INDEPENDENT HIP-HOP. UNFILTERED. DIRECT TO YOU.",
  bookingEmail: "DM on Instagram",
};

const SOCIALS = [
  { name: "Instagram", icon: "IG", url: "https://instagram.com/OfficialAIKING", color: "#E1306C" },
  { name: "TikTok", icon: "TT", url: "https://tiktok.com/@KingAI.Jay", color: "#00F2EA" },
  { name: "YouTube", icon: "YT", url: "https://youtube.com/@OfficalAIKING", color: "#FF0000" },
  { name: "X", icon: "X", url: "https://x.com/OfficialAIKING", color: "#ffffff" },
];

const STREAMING = [
  { name: "Spotify", url: "#" },
  { name: "Apple Music", url: "#" },
  { name: "Tidal", url: "#" },
  { name: "YouTube Music", url: "#" },
  { name: "Amazon Music", url: "#" },
];

// Add your tracks here with audio URLs for the player
// For now these are placeholders — replace with real audio URLs
const PLAYER_TRACKS = [
  { 
    id: 1, 
    title: "See It All, Be It All", 
    duration: "3:24",
    // Replace with your actual audio URL:
    audioUrl: "", 
  },
  { 
    id: 2, 
    title: "How Long?", 
    duration: "2:58",
    audioUrl: "",
  },
  { 
    id: 3, 
    title: "All The Time", 
    duration: "3:12",
    audioUrl: "",
  },
];

// If you prefer a Spotify embed instead of custom player, paste your Spotify artist URI here:
// Example: "https://open.spotify.com/embed/artist/YOUR_ARTIST_ID?theme=0"
const SPOTIFY_EMBED_URL = "";

const STRIPE_LINK = ""; // Your Stripe storefront link when ready

// =============================================
// FONTS & ANIMATIONS
// =============================================

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap');`;

const keyframes = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes crownFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
@keyframes glow { 0%, 100% { text-shadow: 0 0 30px rgba(226,54,54,.2); } 50% { text-shadow: 0 0 60px rgba(226,54,54,.5), 0 0 120px rgba(226,54,54,.15); } }
@keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
@keyframes eqBar1 { 0% { height: 4px; } 50% { height: 20px; } 100% { height: 4px; } }
@keyframes eqBar2 { 0% { height: 12px; } 50% { height: 6px; } 100% { height: 12px; } }
@keyframes eqBar3 { 0% { height: 8px; } 50% { height: 22px; } 100% { height: 8px; } }
@keyframes grain { 0%,100%{transform:translate(0,0)} 20%{transform:translate(-2%,-1%)} 40%{transform:translate(1%,2%)} 60%{transform:translate(-1%,1%)} 80%{transform:translate(2%,-1%)} }
@keyframes borderGlow { 0%,100% { border-color: rgba(226,54,54,0.15); } 50% { border-color: rgba(226,54,54,0.4); } }
@keyframes progressPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }

::selection { background: rgba(226,54,54,0.3); color: #fff; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { background: #060606; overflow-x: hidden; }
`;

// =============================================
// COMPONENTS
// =============================================

function Crown({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ animation: "crownFloat 3s ease-in-out infinite", filter: "drop-shadow(0 0 12px rgba(226,54,54,0.4))" }}>
      <path d="M8 48L4 20L18 32L32 12L46 32L60 20L56 48H8Z" fill="#E23636" opacity="0.9"/>
      <path d="M8 48H56V54H8V48Z" fill="#E23636"/>
      <circle cx="4" cy="20" r="3" fill="#FFD700"/>
      <circle cx="32" cy="12" r="3" fill="#FFD700"/>
      <circle cx="60" cy="20" r="3" fill="#FFD700"/>
    </svg>
  );
}

function Equalizer({ playing }) {
  if (!playing) return null;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22 }}>
      {[1, 2, 3, 2, 1].map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 1, backgroundColor: "#E23636",
          animation: `eqBar${(i % 3) + 1} 0.${4 + i}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  // If Spotify embed is configured, show that instead
  if (SPOTIFY_EMBED_URL) {
    return (
      <div style={{ animation: "fadeUp 0.6s ease 0.3s both" }}>
        <iframe
          src={SPOTIFY_EMBED_URL}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}
        />
      </div>
    );
  }

  const playTrack = (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      clearInterval(progressInterval.current);
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);

    if (track.audioUrl && audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().catch(() => {});
    } else {
      // Demo mode: simulate playback progress
      clearInterval(progressInterval.current);
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 150);
    }
  };

  useEffect(() => {
    return () => clearInterval(progressInterval.current);
  }, []);

  return (
    <div style={{
      border: "1px solid rgba(226,54,54,0.12)",
      background: "rgba(226,54,54,0.02)",
      backdropFilter: "blur(20px)",
      overflow: "hidden",
      animation: "fadeUp 0.6s ease 0.3s both",
    }}>
      <audio ref={audioRef} />

      {/* Player header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: isPlaying ? "#E23636" : "#333",
            boxShadow: isPlaying ? "0 0 12px rgba(226,54,54,0.6)" : "none",
            transition: "all 0.3s",
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: 3,
            color: isPlaying ? "#E23636" : "#555",
          }}>
            {isPlaying ? "NOW PLAYING" : "PREVIEW TRACKS"}
          </span>
        </div>
        <Equalizer playing={isPlaying} />
      </div>

      {/* Track list */}
      {PLAYER_TRACKS.map((track, i) => {
        const active = currentTrack?.id === track.id;
        return (
          <div key={track.id} onClick={() => playTrack(track)} style={{
            display: "grid", gridTemplateColumns: "32px 1fr auto",
            gap: 14, alignItems: "center",
            padding: "14px 20px",
            borderBottom: i < PLAYER_TRACKS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
            background: active ? "rgba(226,54,54,0.06)" : "transparent",
            cursor: "pointer",
            transition: "background 0.2s",
          }}>
            {/* Play/Pause icon */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `1px solid ${active ? "#E23636" : "#2a2a2a"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.25s",
              position: "relative",
            }}>
              {active && isPlaying && (
                <div style={{
                  position: "absolute", inset: -4, borderRadius: "50%",
                  border: "1px solid rgba(226,54,54,0.3)",
                  animation: "pulseRing 1.5s ease-out infinite",
                }} />
              )}
              <span style={{
                fontFamily: "JetBrains Mono", fontSize: 10,
                color: active ? "#E23636" : "#555",
                marginLeft: active && isPlaying ? 0 : 2,
              }}>
                {active && isPlaying ? "❚❚" : "▶"}
              </span>
            </div>

            {/* Track info */}
            <div>
              <div style={{
                fontFamily: "'Dela Gothic One'", fontSize: 14, letterSpacing: 1,
                color: active ? "#E23636" : "#ccc",
                transition: "color 0.2s",
              }}>{track.title}</div>
              {active && isPlaying && (
                <div style={{
                  marginTop: 6, height: 2, background: "#1a1a1a",
                  borderRadius: 1, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", background: "#E23636",
                    width: `${progress}%`, transition: "width 0.15s linear",
                    animation: "progressPulse 2s ease-in-out infinite",
                  }} />
                </div>
              )}
            </div>

            {/* Duration */}
            <span style={{
              fontFamily: "'JetBrains Mono'", fontSize: 11, color: "#333",
            }}>{track.duration}</span>
          </div>
        );
      })}
    </div>
  );
}

function LinkButton({ name, url, icon, color, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={url} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 12, padding: "18px 24px",
        border: hover ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.06)",
        background: hover ? `${color}08` : "rgba(255,255,255,0.015)",
        textDecoration: "none",
        transition: "all 0.3s ease",
        animation: `fadeUp 0.5s ease ${delay}s both`,
        position: "relative",
        overflow: "hidden",
      }}>
      {hover && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: 3, background: color,
        }} />
      )}
      {icon && (
        <span style={{
          fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 700,
          color: hover ? color : "#555", letterSpacing: 2,
          transition: "color 0.3s", minWidth: 28,
        }}>{icon}</span>
      )}
      <span style={{
        fontFamily: "'Dela Gothic One'", fontSize: 15, letterSpacing: 3,
        color: hover ? "#f0f0f0" : "#aaa",
        transition: "color 0.3s",
      }}>{name.toUpperCase()}</span>
    </a>
  );
}

function EmailPopup({ onClose }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    // TODO: Connect to ConvertKit, Mailchimp, etc.
    console.log("New subscriber:", email);
    setDone(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
      animation: "fadeIn 0.4s ease",
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
      }} />

      {/* Modal */}
      <div style={{
        position: "relative",
        width: "100%", maxWidth: 420,
        background: "linear-gradient(180deg, #0e0e0e 0%, #0a0808 100%)",
        border: "1px solid rgba(226,54,54,0.2)",
        padding: "48px 36px",
        textAlign: "center",
        animation: "slideDown 0.5s ease",
        boxShadow: "0 0 80px rgba(226,54,54,0.08), 0 40px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none",
          color: "#333", fontSize: 18, cursor: "pointer",
          fontFamily: "'JetBrains Mono'",
          transition: "color 0.2s",
        }}>✕</button>

        <Crown size={44} />

        <h2 style={{
          fontFamily: "'Dela Gothic One'", fontSize: 24,
          color: "#E0E0E0", marginTop: 16, marginBottom: 8, letterSpacing: 2,
        }}>JOIN THE INNER CIRCLE</h2>

        <p style={{
          fontFamily: "'JetBrains Mono'", fontSize: 11,
          color: "#555", letterSpacing: 1, lineHeight: 1.6,
          marginBottom: 28, maxWidth: 300, margin: "0 auto 28px",
        }}>
          Get unreleased tracks, first access to new drops, and exclusive content. Direct from AI KING.
        </p>

        {!done ? (
          <>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="YOUR@EMAIL.COM"
              type="email"
              autoFocus
              style={{
                width: "100%", padding: "16px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#E0E0E0", fontSize: 13, letterSpacing: 2,
                fontFamily: "'JetBrains Mono'", outline: "none",
                marginBottom: 12,
                transition: "border-color 0.3s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(226,54,54,0.3)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <button onClick={handleSubmit} style={{
              width: "100%", padding: "16px 0",
              background: "#E23636", border: "none",
              fontFamily: "'Dela Gothic One'", fontSize: 15,
              letterSpacing: 4, color: "#0A0A0A", cursor: "pointer",
              transition: "opacity 0.2s",
            }}>JOIN NOW</button>
            <button onClick={onClose} style={{
              background: "none", border: "none",
              fontFamily: "'JetBrains Mono'", fontSize: 10,
              letterSpacing: 2, color: "#333", cursor: "pointer",
              marginTop: 16, display: "block", margin: "16px auto 0",
            }}>MAYBE LATER</button>
          </>
        ) : (
          <div style={{
            padding: 20,
            border: "1px solid rgba(226,54,54,0.3)",
            animation: "fadeUp 0.3s ease",
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>👑</div>
            <p style={{
              fontFamily: "'JetBrains Mono'", fontSize: 12,
              letterSpacing: 2, color: "#E23636",
            }}>YOU'RE IN THE CIRCLE</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================
// MAIN APP
// =============================================

export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  // Show email popup after 2 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("aiking_popup_dismissed");
      if (!dismissed) {
        setShowPopup(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismissPopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
    sessionStorage.setItem("aiking_popup_dismissed", "true");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #060606 0%, #080606 50%, #060606 100%)",
      color: "#E0E0E0",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <style>{fonts}{keyframes}</style>

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998, opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        animation: "grain 0.4s steps(3) infinite",
      }} />

      {/* Ambient glow - top */}
      <div style={{
        position: "fixed", top: "-25%", left: "50%", transform: "translateX(-50%)",
        width: "80%", height: "50%",
        background: "radial-gradient(ellipse, rgba(226,54,54,0.06) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Ambient glow - bottom */}
      <div style={{
        position: "fixed", bottom: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "60%", height: "40%",
        background: "radial-gradient(ellipse, rgba(226,54,54,0.03) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Email popup */}
      {showPopup && <EmailPopup onClose={dismissPopup} />}

      {/* Main content */}
      <div style={{
        width: "100%", maxWidth: 460,
        padding: "60px 24px 40px",
        display: "flex", flexDirection: "column", gap: 0,
      }}>

        {/* Header / Identity */}
        <div style={{
          textAlign: "center",
          marginBottom: 40,
          animation: "fadeUp 0.6s ease",
        }}>
          <Crown size={52} />
          <h1 style={{
            fontFamily: "'Dela Gothic One'",
            fontSize: "clamp(36px, 10vw, 52px)",
            letterSpacing: 4,
            color: "#E0E0E0",
            marginTop: 12,
            animation: "glow 4s ease-in-out infinite",
            lineHeight: 1,
          }}>AI KING</h1>
          <p style={{
            fontFamily: "'JetBrains Mono'", fontSize: 10,
            letterSpacing: 4, color: "#3a3a3a", marginTop: 10,
            lineHeight: 1.6,
          }}>{CONFIG.tagline}</p>
        </div>

        {/* Music Player */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono'", fontSize: 9,
              letterSpacing: 3, color: "#E23636",
            }}>MUSIC</span>
            <div style={{ flex: 1, height: 1, background: "rgba(226,54,54,0.1)" }} />
          </div>
          <MusicPlayer />
        </div>

        {/* Social Links */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono'", fontSize: 9,
              letterSpacing: 3, color: "#555",
            }}>CONNECT</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {SOCIALS.map((s, i) => (
              <LinkButton key={s.name} {...s} delay={0.1 + i * 0.06} />
            ))}
          </div>
        </div>

        {/* Streaming Links */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono'", fontSize: 9,
              letterSpacing: 3, color: "#555",
            }}>STREAM</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {STREAMING.map((s, i) => (
              <LinkButton key={s.name} name={s.name} url={s.url} color="#E23636" delay={0.4 + i * 0.06} />
            ))}
          </div>
        </div>

        {/* Buy Music Link (when Stripe is ready) */}
        {STRIPE_LINK && (
          <div style={{ marginBottom: 28 }}>
            <a href={STRIPE_LINK} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, padding: "20px 24px",
              background: "#E23636",
              textDecoration: "none",
              animation: "fadeUp 0.5s ease 0.8s both",
              transition: "opacity 0.2s",
            }}>
              <span style={{
                fontFamily: "'Dela Gothic One'", fontSize: 16,
                letterSpacing: 4, color: "#0A0A0A",
              }}>BUY MUSIC DIRECT</span>
            </a>
          </div>
        )}

        {/* Email signup (inline, in case they closed the popup) */}
        {popupDismissed && (
          <InlineEmailSignup />
        )}

        {/* Footer */}
        <footer style={{
          textAlign: "center", padding: "40px 0 20px",
          borderTop: "1px solid rgba(255,255,255,0.03)",
          marginTop: 20,
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono'", fontSize: 9,
            letterSpacing: 3, color: "#1a1a1a",
          }}>© 2026 AI KING — ALL RIGHTS RESERVED</p>
          <p style={{
            fontFamily: "'JetBrains Mono'", fontSize: 8,
            letterSpacing: 2, color: "#111", marginTop: 6,
          }}>OFFICIALAIKING.COM</p>
        </footer>
      </div>
    </div>
  );
}

function InlineEmailSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div style={{
      border: "1px solid rgba(226,54,54,0.1)",
      padding: "28px 20px",
      textAlign: "center",
      marginBottom: 20,
      animation: "fadeUp 0.5s ease",
    }}>
      <Crown size={28} />
      <p style={{
        fontFamily: "'Dela Gothic One'", fontSize: 14,
        color: "#ccc", letterSpacing: 2, marginTop: 8, marginBottom: 6,
      }}>THE INNER CIRCLE</p>
      <p style={{
        fontFamily: "'JetBrains Mono'", fontSize: 10,
        color: "#444", letterSpacing: 1, marginBottom: 16,
      }}>Exclusive drops. Direct from AI KING.</p>
      {!done ? (
        <div style={{ display: "flex", maxWidth: 360, margin: "0 auto" }}>
          <input value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && email && (console.log("Sub:", email), setDone(true))}
            placeholder="YOUR@EMAIL.COM" type="email"
            style={{
              flex: 1, padding: "14px 16px", background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)", borderRight: "none",
              color: "#E0E0E0", fontSize: 11, letterSpacing: 2,
              fontFamily: "'JetBrains Mono'", outline: "none",
            }} />
          <button onClick={() => email && (console.log("Sub:", email), setDone(true))} style={{
            padding: "14px 24px", background: "#E23636", border: "1px solid #E23636",
            color: "#0A0A0A", fontSize: 11, fontWeight: 700, letterSpacing: 3,
            fontFamily: "'JetBrains Mono'", cursor: "pointer",
          }}>JOIN</button>
        </div>
      ) : (
        <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: 2, color: "#E23636" }}>
          ✓ YOU'RE IN THE CIRCLE
        </p>
      )}
    </div>
  );
}
