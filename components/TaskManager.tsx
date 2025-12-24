import React, { useState } from 'react';
import { EvaluationTask, TaskStatus, TaskType } from '../types';
import { Play, Plus, FileBarChart, RefreshCw, Trash2, Clock, Calendar, UserCheck, ShieldAlert } from 'lucide-react';
import Modal from './Modal';
import { MOCK_MODELS, MOCK_STRATEGIES } from '../constants';

interface TaskManagerProps {
  tasks: EvaluationTask[];
  onAddTask: (task: EvaluationTask) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
}

const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
   const styles = {
    [TaskStatus.Pending]: "bg-slate-100 text-slate-600",
    [TaskStatus.Running]: "bg-blue-100 text-blue-700 animate-pulse",
    [TaskStatus.Completed]: "bg-green-100 text-green-700",
    [TaskStatus.Failed]: "bg-red-100 text-red-700",
  };
  
  const statusMap = {
      [TaskStatus.Pending]: "等待中",
      [TaskStatus.Running]: "进行中",
      [TaskStatus.Completed]: "已完成",
      [TaskStatus.Failed]: "失败",
  };

  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{statusMap[status]}</span>;
}

const POLLING_OPTIONS = [
  { label: '单次执行', value: 0 },
  { label: '每 30 分钟', value: 30 },
  { label: '每 1 小时', value: 60 },
  { label: '每 12 小时', value: 720 },
  { label: '每 24 小时 (每天)', value: 1440 },
  { label: '每 7 天 (每周)', value: 10080 },
];

