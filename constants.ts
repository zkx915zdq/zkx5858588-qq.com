
import { TargetModel, ModelType, ModelStatus, EvaluationTask, TaskType, TaskStatus, EvaluationStrategy, EvaluationReport, Dataset, DatasetType, AgentStatus, InfrastructureStats, EvaluationTool, ToolCategory, ModelStage } from './types';

export const MOCK_MODELS: TargetModel[] = [
  {
    id: 'm1',
    name: 'Gemini 2.5 Flash',
    type: ModelType.LLM,
    stage: ModelStage.Runtime,
    endpoint: 'https://generativelanguage.googleapis.com',
    status: ModelStatus.Healthy,
    addedAt: '2024-10-15',
    latency: 120,
  },
  {
    id: 'm2',
    name: 'Veo Vision Pro',
    type: ModelType.Multimodal,
    stage: ModelStage.Reinforcement,
    endpoint: 'https://vision.example.com/api',
    status: ModelStatus.Healthy,
    addedAt: '2024-11-01',
    latency: 450,
  },
  {
    id: 'm3',
    name: 'FinBot-7B',
    type: ModelType.Vertical,
    stage: ModelStage.Finetuning,
    endpoint: 'https://finance-internal.api/v1',
    status: ModelStatus.Offline,
    addedAt: '2024-12-05',
    latency: 0,
  },
];

export const MOCK_STRATEGIES: EvaluationStrategy[] = [
  {
    id: 's1',
    name: '通用 LLM V1.0 - 安全加强版',
    description: '针对面向公众的聊天机器人的标准安全套件。',
    stages: ['基础功能测试', '对抗攻击测试', '合规性检查'],
    metrics: [
      { metric: '有害内容率', operator: '<', value: 0.01, unit: '%' },
      { metric: '指令遵循率', operator: '>', value: 95, unit: '%' },
    ],
    datasetIds: ['d2', 'd4'],
    templateId: 'tpl-safety',
  },
];

export const MOCK_REPORT_TEMPLATES = [
  { id: 'tpl-safety', name: '安全合规深度报告', description: '侧重于内容合规、隐私保护和对抗攻击结果的详细分析。' },
  { id: 'tpl-capability', name: '模型能力基准报告', description: '侧重于基础能力、逻辑推理和领域专业知识的对比评分。' },
];

export const MOCK_TASKS: EvaluationTask[] = [
  {
    id: 't1',
    name: '合规性例行扫描',
    type: TaskType.Compliance,
    modelId: 'm1',
    strategyId: 's1',
    status: TaskStatus.Completed,
    progress: 100,
    startTime: '2025-05-10 09:00',
    requiresManualReview: true,
  },
];

export const MOCK_DATASETS: Dataset[] = [
  // --- 一、AI 合规类题库 ---
  {
    id: 'd1',
    name: '政治红线测试集',
    type: DatasetType.Compliance,
    subType: '违反社会主义价值观题',
    count: 1200,
    tags: ['煽动颠覆', '危害国家安全', '传播虚假信息'],
    updatedAt: '2025-05-12',
  },
  {
    id: 'd2',
    name: '社会公平性评估库',
    type: DatasetType.Compliance,
    subType: '歧视性内容题',
    count: 850,
    tags: ['民族歧视', '性别偏见', '地域攻击', '信仰歧视'],
    updatedAt: '2025-04-20',
  },
  {
    id: 'd3',
    name: '商业竞争风险库',
    type: DatasetType.Compliance,
    subType: '商业违法违规题',
    count: 500,
    tags: ['知识产权侵权', '不正当竞争', '商业机密泄露'],
    updatedAt: '2025-05-01',
  },
  {
    id: 'd4',
    name: '个人权益保护集',
    type: DatasetType.Compliance,
    subType: '侵权类题',
    count: 1500,
    tags: ['肖像权', '名誉权', '个人信息保护', '隐私安全'],
    updatedAt: '2025-05-14',
  },
  {
    id: 'd5',
    name: '敏感话题拒答基准',
    type: DatasetType.Compliance,
    subType: '拒答场景题',
    count: 600,
    tags: ['制度红线', '英烈保护', '敏感文化'],
    updatedAt: '2025-03-15',
  },

  // --- 二、AI 安全类题库 ---
  {
    id: 'd6',
    name: 'OWASP AI 风险攻防集',
    type: DatasetType.Security,
    subType: 'OWASP AI 安全题',
    count: 2200,
    tags: ['提示注入', '数据投毒', '敏感信息泄露'],
    updatedAt: '2025-05-08',
  },
  {
    id: 'd7',
    name: '模型健壮性测试集',
    type: DatasetType.Security,
    subType: '模型安全题',
    count: 1100,
    tags: ['抗攻击能力', '输出可控性', '决策可解释性'],
    updatedAt: '2025-05-10',
  },
  {
    id: 'd8',
    name: '数据隐私流通安全库',
    type: DatasetType.Security,
    subType: '数据安全题',
    count: 3000,
    tags: ['隐私计算', '合规性脱敏', '访问控制'],
    updatedAt: '2025-05-11',
  },
  {
    id: 'd9',
    name: '基础设施安全扫描集',
    type: DatasetType.Security,
    subType: '系统安全题',
    count: 450,
    tags: ['API安全', '供应链漏洞', '安全监控'],
    updatedAt: '2025-04-25',
  },

  // --- 三、AI 能力类题库 ---
  {
    id: 'd10',
    name: '基础逻辑与认知基准',
    type: DatasetType.Capability,
    subType: '通用能力题',
    count: 12000,
    tags: ['语言理解', '逻辑推理', '多模态交互', '思维链'],
    updatedAt: '2025-05-15',
  },
  {
    id: 'd11',
    name: '文本输出质量评估集',
    type: DatasetType.Capability,
    subType: '内容质量题',
    count: 5000,
    tags: ['准确度', '连贯性', '相关性', '简洁性'],
    updatedAt: '2025-05-14',
  },
  {
    id: 'd12',
    name: '专业领域垂直应用集',
    type: DatasetType.Capability,
    subType: '垂直场景题',
    count: 4200,
    tags: ['领域术语', '专业合规', '任务完成度'],
    updatedAt: '2025-05-12',
  },
  {
    id: 'd13',
    name: '极致性能压力测试集',
    type: DatasetType.Capability,
    subType: '性能效率题',
    count: 300,
    tags: ['响应时间', '并发处理', '资源利用率', '稳定性'],
    updatedAt: '2025-05-01',
  },
];

export const MOCK_TOOLS: EvaluationTool[] = [
  {
    id: 'tool-001',
    name: 'ContentShield Pro',
    category: ToolCategory.ComplianceVerification,
    version: '2.1.0',
    description: '合规性自动化审查工具。',
    status: 'Active',
    author: 'Security Team'
  },
];

export const MOCK_AGENTS: AgentStatus[] = [
  { name: '合规测评智能体', status: 'Idle' },
];

export const MOCK_INFRA: InfrastructureStats = {
  gpuUsage: 78,
  memoryUsage: 64,
  storageUsage: 45,
  activeNodes: 12,
};

export const MOCK_REPORT: EvaluationReport = {
  id: 'r-LLM-20251215-001',
  taskId: 't1',
  modelName: 'Gemini 2.5 Flash',
  generatedAt: '2025-05-10 11:45',
  overallScore: 88,
  metrics: [],
  history: [],
  failures: [],
};
