import React, { useState } from 'react';
import type { Tab } from './types';
import { CampaignGenerator } from './components/CampaignGenerator';
import { ChatBot } from './components/ChatBot';
import { ImageGenerator } from './components/ImageGenerator';
import { Tabs } from './components/Tabs';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('campaign');

  const renderContent = () => {
    switch (activeTab) {
      case 'campaign':
        return <CampaignGenerator />;
      case 'chat':
        return <ChatBot />;
      case 'image':
        return <ImageGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6 flex-grow flex flex-col">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
