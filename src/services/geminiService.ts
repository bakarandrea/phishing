import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult, URLAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    threatType: {
      type: Type.STRING,
      description: "One of: Phishing, Scam, Social Engineering, Legitimate, Spam, Malware",
    },
    riskLevel: {
      type: Type.STRING,
      description: "One of: High, Medium, Low, Safe",
    },
    explanation: {
      type: Type.STRING,
      description: "A detailed explanation in English of why this content was flagged or cleared.",
    },
    suspiciousElements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific indicators found (e.g., 'Sense of urgency', 'Mismatching URL', 'Generic greeting')",
    },
    score: {
      type: Type.NUMBER,
      description: "A risk score from 0 (Safe) to 100 (Extremely Dangerous)",
    },
    isSafe: {
      type: Type.BOOLEAN,
      description: "True if the message is legitimate, false if it's suspicious",
    },
  },
  required: ["threatType", "riskLevel", "explanation", "suspiciousElements", "score", "isSafe"],
};

export async function analyzeContent(content: string): Promise<DetectionResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze the following message (Email or SMS) for phishing or security threats: \n\n ${content}` }]
      }
    ],
    config: {
      systemInstruction: "You are a world-class cybersecurity expert specializing in phishing detection. Analyze input for malicious intent, suspicious links, and psychological triggers. Respond in English.",
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  const result = JSON.parse(response.text);
  return {
    ...result,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    content: content,
  };
}

export async function analyzeUrl(url: string): Promise<URLAnalysis> {
  const schema = {
    type: Type.OBJECT,
    properties: {
      isMalicious: { type: Type.BOOLEAN },
      riskLevel: { type: Type.STRING },
      reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
      recommendation: { type: Type.STRING },
    },
    required: ["isMalicious", "riskLevel", "reasons", "recommendation"],
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze this URL for security risks: ${url}` }]
      }
    ],
    config: {
      systemInstruction: "You are a URL safety analyzer. Check for typosquatting, suspicious top-level domains, and known phishing patterns. Respond in English.",
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const result = JSON.parse(response.text);
  return {
    ...result,
    url: url,
  };
}
