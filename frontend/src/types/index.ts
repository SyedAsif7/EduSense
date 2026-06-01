export interface Student {
  roll_number: string;
  name: string;
  email: string;
  rfid_tag: string;
}

export interface AttendanceRecord {
  id: number;
  roll_number: string;
  timestamp: string;
  status: 'PRESENT_VERIFIED' | 'PROXY_ATTEMPT' | 'ABSENT_UNVERIFIED';
}

export interface RiskPrediction {
  roll_number: string;
  risk_level: 'Low' | 'Medium' | 'High';
  confidence: number;
  top_factors: string[];
}
