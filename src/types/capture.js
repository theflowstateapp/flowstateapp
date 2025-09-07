export interface AITaskDraft {
  title: string;
  description?: string;
  paraBucket?: 'PROJECT' | 'AREA' | 'RESOURCE' | 'INBOX';
  projectId?: string;
  areaId?: string;
  resourceId?: string;
  status?: 'TODO' | 'DOING' | 'DONE' | 'BACKLOG';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueAt?: string;
  estimateMins?: number;
  context?: string;
  tags?: string[];
  confidence?: {
    title?: number;
    priority?: number;
    estimateMins?: number;
    context?: number;
    dueAt?: number;
  };
}

export interface ProposedBlock {
  start: string;
  end: string;
  rationale: string;
  score: number;
}

export interface CaptureConfirmProps {
  draft: AITaskDraft;
  onAccept: (task: any) => void;
  onCancel: () => void;
}

export interface ScheduleProposeRequest {
  estimateMins?: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  context?: string;
  exclude?: Array<{ start: string; end: string }>;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  paraBucket?: 'PROJECT' | 'AREA' | 'RESOURCE' | 'INBOX';
  projectId?: string;
  areaId?: string;
  resourceId?: string;
  status?: 'TODO' | 'DOING' | 'DONE' | 'BACKLOG';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueAt?: string;
  estimateMins?: number;
  context?: string;
  startAt?: string;
  endAt?: string;
  tags?: string[];
}
