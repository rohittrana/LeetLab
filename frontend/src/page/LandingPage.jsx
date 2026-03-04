import React, { useEffect, useRef } from "react";
import { Code2, Zap, Shield, Database, ArrowRight, Terminal } from "lucide-react";

/* ─── Google Fonts ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green:   #00ff88;
      --green2:  #00cc6a;
      --cyan:    #00e5ff;
      --red:     #ff3e5e;
      --yellow:  #ffd600;
      --bg:      #050a0a;
      --bg2:     #0a1010;
      --bg3:     #0d1818;
      --border:  rgba(0,255,136,0.18);
      --mono:    'Share Tech Mono', monospace;
      --sans:    'Syne', sans-serif;
    }

    body { background: var(--bg); color: #e0ffe8; font-family: var(--mono); }

    /* scanline overlay */
    body::before {
      content: '';
      position: fixed; inset: 0; z-index: 9999; pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.06) 2px,
        rgba(0,0,0,0.06) 4px
      );
    }

    /* noise grain */
    body::after {
      content: '';
      position: fixed; inset: 0; z-index: 9998; pointer-events: none; opacity: .035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes glitch  {
      0%,100%{transform:translate(0)} 20%{transform:translate(-2px,1px)}
      40%{transform:translate(2px,-1px)} 60%{transform:translate(-1px,2px)}
      80%{transform:translate(1px,-2px)}
    }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,.35)} 50%{box-shadow:0 0 0 14px rgba(0,255,136,0)} }
    @keyframes scanH   { from{top:-100%} to{top:100%} }
    @keyframes typing  { from{width:0} to{width:100%} }

    .fade-up      { animation: fadeUp .7s ease both; }
    .fade-up-1    { animation: fadeUp .7s .1s ease both; }
    .fade-up-2    { animation: fadeUp .7s .22s ease both; }
    .fade-up-3    { animation: fadeUp .7s .34s ease both; }
    .fade-up-4    { animation: fadeUp .7s .46s ease both; }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; padding: 7rem 1.5rem 5rem;
      position: relative; overflow: hidden;
    }
    .hero-grid {
      position: absolute; inset: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(0,255,136,.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,136,.06) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
    }
    .hero-glow {
      position: absolute; width: 600px; height: 600px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,255,136,.12) 0%, transparent 70%);
      top: 50%; left: 50%; transform: translate(-50%,-50%);
      pointer-events: none;
    }
    .tag-line {
      font-family: var(--mono);
      font-size: .75rem; letter-spacing: .25em; text-transform: uppercase;
      color: var(--green); border: 1px solid var(--border);
      padding: .35rem 1rem; border-radius: 2px; margin-bottom: 2rem;
      display: inline-flex; align-items: center; gap: .5rem;
    }
    .cursor { display:inline-block; animation: blink 1s step-end infinite; color: var(--green); }
    .hero h1 {
      font-family: var(--sans); font-size: clamp(2.8rem, 7vw, 6rem);
      font-weight: 800; line-height: 1.05; letter-spacing: -.02em;
      margin-bottom: 1.5rem;
    }
    .hero h1 .brand {
      color: var(--green);
      text-shadow: 0 0 40px rgba(0,255,136,.6), 0 0 80px rgba(0,255,136,.25);
      display: inline-block;
      animation: glitch 8s ease infinite;
    }
    .hero p {
      color: #7db897; max-width: 580px; font-size: 1rem; line-height: 1.75;
      margin-bottom: 2.5rem;
    }
    .btn-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .btn-primary-x {
      display: inline-flex; align-items: center; gap: .5rem;
      background: var(--green); color: #050a0a;
      font-family: var(--mono); font-size: .875rem; font-weight: 700; letter-spacing: .08em;
      padding: .8rem 1.8rem; border: none; cursor: pointer; border-radius: 2px;
      text-decoration: none; transition: all .2s;
      animation: pulse 3s ease infinite;
    }
    .btn-primary-x:hover { background: #fff; box-shadow: 0 0 30px rgba(0,255,136,.5); transform: translateY(-2px); }
    .btn-outline-x {
      display: inline-flex; align-items: center; gap: .5rem;
      background: transparent; color: var(--green);
      font-family: var(--mono); font-size: .875rem; letter-spacing: .08em;
      padding: .8rem 1.8rem; border: 1px solid var(--border); cursor: pointer; border-radius: 2px;
      text-decoration: none; transition: all .2s;
    }
    .btn-outline-x:hover { border-color: var(--green); background: rgba(0,255,136,.07); transform: translateY(-2px); }

    /* ── TERMINAL MARQUEE ── */
    .marquee-wrap {
      overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
      background: rgba(0,255,136,.03); padding: .6rem 0;
    }
    .marquee-track {
      display: flex; gap: 3rem; white-space: nowrap;
      animation: marqueeScroll 22s linear infinite;
    }
    @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .marquee-item {
      font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: var(--green2);
      display: inline-flex; align-items: center; gap: .4rem;
    }
    .marquee-dot { width: 4px; height: 4px; background: var(--green); border-radius: 50%; }

    /* ── FEATURES ── */
    .features {
      padding: 6rem 1.5rem; background: var(--bg2);
      position: relative;
    }
    .section-label {
      font-size: .7rem; letter-spacing: .3em; text-transform: uppercase; color: var(--green);
      margin-bottom: .75rem; display: block;
    }
    .section-title {
      font-family: var(--sans); font-size: clamp(1.8rem, 4vw, 2.8rem);
      font-weight: 800; margin-bottom: 3.5rem; line-height: 1.1;
    }
    .features-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5px; max-width: 1100px; margin: 0 auto;
      border: 1px solid var(--border); background: var(--border);
    }
    .feat-card {
      background: var(--bg2); padding: 2.5rem 2rem;
      position: relative; overflow: hidden; transition: background .25s;
    }
    .feat-card::before {
      content: attr(data-num);
      position: absolute; top: 1.2rem; right: 1.5rem;
      font-size: .65rem; letter-spacing: .15em; color: rgba(0,255,136,.2);
    }
    .feat-card:hover { background: var(--bg3); }
    .feat-card:hover .feat-scan { opacity: 1; }
    .feat-scan {
      position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: 0; transition: opacity .3s; animation: scanH 1.8s linear infinite;
    }
    .feat-icon { margin-bottom: 1.25rem; display: flex; }
    .feat-title { font-family: var(--sans); font-size: 1.1rem; font-weight: 700; margin-bottom: .6rem; }
    .feat-desc  { font-size: .82rem; line-height: 1.7; color: #5a8068; }

    /* ── STEPS ── */
    .steps { padding: 6rem 1.5rem; }
    .steps-inner {
      max-width: 900px; margin: 0 auto;
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2rem; margin-top: 3.5rem;
    }
    .step-card {
      border: 1px solid var(--border); padding: 2.5rem 2rem;
      border-radius: 2px; position: relative;
      background: linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%);
      transition: border-color .3s, transform .3s;
    }
    .step-card:hover { border-color: var(--green); transform: translateY(-4px); }
    .step-num {
      font-family: var(--sans); font-size: 3.5rem; font-weight: 800;
      color: transparent; -webkit-text-stroke: 1px rgba(0,255,136,.35);
      line-height: 1; margin-bottom: .75rem;
    }
    .step-title { font-family: var(--sans); font-size: 1.1rem; font-weight: 700; }
    .step-line {
      position: absolute; bottom: 0; left: 0; height: 2px;
      background: linear-gradient(90deg, var(--green), transparent);
      width: 0; transition: width .4s;
    }
    .step-card:hover .step-line { width: 100%; }

    /* ── CTA ── */
    .cta {
      padding: 7rem 1.5rem; text-align: center;
      background: var(--bg2);
      position: relative; overflow: hidden;
    }
    .cta-bg {
      position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse 60% 60% at 50% 100%, rgba(0,255,136,.08) 0%, transparent 70%);
    }
    .cta h2 {
      font-family: var(--sans); font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 800; margin-bottom: 1rem;
    }
    .cta h2 em { font-style: normal; color: var(--green); }
    .cta p { color: #5a8068; margin-bottom: 2.5rem; font-size: .9rem; letter-spacing: .05em; }
    .cta-sub {
      display: flex; align-items: center; justify-content: center; gap: .5rem;
      font-size: .7rem; letter-spacing: .2em; color: rgba(0,255,136,.35);
      margin-top: 1.5rem; text-transform: uppercase;
    }

    /* ── NAV ── */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(5,10,10,.85); backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .nav-logo {
      font-family: var(--sans); font-size: 1.1rem; font-weight: 800;
      color: var(--green); letter-spacing: -.01em; text-decoration: none;
      display: flex; align-items: center; gap: .5rem;
    }
    .nav-links { display: flex; gap: 1.5rem; align-items: center; }
    .nav-link { font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; color: #5a8068; text-decoration: none; transition: color .2s; }
    .nav-link:hover { color: var(--green); }
    .nav-btn {
      font-family: var(--mono); font-size: .72rem; letter-spacing: .1em;
      padding: .45rem 1.1rem; border: 1px solid var(--border); color: var(--green);
      background: transparent; cursor: pointer; border-radius: 2px; transition: all .2s; text-decoration: none;
    }
    .nav-btn:hover { background: rgba(0,255,136,.1); border-color: var(--green); }

    @media (max-width: 600px) {
      .nav-links { display: none; }
      .hero h1 { font-size: 2.4rem; }
    }
  `}</style>
);

/* ─── Component ─────────────────────────────────────────────────────────────── */
const LandingPage = () => {
  const marqueeItems = [
    "JavaScript", "Python", "Java", "C++", "Go", "Rust",
    "Dynamic Programming", "Binary Search", "Graphs", "Trees",
    "JavaScript", "Python", "Java", "C++", "Go", "Rust",
    "Dynamic Programming", "Binary Search", "Graphs", "Trees",
  ];

  return (
    <>
      <FontLoader />

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <Terminal size={16} />
          LeetLab
        </a>
        <div className="nav-links">
          <a href="/problems" className="nav-link">Problems</a>
          <a href="/leaderboard" className="nav-link">Leaderboard</a>
          <a href="/login" className="nav-btn">Login</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />

        <div className="tag-line fade-up">
          <span className="cursor">█</span> v2.0 — Now live
        </div>

        <h1 className="fade-up-1">
          Master Coding<br />with <span className="brand">LeetLab</span>
        </h1>

        <p className="fade-up-2">
          Write, run, and test your code instantly. Practice real problems,
          track your progress, and become interview-ready.
        </p>

        <div className="btn-row fade-up-3">
          <a href="/problems" className="btn-primary-x">
            Start Solving <ArrowRight size={16} />
          </a>
          <a href="/login" className="btn-outline-x">
            Login
          </a>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span className="marquee-item" key={i}>
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span className="section-label fade-up">// features</span>
          <h2 className="section-title fade-up-1">Why Choose LeetLab?</h2>
          <div className="features-grid">
            <FeatureCard
              num="01"
              icon={<Code2 size={28} color="var(--cyan)" />}
              title="Multi-Language"
              desc="Solve problems in JavaScript, Python, Java, Go, and more languages."
            />
            <FeatureCard
              num="02"
              icon={<Zap size={28} color="var(--yellow)" />}
              title="Instant Execution"
              desc="Real-time code execution powered by the Judge0 API engine."
            />
            <FeatureCard
              num="03"
              icon={<Database size={28} color="var(--green)" />}
              title="Submission History"
              desc="Track all submissions with detailed memory and runtime stats."
            />
            <FeatureCard
              num="04"
              icon={<Shield size={28} color="var(--red)" />}
              title="Secure Auth"
              desc="JWT-based authentication with bcrypt-encrypted passwords."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps">
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label">// how_it_works</span>
          <h2 className="section-title">Three Steps to Ship</h2>
          <div className="steps-inner">
            <StepCard number="01" title="Choose a Problem" />
            <StepCard number="02" title="Write Your Code" />
            <StepCard number="03" title="Run & Submit" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="cta-bg" />
        <span className="section-label">// get_started</span>
        <h2>Ready to <em>Level Up?</em></h2>
        <p>Start solving real-world coding problems today. Free forever.</p>
        <a href="/signup" className="btn-primary-x" style={{ fontSize: "1rem", padding: ".95rem 2.2rem" }}>
          Create Free Account <ArrowRight size={18} />
        </a>
        <div className="cta-sub">
          <span className="marquee-dot" />
          No credit card required
          <span className="marquee-dot" />
          Instant access
          <span className="marquee-dot" />
          200+ problems
        </div>
      </section>
    </>
  );
};

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
const FeatureCard = ({ num, icon, title, desc }) => (
  <div className="feat-card" data-num={num}>
    <div className="feat-scan" />
    <div className="feat-icon">{icon}</div>
    <div className="feat-title">{title}</div>
    <div className="feat-desc">{desc}</div>
  </div>
);

const StepCard = ({ number, title }) => (
  <div className="step-card">
    <div className="step-num">{number}</div>
    <div className="step-title">{title}</div>
    <div className="step-line" />
  </div>
);

export default LandingPage;