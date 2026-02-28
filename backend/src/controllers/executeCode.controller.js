import { db } from "../libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    // ✅ FIXED: problemId is STRING (UUID)
    if (!problemId || typeof problemId !== "string") {
      return res.status(400).json({ error: "Invalid problemId" });
    }

    // ✅ Check if problem exists
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(400).json({ error: "Problem not found" });
    }

    // ✅ Validate testcases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or Missing test cases" });
    }

    // ✅ Prepare Judge0 submissions
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((r) => r.token);

    const results = await pollBatchResults(tokens);

    let allPassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim() || "";
      const expected = expected_outputs[i]?.trim() || "";
      const passed = stdout === expected;

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status?.description || "Unknown",
        memory: result.memory ? `${result.memory} KB` : null,
        time: result.time ? `${result.time} s` : null,
      };
    });

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: JSON.stringify(detailedResults.map((r) => r.stderr)),
        compileOutput: JSON.stringify(
          detailedResults.map((r) => r.compileOutput)
        ),
        status: allPassed ? "ACCEPTED" : "WRONG_ANSWER",
        memory: JSON.stringify(detailedResults.map((r) => r.memory)),
        time: JSON.stringify(detailedResults.map((r) => r.time)),
      },
    });

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    await db.testCaseResult.createMany({
      data: detailedResults.map((result) => ({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected,
        stderr: result.stderr,
        compileOutput: result.compileOutput,
        status: result.status,
        memory: result.memory,
        time: result.time,
      })),
    });

    res.status(200).json({
      success: true,
      allPassed,
      results: detailedResults,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      error: "Failed to execute code",
      details: error.message,
    });
  }
};