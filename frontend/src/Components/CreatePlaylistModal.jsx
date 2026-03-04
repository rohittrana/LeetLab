import React from "react";
import { useForm } from "react-hook-form";
import { X, Terminal } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .llm-overlay {
      position: fixed; inset: 0; z-index: 50;
      background: rgba(0,0,0,.75);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem;
      animation: llm-fadeIn .15s ease both;
    }
    @keyframes llm-fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes llm-slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llm-scanH   { from{top:-100%} to{top:200%} }
    @keyframes llm-blink   { 0%,100%{opacity:1} 50%{opacity:0} }

    .llm-panel {
      --green:  #00ff88;
      --green2: #00cc6a;
      --red:    #ff3e5e;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --border: rgba(0,255,136,0.15);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;

      font-family: var(--mono);
      background: var(--bg);
      border: 1px solid var(--border);
      width: 100%; max-width: 440px;
      position: relative; overflow: hidden;
      animation: llm-slideUp .2s ease both;
    }

    /* top shimmer */
    .llm-panel::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--green), transparent);
      opacity: .5;
    }

    /* ── header ── */
    .llm-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: .9rem 1.25rem;
      border-bottom: 1px solid var(--border);
      background: rgba(0,255,136,.03);
    }
    .llm-header-left {
      display: flex; align-items: center; gap: .6rem;
    }
    .llm-header-tag {
      font-size: .65rem; letter-spacing: .22em; text-transform: uppercase;
      color: var(--green2);
    }
    .llm-header-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--green);
      animation: llm-blink 1.4s step-end infinite;
    }
    .llm-title {
      font-family: var(--sans); font-size: 1.1rem; font-weight: 800;
      color: #e0ffe8; letter-spacing: -.01em;
    }
    .llm-close {
      width: 30px; height: 30px;
      border: 1px solid var(--border);
      background: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: rgba(0,255,136,.4);
      transition: color .2s, border-color .2s, background .2s;
      flex-shrink: 0;
    }
    .llm-close:hover { color: var(--red); border-color: var(--red); background: rgba(255,62,94,.06); }

    /* ── form body ── */
    .llm-body { padding: 1.5rem 1.25rem; }

    .llm-field { margin-bottom: 1.25rem; }
    .llm-label {
      display: block; font-size: .68rem; letter-spacing: .18em; text-transform: uppercase;
      color: rgba(0,255,136,.55); margin-bottom: .45rem;
    }
    .llm-input, .llm-textarea {
      width: 100%; background: rgba(0,0,0,.4);
      border: 1px solid var(--border);
      color: #e0ffe8; font-family: var(--mono); font-size: .875rem;
      padding: .72rem .85rem; outline: none; border-radius: 0;
      transition: border-color .2s, box-shadow .2s;
      -webkit-appearance: none;
    }
    .llm-input::placeholder, .llm-textarea::placeholder { color: rgba(224,255,232,.18); }
    .llm-input:focus, .llm-textarea:focus {
      border-color: var(--green);
      box-shadow: 0 0 0 3px rgba(0,255,136,.08);
    }
    .llm-input.err, .llm-textarea.err { border-color: var(--red); }
    .llm-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
    .llm-error { font-size: .7rem; color: var(--red); margin-top: .3rem; letter-spacing: .04em; }

    /* char hint */
    .llm-hint {
      font-size: .63rem; color: rgba(0,255,136,.25);
      margin-top: .3rem; letter-spacing: .06em;
    }

    /* ── footer ── */
    .llm-footer {
      display: flex; justify-content: flex-end; gap: .5rem;
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border);
      background: rgba(0,255,136,.02);
    }
    .llm-btn-cancel {
      font-family: var(--mono); font-size: .72rem; letter-spacing: .12em; text-transform: uppercase;
      padding: .55rem 1.1rem;
      border: 1px solid var(--border); background: transparent; color: rgba(224,255,232,.4);
      cursor: pointer; transition: border-color .2s, color .2s;
    }
    .llm-btn-cancel:hover { border-color: rgba(224,255,232,.3); color: #e0ffe8; }
    .llm-btn-submit {
      font-family: var(--mono); font-size: .72rem; letter-spacing: .12em; text-transform: uppercase;
      font-weight: 700;
      padding: .55rem 1.25rem;
      border: none; background: var(--green); color: #050a0a;
      cursor: pointer; transition: background .2s, transform .15s;
    }
    .llm-btn-submit:hover { background: #fff; transform: translateY(-1px); }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const nameVal = watch("name", "");

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="llm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Styles />
      <div className="llm-panel">

        {/* Header */}
        <div className="llm-header">
          <div className="llm-header-left">
            <span className="llm-header-dot" />
            <Terminal size={13} color="var(--green)" style={{ opacity: .6 }} />
            <span className="llm-header-tag">playlist.create</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <span className="llm-title">New Playlist</span>
            <button className="llm-close" onClick={onClose} type="button">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="llm-body">

            {/* Name */}
            <div className="llm-field">
              <label className="llm-label">Playlist Name</label>
              <input
                type="text"
                className={`llm-input${errors.name ? " err" : ""}`}
                placeholder="e.g. Dynamic Programming"
                {...register("name", { required: "Playlist name is required" })}
              />
              {errors.name
                ? <p className="llm-error">⚠ {errors.name.message}</p>
                : <p className="llm-hint">// {nameVal.length}/60 chars</p>
              }
            </div>

            {/* Description */}
            <div className="llm-field" style={{ marginBottom: 0 }}>
              <label className="llm-label">Description <span style={{ opacity: .4 }}>(optional)</span></label>
              <textarea
                className="llm-textarea"
                placeholder="What problems does this playlist cover?"
                {...register("description")}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="llm-footer">
            <button type="button" className="llm-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="llm-btn-submit">
              Create →
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreatePlaylistModal;