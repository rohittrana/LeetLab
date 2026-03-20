import { CheckCircle2, XCircle, Clock, MemoryStick as Memory, Calendar, Terminal } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .llsl {
      --green:  #00ff88;
      --green2: #00cc6a;
      --red:    #ff3e5e;
      --yellow: #ffd600;
      --cyan:   #00e5ff;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --bg3:    #0d1818;
      --border: rgba(0,255,136,0.13);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
    }

    @keyframes llsl-fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llsl-spin      { to{transform:rotate(360deg)} }
    @keyframes llsl-blink     { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes llsl-scanH     { from{top:-100%} to{top:200%} }
    @keyframes llsl-pop       { 0%{opacity:0;transform:scale(.92) translateY(8px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes llsl-glow-in   {
      0%   { box-shadow: 0 0 0 0 rgba(0,255,136,0); }
      40%  { box-shadow: 0 0 0 6px rgba(0,255,136,.2); }
      100% { box-shadow: 0 0 0 0 rgba(0,255,136,0); }
    }

    /* ── loading ── */
    .llsl-loading {
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 3rem; gap: 1rem;
    }
    .llsl-spinner {
      width: 36px; height: 36px;
      border: 2px solid var(--border);
      border-top-color: var(--green);
      border-radius: 50%;
      animation: llsl-spin .75s linear infinite;
    }
    .llsl-loading-txt {
      font-size: .65rem; letter-spacing: .25em; text-transform: uppercase;
      color: rgba(0,255,136,.4);
      animation: llsl-blink 1.4s step-end infinite;
    }

    /* ── empty ── */
    .llsl-empty {
      padding: 2.5rem 1rem; text-align: center;
      border: 1px dashed var(--border);
      font-size: .72rem; letter-spacing: .18em; text-transform: uppercase;
      color: rgba(0,255,136,.25);
    }

    /* ── success banner ── */
    .llsl-banner {
      border: 1px solid rgba(0,255,136,.35);
      background: rgba(0,255,136,.06);
      padding: 1rem 1.25rem;
      margin-bottom: 1.25rem;
      display: flex; align-items: center; gap: .85rem;
      animation: llsl-pop .35s ease both;
      position: relative; overflow: hidden;
    }
    .llsl-banner::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: .6;
    }
    .llsl-banner::after {
      content: '';
      position: absolute; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: .25;
      animation: llsl-scanH 2.5s linear infinite;
    }
    .llsl-banner-icon { color: var(--green); flex-shrink: 0; }
    .llsl-banner-title {
      font-family: var(--sans); font-size: 1rem; font-weight: 800;
      color: var(--green); letter-spacing: -.01em;
    }
    .llsl-banner-sub {
      font-size: .65rem; letter-spacing: .18em; text-transform: uppercase;
      color: rgba(0,255,136,.5); margin-top: .15rem;
    }
    .llsl-banner-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--green);
      animation: llsl-blink 1s step-end infinite;
      margin-left: auto; flex-shrink: 0;
    }

    /* ── list ── */
    .llsl-list { display: flex; flex-direction: column; gap: .6rem; }

    /* ── card ── */
    .llsl-card {
      border: 1px solid var(--border);
      background: var(--bg2);
      position: relative; overflow: hidden;
      transition: border-color .2s, background .2s;
      animation: llsl-fadeUp .4s ease both;
    }
    .llsl-card:hover { border-color: rgba(0,255,136,.28); background: var(--bg3); }
    .llsl-card.accepted:hover { animation: llsl-glow-in .5s ease; }

    /* index label */
    .llsl-card-idx {
      position: absolute; top: .55rem; right: .85rem;
      font-size: .58rem; letter-spacing: .15em;
      color: rgba(0,255,136,.18);
    }

    .llsl-card-inner {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: .75rem;
      padding: .85rem 1.1rem;
    }

    /* left */
    .llsl-left { display: flex; align-items: center; gap: .85rem; }

    .llsl-status {
      display: flex; align-items: center; gap: .4rem;
      font-family: var(--sans); font-size: .82rem; font-weight: 700;
      letter-spacing: -.01em;
    }
    .llsl-status.ok  { color: var(--green); }
    .llsl-status.err { color: var(--red); }

    .llsl-lang {
      font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
      padding: .2rem .6rem; border: 1px solid var(--border);
      color: var(--cyan);
    }

    /* right */
    .llsl-right {
      display: flex; align-items: center; gap: 1.25rem;
      flex-wrap: wrap;
    }
    .llsl-stat {
      display: flex; align-items: center; gap: .35rem;
      font-size: .72rem; color: rgba(224,255,232,.4);
    }
    .llsl-stat svg { color: rgba(0,255,136,.35); flex-shrink: 0; }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const SubmissionsList = ({ submissions, isLoading }) => {

  const safeParse = (data) => {
    try { return JSON.parse(data); }
    catch { return []; }
  };

  const avgMemory = (mem) => {
    const arr = safeParse(mem).map((m) => parseFloat(m.split(" ")[0]));
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  };

  const avgTime = (time) => {
    const arr = safeParse(time).map((t) => parseFloat(t.split(" ")[0]));
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  };

  /* ── loading ── */
  if (isLoading) return (
    <div className="llsl">
      <Styles />
      <div className="llsl-loading">
        <div className="llsl-spinner" />
        <span className="llsl-loading-txt">Fetching submissions...</span>
      </div>
    </div>
  );

  /* ── empty ── */
  if (!submissions?.length) return (
    <div className="llsl">
      <Styles />
      <div className="llsl-empty">// no submissions yet</div>
    </div>
  );

  const latestAccepted = submissions[0]?.status === "Accepted";

  return (
    <div className="llsl">
      <Styles />

      {/* ── Accepted banner (shows when latest submission passed) ── */}
      {latestAccepted && (
        <div className="llsl-banner">
          <CheckCircle2 size={22} className="llsl-banner-icon" />
          <div>
            <div className="llsl-banner-title">Problem Solved!</div>
            <div className="llsl-banner-sub">
              // latest submission accepted &nbsp;·&nbsp;{" "}
              {new Date(submissions[0].createdAt).toLocaleString()}
            </div>
          </div>
          <span className="llsl-banner-dot" />
        </div>
      )}

      {/* ── Submissions list ── */}
      <div className="llsl-list">
        {submissions.map((sub, i) => {
          const accepted = sub.status === "Accepted";
          return (
            <div
              key={sub.id}
              className={`llsl-card${accepted ? " accepted" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="llsl-card-idx">#{String(submissions.length - i).padStart(3, "0")}</span>
              <div className="llsl-card-inner">

                {/* Left */}
                <div className="llsl-left">
                  <span className={`llsl-status ${accepted ? "ok" : "err"}`}>
                    {accepted
                      ? <><CheckCircle2 size={15} /> Accepted</>
                      : <><XCircle size={15} /> {sub.status}</>
                    }
                  </span>
                  <span className="llsl-lang">{sub.language}</span>
                </div>

                {/* Right */}
                <div className="llsl-right">
                  <span className="llsl-stat">
                    <Clock size={12} />
                    {avgTime(sub.time).toFixed(3)} s
                  </span>
                  <span className="llsl-stat">
                    <Memory size={12} />
                    {avgMemory(sub.memory).toFixed(0)} KB
                  </span>
                  <span className="llsl-stat">
                    <Calendar size={12} />
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionsList;