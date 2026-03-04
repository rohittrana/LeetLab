import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, Terminal, User } from "lucide-react";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const SignUpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
});

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;700;800&display=swap');

    .ll-signup-root {
      --green:  #00ff88;
      --green2: #00cc6a;
      --red:    #ff3e5e;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --border: rgba(0,255,136,0.15);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
    }

    .ll-signup-root::before {
      content:'';
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);
    }

    @keyframes lls-fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes lls-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes lls-pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,.4)} 50%{box-shadow:0 0 0 10px rgba(0,255,136,0)} }
    @keyframes lls-scanH   { from{top:-100%} to{top:200%} }
    @keyframes lls-grid    { from{background-position:0 0} to{background-position:0 48px} }

    /* ── left panel ── */
    .lls-left {
      background:var(--bg);
      display:flex;flex-direction:column;justify-content:center;align-items:center;
      padding:2rem 1.5rem;
      position:relative;overflow:hidden;
    }
    .lls-grid {
      position:absolute;inset:0;pointer-events:none;
      background-image:
        linear-gradient(rgba(0,255,136,.05) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,255,136,.05) 1px,transparent 1px);
      background-size:48px 48px;
      animation:lls-grid 4s linear infinite;
      mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
    }
    .lls-glow {
      position:absolute;width:520px;height:520px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,rgba(0,255,136,.09) 0%,transparent 70%);
      top:50%;left:50%;transform:translate(-50%,-50%);
    }

    .lls-card {
      position:relative;z-index:1;width:100%;max-width:420px;
      animation:lls-fadeUp .6s ease both;
    }

    /* logo */
    .lls-logo {
      display:flex;flex-direction:column;align-items:center;gap:.4rem;
      text-align:center;margin-bottom:2rem;
    }
    .lls-logo-icon {
      width:52px;height:52px;border:1px solid var(--border);
      display:flex;align-items:center;justify-content:center;
      background:rgba(0,255,136,.06);position:relative;overflow:hidden;
      transition:border-color .3s;
    }
    .lls-logo-icon:hover { border-color:var(--green); }
    .lls-logo-icon::after {
      content:'';position:absolute;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--green),transparent);
      animation:lls-scanH 2s linear infinite;
    }
    .lls-logo-tag {
      font-size:.65rem;letter-spacing:.28em;text-transform:uppercase;
      color:var(--green);opacity:.7;
    }
    .lls-logo-title {
      font-family:var(--sans);font-size:1.6rem;font-weight:800;
      color:#e0ffe8;letter-spacing:-.01em;
    }
    .lls-logo-sub { font-size:.78rem;color:rgba(224,255,232,.35);letter-spacing:.05em; }
    .lls-cursor { animation:lls-blink 1s step-end infinite;color:var(--green); }

    /* box */
    .lls-box {
      border:1px solid var(--border);
      background:rgba(10,16,16,.8);
      padding:1.75rem 2rem;
      backdrop-filter:blur(8px);
    }
    .lls-box-header {
      font-size:.65rem;letter-spacing:.22em;text-transform:uppercase;
      color:var(--green2);margin-bottom:1.5rem;
      display:flex;align-items:center;gap:.5rem;
    }
    .lls-dot { width:6px;height:6px;background:var(--green);border-radius:50%;flex-shrink:0; }

    /* progress bar */
    .lls-progress-wrap {
      display:flex;gap:4px;margin-bottom:1.5rem;
    }
    .lls-progress-seg {
      flex:1;height:2px;background:var(--border);transition:background .4s;
    }
    .lls-progress-seg.active { background:var(--green); }

    /* field */
    .lls-field { margin-bottom:1.1rem; }
    .lls-label {
      display:block;font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(0,255,136,.55);margin-bottom:.45rem;
    }
    .lls-input-wrap { position:relative; }
    .lls-input-icon {
      position:absolute;left:.85rem;top:50%;transform:translateY(-50%);
      pointer-events:none;color:rgba(0,255,136,.35);
    }
    .lls-input {
      width:100%;background:rgba(0,0,0,.4);border:1px solid var(--border);
      color:#e0ffe8;font-family:var(--mono);font-size:.875rem;
      padding:.72rem .85rem .72rem 2.6rem;outline:none;border-radius:0;
      transition:border-color .2s,box-shadow .2s;
      -webkit-appearance:none;
    }
    .lls-input::placeholder { color:rgba(224,255,232,.18); }
    .lls-input:focus {
      border-color:var(--green);
      box-shadow:0 0 0 3px rgba(0,255,136,.08);
    }
    .lls-input.lls-err { border-color:var(--red); }
    .lls-input.lls-err:focus { box-shadow:0 0 0 3px rgba(255,62,94,.1); }
    .lls-eye {
      position:absolute;right:.85rem;top:50%;transform:translateY(-50%);
      background:none;border:none;cursor:pointer;
      color:rgba(0,255,136,.35);padding:0;transition:color .2s;
    }
    .lls-eye:hover { color:var(--green); }
    .lls-error { font-size:.72rem;color:var(--red);margin-top:.3rem;letter-spacing:.04em; }

    /* submit */
    .lls-submit {
      width:100%;margin-top:1.5rem;
      background:var(--green);color:#050a0a;
      font-family:var(--mono);font-size:.85rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
      padding:.85rem;border:none;cursor:pointer;
      display:flex;align-items:center;justify-content:center;gap:.6rem;
      transition:background .2s,transform .15s;
      animation:lls-pulse 3s ease infinite;
    }
    .lls-submit:hover:not(:disabled) { background:#fff;transform:translateY(-1px); }
    .lls-submit:disabled { opacity:.55;cursor:not-allowed;animation:none; }

    /* terms note */
    .lls-terms {
      font-size:.65rem;color:rgba(0,255,136,.25);text-align:center;
      margin-top:.85rem;letter-spacing:.04em;line-height:1.6;
    }

    /* footer */
    .lls-footer {
      text-align:center;margin-top:1.25rem;
      font-size:.75rem;color:rgba(224,255,232,.3);letter-spacing:.04em;
    }
    .lls-footer a { color:var(--green);text-decoration:none;transition:opacity .2s; }
    .lls-footer a:hover { opacity:.75; }

    @media (max-width:1023px) {
      .lls-right { display:none; }
      .ll-signup-root { grid-template-columns:1fr !important; }
    }
  `}</style>
);

/* ─── Component ──────────────────────────────────────────────────────────── */
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigninUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  // progress indicator based on filled fields
  const watched = watch(["name", "email", "password"]);
  const filled = watched.filter(Boolean).length;

  const onSubmit = async (data) => {
    try {
      await signup(data);
    } catch (error) {
      console.error("SignUp failed:", error);
    }
  };

  return (
    <div
      className="ll-signup-root"
      style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}
    >
      <Styles />

      {/* ── LEFT PANEL ── */}
      <div className="lls-left">
        <div className="lls-grid" />
        <div className="lls-glow" />

        <div className="lls-card">
          {/* Logo */}
          <div className="lls-logo">
            <div className="lls-logo-icon">
              <Terminal size={22} color="var(--green)" />
            </div>
            <span className="lls-logo-tag">
              LeetLab <span className="lls-cursor">█</span>
            </span>
            <h1 className="lls-logo-title">Create Account</h1>
            <p className="lls-logo-sub">// initializing new user session</p>
          </div>

          {/* Box */}
          <div className="lls-box">
            <div className="lls-box-header">
              <span className="lls-dot" />
              signup_form.exec — {filled}/3 fields
            </div>

            {/* Progress */}
            <div className="lls-progress-wrap">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`lls-progress-seg${i < filled ? " active" : ""}`}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="lls-field">
                <label className="lls-label">Display name</label>
                <div className="lls-input-wrap">
                  <span className="lls-input-icon"><User size={15} /></span>
                  <input
                    type="text"
                    {...register("name")}
                    className={`lls-input${errors.name ? " lls-err" : ""}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="lls-error">⚠ {errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="lls-field">
                <label className="lls-label">Email address</label>
                <div className="lls-input-wrap">
                  <span className="lls-input-icon"><Mail size={15} /></span>
                  <input
                    type="email"
                    {...register("email")}
                    className={`lls-input${errors.email ? " lls-err" : ""}`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="lls-error">⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="lls-field">
                <label className="lls-label">Password</label>
                <div className="lls-input-wrap">
                  <span className="lls-input-icon"><Lock size={15} /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`lls-input${errors.password ? " lls-err" : ""}`}
                    placeholder="••••••••"
                    style={{ paddingRight: "2.8rem" }}
                  />
                  <button
                    type="button"
                    className="lls-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="lls-error">⚠ {errors.password.message}</p>}
              </div>

              <button type="submit" className="lls-submit" disabled={isSigninUp}>
                {isSigninUp ? (
                  <><Loader2 size={16} className="animate-spin" /> Initializing...</>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            <p className="lls-terms">
              By signing up you agree to our Terms of Service &amp; Privacy Policy
            </p>
          </div>

          {/* Footer */}
          <div className="lls-footer">
            Already have an account?&nbsp;
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lls-right">
        <AuthImagePattern
          title="Welcome to LeetLab!"
          subtitle="Sign up to access our platform and start solving problems."
        />
      </div>
    </div>
  );
};

export default SignUpPage;