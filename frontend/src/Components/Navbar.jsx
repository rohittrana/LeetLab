import React, { useState, useRef, useEffect } from "react";
import { User, Code, LogOut, Trophy, List, LayoutList, Terminal, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import leetlabLogo from "../image/leetlab.png";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .lln-root {
      --green:  #00ff88;
      --green2: #00cc6a;
      --bg:     #050a0a;
      --border: rgba(0,255,136,0.13);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      position: sticky;
      top: 0;
      z-index: 100;
      padding: .75rem 1.25rem;
      font-family: var(--mono);
    }

    .lln-bar {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      background: rgba(5,10,10,.88);
      backdrop-filter: blur(14px);
      border: 1px solid var(--border);
      padding: .7rem 1.25rem;
      position: relative;
    }

    /* top shimmer line */
    .lln-bar::before {
      content: '';
      position: absolute;
      top: -1px; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent 0%, var(--green) 50%, transparent 100%);
      opacity: .4;
      pointer-events: none;
    }

    /* ── logo ── */
    .lln-logo {
      display: flex;
      align-items: center;
      gap: .6rem;
      text-decoration: none;
      flex-shrink: 0;
    }
    .lln-logo-img {
      width: 32px; height: 32px;
      border: 1px solid var(--border);
      object-fit: cover;
    }
    .lln-logo-text {
      font-family: var(--sans);
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--green);
      letter-spacing: -.01em;
      display: none;
    }
    @media(min-width:640px){ .lln-logo-text { display: block; } }

    /* ── center nav links ── */
    .lln-links {
      display: none;
      align-items: center;
      gap: .25rem;
    }
    @media(min-width:768px){ .lln-links { display: flex; } }

    .lln-link {
      display: flex;
      align-items: center;
      gap: .4rem;
      padding: .42rem .85rem;
      font-size: .72rem;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: rgba(224,255,232,.45);
      text-decoration: none;
      border: 1px solid transparent;
      transition: color .2s, border-color .2s, background .2s;
      position: relative;
    }
    .lln-link:hover {
      color: var(--green);
      border-color: var(--border);
      background: rgba(0,255,136,.04);
    }
    .lln-link.active {
      color: var(--green);
      border-color: var(--border);
    }

    /* ── right section ── */
    .lln-right { display: flex; align-items: center; gap: .6rem; flex-shrink: 0; }

    .lln-btn-outline {
      font-family: var(--mono);
      font-size: .72rem;
      letter-spacing: .12em;
      text-transform: uppercase;
      padding: .42rem 1rem;
      border: 1px solid var(--border);
      color: var(--green);
      background: transparent;
      text-decoration: none;
      transition: border-color .2s, background .2s;
    }
    .lln-btn-outline:hover { border-color: var(--green); background: rgba(0,255,136,.06); }

    .lln-btn-solid {
      font-family: var(--mono);
      font-size: .72rem;
      letter-spacing: .12em;
      text-transform: uppercase;
      padding: .42rem 1rem;
      border: none;
      background: var(--green);
      color: #050a0a;
      font-weight: 700;
      text-decoration: none;
      transition: background .2s, transform .15s;
    }
    .lln-btn-solid:hover { background: #fff; transform: translateY(-1px); }

    /* ── avatar + dropdown ── */
    .lln-avatar-wrap { position: relative; }

    .lln-avatar-btn {
      display: flex;
      align-items: center;
      gap: .5rem;
      background: none;
      border: 1px solid var(--border);
      padding: .3rem .6rem .3rem .3rem;
      cursor: pointer;
      transition: border-color .2s;
      color: rgba(224,255,232,.6);
      font-family: var(--mono);
      font-size: .7rem;
      letter-spacing: .1em;
    }
    .lln-avatar-btn:hover { border-color: var(--green); color: var(--green); }

    .lln-avatar-circle {
      width: 28px; height: 28px;
      background: var(--green);
      color: #050a0a;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--sans);
      font-weight: 800;
      font-size: .85rem;
      flex-shrink: 0;
    }

    /* dropdown panel */
    .lln-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 200px;
      background: rgba(5,10,10,.97);
      border: 1px solid var(--border);
      backdrop-filter: blur(16px);
      padding: .5rem;
      z-index: 200;
      animation: lln-dropIn .15s ease both;
    }
    @keyframes lln-dropIn {
      from { opacity:0; transform:translateY(-6px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .lln-drop-header {
      padding: .6rem .75rem .5rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: .35rem;
    }
    .lln-drop-name {
      font-family: var(--sans);
      font-size: .85rem;
      font-weight: 700;
      color: #e0ffe8;
    }
    .lln-drop-tag {
      font-size: .6rem;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--green2);
      opacity: .6;
    }

    .lln-drop-item {
      display: flex;
      align-items: center;
      gap: .6rem;
      width: 100%;
      padding: .55rem .75rem;
      font-size: .72rem;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: rgba(224,255,232,.45);
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--mono);
      transition: color .2s, background .2s;
      text-align: left;
    }
    .lln-drop-item:hover { color: var(--green); background: rgba(0,255,136,.05); }
    .lln-drop-item.danger:hover { color: #ff3e5e; background: rgba(255,62,94,.05); }

    @keyframes lln-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .lln-status-dot {
      width: 5px; height: 5px;
      background: var(--green);
      border-radius: 50%;
      animation: lln-blink 1.4s step-end infinite;
      flex-shrink: 0;
    }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const Navbar = () => {
  const { authUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="lln-root">
      <Styles />
      <div className="lln-bar">

        {/* ── Logo ── */}
        <Link to="/" className="lln-logo">
          <img src={leetlabLogo} alt="LeetLab" className="lln-logo-img" />
          <span className="lln-logo-text">LeetLab</span>
        </Link>

        {/* ── Center links ── */}
        {authUser && (
          <div className="lln-links">
            <Link to="/problems" className="lln-link">
              <LayoutList size={13} /> Problems
            </Link>
            <Link to="/playlists" className="lln-link">
              <List size={13} /> Playlists
            </Link>
            <Link to="/leaderboard" className="lln-link">
              <Trophy size={13} /> Leaderboard
            </Link>
          </div>
        )}

        {/* ── Right ── */}
        <div className="lln-right">
          {!authUser ? (
            <>
              <Link to="/login"  className="lln-btn-outline">Login</Link>
              <Link to="/signup" className="lln-btn-solid">Sign Up</Link>
            </>
          ) : (
            <div className="lln-avatar-wrap" ref={dropRef}>
              <button className="lln-avatar-btn" onClick={() => setOpen((v) => !v)}>
                <span className="lln-status-dot" />
                <div className="lln-avatar-circle">
                  {authUser?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ display: "none" }} className="md-show">{authUser?.name?.split(" ")[0]}</span>
                <ChevronDown size={12} style={{ opacity: .5, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>

              {open && (
                <div className="lln-dropdown" onClick={() => setOpen(false)}>
                  <div className="lln-drop-header">
                    <div className="lln-drop-name">{authUser?.name}</div>
                    <div className="lln-drop-tag">
                      {authUser?.role === "ADMIN" ? "// admin" : "// user"}
                    </div>
                  </div>

                  <Link to="/profile" className="lln-drop-item">
                    <User size={13} /> My Profile
                  </Link>

                  {authUser?.role === "ADMIN" && (
                    <Link to="/add-problem" className="lln-drop-item">
                      <Code size={13} /> Add Problem
                    </Link>
                  )}

                  <LogoutButton className="lln-drop-item danger">
                    <LogOut size={13} /> Logout
                  </LogoutButton>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;