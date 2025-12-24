import React, { useState } from 'react';
import { TargetModel, ModelType, ModelStatus, ModelStage } from '../types';
import { Plus, Server, Wifi, WifiOff, AlertCircle, Trash2, Edit2, Zap } from 'lucide-react';
import Modal from './Modal';

interface ModelManagerProps {
  models: TargetModel[];
  onAddModel: (model: TargetModel) => void;
}

const ModelStatusBadge: React.FC<{ status: ModelStatus }> = ({ status }) => {
  const styles = {
    [ModelStatus.Healthy]: "bg-green-100 text-green-700",
    [ModelStatus.Degraded]: "bg-amber-100 text-amber-700",
    [ModelStatus.Offline]: "bg-red-100 text-red-700",
  };
  
  const Icons = {
    [ModelStatus.Healthy]: Wifi,
    [ModelStatus.Degraded]: AlertCircle,
    [ModelStatus.Offline]: WifiOff,
  };

  const statusMap = {
    [ModelStatus.Healthy]: "健康",
    [ModelStatus.Degraded]: "降级",
    [ModelStatus.Offline]: "离线",
  };

  const Icon = Icons[status];

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <Icon size={12} />
      {statusMap[status]}
    </span>
  );
};

const ModelStageBadge: React.FC<{ stage: ModelStage }> = ({ stage }) => {
  const styles = {
    [ModelStage.Pretraining]: "bg-slate-100 text-slate-700",
    [ModelStage.Finetuning]: "bg-blue-100 text-blue-700",
    [ModelStage.Reinforcement]: "bg-purple-100 text-purple-700",
    [ModelStage.Runtime]: "bg-indigo-100 text-indigo-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[stage]}`}>
      {stage}
    </span>
  );
};

const ModelTypeMap: Record<string, string> = {
  [ModelType.LLM]: '大语言模型',
  [ModelType.Multimodal]: '多模态',
  [ModelType.Vertical]: '垂类模型',
};

const ModelManager: React.FC<ModelManagerProps> = ({ models, onAddModel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    type: ModelType.LLM,
    stage: ModelStage.Runtime,
    endpoint: '',
    key: ''
  });

  const handleAddModel = () => {
    const model: TargetModel = {
      id: `m${Date.now()}`,
      name: newModel.name,
      type: newModel.type,
      stage: newModel.stage,
      endpoint: newModel.endpoint,
      status: ModelStatus.Healthy, // Default to healthy for demo
      addedAt: new Date().toISOString().split('T')[0],
      latency: Math.floor(Math.random() * 200) + 50,
    };
    onAddModel(model);
    setIsModalOpen(false);
    setNewModel({ name: '', type: ModelType.LLM, stage: ModelStage.Runtime, endpoint: '', key: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">管理和监控已接入的 AI 模型及其所处的测评阶段。</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
          <span>新增模型</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">模型名称</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">类型</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">测评阶段</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">延迟</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-slate-50 transition group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Server size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{model.name}</p>
                      <p className="text-xs text-slate-500">ID: {model.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                    {ModelTypeMap[model.type] || model.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ModelStageBadge stage={model.stage} />
                </td>
                <td className="px-6 py-4">
                  <ModelStatusBadge status={model.status} />
                </td>
                <td className="px-6 py-4">
                   <span className="text-sm font-mono text-slate-600">{model.latency}ms</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button className="p-1 text-slate-400 hover:text-indigo-600 transition" title="编辑"><Edit2 size={16}/></button>
                    <button className="p-1 text-slate-400 hover:text-red-600 transition" title="删除"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {models.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <Server size={48} className="mx-auto mb-4 opacity-50" />
            <p>暂无接入模型，请点击右上角新增。</p>
          </div>
        )}
      </div>

      {/* Add Model Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="接入新模型"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">取消</button>
            <button onClick={handleAddModel} disabled={!newModel.name || !newModel.endpoint} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">确认接入</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">模型名称</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="例如：GPT-4 Internal"
              value={newModel.name}
              onChange={(e) => setNewModel({...newModel, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">模型类型</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newModel.type}
                onChange={(e) => setNewModel({...newModel, type: e.target.value as ModelType})}
              >
                {Object.values(ModelType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">测评阶段</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newModel.stage}
                onChange={(e) => setNewModel({...newModel, stage: e.target.value as ModelStage})}
              >
                {Object.values(ModelStage).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Endpoint</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">https://</span>
              <input 
                type="text" 
                className="flex-1 w-full px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono text-sm"
                placeholder="api.example.com/v1"
                value={newModel.endpoint}
                onChange={(e) => setNewModel({...newModel, endpoint: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono"
              placeholder="sk-........................"
              value={newModel.key}
              onChange={(e) => setNewModel({...newModel, key: e.target.value})}
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-sm text-blue-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0"/>
            <p>系统将自动发起连通性测试。测评阶段的选择将决定系统调用的自动化基准测试套件。</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModelManager;