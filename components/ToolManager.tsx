import React, { useState } from 'react';
import { EvaluationTool, ToolCategory } from '../types';
import { 
  Search, 
  Plus, 
  FileCheck, 
  ShieldAlert, 
  Siren, 
  Zap, 
  Bug, 
  Activity,
  MoreHorizontal,
  DownloadCloud
} from 'lucide-react';
import Modal from './Modal';

interface ToolManagerProps {
  tools: EvaluationTool[];
  onAddTool: (tool: EvaluationTool) => void;
}

const CategoryIconMap: Record<ToolCategory, any> = {
  [ToolCategory.ComplianceVerification]: FileCheck,
  [ToolCategory.SecurityPenetration]: ShieldAlert,
  [ToolCategory.RiskDetection]: Siren,
  [ToolCategory.CapabilityAssessment]: Zap,
  [ToolCategory.AdversarialAttack]: Bug,
  [ToolCategory.PerformanceTesting]: Activity,
};

const CategoryColorMap: Record<ToolCategory, string> = {
  [ToolCategory.ComplianceVerification]: 'bg-blue-50 text-blue-600',
  [ToolCategory.SecurityPenetration]: 'bg-red-50 text-red-600',
  [ToolCategory.RiskDetection]: 'bg-orange-50 text-orange-600',
  [ToolCategory.CapabilityAssessment]: 'bg-purple-50 text-purple-600',
  [ToolCategory.AdversarialAttack]: 'bg-rose-50 text-rose-600',
  [ToolCategory.PerformanceTesting]: 'bg-emerald-50 text-emerald-600',
};

const ToolManager: React.FC<ToolManagerProps> = ({ tools, onAddTool }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTool, setNewTool] = useState<{name: string, category: string, description: string, version: string}>({
    name: '',
    category: ToolCategory.ComplianceVerification,
    description: '',
    version: ''
  });

  const filteredTools = tools.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = () => {
    const tool: EvaluationTool = {
      id: `tool-${Date.now()}`,
      name: newTool.name,
      category: newTool.category as ToolCategory,
      version: newTool.version || '1.0.0',
      description: newTool.description,
      status: 'Active',
      author: 'User'
    };
    onAddTool(tool);
    setIsModalOpen(false);
    setNewTool({ name: '', category: ToolCategory.ComplianceVerification, description: '', version: '' });
  };

  const categories = ['All', ...Object.values(ToolCategory)];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <p className="text-slate-500">集成和管理各类 AI 测评工具链，支持合规、安全、能力等多种评估维度。</p>
        </div>
        <div className="flex gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="搜索工具..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition"
             >
                <Plus size={16} />
                <span>新增工具</span>
            </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeCategory === cat 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? '全部工具' : cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => {
          const Icon = CategoryIconMap[tool.category] || Zap;
          const colorClass = CategoryColorMap[tool.category] || 'bg-slate-50 text-slate-600';

          return (
            <div key={tool.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-2">
                   {tool.status === 'Update Available' && (
                     <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" title="Update Available"></span>
                   )}
                   <button className="text-slate-400 hover:text-slate-600">
                     <MoreHorizontal size={18} />
                   </button>
                </div>
              </div>

              <div className="mb-3">
                 <h3 className="font-bold text-slate-800 text-lg leading-tight">{tool.name}</h3>
                 <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">v{tool.version}</span>
                   <span className="text-xs text-slate-400">by {tool.author}</span>
                 </div>
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2 flex-grow">
                {tool.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                 <button className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                   配置
                 </button>
                 <button className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition" title="下载/更新">
                   <DownloadCloud size={18} />
                 </button>
              </div>
            </div>
          );
        })}
        
        {filteredTools.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
             <Search size={48} className="mb-4 opacity-50" />
             <p>未找到匹配的测评工具</p>
          </div>
        )}
      </div>

      {/* Add Tool Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="集成新工具"
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">取消</button>
            <button onClick={handleAdd} disabled={!newTool.name} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">确认集成</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">工具名称</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="例如：Custom Security Scanner"
              value={newTool.name}
              onChange={(e) => setNewTool({...newTool, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">工具分类</label>
            <select 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newTool.category}
              onChange={(e) => setNewTool({...newTool, category: e.target.value})}
            >
              {Object.values(ToolCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">当前版本</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. 1.0.0"
                  value={newTool.version}
                  onChange={(e) => setNewTool({...newTool, version: e.target.value})}
                />
             </div>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">功能描述</label>
             <textarea 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition h-24 resize-none"
                placeholder="简要描述该工具的主要功能和适用场景..."
                value={newTool.description}
                onChange={(e) => setNewTool({...newTool, description: e.target.value})}
             />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ToolManager;