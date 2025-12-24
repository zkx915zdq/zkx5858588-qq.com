
export enum ModelType {
  LLM = 'LLM 大模型',
  Multimodal = '多模态模型',
  Vertical = '垂直大模型',
}

export enum ModelStage {
  Pretraining = '预训练阶段',
  Finetuning = '微调阶段',
  Reinforcement = '强化阶段',
  Runtime = '运行阶段',
}

export enum ModelStatus {
  Healthy = 'Healthy',
  Degraded = 'Degraded',
  Offline = 'Offline',
}

export interface TargetModel {
  id: string;
  name: string;
  type: ModelType;
  stage: ModelStage;
  endpoint: string;
  status: ModelStatus;
  addedAt: string;
  latency: number; // ms
}

export enum TaskType {
  Compliance = '合规性测评',
  Capability = '能力测评',
  Security = '安全测评',
}

export enum TaskStatus {
  Pending = 'Pending',
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface EvaluationTask {
  id: string;
  name: string;
  type: TaskType;
  modelId: string;
  strategyId: string;
  status: TaskStatus;
  progress: number; // 0-100
  startTime: string;
  pollingInterval?: number; // In minutes, 0 or undefined means one-time task
  requiresManualReview: boolean; // Whether human review is needed for results
}

export interface MetricThreshold {
  metric: string;
  operator: '<' | '>' | '<=' | '>=';
  value: number;
  unit: string;
}

export interface EvaluationStrategy {
  id: string;
  name: string;
  description: string;
  stages: string[];
  metrics: MetricThreshold[];
  datasetIds: string[]; // Associated datasets
  templateId: string;   // Report template selection
}

// New Types for Dataset (Question Bank)
export enum DatasetType {
  Compliance = 'AI 合规类',
  Security = 'AI 安全类',
  Capability = 'AI 能力类',
}

export interface Dataset {
  id: string;
  name: string;
  type: DatasetType;
  subType: string; // Detailed module like "OWASP AI 安全", "拒答场景", etc.
  count: number;
  tags: string[];
  updatedAt: string;
}

// New Types for Evaluation Tools
export enum ToolCategory {
  ComplianceVerification = '合规验证工具',
  SecurityPenetration = '安全渗透工具',
  RiskDetection = '风险检测工具',
  CapabilityAssessment = '能力评估工具',
  AdversarialAttack = '对抗攻击工具',
  PerformanceTesting = '性能测试工具',
}

export interface EvaluationTool {
  id: string;
  name: string;
  category: ToolCategory;
  version: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Update Available';
  author: string;
}

// New Types for System Status
export interface AgentStatus {
  name: string; // e.g., "合规测评智能体"
  status: 'Idle' | 'Working' | 'Error';
  currentTask?: string;
}

export interface InfrastructureStats {
  gpuUsage: number; // %
  memoryUsage: number; // %
  storageUsage: number; // %
  activeNodes: number;
}

export interface ReportMetric {
  name: string;
  score: number;
  maxScore: number;
  status: 'Pass' | 'Fail';
}

export interface ReportFailure {
  id: string;
  prompt: string;
  response: string;
  reason: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface EvaluationReport {
  id: string;
  taskId: string;
  modelName: string;
  generatedAt: string;
  overallScore: number;
  metrics: ReportMetric[];
  history: { epoch: number; score: number }[];
  failures: ReportFailure[];
  aiAnalysis?: string;
}
