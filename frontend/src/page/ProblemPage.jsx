import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang.js";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";

import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();

  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const { executeCode, submission, isExecuting } = useExecutionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.[selectedLanguage] ||
          submission?.sourceCode ||
          ""
      );

      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();

    try {
      const language_id = getLanguageId(selectedLanguage);

      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);

      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#050a0a] text-[#00ff88]">
        Loading Problem...
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6 text-sm leading-relaxed">

            <p>{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-lg font-semibold text-[#00ff88]">
                  Examples
                </h3>

                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div
                    key={lang}
                    className="border border-[#00ff88]/20 p-4 bg-[#0b1313]"
                  >
                    <p>
                      <strong>Input:</strong> {example.input}
                    </p>

                    <p>
                      <strong>Output:</strong> {example.output}
                    </p>

                    {example.explanation && (
                      <p className="text-gray-400 mt-2">
                        {example.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-lg font-semibold text-[#00ff88]">
                  Constraints
                </h3>

                <div className="border border-[#00ff88]/20 p-4 bg-[#0b1313]">
                  {problem.constraints}
                </div>
              </>
            )}
          </div>
        );

      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );

      case "discussion":
        return (
          <div className="text-gray-400">No discussions yet</div>
        );

      case "hints":
        return (
          <div>
            {problem?.hints ? (
              <div className="border border-[#00ff88]/20 p-4 bg-[#0b1313]">
                {problem.hints}
              </div>
            ) : (
              <div className="text-gray-400">No hints available</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0a] text-[#e0ffe8]">

      {/* NAVBAR */}
      <div className="flex justify-between items-center border-b border-[#00ff88]/20 px-6 py-4 bg-[#0b1313]">

        <div className="flex items-center gap-2">
          <Link to="/">
            <Home size={20} />
          </Link>

          <ChevronRight size={16} />

          <span className="font-semibold">{problem.title}</span>
        </div>

        <div className="flex items-center gap-4">

          <button onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark size={18} />
          </button>

          <button>
            <Share2 size={18} />
          </button>

          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="bg-[#050a0a] border border-[#00ff88]/20 px-2 py-1"
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">

        {/* LEFT PANEL */}
        <div className="border border-[#00ff88]/20 bg-[#0b1313]">

          {/* TABS */}
          <div className="flex border-b border-[#00ff88]/20">

            {[
              ["description", "Description", FileText],
              ["submissions", "Submissions", Code2],
              ["discussion", "Discussion", MessageSquare],
              ["hints", "Hints", Lightbulb],
            ].map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm border-b-2 ${
                  activeTab === key
                    ? "border-[#00ff88] text-[#00ff88]"
                    : "border-transparent text-gray-400"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}

          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>

        </div>

        {/* CODE EDITOR */}
        <div className="border border-[#00ff88]/20 bg-[#0b1313] flex flex-col">

          <div className="border-b border-[#00ff88]/20 p-3 flex items-center gap-2 text-sm">
            <Terminal size={16} />
            Code Editor
          </div>

          <div className="flex-1">
            <Editor
              height="500px"
              language={selectedLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="flex justify-between p-4 border-t border-[#00ff88]/20">

            <button
              onClick={handleRunCode}
              disabled={isExecuting}
              className="flex items-center gap-2 border border-[#00ff88] px-4 py-2 hover:bg-[#00ff88] hover:text-black transition"
            >
              <Play size={14} />
              Run Code
            </button>

            <button className="flex items-center gap-2 border border-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition">
              Submit Solution
            </button>

          </div>

        </div>

      </div>

      {/* TEST CASES */}
      <div className="p-4">

        {submission ? (
          <Submission submission={submission} />
        ) : (
          <div className="border border-[#00ff88]/20 bg-[#0b1313] p-4">

            <h3 className="text-lg mb-4 text-[#00ff88]">
              Test Cases
            </h3>

            <table className="w-full text-sm">

              <thead className="text-gray-400">
                <tr>
                  <th className="text-left">Input</th>
                  <th className="text-left">Expected Output</th>
                </tr>
              </thead>

              <tbody>
                {testcases.map((testCase, index) => (
                  <tr key={index} className="border-t border-[#00ff88]/10">
                    <td className="font-mono">{testCase.input}</td>
                    <td className="font-mono">{testCase.output}</td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default ProblemPage;