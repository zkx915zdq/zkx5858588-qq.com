
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ModelManager from './components/ModelManager';
import TaskManager from './components/TaskManager';
import StrategyManager from './components/StrategyManager';
import DatasetManager from './components/DatasetManager';
import ToolManager from './components/ToolManager';
import ReportManager from './components/ReportManager';
import ReportDetail from './components/ReportDetail';
import SettingsManager from './components/SettingsManager';

import { MOCK_MODELS, MOCK_TASKS, MOCK_STRATEGIES, MOCK_REPORT, MOCK_DATASETS, MOCK_AGENTS, MOCK_INFRA, MOCK_TOOLS } from './constants';
import { EvaluationReport, TargetModel, EvaluationTask, Dataset, EvaluationTool } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState<EvaluationReport | null>(null);
  const [logoUrl, setLogoUrl] = useState('logo.png');
  
  // Global State for Data Persistence
  const [models, setModels] = useState<TargetModel[]>(MOCK_MODELS);
  const [tasks, setTasks] = useState<EvaluationTask[]>(MOCK_TASKS);
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [tools, setTools] = useState<EvaluationTool[]>(MOCK_TOOLS);
  // Mocking a list of reports based on the single mock report
  const [reports, setReports] = useState<EvaluationReport[]>([MOCK_REPORT]);

  // Global UI State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'reports') setSelectedReport(null);
  };

  const handleTriggerCreateTask = () => {
    setActiveTab('tasks');
    setIsTaskModalOpen(true);
  };

  const handleAddTask = (newTask: EvaluationTask) => {
    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
  };

  const handleAddModel = (newModel: TargetModel) => {
    setModels([newModel, ...models]);
  };

  const handleAddDataset = (newDataset: Dataset) => {
    setDatasets([newDataset, ...datasets]);
  };

  const handleAddTool = (newTool: EvaluationTool) => {
    setTools([newTool, ...tools]);
  };

  const renderContent = () => {
    // If a report is selected and we are in the reports tab, show details
    if (activeTab === 'reports' && selectedReport) {
      return (
        <ReportDetail 
          report={selectedReport} 
          onBack={() => setSelectedReport(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
            <Dashboard 
                models={models} 
                tasks={tasks} 
                strategies={MOCK_STRATEGIES}
                datasets={datasets}
                reports={reports}
                tools={tools}
                agents={MOCK_AGENTS}
                infra={MOCK_INFRA}
                onNavigate={handleNavigate}
            />
        );
      case 'models':
        return (
          <ModelManager 
            models={models} 
            onAddModel={handleAddModel} 
          />
        );
      case 'tools':
        return (
          <ToolManager 
            tools={tools} 
            onAddTool={handleAddTool} 
          />
        );
      case 'tasks':
        return (
          <TaskManager 
            tasks={tasks} 
            onAddTask={handleAddTask}
            isModalOpen={isTaskModalOpen}
            onCloseModal={() => setIsTaskModalOpen(false)}
          />
        );
      case 'strategies':
        return <StrategyManager strategies={MOCK_STRATEGIES} />;
      case 'datasets':
        return (
          <DatasetManager 
            datasets={datasets} 
            onAddDataset={handleAddDataset}
          />
        );
      case 'reports':
        return (
          <ReportManager 
            reports={reports} 
            onViewReport={(report) => setSelectedReport(report)} 
          />
        );
      case 'settings':
        return (
          <SettingsManager 
            logoUrl={logoUrl} 
            onLogoChange={setLogoUrl} 
          />
        );
      default:
        return (
            <Dashboard 
                models={models} 
                tasks={tasks} 
                strategies={MOCK_STRATEGIES}
                datasets={datasets}
                reports={reports}
                tools={tools}
                agents={MOCK_AGENTS}
                infra={MOCK_INFRA}
                onNavigate={handleNavigate}
            />
        );
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={handleNavigate}
      onCreateTask={handleTriggerCreateTask}
      logoUrl={logoUrl}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
