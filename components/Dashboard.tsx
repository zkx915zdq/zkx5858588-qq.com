import React from 'react';
import { TargetModel, EvaluationTask, AgentStatus, InfrastructureStats, ModelType, TaskType, EvaluationStrategy, Dataset, EvaluationReport, EvaluationTool, ModelStage } from '../types';
import { 
  Activity, 
  Zap, 
  Database, 
  TrendingUp,
  TrendingDown,
  Shield,
  Layers,
  Terminal,
  Bell,
  FileWarning,
  CheckSquare,
  AlertOctagon,
  ChevronRight,
  Clock,
  Box,
  ListTodo,
  FileText,
  Download,
  Wrench
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, XAxis, YAxis, Legend 
} from 'recharts';

interface DashboardProps {
  models: TargetModel[];
  tasks: EvaluationTask[];
  strategies: EvaluationStrategy[];
  datasets: Dataset[];
  reports: EvaluationReport[];
  tools: EvaluationTool[];
  agents: AgentStatus[];
  infra: InfrastructureStats;
  onNavigate: (tab: string) => void;
}

// --- Enhanced Mock Data ---
const capabilityRadarData = [
  { subject: '逻辑推理', A: 85, B: 70, fullMark: 100 },
  { subject: '代码生成', A: 92, B: 65, fullMark: 100 },
  { subject: '合规安全', A: 88, B: 95, fullMark: 100 },
  { subject: '指令遵循', A: 90, B: 80, fullMark: 100 },
  { subject: '长文本', A: 75, B: 85, fullMark: 100 },
  { subject: '多轮对话', A: 82, B: 78, fullMark: 100 },
];

const leaderboardData = [
  { name: 'Gemini 2.5', score: 92, color: '#4f46e5' },
  { name: 'GPT-4 Internal', score: 89, color: '#818cf8' },
  { name: 'Claude 3.5', score: 86, color: '#c7d2fe' },
  { name: 'Llama 3', score: 78, color: '#e0e7ff' },
];

const recentActivities = [
  { id: 1, user: 'System', action: '完成任务 "Weekly Scan"', time: '10m ago', type: 'success' },
  { id: 2, user: 'Admin', action: '审批通过 "FinBot V2"', time: '35m ago', type: 'info' },
  { id: 3, user: 'Agent-03', action: '发现高危越狱样本', time: '1h ago', type: 'warning' },
];

const pendingReviews = [
  { id: 'REV-2901', title: 'Gemini 2.5 越狱响应疑似', priority: 'High', due: '2h' },
  { id: 'REV-2902', title: 'FinBot-7B 敏感数据泄露', priority: 'Medium', due: '4h' },
  { id: 'REV-2903', title: 'Llama 3 幻觉检测复核', priority: 'Low', due: '1d' },
];

const systemAlerts = [
  { id: 1, msg: 'API 速率限制预警: Gemini Endpoint (85%)', type: 'warning' },
  { id: 2, msg: '节点 Node-04 显存溢出，任务已迁移', type: 'critical' },
];

// --- Sub-components ---

const KpiCard: React.FC<{ title: string; value: string; trend?: string; trendUp?: boolean; icon: any; color: string }> = ({ title, value, trend, trendUp, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
    </div>
  </div>
);

const WorkbenchStatRow: React.FC<{ label: string; count: number; colorClass?: string; barWidth?: string }> = ({ label, count, colorClass = "text-slate-600", barWidth }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold ${colorClass}`}>{count}</span>
    </div>
    {barWidth && (
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${colorClass.replace('text-', 'bg-')}`} style={{ width: barWidth }}></div>
      </div>
    )}
  </div>
);

