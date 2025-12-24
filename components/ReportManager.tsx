import React from 'react';
import { EvaluationReport } from '../types';
import { FileText, Eye, Download } from 'lucide-react';

interface ReportManagerProps {
  reports: EvaluationReport[];
  onViewReport: (report: EvaluationReport) => void;
}

const ReportManager: React.FC<ReportManagerProps> = ({ reports, onViewReport }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <p className="text-slate-500">查看历史测评报告和分析。</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
           <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">报告 ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">模型</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">生成时间</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">得分</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {/* Since we only have one mock report, I'll duplicate it for the list effect */}
             {[reports[0], {...reports[0], id: 'r-LLM-20251214-002', generatedAt: '2025-05-09 10:00', overallScore: 76}].map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        <span className="font-medium text-slate-700">{report.id}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{report.modelName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{report.generatedAt}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        report.overallScore >= 90 ? 'bg-green-100 text-green-700' :
                        report.overallScore >= 80 ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                     }`}>
                        {report.overallScore}/100
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                       <button 
                        onClick={() => onViewReport(report)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                       >
                         <Eye size={16} /> 查看
                       </button>
                    </div>
                  </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportManager;