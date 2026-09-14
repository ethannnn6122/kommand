import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './containers/Dashboard';
import { Nodes } from './containers/Nodes';
import { Workloads } from './containers/Workloads';
import { Settings } from './containers/Settings';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContainer = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'nodes':
        return <Nodes />;
      case 'workloads':
        return <Workloads />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />
        <main className="p-8 max-w-7xl mx-auto w-full">
          {renderContainer()}
        </main>
      </div>
    </div>
  );
}

export default App;
