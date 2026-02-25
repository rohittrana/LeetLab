import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

/* ======================================
   CREATE PROBLEM
====================================== */
export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    // Basic validation
    if (!title || !description || !difficulty) {
      return res.status(400).json({
        error: "Title, description and difficulty are required",
      });
    }

    if (!Array.isArray(testcases) || testcases.length === 0) {
      return res.status(400).json({
        error: "At least one testcase is required",
      });
    }

    if (
      !referenceSolutions ||
      typeof referenceSolutions !== "object" ||
      Object.keys(referenceSolutions).length === 0
    ) {
      return res.status(400).json({
        error: "Reference solutions are required",
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // Validate reference solutions using Judge0
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({
          error: `Language ${language} is not supported`,
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((r) => r.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        if (!results[i] || results[i].status?.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("CREATE PROBLEM ERROR:", error);
    return res.status(500).json({
      error: "Error while creating problem ",
    });
  }
};

/* ======================================
   GET ALL PROBLEMS
====================================== */
export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    return res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    return res.status(500).json({
      error: "Error while fetching problems",
    });
  }
};

/* ======================================
   GET PROBLEM BY ID
====================================== */
export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: { id },
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("GET BY ID ERROR:", error);
    return res.status(500).json({
      error: "Error while fetching problem",
    });
  }
};

/* ======================================
   UPDATE PROBLEM
====================================== */
export const updateProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const existingProblem = await db.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    const updatedProblem = await db.problem.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({
      error: "Error while updating problem",
    });
  }
};

/* ======================================
   DELETE PROBLEM
====================================== */
export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const existingProblem = await db.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    await db.problem.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      error: "Error while deleting problem",
    });
  }
};

/* ======================================
   GET ALL PROBLEMS SOLVED BY USER
====================================== */
export const getAllProblemsSolvedByUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    console.error("FETCH SOLVED ERROR:", error);
    return res.status(500).json({
      error: "Failed to fetch solved problems",
    });
  }
};
