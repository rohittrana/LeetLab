import React, { useEffect, useState } from 'react';
import { X, Plus, Loader, Terminal, List } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .llapm-overlay {
      position:fixed;inset:0;z-index:50;
      background:rgba(0,0,0,.75);
      backdrop-filter:blur(4px);
      display:flex;align-items:center;justify-content:center;
      padding:1rem;
      animation:llapm-fadeIn .15s ease both;
    }
    @keyframes llapm-fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes llapm-slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llapm-scanH   { from{top:-100%} to{top:200%} }
    @keyframes llapm-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes llapm-spin    { to{transform:rotate(360deg)} }

    .llapm-panel {
      --green:  #00ff88;
      --green2: #00cc6a;
      --red:    #ff3e5e;
      --cyan:   #00e5ff;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --bg3:    #0d1818;
      --border: rgba(0,255,136,0.15);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
      background: var(--bg);
      border: 1px solid var(--border);
      width: 100%; max-width: 400px;
      position: relative; overflow: hidden;
      animation: llapm-slideUp .2s ease both;
    }

    /* shimmer top */
    .llapm-panel::before {
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--green),transparent);
      opacity:.5;
    }

    /* ── header ── */
    .llapm-header {
      display:flex;align-items:center;justify-content:space-between;
      padding:.85rem 1.25rem;
      border-bottom:1px solid var(--border);
      background:rgba(0,255,136,.025);
    }
    .llapm-header-left {
      display:flex;align-items:center;gap:.55rem;
    }
    .llapm-header-dot {
      width:6px;height:6px;border-radius:50%;
      background:var(--green);
      animation:llapm-blink 1.4s step-end infinite;
    }
    .llapm-header-tag {
      font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;
      color:var(--green2);
    }
    .llapm-title {
      font-family:var(--sans);font-size:1.05rem;font-weight:800;
      color:#e0ffe8;letter-spacing:-.01em;
    }
    .llapm-close {
      width:28px;height:28px;border:1px solid var(--border);
      background:none;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      color:rgba(0,255,136,.4);
      transition:color .2s,border-color .2s,background .2s;
    }
    .llapm-close:hover { color:var(--red);border-color:var(--red);background:rgba(255,62,94,.06); }

    /* ── body ── */
    .llapm-body { padding:1.4rem 1.25rem 1.1rem; }

    .llapm-label {
      display:block;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(0,255,136,.5);margin-bottom:.5rem;
    }

    /* playlist select — styled as list of options */
    .llapm-select-wrap { position:relative; }
    .llapm-select {
      width:100%;background:rgba(0,0,0,.45);
      border:1px solid var(--border);
      color:#e0ffe8;font-family:var(--mono);font-size:.82rem;
      padding:.72rem 2rem .72rem .85rem;
      outline:none;cursor:pointer;border-radius:0;
      transition:border-color .2s,box-shadow .2s;
      -webkit-appearance:none;
    }
    .llapm-select::placeholder { color:rgba(224,255,232,.2); }
    .llapm-select:focus {
      border-color:var(--green);
      box-shadow:0 0 0 3px rgba(0,255,136,.07);
    }
    .llapm-select:disabled { opacity:.4;cursor:not-allowed; }
    .llapm-select option { background:#0a1010;color:#e0ffe8; }
    /* custom chevron */
    .llapm-select-chevron {
      position:absolute;right:.75rem;top:50%;transform:translateY(-50%);
      pointer-events:none;color:rgba(0,255,136,.35);font-size:.65rem;
    }

    /* playlist count hint */
    .llapm-hint {
      font-size:.62rem;letter-spacing:.1em;color:rgba(0,255,136,.25);
      margin-top:.35rem;
    }

    /* ── footer ── */
    .llapm-footer {
      display:flex;justify-content:flex-end;gap:.5rem;
      padding:.9rem 1.25rem;
      border-top:1px solid var(--border);
      background:rgba(0,255,136,.02);
    }
    .llapm-btn-cancel {
      font-family:var(--mono);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;
      padding:.52rem 1rem;border:1px solid var(--border);
      background:transparent;color:rgba(224,255,232,.4);cursor:pointer;
      transition:border-color .2s,color .2s;
    }
    .llapm-btn-cancel:hover { border-color:rgba(224,255,232,.3);color:#e0ffe8; }
    .llapm-btn-submit {
      font-family:var(--mono);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;
      font-weight:700;padding:.52rem 1.1rem;
      border:none;background:var(--green);color:#050a0a;
      cursor:pointer;display:flex;align-items:center;gap:.4rem;
      transition:background .2s,transform .15s;
    }
    .llapm-btn-submit:hover:not(:disabled) { background:#fff;transform:translateY(-1px); }
    .llapm-btn-submit:disabled { opacity:.45;cursor:not-allowed; }
    .llapm-spinner {
      width:13px;height:13px;border:2px solid rgba(5,10,10,.25);
      border-top-color:#050a0a;border-radius:50%;
      animation:llapm-spin .7s linear infinite;
    }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    if (isOpen) getAllPlaylists();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;
    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="llapm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Styles />
      <div className="llapm-panel">

        {/* Header */}
        <div className="llapm-header">
          <div className="llapm-header-left">
            <span className="llapm-header-dot" />
            <Terminal size={12} color="var(--green)" style={{ opacity: .6 }} />
            <span className="llapm-header-tag">playlist.add</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'.7rem' }}>
            <span className="llapm-title">Add to Playlist</span>
            <button className="llapm-close" type="button" onClick={onClose}>
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="llapm-body">
            <label className="llapm-label">
              <List size={10} style={{ display:'inline', marginRight:'.35rem' }} />
              Select Playlist
            </label>
            <div className="llapm-select-wrap">
              <select
                className="llapm-select"
                value={selectedPlaylist}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
                disabled={isLoading}
              >
                <option value="">// choose a playlist</option>
                {playlists.map((pl) => (
                  <option key={pl.id} value={pl.id}>{pl.name}</option>
                ))}
              </select>
              <span className="llapm-select-chevron">▼</span>
            </div>
            <p className="llapm-hint">
              {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Footer */}
          <div className="llapm-footer">
            <button type="button" className="llapm-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="llapm-btn-submit"
              disabled={!selectedPlaylist || isLoading}
            >
              {isLoading
                ? <><div className="llapm-spinner" /> Adding...</>
                : <><Plus size={13} /> Add →</>
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddToPlaylistModal;