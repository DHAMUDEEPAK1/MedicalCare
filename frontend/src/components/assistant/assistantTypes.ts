// Assistant message and state types

export type AssistantMessageRole = 'user' | 'assistant' | 'system';

export type ConfidenceLevel = number;

export interface AssistantMessage {
  id: string;
  role: AssistantMessageRole;
  content: string;
  timestamp: number;
  confidence?: ConfidenceLevel;
  summary?: string;
}

export type AssistantStatus = 'idle' | 'listening' | 'processing' | 'error';

export interface AssistantState {
  isOpen: boolean;
  status: AssistantStatus;
  errorMessage?: string;
  transcript: AssistantMessage[];
}

export type ReportAnalysisContext =
  | { state: 'idle' }
  | { state: 'analyzing' }
  | { state: 'awaiting-selection' }
  | { state: 'awaiting-paste', selectedReportId?: string, selectedReportFilename?: string };

export interface CommandResult {
  type: 'navigation' | 'help' | 'unknown' | 'medical' | 'report-list' | 'report-paste-request' | 'EMERGENCY' | 'GENERAL_KNOWLEDGE' | 'MEDICAL_RESPONSE' | 'TALK' | 'NAVIGATION';
  message: string;
  navigationTarget?: string;
  targetFilename?: string;
  category?: string;
  content?: any;
}
