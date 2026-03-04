import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail, Terminal } from "lucide-react";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* ─── Injected styles ──────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@400;700;800&display=swap');

    .ll-login-root {
      --green:  #00ff88;
      --green2: #00cc6a;
      --cyan:   #00e5ff;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --bg3:    #0d1818;
      --border: rgba(0,255,136,0.15);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
    }

    /* scanlines */
    .ll-login-root::before {
      content:'';
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);
    }

    @keyframes ll-fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ll-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes ll-pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,.4)} 50%{box-shadow:0 0 0 10px rgba(0,255,136,0)} }
    @keyframes ll-scanH    { from{top:-100%} to{top:200%} }
    @keyframes ll-gridMove { from{background-position:0 0} to{background-position:0 48px} }

    /* ── left panel ── */
    .ll-left {
      background: var(--bg);
      display:flex; flex-direction:column; justify-content:center; align-items:center;
      padding:2rem 1.5rem;
      position:relative; overflow:hidden;
    }
    .ll-left-grid {
      position:absolute;inset:0;pointer-events:none;
      background-image:
        linear-gradient(rgba(0,255,136,.05) 1px,transparent 1px),
        linear-gradient(90deg,rgba(0,255,136,.05) 1px,transparent 1px);
      background-size:48px 48px;
      animation: ll-gridMove 4s linear infinite;
      mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
    }
    .ll-glow {
      position:absolute;width:500px;height:500px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,rgba(0,255,136,.09) 0%,transparent 70%);
      top:50%;left:50%;transform:translate(-50%,-50%);
    }

    .ll-card {
      position:relative;z-index:1;width:100%;max-width:420px;
      animation: ll-fadeUp .6s ease both;
    }

    /* logo */
    .ll-logo {
      display:flex;flex-direction:column;align-items:center;gap:.5rem;
      text-align:center;margin-bottom:2.5rem;
    }
    .ll-logo-icon {
      width:52px;height:52px;border:1px solid var(--border);
      display:flex;align-items:center;justify-content:center;
      background:rgba(0,255,136,.06);position:relative;overflow:hidden;
      transition:border-color .3s;
    }
    .ll-logo-icon:hover { border-color:var(--green); }
    .ll-logo-icon::after {
      content:'';position:absolute;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--green),transparent);
      animation:ll-scanH 2s linear infinite;
    }
    .ll-logo-tag {
      font-size:.65rem;letter-spacing:.28em;text-transform:uppercase;
      color:var(--green);opacity:.7;
    }
    .ll-logo-title {
      font-family:var(--sans);font-size:1.6rem;font-weight:800;
      color:#e0ffe8;letter-spacing:-.01em;
    }
    .ll-logo-sub { font-size:.78rem;color:rgba(224,255,232,.35);letter-spacing:.05em; }
    .ll-cursor { animation:ll-blink 1s step-end infinite;color:var(--green); }

    /* form box */
    .ll-box {
      border:1px solid var(--border);
      background:rgba(10,16,16,.8);
      padding:2rem 2rem 1.75rem;
      backdrop-filter:blur(8px);
    }
    .ll-box-header {
      font-size:.65rem;letter-spacing:.22em;text-transform:uppercase;
      color:var(--green2);margin-bottom:1.75rem;
      display:flex;align-items:center;gap:.5rem;
    }
    .ll-box-dot { width:6px;height:6px;background:var(--green);border-radius:50%;flex-shrink:0; }

    /* field */
    .ll-field { margin-bottom:1.25rem; }
    .ll-label {
      display:block;font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(0,255,136,.55);margin-bottom:.5rem;
    }
    .ll-input-wrap { position:relative; }
    .ll-input-icon {
      position:absolute;left:.85rem;top:50%;transform:translateY(-50%);
      pointer-events:none;color:rgba(0,255,136,.35);
    }
    .ll-input {
      width:100%;background:rgba(0,0,0,.4);border:1px solid var(--border);
      color:#e0ffe8;font-family:var(--mono);font-size:.875rem;
      padding:.75rem .85rem .75rem 2.6rem;outline:none;border-radius:0;
      transition:border-color .2s,box-shadow .2s;
      -webkit-appearance:none;
    }
    .ll-input::placeholder { color:rgba(224,255,232,.18); }
    .ll-input:focus {
      border-color:var(--green);
      box-shadow:0 0 0 3px rgba(0,255,136,.08);
    }
    .ll-input.ll-err { border-color:#ff3e5e; }
    .ll-input.ll-err:focus { box-shadow:0 0 0 3px rgba(255,62,94,.1); }
    .ll-eye {
      position:absolute;right:.85rem;top:50%;transform:translateY(-50%);
      background:none;border:none;cursor:pointer;
      color:rgba(0,255,136,.35);padding:0;transition:color .2s;
    }
    .ll-eye:hover { color:var(--green); }
    .ll-error-msg { font-size:.72rem;color:#ff3e5e;margin-top:.35rem;letter-spacing:.04em; }

    /* submit */
    .ll-submit {
      width:100%;margin-top:1.75rem;
      background:var(--green);color:#050a0a;
      font-family:var(--mono);font-size:.85rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
      padding:.85rem;border:none;cursor:pointer;
      display:flex;align-items:center;justify-content:center;gap:.6rem;
      transition:background .2s,transform .15s;
      animation:ll-pulse 3s ease infinite;
    }
    .ll-submit:hover:not(:disabled) { background:#fff;transform:translateY(-1px); }
    .ll-submit:disabled { opacity:.55;cursor:not-allowed;animation:none; }

    /* footer */
    .ll-footer {
      text-align:center;margin-top:1.5rem;
      font-size:.75rem;color:rgba(224,255,232,.3);letter-spacing:.04em;
    }
    .ll-footer a { color:var(--green);text-decoration:none;transition:opacity .2s; }
    .ll-footer a:hover { opacity:.75; }

    /* divider */
    .ll-divider {
      display:flex;align-items:center;gap:.75rem;margin:1.25rem 0;
    }
    .ll-divider-line { flex:1;height:1px;background:var(--border); }
    .ll-divider-text { font-size:.6rem;letter-spacing:.2em;color:rgba(0,255,136,.25);text-transform:uppercase; }
  `}</style>
);

/* ─── Component ─────────────────────────────────────────────────────────────── */
const LoginPage = () => {
  const { isLoggingIn, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="ll-login-root" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <Styles />

      {/* ── LEFT PANEL ── */}
      <div className="ll-left">
        <div className="ll-left-grid" />
        <div className="ll-glow" />

        <div className="ll-card">
          {/* Logo */}
          <div className="ll-logo">
            <div className="ll-logo-icon">
              <Terminal size={22} color="var(--green)" />
            </div>
            <span className="ll-logo-tag">LeetLab <span className="ll-cursor">█</span></span>
            <h1 className="ll-logo-title">Welcome Back</h1>
            <p className="ll-logo-sub">// authenticate to continue</p>
          </div>

          {/* Box */}
          <div className="ll-box">
            <div className="ll-box-header">
              <span className="ll-box-dot" />
              login_form.exec
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="ll-field">
                <label className="ll-label">Email address</label>
                <div className="ll-input-wrap">
                  <span className="ll-input-icon"><Mail size={15} /></span>
                  <input
                    type="email"
                    {...register("email")}
                    className={`ll-input${errors.email ? " ll-err" : ""}`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="ll-error-msg">⚠ {errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="ll-field">
                <label className="ll-label">Password</label>
                <div className="ll-input-wrap">
                  <span className="ll-input-icon"><Lock size={15} /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`ll-input${errors.password ? " ll-err" : ""}`}
                    placeholder="••••••••"
                    style={{ paddingRight: "2.8rem" }}
                  />
                  <button
                    type="button"
                    className="ll-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="ll-error-msg">⚠ {errors.password.message}</p>}
              </div>

              <button type="submit" className="ll-submit" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="ll-footer">
            No account?&nbsp;
            <Link to="/signup">Create one free</Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your journey. Don't have an account? Create one now."
      />
    </div>
  );
};

export default LoginPage;