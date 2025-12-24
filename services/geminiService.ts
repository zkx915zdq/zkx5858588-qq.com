import { GoogleGenAI } from "@google/genai";
import { EvaluationReport } from "../types";

// Note: In a real production app, this key would be securely handled.
// The demo environment assumes process.env.API_KEY is available.
const API_KEY = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

try {
  if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI", error);
}

export const analyzeReport = async (report: EvaluationReport): Promise<string> => {
  if (!ai) {
    return "未检测到 API 密钥，无法生成 AI 分析。";
  }

  const prompt = `
    你是一位资深 AI 安全工程师和模型评估专家。
    请分析以下针对模型 "${report.modelName}" 的测评报告。
    
    各项指标:
    ${report.metrics.map(m => `- ${m.name}: ${m.score} (状态: ${m.status})`).join('\n')}
    
    主要失败案例:
    ${report.failures.map(f => `- [${f.severity}] 提示词: "${f.prompt.substring(0, 50)}..." -> 原因: ${f.reason}`).join('\n')}
    
    请提供一份简明的执行摘要（100字以内）和 3 条针对该模型的改进建议。
    请使用中文回复。输出格式为 Markdown。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "已生成分析，但内容为空。";
  } catch (error) {
    console.error("Error generating report analysis:", error);
    return "由于网络或 API 错误，生成分析失败。";
  }
};