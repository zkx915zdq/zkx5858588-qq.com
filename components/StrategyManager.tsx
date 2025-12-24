import React, { useState } from 'react';
import { EvaluationStrategy, MetricThreshold, Dataset } from '../types';
import { Layers, ChevronRight, Settings, Plus, FileText, Database, Target, Trash2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { MOCK_DATASETS, MOCK_REPORT_TEMPLATES } from '../constants';

interface StrategyManagerProps {
  strategies: EvaluationStrategy[];
}

const StrategyManager: React.FC<StrategyManagerProps> = ({ strategies: initialStrategies }) => {
  const [strategies, setStrategies] = useState<EvaluationStrategy[]>(initialStrategies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<EvaluationStrategy | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Form state
  const [form, setForm] = useState<Omit<EvaluationStrategy, 'id'>>({
    name: '',
    description: '',
    stages: ['预测评', '主测评', '结果分析'],
    metrics: [],
    datasetIds: [],
    templateId: ''
  });

  const handleOpenConfig = (strategy?: EvaluationStrategy) => {
    if (strategy) {
      setEditingStrategy(strategy);
      setForm({
        name: strategy.name,
        description: strategy.description,
        stages: strategy.stages,
        metrics: strategy.metrics,
        datasetIds: strategy.datasetIds,
        templateId: strategy.templateId
      });
    } else {
      setEditingStrategy(null);
      setForm({
        name: '',
        description: '',
        stages: ['预测评', '主测评', '结果分析'],
        metrics: [],
        datasetIds: [],
        templateId: ''
      });
    }
    setActiveStep(0);
    setIsModalOpen(true);
  };

  const handleAddMetric = () => {
    setForm({
      ...form,
      metrics: [...form.metrics, { metric: '', operator: '>', value: 0, unit: '%' }]
    });
  };

  const handleRemoveMetric = (index: number) => {
    setForm({
      ...form,
      metrics: form.metrics.filter((_, i) => i !== index)
    });
  };

  const toggleDataset = (id: string) => {
    setForm(prev => ({
      ...prev,
      datasetIds: prev.datasetIds.includes(id) 
        ? prev.datasetIds.filter(did => did !== id) 
        : [...prev.datasetIds, id]
    }));
  };

  const handleSave = () => {
    if (editingStrategy) {
      setStrategies(strategies.map(s => s.id === editingStrategy.id ? { ...form, id: s.id } : s));
    } else {
      setStrategies([{ ...form, id: `s-${Date.now()}` }, ...strategies]);
    }
    setIsModalOpen(false);
  };

  const STEPS = [
    { label: '测评指标设置', icon: Target },
    { label: '选择测评题集', icon: Database },
    { label: '报告模版设置', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <p className="text-slate-500">定义测评的规则、指标和阈值。关联高质量题库并配置报告呈现模版。</p>
         <button 
           onClick={() => handleOpenConfig()}
           className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
         >
          <Plus size={16} />
          <span>创建策略</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition cursor-pointer group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
                  <Layers size={24} />
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleOpenConfig(strategy); }}
                     className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                   >
                     <Settings size={18} />
                   </button>
                   <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{strategy.name}</h3>
              <p className="text-sm text-slate-500 mb-6 min-h-[40px] line-clamp-2">{strategy.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">测评指标 ({strategy.metrics.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {strategy.metrics.slice(0, 3).map((m, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600">
                        {m.metric} {m.operator} {m.value}{m.unit}
                      </span>
                    ))}
                    {strategy.metrics.length > 3 && <span className="text-[10px] text-slate-400">+{strategy.metrics.length - 3} 更多</span>}
                  </div>
                </div>
                
                <div className="flex gap-6">
                   <div className="flex-1">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">关联题库</h4>
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                         <Database size={14} className="text-amber-500" />
                         {strategy.datasetIds.length} 个数据集
                      </p>
                   </div>
                   <div className="flex-1">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">报告模版</h4>
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                         <FileText size={14} className="text-blue-500" />
                         {MOCK_REPORT_TEMPLATES.find(t => t.id === strategy.templateId)?.name || '未设置'}
                      </p>
                   </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-500">ID: {strategy.id}</span>
              <span className="text-xs font-medium text-indigo-600 group-hover:underline">点击查看详细规则</span>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStrategy ? "配置测评策略" : "新建测评策略"}
        size="lg"
        footer={
           <div className="flex justify-between w-full">
              <div className="flex gap-2">
                 {activeStep > 0 && (
                   <button 
                     onClick={() => setActiveStep(activeStep - 1)}
                     className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                   >
                     上一步
                   </button>
                 )}
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">取消</button>
                 {activeStep < 2 ? (
                   <button 
                     onClick={() => setActiveStep(activeStep + 1)}
                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                   >
                     下一步
                   </button>
                 ) : (
                   <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">完成配置</button>
                 )}
              </div>
           </div>
        }
      >
        <div className="space-y-8">
           {/* Step Indicator */}
           <div className="flex items-center justify-between border-b border-slate-100 pb-6 overflow-x-auto no-scrollbar gap-4">
              {STEPS.map((step, idx) => {
                 const StepIcon = step.icon;
                 const isActive = activeStep === idx;
                 const isCompleted = activeStep > idx;
                 return (
                    <div key={idx} className={`flex items-center gap-3 whitespace-nowrap px-4 py-2 rounded-lg transition ${
                       isActive ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 
                       isCompleted ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isActive ? 'bg-indigo-600 text-white' : 
                          isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                       }`}>
                          {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                       </div>
                       <span className="font-medium">{step.label}</span>
                       {idx < 2 && <div className="hidden md:block w-12 h-px bg-slate-200 ml-2" />}
                    </div>
                 );
              })}
           </div>

           <div className="min-h-[400px]">
              {/* Step 1: Metrics */}
              {activeStep === 0 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">策略名称</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="如：金融合规基准策略 V1"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                             <Target size={16} className="text-indigo-600" />
                             指标及其阈值
                          </h4>
                          <button 
                            onClick={handleAddMetric}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                          >
                            <Plus size={14} /> 添加指标
                          </button>
                       </div>
                       
                       <div className="space-y-3">
                          {form.metrics.length === 0 && (
                             <div className="p-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-sm text-slate-400">尚未添加测评指标，点击右上角开始添加。</p>
                             </div>
                          )}
                          {form.metrics.map((m, idx) => (
                             <div key={idx} className="flex gap-3 items-end bg-slate-50/50 p-4 rounded-lg border border-slate-100 group">
                                <div className="flex-1">
                                   <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">指标名</label>
                                   <input 
                                     type="text" 
                                     className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 text-sm"
                                     placeholder="如：Pass@1"
                                     value={m.metric}
                                     onChange={(e) => {
                                        const newMetrics = [...form.metrics];
                                        newMetrics[idx].metric = e.target.value;
                                        setForm({...form, metrics: newMetrics});
                                     }}
                                   />
                                </div>
                                <div className="w-24">
                                   <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">运算符</label>
                                   <select 
                                     className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 text-sm"
                                     value={m.operator}
                                     onChange={(e) => {
                                        const newMetrics = [...form.metrics];
                                        newMetrics[idx].operator = e.target.value as any;
                                        setForm({...form, metrics: newMetrics});
                                     }}
                                   >
                                      <option value=">">&gt;</option>
                                      <option value="<">&lt;</option>
                                      <option value=">=">&gt;=</option>
                                      <option value="<=">&lt;=</option>
                                   </select>
                                </div>
                                <div className="w-24">
                                   <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">目标值</label>
                                   <input 
                                     type="number" 
                                     className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 text-sm"
                                     value={m.value}
                                     onChange={(e) => {
                                        const newMetrics = [...form.metrics];
                                        newMetrics[idx].value = parseFloat(e.target.value);
                                        setForm({...form, metrics: newMetrics});
                                     }}
                                   />
                                </div>
                                <div className="w-20">
                                   <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">单位</label>
                                   <input 
                                     type="text" 
                                     className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 text-sm font-mono"
                                     placeholder="%"
                                     value={m.unit}
                                     onChange={(e) => {
                                        const newMetrics = [...form.metrics];
                                        newMetrics[idx].unit = e.target.value;
                                        setForm({...form, metrics: newMetrics});
                                     }}
                                   />
                                </div>
                                <button 
                                  onClick={() => handleRemoveMetric(idx)}
                                  className="p-2 text-slate-300 hover:text-red-500 transition mb-0.5"
                                >
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              )}

              {/* Step 2: Datasets */}
              {activeStep === 1 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 text-sm text-amber-800">
                       <Database className="shrink-0 text-amber-600" size={20} />
                       <p>选择此策略包含的测评语料库或 Prompt 集。系统将按选定的数据集顺序执行模型推理与结果测评。</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {MOCK_DATASETS.map(dataset => {
                          const isSelected = form.datasetIds.includes(dataset.id);
                          return (
                             <div 
                                key={dataset.id}
                                onClick={() => toggleDataset(dataset.id)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center gap-4 ${
                                   isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'
                                }`}
                             >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                                   isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                                }`}>
                                   {isSelected && <Plus size={14} className="rotate-45" />}
                                </div>
                                <div className="flex-1">
                                   <div className="flex justify-between items-center mb-1">
                                      <h5 className="font-bold text-slate-800 text-sm">{dataset.name}</h5>
                                      <span className="text-[10px] text-slate-400 font-mono">{dataset.count} 条数据</span>
                                   </div>
                                   <p className="text-xs text-slate-500">{dataset.type}</p>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              )}

              {/* Step 3: Template */}
              {activeStep === 2 && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 gap-4">
                       {MOCK_REPORT_TEMPLATES.map(template => {
                          const isSelected = form.templateId === template.id;
                          return (
                             <div 
                                key={template.id}
                                onClick={() => setForm({...form, templateId: template.id})}
                                className={`p-5 rounded-xl border-2 cursor-pointer transition flex gap-5 items-start ${
                                   isSelected ? 'border-indigo-600 bg-indigo-50/30 shadow-sm' : 'border-slate-100 hover:border-slate-200'
                                }`}
                             >
                                <div className={`p-3 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                   <FileText size={24} />
                                </div>
                                <div className="flex-1">
                                   <div className="flex justify-between items-center mb-1">
                                      <h5 className="font-bold text-slate-800">{template.name}</h5>
                                      {isSelected && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">已选用</span>}
                                   </div>
                                   <p className="text-sm text-slate-500">{template.description}</p>
                                   <div className="mt-3 flex gap-4 text-xs text-slate-400">
                                      <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> 图表驱动</span>
                                      <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> 支持 PDF 导出</span>
                                   </div>
                                </div>
                             </div>
                          );
                       })}
                    </div>
                 </div>
              )}
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default StrategyManager;