
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Box, 
  ListTodo, 
  ShieldCheck, 
  FileText, 
  Menu, 
  X,
  Bell,
  Settings,
  Database,
  Wrench
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateTask?: () => void;
  logoUrl?: string;
}

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: '测评门户', icon: LayoutDashboard },
  { id: 'models', label: '测评对象管理', icon: Box },
  { id: 'tools', label: '测评工具管理', icon: Wrench },
  { id: 'tasks', label: '测评任务管理', icon: ListTodo },
  { id: 'strategies', label: '测评策略管理', icon: ShieldCheck },
  { id: 'datasets', label: '测评题库管理', icon: Database },
  { id: 'reports', label: '测评报告管理', icon: FileText },
];

const LAYOUT_TITLES: Record<string, string> = {
  dashboard: '测评驾驶舱',
  models: '测评对象管理',
  tools: '测评工具管理',
  tasks: '测评任务管理',
  strategies: '测评策略管理',
  datasets: '测评题库管理',
  reports: '测评报告管理',
  settings: '系统设置'
};

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onCreateTask, logoUrl = 'logo.png' }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold text-indigo-600 text-xl">
          <img src={logoUrl} alt="EvalMatrix" className="w-10 h-10 object-contain" />
          <span>EvalMatrix</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col shadow-xl`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-700 bg-slate-950">
          <div className="bg-white p-1 rounded-lg shadow-lg shadow-indigo-500/20">
            <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col">
             <span className="text-lg font-bold tracking-tight leading-none">EvalMatrix</span>
             <span className="text-xs text-slate-400 mt-1">智能测评系统</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all ${
              activeTab === 'settings' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">系统设置</span>
          </button>
          <div className="mt-2 flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer rounded-lg hover:bg-slate-800 transition">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800">JD</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">John Doe</span>
              <span className="text-xs text-slate-500">管理员</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50 relative">
         {/* Top Bar Desktop */}
        <header className="hidden md:flex bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-8 py-4 justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{LAYOUT_TITLES[activeTab] || activeTab}</h2>
            {activeTab === 'dashboard' && <p className="text-xs text-slate-500 mt-1">欢迎回来，系统运行正常。</p>}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={onCreateTask}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-200 active:scale-95"
            >
              新建测评任务
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-[1600px] mx-auto pb-20">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
