import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus, Trash2, Code2, FileText, Lightbulb,
  BookOpen, CheckCircle2, Download, Terminal,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/* ─── Schema (unchanged) ────────────────────────────────────────────────── */
const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testcases: z.array(z.object({
    input: z.string().min(1, "Input is required"),
    output: z.string().min(1, "Output is required"),
  })).min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().optional() }),
    PYTHON:     z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().optional() }),
    JAVA:       z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().optional() }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1),
    PYTHON:     z.string().min(1),
    JAVA:       z.string().min(1),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1),
    PYTHON:     z.string().min(1),
    JAVA:       z.string().min(1),
  }),
});

/* ─── Sample data (unchanged, trimmed for brevity) ──────────────────────── */
const sampledpData = {
  title: "Climbing Stairs", difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  constraints: "1 <= n <= 45",
  hints: "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial: "Classic DP problem forming a Fibonacci-like sequence.",
  testcases: [{ input: "2", output: "2" }, { input: "3", output: "3" }],
  examples: {
    JAVASCRIPT: { input: "n = 2", output: "2", explanation: "1+1 or 2" },
    PYTHON:     { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
    JAVA:       { input: "n = 4", output: "5", explanation: "Five ways to climb" },
  },
  codeSnippets: {
    JAVASCRIPT: "function climbStairs(n) {\n  // Write your code here\n}",
    PYTHON: "def climb_stairs(n):\n    # Write your code here\n    pass",
    JAVA: "public class Main {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}",
  },
  referenceSolutions: {
    JAVASCRIPT: "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) { let t = a + b; a = b; b = t; }\n  return b;\n}",
    PYTHON: "def climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1): a, b = b, a+b\n    return b",
    JAVA: "public int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) { int t = a+b; a=b; b=t; }\n    return b;\n}",
  },
};

const sampleStringProblem = {
  title: "Valid Palindrome", difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  description: "Given a string s, return true if it is a palindrome after lowercasing and removing non-alphanumeric characters.",
  constraints: "1 <= s.length <= 2 * 10^5",
  hints: "Use two pointers from both ends.",
  editorial: "Filter chars, then check with two pointers.",
  testcases: [{ input: "A man, a plan, a canal: Panama", output: "true" }],
  examples: {
    JAVASCRIPT: { input: '"A man, a plan, a canal: Panama"', output: "true", explanation: "amanaplanacanalpanama is a palindrome" },
    PYTHON:     { input: '"A man, a plan, a canal: Panama"', output: "true", explanation: "amanaplanacanalpanama is a palindrome" },
    JAVA:       { input: '"A man, a plan, a canal: Panama"', output: "true", explanation: "amanaplanacanalpanama is a palindrome" },
  },
  codeSnippets: {
    JAVASCRIPT: "function isPalindrome(s) {\n  // Write your code here\n}",
    PYTHON: "def is_palindrome(s):\n    # Write your code here\n    pass",
    JAVA: "public class Main {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}",
  },
  referenceSolutions: {
    JAVASCRIPT: "function isPalindrome(s) {\n  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return s === s.split('').reverse().join('');\n}",
    PYTHON: "def is_palindrome(s):\n    s = ''.join(c.lower() for c in s if c.isalnum())\n    return s == s[::-1]",
    JAVA: "public boolean isPalindrome(String s) {\n    s = s.replaceAll('[^a-zA-Z0-9]','').toLowerCase();\n    int l=0,r=s.length()-1;\n    while(l<r){if(s.charAt(l)!=s.charAt(r))return false;l++;r--;}\n    return true;\n}",
  },
};

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Syne:wght@700;800&display=swap');

    .llcpf {
      --green:  #00ff88;
      --green2: #00cc6a;
      --yellow: #ffd600;
      --red:    #ff3e5e;
      --cyan:   #00e5ff;
      --bg:     #050a0a;
      --bg2:    #0a1010;
      --bg3:    #0d1818;
      --border: rgba(0,255,136,0.13);
      --mono:   'Share Tech Mono', monospace;
      --sans:   'Syne', sans-serif;
      font-family: var(--mono);
      background: var(--bg);
      color: #e0ffe8;
      min-height: 100vh;
      padding: 6rem 1.25rem 4rem;
    }

    .llcpf::before {
      content:'';
      position:fixed;inset:0;z-index:9999;pointer-events:none;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.05) 2px,rgba(0,0,0,.05) 4px);
    }

    .llcpf-inner { max-width: 1100px; margin: 0 auto; }

    @keyframes llcpf-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes llcpf-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes llcpf-scanH  { from{top:-100%} to{top:200%} }

    /* ── page header ── */
    .llcpf-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      flex-wrap: wrap; gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2.5rem;
      animation: llcpf-fadeUp .5s ease both;
    }
    .llcpf-header-left { display: flex; align-items: center; gap: .75rem; }
    .llcpf-header-dot  { width:6px;height:6px;background:var(--green);border-radius:50%;animation:llcpf-blink 1.4s step-end infinite; }
    .llcpf-page-tag    { font-size:.65rem;letter-spacing:.22em;text-transform:uppercase;color:var(--green2); }
    .llcpf-page-title  { font-family:var(--sans);font-size:clamp(1.4rem,3vw,2rem);font-weight:800;color:#e0ffe8;letter-spacing:-.01em; }

    /* sample loader row */
    .llcpf-sample-row  { display:flex;align-items:center;gap:.5rem;flex-wrap:wrap; }
    .llcpf-seg-btn {
      font-family:var(--mono);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;
      padding:.42rem .9rem;border:1px solid var(--border);background:transparent;
      color:rgba(224,255,232,.4);cursor:pointer;transition:all .2s;
    }
    .llcpf-seg-btn:hover,.llcpf-seg-btn.active {
      border-color:var(--green);color:var(--green);background:rgba(0,255,136,.06);
    }
    .llcpf-load-btn {
      font-family:var(--mono);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;
      padding:.42rem 1rem;border:none;background:var(--green);
      color:#050a0a;font-weight:700;cursor:pointer;
      display:flex;align-items:center;gap:.4rem;
      transition:background .2s,transform .15s;
    }
    .llcpf-load-btn:hover { background:#fff;transform:translateY(-1px); }

    /* ── section card ── */
    .llcpf-section {
      border:1px solid var(--border);
      background:var(--bg2);
      margin-bottom:1.5rem;
      animation: llcpf-fadeUp .5s ease both;
      position:relative;overflow:hidden;
    }
    .llcpf-section::before {
      content:'';position:absolute;top:0;left:0;right:0;height:1px;
      background:linear-gradient(90deg,transparent,var(--green),transparent);
      opacity:.25;
    }
    .llcpf-section-head {
      display:flex;align-items:center;justify-content:space-between;
      padding:.9rem 1.25rem;
      border-bottom:1px solid var(--border);
      background:rgba(0,255,136,.025);
    }
    .llcpf-section-title {
      display:flex;align-items:center;gap:.6rem;
      font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;
      color:var(--green2);
    }
    .llcpf-section-body { padding:1.25rem; }

    /* ── subsection card (test case / code) ── */
    .llcpf-sub {
      border:1px solid var(--border);
      background:var(--bg3);
      margin-bottom:1rem;
      position:relative;overflow:hidden;
    }
    .llcpf-sub:last-child { margin-bottom:0; }
    .llcpf-sub-head {
      display:flex;align-items:center;justify-content:space-between;
      padding:.65rem 1rem;
      border-bottom:1px solid var(--border);
      font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(0,255,136,.45);
    }
    .llcpf-sub-body { padding:1rem; }

    /* ── inputs ── */
    .llcpf-field { margin-bottom:1rem; }
    .llcpf-field:last-child { margin-bottom:0; }
    .llcpf-label {
      display:block;font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(0,255,136,.5);margin-bottom:.4rem;
    }
    .llcpf-input, .llcpf-textarea, .llcpf-select {
      width:100%;background:rgba(0,0,0,.5);
      border:1px solid var(--border);
      color:#e0ffe8;font-family:var(--mono);font-size:.875rem;
      padding:.7rem .85rem;outline:none;border-radius:0;
      transition:border-color .2s,box-shadow .2s;
      -webkit-appearance:none;
    }
    .llcpf-input::placeholder,.llcpf-textarea::placeholder { color:rgba(224,255,232,.18); }
    .llcpf-input:focus,.llcpf-textarea:focus,.llcpf-select:focus {
      border-color:var(--green);box-shadow:0 0 0 3px rgba(0,255,136,.07);
    }
    .llcpf-input.err,.llcpf-textarea.err { border-color:var(--red); }
    .llcpf-textarea { resize:vertical;min-height:80px;line-height:1.65; }
    .llcpf-select { cursor:pointer; }
    .llcpf-select option { background:#0a1010; }
    .llcpf-error { font-size:.68rem;color:var(--red);margin-top:.3rem;letter-spacing:.04em; }

    /* difficulty badge inside select wrapper */
    .llcpf-diff-row { display:flex;gap:2px; }
    .llcpf-diff-opt {
      flex:1;padding:.6rem;text-align:center;cursor:pointer;
      border:1px solid var(--border);background:transparent;
      font-family:var(--mono);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;
      transition:all .2s;color:rgba(224,255,232,.35);
    }
    .llcpf-diff-opt.easy.active   { border-color:var(--green); color:var(--green);  background:rgba(0,255,136,.07); }
    .llcpf-diff-opt.medium.active { border-color:var(--yellow);color:var(--yellow);background:rgba(255,214,0,.07); }
    .llcpf-diff-opt.hard.active   { border-color:var(--red);   color:var(--red);   background:rgba(255,62,94,.07); }
    .llcpf-diff-opt:hover { border-color:rgba(224,255,232,.3);color:#e0ffe8; }

    /* tag chip */
    .llcpf-tags-grid { display:flex;flex-wrap:wrap;gap:.5rem; }
    .llcpf-tag-input-wrap { display:flex;align-items:center;gap:.35rem; }
    .llcpf-tag-input {
      background:rgba(0,0,0,.5);border:1px solid var(--border);
      color:#e0ffe8;font-family:var(--mono);font-size:.78rem;
      padding:.45rem .75rem;outline:none;
      transition:border-color .2s;min-width:120px;
    }
    .llcpf-tag-input:focus { border-color:var(--green); }

    /* icon buttons */
    .llcpf-icon-btn {
      width:28px;height:28px;border:1px solid var(--border);
      background:transparent;cursor:pointer;
      display:flex;align-items:center;justify-content:center;
      color:rgba(224,255,232,.35);transition:all .2s;flex-shrink:0;
    }
    .llcpf-icon-btn:hover:not(:disabled) { border-color:var(--red);color:var(--red);background:rgba(255,62,94,.06); }
    .llcpf-icon-btn:disabled { opacity:.25;cursor:not-allowed; }

    .llcpf-add-btn {
      font-family:var(--mono);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;
      padding:.38rem .85rem;border:1px solid var(--border);
      background:transparent;color:var(--green);cursor:pointer;
      display:flex;align-items:center;gap:.35rem;
      transition:all .2s;
    }
    .llcpf-add-btn:hover { border-color:var(--green);background:rgba(0,255,136,.06); }

    /* editor border */
    .llcpf-editor-wrap {
      border:1px solid var(--border);overflow:hidden;
    }

    /* grid helpers */
    .llcpf-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
    @media(max-width:640px){ .llcpf-grid-2 { grid-template-columns:1fr; } }
    .llcpf-span-2 { grid-column:1/-1; }

    /* language tab */
    .llcpf-lang-header {
      display:flex;align-items:center;gap:.6rem;
      font-family:var(--sans);font-size:1rem;font-weight:700;
      color:#e0ffe8;margin-bottom:1.25rem;
    }
    .llcpf-lang-badge {
      font-family:var(--mono);font-size:.6rem;letter-spacing:.18em;
      padding:.2rem .55rem;border:1px solid var(--border);
      color:var(--cyan);
    }

    /* submit */
    .llcpf-submit-row {
      display:flex;justify-content:flex-end;
      padding-top:1.25rem;border-top:1px solid var(--border);
      margin-top:1.5rem;
    }
    .llcpf-submit {
      font-family:var(--mono);font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;
      font-weight:700;padding:.8rem 2rem;
      border:none;background:var(--green);color:#050a0a;
      cursor:pointer;display:flex;align-items:center;gap:.5rem;
      transition:background .2s,transform .15s;
    }
    .llcpf-submit:hover:not(:disabled) { background:#fff;transform:translateY(-1px); }
    .llcpf-submit:disabled { opacity:.55;cursor:not-allowed; }

    .llcpf-spinner {
      width:16px;height:16px;border:2px solid rgba(5,10,10,.3);
      border-top-color:#050a0a;border-radius:50%;
      animation:llcpf-spin .7s linear infinite;
    }
    @keyframes llcpf-spin { to{transform:rotate(360deg)} }
  `}</style>
);

/* ─── helpers ────────────────────────────────────────────────────────────── */
const SectionCard = ({ icon, label, action, children }) => (
  <div className="llcpf-section">
    <div className="llcpf-section-head">
      <span className="llcpf-section-title">{icon}{label}</span>
      {action}
    </div>
    <div className="llcpf-section-body">{children}</div>
  </div>
);

const Field = ({ label, error, children }) => (
  <div className="llcpf-field">
    <label className="llcpf-label">{label}</label>
    {children}
    {error && <p className="llcpf-error">⚠ {error}</p>}
  </div>
);

const editorOpts = {
  minimap: { enabled: false }, fontSize: 13,
  lineNumbers: "on", scrollBeyondLastLine: false,
  automaticLayout: true, fontFamily: "'Share Tech Mono', monospace",
};

/* ─── Component ──────────────────────────────────────────────────────────── */
const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();

  const { register, control, handleSubmit, reset, watch, setValue,
    formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: "EASY",
      testcases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON:     { input: "", output: "", explanation: "" },
        JAVA:       { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
      },
    },
  });

  const difficulty = watch("difficulty");

  const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase, replace: replaceTestcases } = useFieldArray({ control, name: "testcases" });
  const { fields: tagFields, append: appendTag, remove: removeTag, replace: replaceTags } = useFieldArray({ control, name: "tags" });

  const onSubmit = async (value) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", value);
      toast.success(res.data.message || "Problem created ⚡");
      navigation("/");
    } catch (error) {
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const data = sampleType === "DP" ? sampledpData : sampleStringProblem;
    replaceTags(data.tags.map((t) => t));
    replaceTestcases(data.testcases.map((tc) => tc));
    reset(data);
  };

  return (
    <div className="llcpf">
      <Styles />
      <div className="llcpf-inner">

        {/* ── Header ── */}
        <div className="llcpf-header">
          <div className="llcpf-header-left">
            <span className="llcpf-header-dot" />
            <Terminal size={14} color="var(--green)" style={{ opacity: .6 }} />
            <div>
              <div className="llcpf-page-tag">admin — problem.create</div>
              <div className="llcpf-page-title">Create Problem</div>
            </div>
          </div>
          <div className="llcpf-sample-row">
            <button type="button" className={`llcpf-seg-btn${sampleType === "DP" ? " active" : ""}`} onClick={() => setSampleType("DP")}>DP</button>
            <button type="button" className={`llcpf-seg-btn${sampleType === "string" ? " active" : ""}`} onClick={() => setSampleType("string")}>String</button>
            <button type="button" className="llcpf-load-btn" onClick={loadSampleData}>
              <Download size={13} /> Load Sample
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* ── Basic Info ── */}
          <SectionCard icon={<FileText size={13} />} label="Basic Information">
            <div style={{ display: "grid", gap: "1rem" }}>
              <Field label="Title" error={errors.title?.message}>
                <input type="text" className={`llcpf-input${errors.title ? " err" : ""}`} placeholder="Enter problem title" {...register("title")} />
              </Field>
              <Field label="Description" error={errors.description?.message}>
                <textarea className={`llcpf-textarea${errors.description ? " err" : ""}`} style={{ minHeight: 110 }} placeholder="Describe the problem clearly..." {...register("description")} />
              </Field>
              <Field label="Difficulty" error={errors.difficulty?.message}>
                <div className="llcpf-diff-row">
                  {[["EASY","easy"], ["MEDIUM","medium"], ["HARD","hard"]].map(([val, cls]) => (
                    <button key={val} type="button"
                      className={`llcpf-diff-opt ${cls}${difficulty === val ? " active" : ""}`}
                      onClick={() => setValue("difficulty", val)}>
                      {val}
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("difficulty")} />
              </Field>
            </div>
          </SectionCard>

          {/* ── Tags ── */}
          <SectionCard
            icon={<BookOpen size={13} />}
            label="Tags"
            action={
              <button type="button" className="llcpf-add-btn" onClick={() => appendTag("")}>
                <Plus size={12} /> Add Tag
              </button>
            }
          >
            <div className="llcpf-tags-grid">
              {tagFields.map((field, index) => (
                <div key={field.id} className="llcpf-tag-input-wrap">
                  <input type="text" className="llcpf-tag-input" placeholder="e.g. Arrays" {...register(`tags.${index}`)} />
                  <button type="button" className="llcpf-icon-btn" onClick={() => removeTag(index)} disabled={tagFields.length === 1}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            {errors.tags && <p className="llcpf-error" style={{ marginTop: ".5rem" }}>⚠ {errors.tags.message}</p>}
          </SectionCard>

          {/* ── Test Cases ── */}
          <SectionCard
            icon={<CheckCircle2 size={13} />}
            label="Test Cases"
            action={
              <button type="button" className="llcpf-add-btn" onClick={() => appendTestCase({ input: "", output: "" })}>
                <Plus size={12} /> Add Test Case
              </button>
            }
          >
            {testCaseFields.map((field, index) => (
              <div key={field.id} className="llcpf-sub">
                <div className="llcpf-sub-head">
                  <span>test_case_{String(index + 1).padStart(2, "0")}</span>
                  <button type="button" className="llcpf-icon-btn" onClick={() => removeTestCase(index)} disabled={testCaseFields.length === 1}>
                    <Trash2 size={11} />
                  </button>
                </div>
                <div className="llcpf-sub-body">
                  <div className="llcpf-grid-2">
                    <Field label="Input" error={errors.testcases?.[index]?.input?.message}>
                      <textarea className={`llcpf-textarea${errors.testcases?.[index]?.input ? " err" : ""}`} placeholder="stdin input" {...register(`testcases.${index}.input`)} />
                    </Field>
                    <Field label="Expected Output" error={errors.testcases?.[index]?.output?.message}>
                      <textarea className={`llcpf-textarea${errors.testcases?.[index]?.output ? " err" : ""}`} placeholder="expected stdout" {...register(`testcases.${index}.output`)} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
            {errors.testcases && !Array.isArray(errors.testcases) && (
              <p className="llcpf-error">⚠ {errors.testcases.message}</p>
            )}
          </SectionCard>

          {/* ── Code Sections ── */}
          {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
            <SectionCard key={lang} icon={<Code2 size={13} />} label={`Code — ${lang}`}>

              {/* Starter */}
              <div className="llcpf-sub">
                <div className="llcpf-sub-head">
                  <span>starter_template</span>
                  <span style={{ color: "var(--cyan)", fontSize: ".6rem", letterSpacing: ".15em" }}>{lang.toLowerCase()}</span>
                </div>
                <div className="llcpf-editor-wrap">
                  <Controller name={`codeSnippets.${lang}`} control={control} render={({ field }) => (
                    <Editor height="260px" language={lang.toLowerCase()} theme="vs-dark" value={field.value} onChange={field.onChange} options={editorOpts} />
                  )} />
                </div>
                {errors.codeSnippets?.[lang] && <p className="llcpf-error" style={{ padding: ".3rem 1rem .5rem" }}>⚠ {errors.codeSnippets[lang].message}</p>}
              </div>

              {/* Reference */}
              <div className="llcpf-sub">
                <div className="llcpf-sub-head">
                  <span style={{ color: "var(--green)" }}>reference_solution</span>
                  <CheckCircle2 size={11} color="var(--green)" />
                </div>
                <div className="llcpf-editor-wrap">
                  <Controller name={`referenceSolutions.${lang}`} control={control} render={({ field }) => (
                    <Editor height="260px" language={lang.toLowerCase()} theme="vs-dark" value={field.value} onChange={field.onChange} options={editorOpts} />
                  )} />
                </div>
                {errors.referenceSolutions?.[lang] && <p className="llcpf-error" style={{ padding: ".3rem 1rem .5rem" }}>⚠ {errors.referenceSolutions[lang].message}</p>}
              </div>

              {/* Example */}
              <div className="llcpf-sub">
                <div className="llcpf-sub-head"><span>example_io</span></div>
                <div className="llcpf-sub-body">
                  <div className="llcpf-grid-2">
                    <Field label="Input" error={errors.examples?.[lang]?.input?.message}>
                      <textarea className={`llcpf-textarea${errors.examples?.[lang]?.input ? " err" : ""}`} placeholder="Example input" {...register(`examples.${lang}.input`)} />
                    </Field>
                    <Field label="Output" error={errors.examples?.[lang]?.output?.message}>
                      <textarea className={`llcpf-textarea${errors.examples?.[lang]?.output ? " err" : ""}`} placeholder="Example output" {...register(`examples.${lang}.output`)} />
                    </Field>
                    <div className="llcpf-span-2">
                      <Field label="Explanation (optional)">
                        <textarea className="llcpf-textarea" placeholder="Explain the example" {...register(`examples.${lang}.explanation`)} />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>

            </SectionCard>
          ))}

          {/* ── Additional Info ── */}
          <SectionCard icon={<Lightbulb size={13} />} label="Additional Information">
            <div style={{ display: "grid", gap: "1rem" }}>
              <Field label="Constraints" error={errors.constraints?.message}>
                <textarea className={`llcpf-textarea${errors.constraints ? " err" : ""}`} placeholder="e.g. 1 <= n <= 10^5" {...register("constraints")} />
              </Field>
              <Field label="Hints (optional)">
                <textarea className="llcpf-textarea" placeholder="Give solvers a nudge..." {...register("hints")} />
              </Field>
              <Field label="Editorial (optional)">
                <textarea className="llcpf-textarea" style={{ minHeight: 100 }} placeholder="Full solution explanation..." {...register("editorial")} />
              </Field>
            </div>
          </SectionCard>

          {/* ── Submit ── */}
          <div className="llcpf-submit-row">
            <button type="submit" className="llcpf-submit" disabled={isLoading}>
              {isLoading
                ? <><div className="llcpf-spinner" /> Deploying...</>
                : <><CheckCircle2 size={15} /> Create Problem</>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProblemForm;