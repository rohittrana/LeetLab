import React from 'react';
import { CheckCircle2, XCircle, Clock, MemoryStick as Memory, Activity } from 'lucide-react';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .llsr {
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
      display: flex; flex-direction: column; gap: 1.25rem;
    }

    @keyframes llsr-fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llsr-scanH  { from{top:-100%} to{top:200%} }
    @keyframes llsr-fill   { from{width:0} to{width:var(--w)} }

    /* ── stats grid ── */
    .llsr-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
      animation: llsr-fadeUp .4s ease both;
    }
    @media(max-width:700px){ .llsr-stats { grid-template-columns: 1fr 1fr; } }
    @media(max-width:400px){ .llsr-stats { grid-template-columns: 1fr; } }

    .llsr-stat-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      padding: 1rem 1.1rem;
      position: relative; overflow: hidden;
      transition: border-color .2s;
    }
    .llsr-stat-card:hover { border-color: rgba(0,255,136,.3); }
    .llsr-stat-card::after {
      content: '';
      position: absolute; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: .18;
      animation: llsr-scanH 3s linear infinite;
    }

    .llsr-stat-label {
      font-size: .6rem; letter-spacing: .2em; text-transform: uppercase;
      color: rgba(0,255,136,.4);
      display: flex; align-items: center; gap: .4rem;
      margin-bottom: .5rem;
    }
    .llsr-stat-val {
      font-family: var(--sans); font-size: 1.5rem; font-weight: 800;
      letter-spacing: -.02em; color: #e0ffe8;
    }
    .llsr-stat-val.ok  { color: var(--green); }
    .llsr-stat-val.err { color: var(--red); }

    /* progress bar for success rate */
    .llsr-bar-wrap {
      margin-top: .5rem; height: 2px;
      background: var(--border);
    }
    .llsr-bar {
      height: 100%;
      background: var(--green);
      width: var(--w);
      animation: llsr-fill .8s .2s ease both;
    }
    .llsr-bar.err { background: var(--red); }

    /* ── test cases section ── */
    .llsr-section {
      border: 1px solid var(--border);
      background: var(--bg2);
      position: relative; overflow: hidden;
      animation: llsr-fadeUp .4s .07s ease both;
    }
    .llsr-section::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: .25; pointer-events: none;
    }

    .llsr-section-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: .8rem 1.1rem;
      border-bottom: 1px solid var(--border);
      background: rgba(0,255,136,.025);
    }
    .llsr-section-title {
      font-size: .65rem; letter-spacing: .2em; text-transform: uppercase;
      color: var(--green2);
      display: flex; align-items: center; gap: .5rem;
    }
    .llsr-section-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--green);
    }
    .llsr-pass-count {
      font-size: .65rem; letter-spacing: .12em;
      color: rgba(0,255,136,.4);
    }
    .llsr-pass-count span { color: var(--green); }

    /* ── table ── */
    .llsr-table-scroll { overflow-x: auto; }
    .llsr-table {
      width: 100%; border-collapse: collapse;
      font-size: .78rem;
    }
    .llsr-thead tr {
      border-bottom: 1px solid var(--border);
      background: rgba(0,255,136,.02);
    }
    .llsr-th {
      padding: .6rem 1rem;
      font-size: .58rem; letter-spacing: .2em; text-transform: uppercase;
      color: rgba(0,255,136,.4); font-weight: 400; text-align: left;
      white-space: nowrap;
    }
    .llsr-tr {
      border-bottom: 1px solid rgba(0,255,136,.05);
      transition: background .15s;
    }
    .llsr-tr:last-child { border-bottom: none; }
    .llsr-tr:hover { background: rgba(0,255,136,.03); }
    .llsr-tr.passed-row { background: rgba(0,255,136,.02); }
    .llsr-tr.failed-row { background: rgba(255,62,94,.02); }

    .llsr-td {
      padding: .7rem 1rem;
      color: rgba(224,255,232,.6);
      vertical-align: middle;
    }

    /* status cell */
    .llsr-status {
      display: flex; align-items: center; gap: .4rem;
      font-family: var(--sans); font-size: .8rem; font-weight: 700;
      white-space: nowrap;
    }
    .llsr-status.ok  { color: var(--green); }
    .llsr-status.err { color: var(--red); }

    /* mono output */
    .llsr-mono {
      font-family: var(--mono); font-size: .75rem;
      color: rgba(224,255,232,.55);
      max-width: 180px; overflow: hidden;
      text-overflow: ellipsis; white-space: nowrap;
    }
    .llsr-mono.mismatch { color: var(--red); }

    /* meta pill */
    .llsr-meta {
      font-size: .68rem; color: rgba(224,255,232,.4);
      white-space: nowrap;
    }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const SubmissionResults = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || '[]');
  const timeArr   = JSON.parse(submission.time   || '[]');

  const avgMemory = memoryArr.map(m => parseFloat(m)).reduce((a, b) => a + b, 0) / (memoryArr.length || 1);
  const avgTime   = timeArr.map(t => parseFloat(t)).reduce((a, b) => a + b, 0)   / (timeArr.length   || 1);

  const passedTests = submission.testCases.filter(tc => tc.passed).length;
  const totalTests  = submission.testCases.length;
  const successRate = (passedTests / totalTests) * 100;
  const accepted    = submission.status === 'Accepted';

  return (
    <div className="llsr">
      <Styles />

      {/* ── Stats Row ── */}
      <div className="llsr-stats">

        {/* Status */}
        <div className="llsr-stat-card">
          <div className="llsr-stat-label">Status</div>
          <div className={`llsr-stat-val ${accepted ? 'ok' : 'err'}`}>
            {accepted ? '✓ Accepted' : '✗ ' + submission.status}
          </div>
        </div>

        {/* Success Rate */}
        <div className="llsr-stat-card">
          <div className="llsr-stat-label"><Activity size={11} /> Pass Rate</div>
          <div className={`llsr-stat-val ${successRate === 100 ? 'ok' : successRate < 50 ? 'err' : ''}`}>
            {successRate.toFixed(1)}%
          </div>
          <div className="llsr-bar-wrap">
            <div
              className={`llsr-bar${successRate < 50 ? ' err' : ''}`}
              style={{ '--w': `${successRate}%` }}
            />
          </div>
        </div>

        {/* Runtime */}
        <div className="llsr-stat-card">
          <div className="llsr-stat-label"><Clock size={11} /> Avg. Runtime</div>
          <div className="llsr-stat-val">{avgTime.toFixed(3)}<span style={{fontSize:'.75rem',opacity:.5}}> s</span></div>
        </div>

        {/* Memory */}
        <div className="llsr-stat-card">
          <div className="llsr-stat-label"><Memory size={11} /> Avg. Memory</div>
          <div className="llsr-stat-val">{avgMemory.toFixed(0)}<span style={{fontSize:'.75rem',opacity:.5}}> KB</span></div>
        </div>

      </div>

      {/* ── Test Cases ── */}
      <div className="llsr-section">
        <div className="llsr-section-head">
          <span className="llsr-section-title">
            <span className="llsr-section-dot" />
            testcases.results
          </span>
          <span className="llsr-pass-count">
            <span>{passedTests}</span> / {totalTests} passed
          </span>
        </div>

        <div className="llsr-table-scroll">
          <table className="llsr-table">
            <thead className="llsr-thead">
              <tr>
                <th className="llsr-th">Status</th>
                <th className="llsr-th">Expected</th>
                <th className="llsr-th">Your Output</th>
                <th className="llsr-th">Memory</th>
                <th className="llsr-th">Time</th>
              </tr>
            </thead>
            <tbody>
              {submission.testCases.map((tc, i) => (
                <tr key={tc.id} className={`llsr-tr ${tc.passed ? 'passed-row' : 'failed-row'}`}
                  style={{ animationDelay: `${i * 0.04}s` }}>
                  <td className="llsr-td">
                    <span className={`llsr-status ${tc.passed ? 'ok' : 'err'}`}>
                      {tc.passed
                        ? <><CheckCircle2 size={13} /> Passed</>
                        : <><XCircle size={13} /> Failed</>
                      }
                    </span>
                  </td>
                  <td className="llsr-td">
                    <span className="llsr-mono">{tc.expected}</span>
                  </td>
                  <td className="llsr-td">
                    <span className={`llsr-mono${!tc.passed ? ' mismatch' : ''}`}>
                      {tc.stdout || 'null'}
                    </span>
                  </td>
                  <td className="llsr-td">
                    <span className="llsr-meta">{tc.memory}</span>
                  </td>
                  <td className="llsr-td">
                    <span className="llsr-meta">{tc.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SubmissionResults;