
import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, RefreshCcw, Check, AlertCircle } from 'lucide-react';

interface SettingsManagerProps {
  logoUrl: string;
  onLogoChange: (url: string) => void;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ logoUrl, onLogoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file.type !== 'image/png') {
      setError('仅支持上传 PNG 格式的图片');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onLogoChange(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const resetLogo = () => {
    onLogoChange('logo.png');
    setError(null);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ImageIcon size={20} className="text-indigo-600" />
            外观与品牌定制
          </h3>
          <p className="text-sm text-slate-500 mt-1">自定义系统 Logo 和品牌识别元素</p>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Logo Upload Area */}
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <p className="text-sm font-semibold text-slate-700">当前 Logo 预览</p>
              <div className="w-40 h-40 bg-slate-900 rounded-2xl flex items-center justify-center p-4 shadow-inner ring-4 ring-slate-50 relative group">
                <img 
                  src={logoUrl} 
                  alt="Current Logo" 
                  className="max-w-full max-h-full object-contain drop-shadow-md"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-2xl">
                   <span className="text-white text-xs font-medium">预览效果</span>
                </div>
              </div>
              <button 
                onClick={resetLogo}
                className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                <RefreshCcw size={12} /> 恢复默认 Logo
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-sm font-semibold text-slate-700">上传新 Logo</p>
              
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept=".png" 
                  className="hidden" 
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <div className={`p-4 rounded-full mb-4 ${dragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Upload size={32} />
                  </div>
                  <p className="text-base font-medium text-slate-800">点击或拖拽 PNG 图片至此处</p>
                  <p className="text-sm text-slate-500 mt-2">建议尺寸 512x512px，背景透明，大小不超过 2MB</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 text-xs rounded-full font-mono">.PNG Only</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100 animate-in shake duration-300">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {!error && logoUrl.startsWith('data:') && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg text-sm border border-emerald-100">
                  <Check size={16} />
                  Logo 已成功更新并实时应用至系统。
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other System Settings Placeholder */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 opacity-60">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">高级配置</h3>
        </div>
        <div className="p-8 space-y-6">
           <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">系统维护模式</p>
                <p className="text-xs text-slate-500">开启后，非管理员用户将无法访问测评门户。</p>
              </div>
              <div className="h-6 w-11 bg-slate-200 rounded-full relative">
                <div className="absolute top-1 left-1 bg-white h-4 w-4 rounded-full shadow-sm"></div>
              </div>
           </div>
           <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">自动清理历史任务</p>
                <p className="text-xs text-slate-500">自动清理 90 天前的未标记测评报告。</p>
              </div>
              <div className="h-6 w-11 bg-indigo-600 rounded-full relative">
                <div className="absolute top-1 right-1 bg-white h-4 w-4 rounded-full shadow-sm"></div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsManager;
