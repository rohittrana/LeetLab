import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, Terminal } from "lucide-react";
import ProblemsTable from "../components/ProblemsTable";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;700;800&display=swap');

    .ll-home {
      --green:  #00ff88;
      --green2: #00cc6a;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --border: rgba(0,255,136,0.13);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
      min-height: 100vh;
      background: var(--bg);
      color: #e0ffe8;
      position: relative;
      overflow-x: hidden;
    }

    /* scanlines */
    .ll-home::before {
      content:'';
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.05) 2px,rgba(0,0,0,.05) 4px);
    }

    /* dot grid */
    .llh-grid {
      position:fixed;inset:0;pointer-events:none;z-index:0;
      background-image:
        linear-gradient(rgba(0,255,136,.045) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,255,136,.045) 1px,transparent 1px);
      background-size:48px 48px;
      mask-image:radial-gradient(ellipse 90% 70% at 50% 0%,black 30%,transparent 100%);
    }

    /* ambient glow blobs */
    .llh-glow-l {
      position:fixed;width:500px;height:500px;border-radius:50%;pointer-events:none;z-index:0;
      background:radial-gradient(circle,rgba(0,255,136,.10) 0%,transparent 70%);
      top:-100px;left:-150px;
    }
    .llh-glow-r {
      position:fixed;width:400px;height:400px;border-radius:50%;pointer-events:none;z-index:0;
      background:radial-gradient(circle,rgba(0,229,255,.06) 0%,transparent 70%);
      top:20%;right:-120px;
    }

    @keyframes llh-fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llh-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes llh-spin    { to{transform:rotate(360deg)} }
    @keyframes llh-pulse   { 0%,100%{opacity:.6} 50%{opacity:1} }

    /* ── loading screen ── */
    .llh-loading {
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      height:100vh;gap:1.25rem;background:var(--bg);font-family:var(--mono);
    }
    .llh-spinner {
      width:44px;height:44px;border:2px solid var(--border);
      border-top-color:var(--green);border-radius:50%;
      animation:llh-spin .8s linear infinite;
    }
    .llh-loading-text {
      font-size:.72rem;letter-spacing:.25em;text-transform:uppercase;
      color:var(--green2);animation:llh-pulse 1.4s ease infinite;
    }

    /* ── page content ── */
    .llh-content {
      position:relative;z-index:1;
      max-width:1100px;margin:0 auto;
      padding:7rem 1.5rem 4rem;
    }

    /* hero */
    .llh-hero { text-align:center;margin-bottom:3.5rem; }

    .llh-tag {
      display:inline-flex;align-items:center;gap:.5rem;
      font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;
      color:var(--green);border:1px solid var(--border);
      padding:.35rem 1rem;margin-bottom:1.5rem;
      animation:llh-fadeUp .5s ease both;
    }
    .llh-tag-dot { width:5px;height:5px;background:var(--green);border-radius:50%;animation:llh-blink 1.2s step-end infinite; }

    .llh-title {
      font-family:var(--sans);font-size:clamp(2.2rem,5vw,3.8rem);
      font-weight:800;line-height:1.08;letter-spacing:-.02em;
      margin-bottom:1.25rem;
      animation:llh-fadeUp .55s .08s ease both;
    }
    .llh-title em {
      font-style:normal;color:var(--green);
      text-shadow:0 0 40px rgba(0,255,136,.5),0 0 80px rgba(0,255,136,.2);
    }

    .llh-sub {
      font-size:.875rem;line-height:1.8;color:rgba(224,255,232,.4);
      max-width:560px;margin:0 auto;
      animation:llh-fadeUp .55s .16s ease both;
    }

    /* stats row */
    .llh-stats {
      display:flex;justify-content:center;gap:2px;
      margin:2.25rem auto 0;max-width:480px;
      animation:llh-fadeUp .55s .24s ease both;
    }
    .llh-stat {
      flex:1;border:1px solid var(--border);background:rgba(0,255,136,.03);
      padding:.85rem .5rem;text-align:center;
    }
    .llh-stat-num {
      font-family:var(--sans);font-size:1.3rem;font-weight:800;color:var(--green);
      display:block;
    }
    .llh-stat-label {
      font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(0,255,136,.35);margin-top:.2rem;display:block;
    }

    /* section header above table */
    .llh-section-bar {
      display:flex;align-items:center;justify-content:space-between;
      border-bottom:1px solid var(--border);padding-bottom:.75rem;
      margin-bottom:1.5rem;
      animation:llh-fadeUp .55s .3s ease both;
    }
    .llh-section-label {
      font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;
      color:var(--green2);display:flex;align-items:center;gap:.5rem;
    }
    .llh-section-dot { width:6px;height:6px;background:var(--green);border-radius:50%; }
    .llh-section-count {
      font-size:.65rem;letter-spacing:.12em;color:rgba(0,255,136,.3);
    }

    /* empty state */
    .llh-empty {
      border:1px dashed var(--border);padding:3rem 2rem;text-align:center;
      margin-top:1rem;
      animation:llh-fadeUp .55s .35s ease both;
    }
    .llh-empty-icon {
      font-size:2rem;margin-bottom:.75rem;opacity:.3;
    }
    .llh-empty-text {
      font-size:.8rem;letter-spacing:.12em;color:rgba(0,255,136,.3);
      text-transform:uppercase;
    }

    /* table wrapper */
    .llh-table-wrap {
      animation:llh-fadeUp .6s .32s ease both;
    }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  /* ── Loading ── */
  if (isProblemsLoading) {
    return (
      <>
        <Styles />
        <div className="llh-loading">
          <div className="llh-spinner" />
          <span className="llh-loading-text">Fetching problems...</span>
        </div>
      </>
    );
  }

  const easy   = problems.filter((p) => p.difficulty === "EASY").length;
  const medium = problems.filter((p) => p.difficulty === "MEDIUM").length;
  const hard   = problems.filter((p) => p.difficulty === "HARD").length;

  return (
    <div className="ll-home">
      <Styles />
      <div className="llh-grid" />
      <div className="llh-glow-l" />
      <div className="llh-glow-r" />

      <div className="llh-content">

        {/* ── Hero ── */}
        <div className="llh-hero">
          <div className="llh-tag">
            <span className="llh-tag-dot" />
            <Terminal size={12} />
            leetlab — problems
          </div>

          <h1 className="llh-title">
            Sharpen Your<br />Skills on <em>LeetLab</em>
          </h1>

          <p className="llh-sub">
            A platform inspired by LeetCode to help you prepare for coding
            interviews and level up your problem-solving skills.
          </p>

          {/* Stats */}
          <div className="llh-stats">
            <div className="llh-stat">
              <span className="llh-stat-num">{problems.length}</span>
              <span className="llh-stat-label">Total</span>
            </div>
            <div className="llh-stat">
              <span className="llh-stat-num" style={{ color: "#00ff88" }}>{easy}</span>
              <span className="llh-stat-label">Easy</span>
            </div>
            <div className="llh-stat">
              <span className="llh-stat-num" style={{ color: "#ffd600" }}>{medium}</span>
              <span className="llh-stat-label">Medium</span>
            </div>
            <div className="llh-stat">
              <span className="llh-stat-num" style={{ color: "#ff3e5e" }}>{hard}</span>
              <span className="llh-stat-label">Hard</span>
            </div>
          </div>
        </div>

        {/* ── Problems section ── */}
        <div className="llh-section-bar">
          <span className="llh-section-label">
            <span className="llh-section-dot" />
            problem_set.list
          </span>
          <span className="llh-section-count">{problems.length} results</span>
        </div>

        {problems.length > 0 ? (
          <div className="llh-table-wrap">
            <ProblemsTable problems={problems} />
          </div>
        ) : (
          <div className="llh-empty">
            <div className="llh-empty-icon">⬛</div>
            <p className="llh-empty-text">// no problems found</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;