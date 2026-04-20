export type ThreatType = 'Phishing' | 'Scam' | 'Social Engineering' | 'Legitimate' | 'Spam' | 'Malware' | 'Unknown';
export type RiskLevel = 'High' | 'Medium' | 'Low' | 'Safe';

export interface DetectionResult {
  id: string;
  timestamp: string;
  content: string;
  riskLevel: RiskLevel;
  threatType: ThreatType;
  explanation: string;
  suspiciousElements: string[];
  isSafe: boolean;
  score: number; // 0 to 100
}

export interface URLAnalysis {
  url: string;
  isMalicious: boolean;
  riskLevel: RiskLevel;
  reasons: string[];
  recommendation: string;
}