const formatInterval = (minutes: number) => {
  if (!minutes) return '单次';
  if (minutes < 60) return `每 ${minutes}m`;
  if (minutes < 1440) return `每 ${Math.round(minutes / 60)}h`;
  return `每 ${Math.round(minutes / 1440)}d`;
};

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onAddTask, isModalOpen, onCloseModal }) => {
  const [newTask, setNewTask] = useState({
    name: '',
    type: TaskType.Compliance,
    modelId: '',
    strategyId: '',
    pollingInterval: 0,
    requiresManualReview: false
  });

  const [localModalOpen, setLocalModalOpen] = useState(false);
  const showModal = isModalOpen || localModalOpen;

  const handleClose = () => {
    onCloseModal();
    setLocalModalOpen(false);
  };

  const handleCreateTask = () => {
    const task: EvaluationTask = {
      id: `t${Date.now()}`,
      name: newTask.name,
      type: newTask.type,
      modelId: newTask.modelId || MOCK_MODELS[0].id,
      strategyId: newTask.strategyId || MOCK_STRATEGIES[0].id,
      status: TaskStatus.Pending,
      progress: 0,
      startTime: new Date().toLocaleString(),
      pollingInterval: newTask.pollingInterval,
      requiresManualReview: newTask.requiresManualReview
    };
    onAddTask(task);
    setNewTask({ 
      name: '', 
      type: TaskType.Compliance, 
      modelId: '', 
      strategyId: '', 
      pollingInterval: 0,
      requiresManualReview: false 
    });
    handleClose();
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <p className="text-slate-500">发起并监控针对模型的测评任务，支持设置定期自动化轮询测评及人工复核节点。</p>
        <button 
          onClick={() => setLocalModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
          <span>新建任务</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                task.type === TaskType.Security ? 'bg-red-50 text-red-600' :
                task.type === TaskType.Compliance ? 'bg-blue-50 text-blue-600' : 
                'bg-emerald-50 text-emerald-600'
              }`}>
                <FileBarChart size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-800">{task.name}</h3>
                  <TaskStatusBadge status={task.status} />
                  {task.requiresManualReview && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded uppercase" title="需要人工复核结果">
                      <UserCheck size={10} />
                      人工复核
                    </span>
                  )}
                  {task.pollingInterval && task.pollingInterval > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded uppercase">
                      <RefreshCw size={10} className="animate-spin-slow" />
                      轮询: {formatInterval(task.pollingInterval)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-500 mt-1 flex flex-wrap gap-x-4">
                   <span>策略: <strong>{task.strategyId}</strong></span>
                   <span>模型: <strong>{MOCK_MODELS.find(m => m.id === task.modelId)?.name || task.modelId}</strong></span>
                   <span className="flex items-center gap-1"><Calendar size={12} /> {task.startTime}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>进度</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${task.status === TaskStatus.Failed ? 'bg-red-500' : 'bg-indigo-500'}`} 
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {task.status === TaskStatus.Pending && (
                <button className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition" title="开始任务">
                  <Play size={18} />
                </button>
              )}
               {task.status === TaskStatus.Completed && (
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition" title="重新运行">
                  <RefreshCw size={18} />
                </button>
              )}
              <button 
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100" 
                title="删除任务"
                onClick={() => alert("删除功能需连接后端 API")}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
           <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
             <FileBarChart size={48} className="mx-auto mb-4 opacity-50" />
             <p>暂无任务，点击“新建任务”开始测评。</p>
           </div>
        )}
      </div>

      {/* New Task Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title="创建新的测评任务"
        footer={
           <>
            <button onClick={handleClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">取消</button>
            <button onClick={handleCreateTask} disabled={!newTask.name} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">创建并启动</button>
          </>
        }
      >
        <div className="space-y-5">
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">任务名称</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="例如：Gemini V2 全面合规测试"
              value={newTask.name}
              onChange={(e) => setNewTask({...newTask, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">测评类型</label>
            <div className="grid grid-cols-3 gap-2">
               {Object.values(TaskType).map((type) => (
                 <button 
                    key={type}
                    onClick={() => setNewTask({...newTask, type: type as TaskType})}
                    className={`px-3 py-2 text-sm border rounded-lg transition ${newTask.type === type ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                   {type}
                 </button>
               ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">目标模型</label>
                <select 
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                   value={newTask.modelId}
                   onChange={(e) => setNewTask({...newTask, modelId: e.target.value})}
                >
                   <option value="">请选择模型...</option>
                   {MOCK_MODELS.map(m => (
                     <option key={m.id} value={m.id}>{m.name}</option>
                   ))}
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">测评策略</label>
                <select 
                   className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                   value={newTask.strategyId}
                   onChange={(e) => setNewTask({...newTask, strategyId: e.target.value})}
                >
                   <option value="">请选择策略...</option>
                   {MOCK_STRATEGIES.map(s => (
                     <option key={s.id} value={s.id}>{s.name}</option>
                   ))}
                </select>
             </div>
          </div>
          
          <div className="space-y-4">
             {/* Polling Config Section */}
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-sm font-bold text-slate-800 flex items-center gap-2">
                   <Clock size={16} className="text-indigo-600" />
                   执行与轮询配置
                </label>
                <div className="grid grid-cols-1 gap-3">
                   <div className="flex flex-wrap gap-2">
                     {POLLING_OPTIONS.map((opt) => (
                       <button
                         key={opt.value}
                         onClick={() => setNewTask({...newTask, pollingInterval: opt.value})}
                         className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                           newTask.pollingInterval === opt.value
                             ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                             : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                         }`}
                       >
                         {opt.label}
                       </button>
                     ))}
                   </div>
                </div>
             </div>

             {/* Human Review Switch Section */}
             <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-start gap-3">
                   <div className="mt-1">
                      <ShieldAlert size={18} className="text-indigo-600" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-800">启用人工复核</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        开启后，系统产生的测评结果需经人工审批确认方可计入最终报告。
                      </p>
                   </div>
                </div>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={() => setNewTask({...newTask, requiresManualReview: !newTask.requiresManualReview})}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                    newTask.requiresManualReview ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span 
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      newTask.requiresManualReview ? 'translate-x-5' : 'translate-x-0'
                    }`} 
                  />
                </button>
             </div>
          </div>

          <div className="pt-2">
             <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100 flex justify-between">
               <span>预计单次耗时：<strong className="text-slate-700">15 分钟</strong></span>
               <span>预估 Token：<strong className="text-slate-700">250K</strong></span>
             </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskManager;