import React, { useState } from 'react';
import { EvaluationReport } from '../types';
import { analyzeReport } from '../services/geminiService';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Sparkles, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  LineChart, Line
} from 'recharts';

interface ReportDetailProps {
  report: EvaluationReport;
  onBack: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onBack }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFailures, setShowFailures] = useState(true);

  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeReport(report);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  // Prepare chart data
  const radarData = report.metrics.map(m => ({
    subject: m.name,
    A: (m.score / m.maxScore) * 100,
    fullMark: 100,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">测评报告</h1>
            <p className="text-slate-500 text-sm">任务 ID: {report.taskId} • 生成时间: {report.generatedAt}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50">
            <Share2 size={16} /> 分享
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 shadow-sm">
            <Download size={16} /> 导出 PDF
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
              <circle cx="64" cy="64" r="56" stroke={report.overallScore > 80 ? "#10b981" : "#f59e0b"} strokeWidth="12" fill="transparent" strokeDasharray="351.86" strokeDashoffset={351.86 - (351.86 * report.overallScore) / 100} className="transition-all duration-1000" />
            </svg>
            <span className="absolute text-3xl font-bold text-slate-800">{report.overallScore}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">总体得分</h3>
          <p className="text-sm text-slate-500">基于 {report.metrics.length} 个指标</p>
        </div>

        {/* AI Insight Section */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={100} className="text-indigo-600" />
          </div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-indigo-600 w-5 h-5" />
                <h3 className="font-bold text-indigo-900">AI 智能分析</h3>
             </div>
             
             {!analysis ? (
               <div className="text-center py-8">
                 <p className="text-slate-600 mb-4">使用 Gemini 生成即时分析报告。</p>
                 <button 
                  onClick={handleGenerateAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                 >
                   {isAnalyzing ? (
                     <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        正在分析...
                     </>
                   ) : (
                     <>生成洞察</>
                   )}
                 </button>
               </div>
             ) : (
               <div className="prose prose-sm max-w-none text-slate-700 max-h-48 overflow-y-auto custom-scrollbar">
                 <div className="whitespace-pre-wrap">{analysis}</div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Metrics Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">指标表现 (雷达图)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={report.modelName} dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-800 mb-6">历史趋势</h3>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={report.history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5 }} stroke="#94a3b8" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Failures List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div 
          className="p-6 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition"
          onClick={() => setShowFailures(!showFailures)}
        >
          <div className="flex items-center gap-3">
             <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                <AlertOctagon size={20} />
             </div>
             <div>
               <h3 className="font-bold text-slate-800">关键失败案例与风险</h3>
               <p className="text-xs text-slate-500">{report.failures.length} 个问题已检测</p>
             </div>
          </div>
          <ChevronDown className={`text-slate-400 transform transition duration-200 ${showFailures ? 'rotate-180' : ''}`} />
        </div>

        {showFailures && (
           <div className="divide-y divide-slate-100">
             {report.failures.map(failure => (
               <div key={failure.id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                      failure.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {failure.severity} 严重程度
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{failure.id}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="bg-slate-50 p-3 rounded border border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 mb-1">输入提示词 (PROMPT)</p>
                      <p className="text-sm text-slate-700 font-mono break-words">{failure.prompt}</p>
                    </div>
                     <div className="bg-red-50 p-3 rounded border border-red-100">
                      <p className="text-xs font-semibold text-red-500 mb-1">响应片段 (RESPONSE)</p>
                      <p className="text-sm text-slate-700 font-mono break-words">{failure.response}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-red-600 font-medium flex items-center gap-2">
                    <XCircle size={14} />
                    检测原因: {failure.reason}
                  </p>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetail;