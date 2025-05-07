import dotenv from "dotenv";
export const getJudge0LanguageId = (Language) => {
  const languageMap = {
    TYPESCRIPT: 74,
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[languageMap.toupperCase()] || null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitBatch = async (submission) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch{?base64_encoded=false }`,
    {
      submission,
    }
  );
  console.log("Submission Results:", data);
  return data;
};

export const pollBatchResults = async (token) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submission/batch`,
      {
        paams: {
          tokens: tokens.json(","),
          base64_encoded: false,
        },
      }
    );
    const results = data.submission;
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );
    if (isAllDone) return results;
    await sleep(1000);
  }
};
