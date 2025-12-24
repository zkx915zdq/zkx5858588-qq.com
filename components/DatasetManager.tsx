
import React, { useState, useMemo } from 'react';
import { Dataset, DatasetType } from '../types';
import { Database, Search, Download, Plus, Tag, UploadCloud, ShieldCheck, ShieldAlert, Cpu, ChevronRight, Filter } from 'lucide-react';
import Modal from './Modal';

interface DatasetManagerProps {
  datasets: Dataset[];
  onAddDataset: (dataset: Dataset) => void;
}

const CategoryThemeMap: Record<DatasetType, { color: string, bg: string, icon: any, lightBg: string }> = {
  [DatasetType.Compliance]: { color: 'text-blue-600', bg: 'bg-blue-600', lightBg: 'bg-blue-50', icon: ShieldCheck },
  [DatasetType.Security]: { color: 'text-red-600', bg: 'bg-red-600', lightBg: 'bg-red-50', icon: ShieldAlert },
  [DatasetType.Capability]: { color: 'text-emerald-600', bg: 'bg-emerald-600', lightBg: 'bg-emerald-50', icon: Cpu },
};

const DatasetManager: React.FC<DatasetManagerProps> = ({ datasets, onAddDataset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DatasetType>(DatasetType.Compliance);
  const [activeSubType, setActiveSubType] = useState<string>('All');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newDataset, setNewDataset] = useState({
    name: '',
    type: DatasetType.Compliance,
    subType: '',
    tags: ''
  });

  // Unique SubTypes for current category
  const subTypes = useMemo(() => {
    const types = datasets
      .filter(d => d.type === activeTab)
      .map(d => d.subType);
    return ['All', ...Array.from(new Set(types))];
  }, [datasets, activeTab]);

  // Unique Tags for current category/subtype
  const availableTags = useMemo(() => {
    const tags = datasets
      .filter(d => d.type === activeTab && (activeSubType === 'All' || d.subType === activeSubType))
      .flatMap(d => d.tags);
    return ['All', ...Array.from(new Set(tags))];
  }, [datasets, activeTab, activeSubType]);

  const filteredDatasets = datasets.filter(d => {
    const matchesTab = d.type === activeTab;
    const matchesSubType = activeSubType === 'All' || d.subType === activeSubType;
    const matchesTag = activeTag === 'All' || d.tags.includes(activeTag);
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.subType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSubType && matchesTag && matchesSearch;
  });

  const handleImport = () => {
    const dataset: Dataset = {
      id: `d${Date.now()}`,
      name: newDataset.name,
      type: newDataset.type,
      subType: newDataset.subType,
      count: Math.floor(Math.random() * 5000) + 500,
      tags: newDataset.tags.split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onAddDataset(dataset);
    setIsModalOpen(false);
    setNewDataset({ name: '', type: DatasetType.Compliance, subType: '', tags: '' });
  };

  const currentTheme = CategoryThemeMap[activeTab];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
       {/* 1. Category Selector (L1) */}
       <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex w-full md:w-fit self-center">
          {Object.values(DatasetType).map(type => {
            const { icon: Icon, color, lightBg } = CategoryThemeMap[type];
            const isActive = activeTab === type;
            return (
              <button 
                key={type}
                onClick={() => {
                  setActiveTab(type);
                  setActiveSubType('All');
                  setActiveTag('All');
                }}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                  isActive ? `${lightBg} ${color} shadow-sm ring-1 ring-slate-100` : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={18} />
                {type}
              </button>
            );
          })}
       </div>

       <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (L2 & L3) */}
          <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
             {/* Sub-type L2 */}
             <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Filter size={14} /> 二级模块分类
                </h4>
                <div className="space-y-1">
                   {subTypes.map(st => (
                     <button
                        key={st}
                        onClick={() => {setActiveSubType(st); setActiveTag('All');}}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                          activeSubType === st 
                            ? `${currentTheme.lightBg} ${currentTheme.color} font-bold shadow-sm border border-slate-100` 
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                     >
                        {st === 'All' ? '全部模块' : st}
                     </button>
                   ))}
                </div>
             </div>

             {/* Tags L3 */}
             <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Tag size={14} /> 三级细分标签
                </h4>
                <div className="flex flex-wrap gap-2">
                   {availableTags.map(tag => (
                     <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          activeTag === tag 
                            ? `${currentTheme.bg} text-white font-medium shadow-md` 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                     >
                        {tag === 'All' ? '全部标签' : tag}
                     </button>
                   ))}
                </div>
             </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
             {/* Search and Action */}
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                      type="text" 
                      placeholder="搜索语料库名称..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                   />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`flex items-center gap-2 px-6 py-2.5 ${currentTheme.bg} text-white rounded-xl shadow-lg hover:opacity-90 transition active:scale-95 text-sm font-bold`}
                >
                  <Plus size={18} /> 新增题库
                </button>
             </div>

             {/* Results Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDatasets.map((ds) => (
                  <div key={ds.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col group relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                         <div className={`p-2.5 rounded-xl ${currentTheme.lightBg} ${currentTheme.color}`}>
                            <currentTheme.icon size={24} />
                         </div>
                         <span className="text-[10px] font-mono text-slate-400 uppercase">最后更新: {ds.updatedAt}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{ds.name}</h3>
                      <p className="text-xs font-medium text-slate-500 mb-4">{ds.subType}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-6">
                         {ds.tags.map((tag, i) => (
                           <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] rounded-md border border-slate-100 flex items-center gap-1">
                              <Tag size={8} /> {tag}
                           </span>
                         ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400">数据量</span>
                            <span className="text-base font-bold text-slate-700">{ds.count.toLocaleString()}</span>
                         </div>
                         <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="详情预览">
                               <ChevronRight size={18} />
                            </button>
                            <button className={`p-2 ${currentTheme.color} ${currentTheme.lightBg} rounded-lg hover:shadow-md transition`} title="下载导出">
                               <Download size={18} />
                            </button>
                         </div>
                      </div>
                  </div>
                ))}
                
                {filteredDatasets.length === 0 && (
                  <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <Database size={64} className="mb-4 opacity-10" />
                      <p className="text-lg font-medium">在该维度下未找到匹配的题库</p>
                      <button 
                        onClick={() => {setActiveSubType('All'); setActiveTag('All'); setSearchQuery('');}} 
                        className="mt-4 text-indigo-600 hover:underline text-sm font-bold"
                      >
                        清空所有筛选条件
                      </button>
                  </div>
                )}
             </div>
          </div>
       </div>

       {/* Add Dataset Modal */}
       <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="创建新测评题库"
          size="lg"
          footer={
             <>
               <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition">取消</button>
               <button onClick={handleImport} disabled={!newDataset.name || !newDataset.subType} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition disabled:opacity-50">上传语料数据</button>
             </>
          }
       >
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">题库名称</label>
                  <input 
                     type="text" 
                     className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                     placeholder="例如：Gemini-2.5 价值观对齐测试集"
                     value={newDataset.name}
                     onChange={(e) => setNewDataset({...newDataset, name: e.target.value})}
                  />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1.5">测评大类 (L1)</label>
                 <select 
                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={newDataset.type}
                   onChange={(e) => setNewDataset({...newDataset, type: e.target.value as DatasetType})}
                 >
                   {Object.values(DatasetType).map(t => (
                     <option key={t} value={t}>{t}</option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1.5">二级模块 (L2)</label>
                 <input 
                     type="text" 
                     className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                     placeholder="如：OWASP AI 安全"
                     value={newDataset.subType}
                     onChange={(e) => setNewDataset({...newDataset, subType: e.target.value})}
                  />
               </div>
               <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">三级细分标签 (L3 - 逗号分隔)</label>
                  <input 
                     type="text" 
                     className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                     placeholder="例如：提示注入, 越狱绕过, 对抗防御"
                     value={newDataset.tags}
                     onChange={(e) => setNewDataset({...newDataset, tags: e.target.value})}
                  />
               </div>
             </div>
             
             <div className="group border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer">
                <UploadCloud size={48} className="mx-auto text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-base font-bold text-slate-700">将数据文件拖拽至此处，或点击浏览</p>
                <p className="text-sm text-slate-500 mt-2">支持 JSONL, CSV (推荐每行包含 prompt, reference 字段)</p>
             </div>
          </div>
       </Modal>
    </div>
  );
};

export default DatasetManager;
