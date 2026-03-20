import React, { useState, useRef, useEffect } from "react";
import { User, Code, LogOut, Trophy, List, LayoutList, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import leetlabLogo from "../image/leetlab.png";
import LeaderboardPage from "../page/LeaderboardPage";
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

    .lln-bar::before {
      content: '';
      position: absolute;
      top: -1px; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent 0%, var(--green) 50%, transparent 100%);
      opacity: .4;
    }

    .lln-logo {
      display: flex;
      align-items: center;
      gap: .6rem;
      text-decoration: none;
      flex-shrink: 0;
    }

    .lln-logo-img {
      width: 32px;
      height: 32px;
      border: 1px solid var(--border);
    }

    .lln-logo-text {
      font-family: var(--sans);
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--green);
      display: none;
    }

    @media(min-width:640px){
      .lln-logo-text { display: block; }
    }

    .lln-links {
      display: none;
      align-items: center;
      gap: .25rem;
    }

    @media(min-width:768px){
      .lln-links { display: flex; }
    }

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
      transition: all .2s;
    }

    .lln-link:hover {
      color: var(--green);
      border-color: var(--border);
      background: rgba(0,255,136,.05);
      box-shadow: 0 0 10px rgba(0,255,136,.15);
    }

    .lln-right {
      display: flex;
      align-items: center;
      gap: .6rem;
    }

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
    }

    .lln-btn-outline:hover {
      border-color: var(--green);
      background: rgba(0,255,136,.06);
    }

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
    }

    .lln-btn-solid:hover {
      background: #fff;
    }

    .lln-avatar-wrap { position: relative; }

    .lln-avatar-btn {
      display: flex;
      align-items: center;
      gap: .5rem;
      background: none;
      border: 1px solid var(--border);
      padding: .3rem .6rem .3rem .3rem;
      cursor: pointer;
      color: rgba(224,255,232,.6);
    }

    .lln-avatar-btn:hover {
      border-color: var(--green);
      color: var(--green);
    }

    .lln-avatar-circle {
      width: 28px;
      height: 28px;
      background: var(--green);
      color: #050a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--sans);
      font-weight: 800;
      font-size: .85rem;
    }

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
      transition: color .2s, background .2s;
    }

    .lln-drop-item:hover {
      color: var(--green);
      background: rgba(0,255,136,.05);
    }

    .lln-drop-item.danger:hover {
      color: #ff3e5e;
    }

  `}</style>
);

/* ─── Navbar Component ───────────────────────────────────────────────────── */
const Navbar = () => {
  const { authUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="lln-root">
      <Styles />

      <div className="lln-bar">

        {/* Logo */}
        <Link to="/" className="lln-logo">
          <img src={leetlabLogo} alt="LeetLab" className="lln-logo-img" />
          <span className="lln-logo-text">LeetLab</span>
        </Link>

        {/* Center Navigation */}
        <div className="lln-links">

          <Link to="/leaderboard" className="lln-link">
            <Trophy size={13} /> Leaderboard
          </Link>

          {authUser && (
            <>
              <Link to="/problems" className="lln-link">
                <LayoutList size={13} /> Problems
              </Link>

              <Link to="/playlists" className="lln-link">
                <List size={13} /> Playlists
              </Link>
            </>
          )}

        </div>

        {/* Right Section */}
        <div className="lln-right">

          {!authUser ? (
            <>
              <Link to="/login" className="lln-btn-outline">Login</Link>
              <Link to="/signup" className="lln-btn-solid">Sign Up</Link>
            </>
          ) : (

            <div className="lln-avatar-wrap" ref={dropRef}>

              <button
                className="lln-avatar-btn"
                onClick={() => setOpen(!open)}
              >

                <div className="lln-avatar-circle">
                  {authUser?.name?.charAt(0).toUpperCase()}
                </div>

                <ChevronDown size={12} />

              </button>

              {open && (
                <div className="lln-dropdown">

                  <Link to="/profile" className="lln-drop-item">
                    <User size={13} /> Profile
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