// FIX: Add React import to support JSX syntax.
import React from 'react';
import type { Tab } from '../types';
import { Icons } from './Icons';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabConfig: { id: Tab; label: string; icon: JSX.Element }[] = [
  { id: 'campaign', label: 'Campaign Generator', icon: <Icons.Wand /> },
  { id: 'chat', label: 'Chat Bot', icon: <Icons.Chat /> },
  { id: 'image', label: 'Image Generator', icon: <Icons.Image /> },
];

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center border-b border-slate-700">
      {tabConfig.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm md:text-base font-medium transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-t-lg
            ${
              activeTab === id
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }
          `}
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};
