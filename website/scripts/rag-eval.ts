import { ragRetriever } from '../lib/rag/retriever';
import { createAIClient } from '../lib/ai/client';

const EVAL_QUESTIONS = [
  {
    query: "What is Dentl2?",
    expectedKeywords: ["3D", "charting", "patient", "dashboard", "dental"]
  },
  {
    query: "Explain the architecture of AegisFlow.",
    expectedKeywords: ["workflow", "engine", "visual", "automation", "integration"]
  },
  {
    query: "How does the enterprise RAG system work?",
    expectedKeywords: ["pgvector", "jina", "supabase", "chunking", "semantic", "pipeline"]
  }
];

async function runEvaluation() {
  console.log('==================================================');
  console.log('          ENTERPRISE RAG V2 EVALUATION SUITE      ');
  console.log('==================================================');

  const aiClient = createAIClient();
  let totalPrecision = 0;
  let totalRecall = 0;
  let cragPasses = 0;

  for (let i = 0; i < EVAL_QUESTIONS.length; i++) {
    const testCase = EVAL_QUESTIONS[i]!;
    console.log(`\n[Test ${i + 1}/${EVAL_QUESTIONS.length}] Query: "${testCase.query}"`);
    
    const start = Date.now();
    const { contextText, cragEval } = await ragRetriever.retrieve(testCase.query, 5, 0.3);
    const latency = Date.now() - start;

    console.log(`- Retrieval Latency: ${latency}ms`);
    console.log(`- CRAG Evaluation: ${cragEval}`);

    if (cragEval === 'RELEVANT') cragPasses++;

    if (!contextText || contextText.trim() === '') {
      console.log(`- Result: NO CONTEXT RETRIEVED`);
      continue;
    }

    // Measure Recall (Keyword Match)
    const contextLower = contextText.toLowerCase();
    const hits = testCase.expectedKeywords.filter(k => contextLower.includes(k.toLowerCase()));
    const recall = hits.length / testCase.expectedKeywords.length;
    totalRecall += recall;
    console.log(`- Recall: ${(recall * 100).toFixed(2)}% (${hits.length}/${testCase.expectedKeywords.length} keywords found)`);

    // Measure Precision (Faithfulness checker via LLM)
    const precisionPrompt = `Given the following context and query, does the context directly provide the answer to the query without extraneous irrelevant topics? Respond with exactly a number between 0.0 and 1.0 representing precision.\n\nQuery: ${testCase.query}\n\nContext:\n${contextText}`;
    
    try {
      const pRes = await aiClient.generateSimpleResponse(precisionPrompt);
      const precisionStr = pRes?.content?.trim() || "0.0";
      const precision = parseFloat(precisionStr);
      totalPrecision += isNaN(precision) ? 0 : precision;
      console.log(`- Precision: ${(isNaN(precision) ? 0 : precision * 100).toFixed(2)}%`);
    } catch (err) {
      console.log(`- Precision: ERROR EVALUATING`);
    }
  }

  const avgRecall = totalRecall / EVAL_QUESTIONS.length;
  const avgPrecision = totalPrecision / EVAL_QUESTIONS.length;
  const mrrApprox = (avgRecall + avgPrecision) / 2; // simplified MRR metric

  console.log('\n==================================================');
  console.log('                 FINAL RESULTS                    ');
  console.log('==================================================');
  console.log(`Average Recall:    ${(avgRecall * 100).toFixed(2)}%`);
  console.log(`Average Precision: ${(avgPrecision * 100).toFixed(2)}%`);
  console.log(`Mean Reciprocal R: ${(mrrApprox * 100).toFixed(2)}%`);
  console.log(`CRAG Pass Rate:    ${((cragPasses / EVAL_QUESTIONS.length) * 100).toFixed(2)}%`);
  console.log('==================================================');
  
  process.exit(0);
}

runEvaluation().catch(err => {
  console.error("Evaluation suite failed:", err);
  process.exit(1);
});
