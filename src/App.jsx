import { useState } from "react";

/*
  ========================================
  AI KING — CONFIGURATION
  ========================================
  Update these values with your real info:
*/

// STRIPE: Create Payment Links in your Stripe Dashboard for each track
// Go to: dashboard.stripe.com → Payment Links → Create
// Set the price, name, and copy the link here
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

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;600&display=swap');`;
const keyframes = `
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes glow{0%,100%{text-shadow:0 0 20px rgba(226,54,54,.3)}50%{text-shadow:0 0 40px rgba(226,54,54,.6),0 0 80px rgba(226,54,54,.2)}}
@keyframes grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-2%,-1%)}40%{transform:translate(1%,2%)}60%{transform:translate(-1%,1%)}80%{transform:translate(2%,-1%)}}
@keyframes crownFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(2deg)}}
a:hover{color:#E23636 !important;border-color:rgba(226,54,54,0.3) !important}
button:hover{opacity:0.9}
::selection{background:rgba(226,54,54,0.3);color:#fff}
`;

function Crown({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ animation: "crownFloat 3s ease-in-out infinite" }}>
      <path d="M8 48L4 20L18 32L32 12L46 32L60 20L56 48H8Z" fill="#E23636" opacity="0.9"/>
      <path d="M8 48H56V54H8V48Z" fill="#E23636"/>
      <circle cx="4" cy="20" r="3" fill="#FFD700"/>
      <circle cx="32" cy="12" r="3" fill="#FFD700"/>
      <circle cx="60" cy="20" r="3" fill="#FFD700"/>
    </svg>
  );
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
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: hover ? "rgba(226,54,54,0.04)" : "transparent",
        transition: "background 0.25s",
        animation: `slideR 0.5s ease ${index * 0.08}s both`,
      }}>
      <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: "#333", letterSpacing: 1 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div style={{ fontFamily: "Bebas Neue", fontSize: 21, letterSpacing: 3, color: "#E0E0E0" }}>
        {track.title}
      </div>
      <span style={{
        fontFamily: "JetBrains Mono", fontSize: 10, fontWeight: 700, letterSpacing: 3,
        color: available ? "#E23636" : "#444",
        animation: !available ? "pulse 2.5s ease-in-out infinite" : "none",
      }}>{track.status}</span>
      {track.price ? (
        <button onClick={handleBuy} style={{
          background: hover ? "#E23636" : "transparent",
          border: "1px solid #E23636", color: hover ? "#0A0A0A" : "#E23636",
          padding: "8px 20px", fontSize: 11, fontWeight: 700, letterSpacing: 2,
          fontFamily: "JetBrains Mono", cursor: "pointer", transition: "all 0.25s",
        }}>BUY ${track.price.toFixed(2)}</button>
      ) : (
        <span style={{
          fontFamily: "JetBrains Mono", fontSize: 10, color: "#333", letterSpacing: 1,
          padding: "8px 16px", border: "1px solid #1a1a1a",
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
    // For now, logs to console — replace with your API call
    console.log("New subscriber:", email);
    setDone(true);
  };

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", textAlign: "center" }}>
      <Crown size={40} />
      <h3 style={{ fontFamily: "Bebas Neue", fontSize: 30, letterSpacing: 6, color: "#E0E0E0", marginBottom: 6, marginTop: 12 }}>
        THE INNER CIRCLE
      </h3>
      <p style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#555", letterSpacing: 1, marginBottom: 28 }}>
        Unreleased tracks. First access drops. Direct from AI KING.
      </p>
      {!done ? (
        <div style={{ display: "flex", maxWidth: 480, margin: "0 auto" }}>
          <input value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="YOUR@EMAIL.COM"
            type="email"
            style={{
              flex: 1, padding: "16px 20px", background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)", borderRight: "none",
              color: "#E0E0E0", fontSize: 12, letterSpacing: 2,
              fontFamily: "JetBrains Mono", outline: "none",
            }} />
          <button onClick={handleSubmit} style={{
            padding: "16px 32px", background: "#E23636", border: "1px solid #E23636",
            color: "#0A0A0A", fontSize: 12, fontWeight: 700, letterSpacing: 3,
            fontFamily: "JetBrains Mono", cursor: "pointer",
          }}>JOIN</button>
        </div>
      ) : (
        <div style={{ padding: 18, border: "1px solid #E23636", fontFamily: "JetBrains Mono", fontSize: 12, letterSpacing: 2, color: "#E23636" }}>
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
      background: "linear-gradient(180deg, #0A0A0A 0%, #070707 40%, #0C0808 100%)",
      color: "#E0E0E0", fontFamily: "Inter, sans-serif", position: "relative",
    }}>
      <style>{fonts}{keyframes}</style>

      {/* Film grain overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        animation: "grain 0.4s steps(3) infinite",
      }} />

      {/* Ambient red glow */}
      <div style={{
        position: "fixed", top: "-20%", right: "-10%",
        width: "45%", height: "50%",
        background: "radial-gradient(circle, rgba(226,54,54,0.04) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* ===== NAVIGATION ===== */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 36px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,10,0.88)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}>
        <div onClick={() => setSection("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <Crown size={24} />
          <span style={{ fontFamily: "Bebas Neue", fontSize: 26, letterSpacing: 8, color: "#E23636" }}>AI KING</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["MUSIC", "ABOUT", "LINKS"].map(s => (
            <span key={s} onClick={() => setSection(s.toLowerCase())} style={{
              fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 3,
              color: section === s.toLowerCase() ? "#E23636" : "#555",
              cursor: "pointer", transition: "color 0.2s",
            }}>{s}</span>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px" }}>

        {/* ===== HERO ===== */}
        {section === "home" && (
          <div style={{ textAlign: "center", padding: "90px 0 70px", animation: "fadeUp 0.8s ease" }}>
            <div style={{ marginBottom: 16 }}><Crown size={56} /></div>
            <h1 style={{
              fontFamily: "Bebas Neue", fontSize: "clamp(56px, 11vw, 110px)",
              letterSpacing: "0.18em", lineHeight: 0.92, color: "#E0E0E0",
              animation: "glow 4s ease-in-out infinite", marginBottom: 16,
            }}>AI KING</h1>
            <p style={{
              fontFamily: "JetBrains Mono", fontSize: 11, letterSpacing: 5,
              color: "#444", maxWidth: 460, margin: "0 auto",
            }}>INDEPENDENT HIP-HOP. UNFILTERED. DIRECT TO YOU.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
              <button onClick={() => setSection("music")} style={{
                padding: "14px 36px", background: "#E23636", border: "none",
                fontFamily: "Bebas Neue", fontSize: 17, letterSpacing: 5, color: "#0A0A0A", cursor: "pointer",
              }}>HEAR THE MUSIC</button>
              <button onClick={() => setSection("links")} style={{
                padding: "14px 36px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "Bebas Neue", fontSize: 17, letterSpacing: 5, color: "#666", cursor: "pointer",
              }}>ALL LINKS</button>
            </div>
            <div style={{ display: "flex", gap: 18, justifyContent: "center", marginTop: 44, flexWrap: "wrap" }}>
              {SOCIALS.map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{
                  fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 700,
                  letterSpacing: 3, color: "#3a3a3a", textDecoration: "none",
                  padding: "8px 14px", border: "1px solid #1a1a1a", transition: "all 0.25s",
                }}>{s.abbr}</a>
              ))}
            </div>
          </div>
        )}

        {/* ===== MUSIC / CATALOG ===== */}
        {(section === "home" || section === "music") && (
          <div style={{ paddingBottom: 70 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: 34, letterSpacing: 6, color: "#E0E0E0", margin: 0 }}>CATALOG</h2>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 2, color: "#333" }}>VIA TUNECORE</span>
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
              {TRACKS.map((t, i) => <TrackRow key={t.id} track={t} index={i} />)}
            </div>
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <p style={{ fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 3, color: "#2a2a2a", marginBottom: 14 }}>
                STREAM EVERYWHERE
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {STREAMING.map(s => (
                  <a key={s.name} href={s.url} style={{
                    fontFamily: "JetBrains Mono", fontSize: 10, letterSpacing: 2,
                    color: "#3a3a3a", textDecoration: "none", padding: "6px 12px",
                    border: "1px solid #151515", transition: "all 0.2s",
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
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: 42, letterSpacing: 6, color: "#E0E0E0", margin: 0 }}>THE STORY</h2>
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 15, lineHeight: 2, color: "#777", maxWidth: 620, fontWeight: 300 }}>
              <p>[Your story goes here. Who is AI KING? Where did the name come from? What drives your music? Talk about your sound, your city, your vision. Keep it raw and authentic — fans connect with the real.]</p>
              <p style={{ marginTop: 20 }}>[What's coming next — the upcoming drops, collaborations, the bigger picture. Give people a reason to follow the journey from day one.]</p>
            </div>
            <div style={{
              marginTop: 44, padding: 24, border: "1px solid rgba(226,54,54,0.1)",
              background: "rgba(226,54,54,0.02)", display: "flex", gap: 40, flexWrap: "wrap",
            }}>
              {[
                ["DISTRIBUTION", "TuneCore"],
                ["BOOKING", "DM on Instagram"],
                ["MANAGEMENT", "Self-managed"],
              ].map(([label, val]) => (
                <div key={label}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, color: "#E23636" }}>{label}</span>
                  <p style={{ fontFamily: "Inter", fontSize: 13, color: "#888", margin: "4px 0 0" }}>{val}</p>
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
              <h2 style={{ fontFamily: "Bebas Neue", fontSize: 36, letterSpacing: 6, color: "#E0E0E0", marginTop: 10 }}>ALL LINKS</h2>
            </div>
            {[
              ...SOCIALS,
              ...STREAMING.map(s => ({ name: s.name, url: s.url })),
            ].map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{
                display: "block", padding: "16px 24px", marginBottom: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
                textDecoration: "none", textAlign: "center",
                fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: 4, color: "#ccc",
                transition: "all 0.25s",
              }}>{link.name.toUpperCase()}</a>
            ))}
          </div>
        )}

        {/* ===== EMAIL SIGNUP ===== */}
        <div style={{ padding: "60px 0 80px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <EmailSignup />
        </div>

        {/* ===== FOOTER ===== */}
        <footer style={{ textAlign: "center", padding: "36px 0", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          <p style={{ fontFamily: "JetBrains Mono", fontSize: 9, letterSpacing: 3, color: "#1a1a1a" }}>
            © 2026 AI KING — ALL RIGHTS RESERVED — POWERED BY INDEPENDENCE
          </p>
        </footer>
      </div>
    </div>
  );
}
