export type ParaBucket = "PROJECT" | "AREA" | "RESOURCE" | "INBOX";

export interface AITaskDraft {
  title: string;
  description?: string;
  paraBucket: ParaBucket;
  projectRef?: {
    kind: "existing" | "new" | "none";
    id?: string;
    name?: string;
  };
  areaRef?: {
    kind: "existing" | "new" | "none";
    id?: string;
    name?: string;
  };
  resourceRef?: {
    kind: "existing" | "new" | "none";
    id?: string;
    name?: string;
  };
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  due?: string;
  estimateMins?: number;
  context?: string;
  recurrenceRRule?: string;
  tags?: string[];
  subtasks?: string[];
  links?: string[];
  suggestions?: {
    schedule?: {
      proposedStart?: string;
      proposedEnd?: string;
      rationale?: string;
    };
    candidates?: Array<{
      type: "project" | "area" | "resource";
      id?: string;
      name: string;
      score: number;
    }>;
  };
  confidence?: number;
  notesToReviewer?: string[];
}

export interface ProposedBlock {
  start: string;
  end: string;
  rationale: string;
  score: number;
}

export interface CaptureConfirmProps {
  draft: AITaskDraft;
  onClose?: () => void;
  onAccept?: (task: any) => void;
}

export interface NextSuggestedCardProps {
  onCaptureOpen?: () => void;
}

export interface WeekAgendaProps {
  weekOffset?: number;
}

export interface TaskScheduleRequest {
  id: string;
  startAt: string;
  endAt: string;
}
