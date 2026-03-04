import { CheckCircle2, XCircle, Clock, MemoryStick as Memory, Calendar } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .llsl {
      --green:  #00ff88;
      --green2: #00cc6a;
      --red:    #ff3e5e;
      --cyan:   #00e5ff;
      --bg2:    #0a1010;
      --bg3:    #0d1818;
      --border: rgba(0,255,136,0.13);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
    }

    @keyframes llsl-fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llsl-spin   { to{transform:rotate(360deg)} }
    @keyframes llsl-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes llsl-scanH  { from{top:-100%} to{top:200%} }
    @keyframes llsl-pop    { 0%{opacity:0;transform:scale(.94) translateY(6px)} 100%{opacity:1;transform:scale(1) translateY(0)} }

    /* loading */
    .llsl-loading {
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:3rem;gap:1rem;
    }
    .llsl-spinner {
      width:34px;height:34px;border:2px solid var(--border);
      border-top-color:var(--green);border-radius:50%;
      animation:llsl-spin .75s linear infinite;
    }
    .llsl-loading-txt {
      font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;
      color:rgba(0,255,136,.4);animation:llsl-blink 1.4s step-end infinite;
    }

    /* empty */
    .llsl-empty {
      padding:2.5rem;text-align:center;border:1px dashed var(--border);
      font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(0,255,136,.25);
    }

    /* banner */
    .llsl-banner {
      border:1px solid rgba(0,255,136,.35);background:rgba(0,255,136,.06);
      padding:.9rem 1.1rem;margin-bottom:.75rem;
      display:flex;align-items:center;gap:.85rem;
      animation:llsl-pop .35s ease both;position:relative;overflow:hidden;
    }
    .llsl-banner::before {
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--green),transparent);opacity:.6;
    }
    .llsl-banner::after {
      content:'';position:absolute;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--green),transparent);opacity:.2;
      animation:llsl-scanH 2.5s linear infinite;
    }
    .llsl-banner-ico   { color:var(--green);flex-shrink:0; }
    .llsl-banner-title { font-family:var(--sans);font-size:.95rem;font-weight:800;color:var(--green); }
    .llsl-banner-sub   { font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(0,255,136,.45);margin-top:.1rem; }
    .llsl-banner-dot   { width:6px;height:6px;border-radius:50%;background:var(--green);margin-left:auto;flex-shrink:0;animation:llsl-blink 1s step-end infinite; }

    /* list */
    .llsl-list { display:flex;flex-direction:column;gap:3px; }

    /* row card — matches screenshot */
    .llsl-card {
      display:flex;align-items:center;gap:1rem;
      padding:.72rem 1.1rem;
      border:1px solid var(--border);
      background:var(--bg2);
      position:relative;overflow:hidden;
      transition:border-color .2s,background .2s;
      animation:llsl-fadeUp .35s ease both;
    }
    .llsl-card:hover    { background:var(--bg3); }
    .llsl-card.ok-card  { border-left:3px solid var(--green); }
    .llsl-card.err-card { border-left:3px solid var(--red); }

    /* status */
    .llsl-status {
      display:flex;align-items:center;gap:.45rem;
      font-family:var(--sans);font-size:.82rem;font-weight:800;
      letter-spacing:.03em;text-transform:uppercase;
      min-width:130px;flex-shrink:0;
    }
    .llsl-status.ok  { color:var(--green); }
    .llsl-status.err { color:var(--red); }

    /* lang badge */
    .llsl-lang {
      font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;
      padding:.22rem .65rem;border:1px solid var(--border);
      color:var(--cyan);flex-shrink:0;
    }

    .llsl-spacer { flex:1; }

    /* stats */
    .llsl-stats { display:flex;align-items:center;gap:1.4rem;flex-wrap:wrap; }
    .llsl-stat  { display:flex;align-items:center;gap:.35rem;font-size:.72rem;color:rgba(224,255,232,.4);white-space:nowrap; }
    .llsl-stat svg { color:rgba(0,255,136,.3);flex-shrink:0; }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const SubmissionsList = ({ submissions, isLoading }) => {
  const safeParse = (d) => { try { return JSON.parse(d); } catch { return []; } };

  const avgMemory = (mem) => {
    const arr = safeParse(mem).map((m) => parseFloat(m.split(" ")[0]));
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  };
  const avgTime = (time) => {
    const arr = safeParse(time).map((t) => parseFloat(t.split(" ")[0]));
    return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  };

  if (isLoading) return (
    <div className="llsl">
      <Styles />
      <div className="llsl-loading">
        <div className="llsl-spinner" />
        <span className="llsl-loading-txt">Fetching submissions...</span>
      </div>
    </div>
  );

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

      {/* Solved banner */}
      {latestAccepted && (
        <div className="llsl-banner">
          <CheckCircle2 size={20} className="llsl-banner-ico" />
          <div>
            <div className="llsl-banner-title">Problem Solved!</div>
            <div className="llsl-banner-sub">
              latest submission accepted · {new Date(submissions[0].createdAt).toLocaleString()}
            </div>
          </div>
          <span className="llsl-banner-dot" />
        </div>
      )}

      {/* Rows */}
      <div className="llsl-list">
        {submissions.map((sub, i) => {
          const accepted = sub.status === "Accepted";
          return (
            <div
              key={sub.id}
              className={`llsl-card ${accepted ? "ok-card" : "err-card"}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* ✓ / ✗  status */}
              <span className={`llsl-status ${accepted ? "ok" : "err"}`}>
                {accepted
                  ? <><CheckCircle2 size={14} /> Accepted</>
                  : <><XCircle      size={14} /> {sub.status}</>
                }
              </span>

              {/* language */}
              <span className="llsl-lang">{sub.language}</span>

              <span className="llsl-spacer" />

              {/* stats */}
              <div className="llsl-stats">
                <span className="llsl-stat"><Clock    size={12} />{avgTime(sub.time).toFixed(3)} s</span>
                <span className="llsl-stat"><Memory   size={12} />{avgMemory(sub.memory).toFixed(0)} KB</span>
                <span className="llsl-stat"><Calendar size={12} />{new Date(sub.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionsList;