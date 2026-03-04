import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

    .llf-footer {
      --green:  #00ff88;
      --green2: #00cc6a;
      --bg:     #050a0a;
      --border: rgba(0,255,136,0.13);
      --mono:   'Share Tech Mono', monospace;
      font-family: var(--mono);
      background: var(--bg);
      border-top: 1px solid var(--border);
      padding: 1.75rem 1.5rem;
      position: relative;
      overflow: hidden;
    }

    /* top scan line sweep */
    .llf-footer::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: .5;
    }

    .llf-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    /* left: brand */
    .llf-brand {
      display: flex;
      align-items: center;
      gap: .6rem;
      font-size: .72rem;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--green2);
    }
    .llf-brand-dot {
      width: 6px; height: 6px;
      background: var(--green);
      border-radius: 50%;
      animation: llf-blink 1.4s step-end infinite;
    }
    @keyframes llf-blink { 0%,100%{opacity:1} 50%{opacity:0} }

    /* center: copyright */
    .llf-copy {
      font-size: .68rem;
      letter-spacing: .12em;
      color: rgba(224,255,232,.25);
      text-align: center;
    }
    .llf-copy span { color: rgba(0,255,136,.45); }

    /* right: socials */
    .llf-socials {
      display: flex;
      gap: .5rem;
    }
    .llf-social-link {
      width: 36px; height: 36px;
      border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      color: rgba(0,255,136,.4);
      text-decoration: none;
      font-size: 1rem;
      transition: color .2s, border-color .2s, background .2s, transform .2s;
      position: relative;
      overflow: hidden;
    }
    .llf-social-link::before {
      content: '';
      position: absolute; inset: 0;
      background: rgba(0,255,136,.06);
      opacity: 0;
      transition: opacity .2s;
    }
    .llf-social-link:hover { color: var(--green); border-color: var(--green); transform: translateY(-2px); }
    .llf-social-link:hover::before { opacity: 1; }

    @media (max-width: 600px) {
      .llf-inner { justify-content: center; flex-direction: column; text-align: center; }
    }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="llf-footer">
    <Styles />
    <div className="llf-inner">

      {/* Brand */}
      <div className="llf-brand">
        <span className="llf-brand-dot" />
        LeetLab — online
      </div>

      {/* Copyright */}
      <p className="llf-copy">
        © {new Date().getFullYear()} <span>Rohit Rana</span>. Built with ♥
      </p>

      {/* Socials */}
      <div className="llf-socials">
        <a
          href="https://github.com/rohittrana"
          target="_blank"
          rel="noopener noreferrer"
          className="llf-social-link"
          title="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://x.com/Rohittrana17"
          target="_blank"
          rel="noopener noreferrer"
          className="llf-social-link"
          title="Twitter / X"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.linkedin.com/in/rohittrana17/"
          target="_blank"
          rel="noopener noreferrer"
          className="llf-social-link"
          title="LinkedIn"
        >
          <FaLinkedin />
        </a>
      </div>

    </div>
  </footer>
);

export default Footer;