const DetailedWorkbenchCard: React.FC<{ 
  title: string; 
  total: number; 
  icon: any; 
  color: string; 
  desc?: string;
  onClick?: () => void; 
  children: React.ReactNode 
}> = ({ title, total, icon: Icon, color, desc, onClick, children }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500`}>
        <Icon className={`w-24 h-24 ${color.replace('bg-', 'text-')}`} />
    </div>

    <div className="flex items-center justify-between mb-6 relative z-10">
       <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{title}</h3>
            {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
          </div>
       </div>
       <span className="text-3xl font-bold text-slate-800">{total}</span>
    </div>
    <div className="mt-auto space-y-3 pt-4 border-t border-slate-50 relative z-10">
      {children}
    </div>
    <div className="absolute bottom-4 right-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
        <ChevronRight size={20} />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ models, tasks, strategies, datasets, reports, tools, agents, infra, onNavigate }) => {
  const activeTasksCount = tasks.filter(t => t.status === 'Running').length;

  // --- Breakdown Calculations ---
  // Models by Type
  const llmCount = models.filter(m => m.type === ModelType.LLM).length;
  const multiModalCount = models.filter(m => m.type === ModelType.Multimodal).length;
  const verticalCount = models.filter(m => m.type === ModelType.Vertical).length;

  // Models by Stage
  const runtimeModels = models.filter(m => m.stage === ModelStage.Runtime).length;
  const otherModels = models.length - runtimeModels;

  // Tasks
  const complianceTasks = tasks.filter(t => t.type === TaskType.Compliance).length;
  const capabilityTasks = tasks.filter(t => t.type === TaskType.Capability).length;
  const securityTasks = tasks.filter(t => t.type === TaskType.Security).length;

  // Tools
  const toolsUpdateCount = tools.filter(t => t.status === 'Update Available').length;

  // Metrics
  const totalMetrics = strategies.reduce((acc, s) => acc + s.metrics.length, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="活跃测评任务" value={`${activeTasksCount} / ${tasks.length}`} trend="+12%" trendUp={true} icon={Activity} color="bg-indigo-500" />
        <KpiCard title="模型平均合规分" value="92.4" trend="+2.1" trendUp={true} icon={Shield} color="bg-emerald-500" />
        <KpiCard title="API 平均延迟" value="145ms" trend="-15ms" trendUp={true} icon={Zap} color="bg-amber-500" />
        <KpiCard title="今日消耗 Token" value="2.4M" trend="+5%" trendUp={false} icon={Database} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* 2. Main Area (Left - 8 Columns) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
           
           {/* System Alerts Banner */}
           {systemAlerts.length > 0 && (
             <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                   <AlertOctagon size={18} className="text-red-600" />
                   <h3 className="font-bold text-red-900 text-sm">系统告警中心 ({systemAlerts.length})</h3>
                </div>
                <div className="grid gap-2">
                   {systemAlerts.map(alert => (
                     <div key={alert.id} className="flex items-center justify-between bg-white/60 p-2 rounded border border-red-100/50 text-sm">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`}></div>
                           <span className="text-red-800 font-medium">{alert.msg}</span>
                        </div>
                        <button className="text-xs text-red-600 hover:underline">查看详情</button>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* Prominent My Workbench */}
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200">
                    <CheckSquare className="text-white" size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-800 tracking-tight">我的工作台</h2>
                 <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Dashboard</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                 {/* Model Stats */}
                 <DetailedWorkbenchCard title="测评对象" total={models.length} icon={Box} color="bg-blue-500" desc="已接入模型总数" onClick={() => onNavigate('models')}>
                    <WorkbenchStatRow label="运行阶段 (Runtime)" count={runtimeModels} barWidth={`${(runtimeModels/models.length)*100}%`} colorClass="text-indigo-600" />
                    <WorkbenchStatRow label="研发阶段 (R&D)" count={otherModels} barWidth={`${(otherModels/models.length)*100}%`} colorClass="text-slate-500" />
                    <div className="pt-2 flex gap-2">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">LLM: {llmCount}</span>
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100">视觉: {multiModalCount}</span>
                    </div>
                 </DetailedWorkbenchCard>

                 {/* Task Stats */}
                 <DetailedWorkbenchCard title="测评任务" total={tasks.length} icon={ListTodo} color="bg-indigo-500" desc="累计执行任务" onClick={() => onNavigate('tasks')}>
                    <WorkbenchStatRow label="合规性验证" count={complianceTasks} barWidth={`${(complianceTasks/tasks.length)*100}%`} colorClass="text-blue-600" />
                    <WorkbenchStatRow label="能力维度评估" count={capabilityTasks} barWidth={`${(capabilityTasks/tasks.length)*100}%`} colorClass="text-indigo-600" />
                    <WorkbenchStatRow label="安全攻防演练" count={securityTasks} barWidth={`${(securityTasks/tasks.length)*100}%`} colorClass="text-red-600" />
                 </DetailedWorkbenchCard>

                 {/* Strategy Stats */}
                 <DetailedWorkbenchCard title="策略体系" total={strategies.length} icon={Shield} color="bg-emerald-500" desc="活跃策略配置" onClick={() => onNavigate('strategies')}>
                    <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-slate-600">覆盖指标总数</span>
                        <span className="text-xl font-bold text-emerald-600">{totalMetrics}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded border border-slate-100">
                       包含：有害内容过滤、指令遵循、代码安全性扫描...
                    </div>
                 </DetailedWorkbenchCard>

                 {/* Dataset Stats */}
                 <DetailedWorkbenchCard title="测评题库" total={datasets.length} icon={Database} color="bg-amber-500" desc="Prompt与语料集" onClick={() => onNavigate('datasets')}>
                    <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-slate-600">总样本数据量</span>
                        <span className="text-xl font-bold font-mono text-amber-600">{datasets.reduce((acc, d) => acc + d.count, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] rounded font-medium border border-red-100">安全: {datasets.filter(d => d.type.includes('Security')).length}</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] rounded font-medium border border-blue-100">能力: {datasets.filter(d => !d.type.includes('Security')).length}</span>
                    </div>
                 </DetailedWorkbenchCard>

                 {/* Reports Stats */}
                 <DetailedWorkbenchCard title="测评报告" total={reports.length} icon={FileText} color="bg-cyan-500" desc="报告归档与分析" onClick={() => onNavigate('reports')}>
                    <WorkbenchStatRow label="已生成报告" count={reports.length} barWidth="100%" colorClass="text-cyan-600" />
                    <WorkbenchStatRow label="可用报告模版" count={8} colorClass="text-slate-600" />
                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-slate-500">累计导出次数</span>
                      <div className="flex items-center gap-1 font-semibold text-slate-600">
                        <Download size={10} className="text-slate-400"/>
                        <span>124</span>
                      </div>
                    </div>
                 </DetailedWorkbenchCard>
                 
                 {/* Tools Stats */}
                 <DetailedWorkbenchCard title="测评工具" total={tools.length} icon={Wrench} color="bg-violet-500" desc="全栈测评工具链" onClick={() => onNavigate('tools')}>
                    <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-slate-600">正常运行</span>
                        <span className="text-xl font-bold text-violet-600">{tools.length - toolsUpdateCount}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                        <span className="text-sm text-slate-600">可用更新</span>
                        <span className="text-xl font-bold text-orange-500">{toolsUpdateCount}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 truncate">
                        包含: 合规, 安全, 渗透, 性能...
                    </div>
                 </DetailedWorkbenchCard>

              </div>
           </div>

           {/* Detailed Analysis Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leaderboard */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <TrendingUp size={18} className="text-amber-500"/>
                    模型综合排行榜
                 </h3>
                 <p className="text-xs text-slate-500 mb-6">S1 安全策略加权</p>
                 <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={leaderboardData} layout="vertical" margin={{ left: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#475569'}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                             {leaderboardData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <Layers size={18} className="text-purple-500"/>
                    能力维度透视
                 </h3>
                 <p className="text-xs text-slate-500 mb-2">基准 vs 最优</p>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="70%" data={capabilityRadarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="当前" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                          <Radar name="基准" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                          <Legend wrapperStyle={{fontSize: '12px', marginTop: '10px'}}/>
                       </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. Operational Column (Right - 4 Columns) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           
           {/* Pending Reviews List */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                     <FileWarning size={16} className="text-orange-500" />
                     待人工复核
                  </h3>
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">{pendingReviews.length}</span>
               </div>
               <div className="divide-y divide-slate-50">
                  {pendingReviews.map((review) => (
                     <div key={review.id} className="p-4 hover:bg-slate-50 transition cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-xs font-mono text-slate-400">{review.id}</span>
                           <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              review.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                           }`}>{review.priority}</span>
                        </div>
                        <h4 className="text-sm font-medium text-slate-800 mb-2 group-hover:text-indigo-600 transition">{review.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                           <span className="flex items-center gap-1"><Clock size={10} /> 截止: {review.due}</span>
                           <span className="flex items-center gap-1 text-indigo-500 opacity-0 group-hover:opacity-100 transition">处理 <ChevronRight size={10} /></span>
                        </div>
                     </div>
                  ))}
               </div>
           </div>

           {/* Enhanced Agent Cluster Status */}
           <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg ring-1 ring-white/10">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
                    <Terminal className="text-green-400" size={18} />
                    <h3 className="font-bold text-sm">智能体集群状态</h3>
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {agents.map((agent, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                           <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-200 font-medium">{agent.name}</span>
                              <span className={`text-[10px] px-1.5 rounded ${
                                 agent.status === 'Working' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                              }`}>{agent.status}</span>
                           </div>
                           {agent.status === 'Working' && (
                              <div className="space-y-1">
                                 <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>{agent.currentTask}</span>
                                    <span>Processing...</span>
                                 </div>
                                 <div className="w-full bg-slate-800 rounded-full h-1">
                                    <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{width: `${Math.random() * 60 + 20}%`}}></div>
                                 </div>
                              </div>
                           )}
                        </div>
                    ))}
                </div>
           </div>

           {/* Activity Feed */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Bell size={16} className="text-slate-500" />
                    操作日志
                 </h3>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                 {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition flex gap-3 items-start">
                       <div className={`w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-400'
                       }`} />
                       <div>
                          <p className="text-xs text-slate-700">
                             <span className="font-semibold">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{activity.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;