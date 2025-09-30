
import React, { useState } from 'react';
import StoryDeckFeature from './features/story-deck/StoryDeckFeature';
import CrowdChallengeFeature from './features/crowd-challenge/CrowdChallengeFeature';
import InstantMatchFeature from './features/instant-match/InstantMatchFeature';
import SmartSearchFeature from './features/smart-search/SmartSearchFeature';
import { HeartIcon, SparklesIcon, UsersIcon, MagnifyingGlassIcon, BuildingStorefrontIcon } from './components/Icons';

type Feature = 'story' | 'challenge' | 'match' | 'search';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>('story');

  const renderFeature = () => {
    switch (activeFeature) {
      case 'story':
        return <StoryDeckFeature />;
      case 'challenge':
        return <CrowdChallengeFeature />;
      case 'match':
        return <InstantMatchFeature />;
      case 'search':
        return <SmartSearchFeature />;
      default:
        return <StoryDeckFeature />;
    }
  };

  const navItems = [
    { id: 'story', name: '故事卡片', icon: <SparklesIcon className="w-5 h-5" /> },
    { id: 'challenge', name: '群體挑戰', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'match', name: '即時媒合', icon: <HeartIcon className="w-5 h-5" /> },
    { id: 'search', name: '智慧搜尋', icon: <MagnifyingGlassIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-orange-50 min-h-screen text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <BuildingStorefrontIcon className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-500">GoodBite</h1>
          </div>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveFeature(item.id as Feature)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-300 ${
                  activeFeature === item.id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-orange-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {renderFeature()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-2 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFeature(item.id as Feature)}
            className={`flex flex-col items-center justify-center w-1/4 py-1 rounded-lg transition-colors duration-300 ${
              activeFeature === item.id ? 'text-orange-500' : 'text-gray-500'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </div>
       <footer className="text-center p-4 text-gray-500 text-sm mt-8 pb-20 md:pb-4">
          <p>GoodBite 公益外燴平台 &copy; 2025. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default App;
