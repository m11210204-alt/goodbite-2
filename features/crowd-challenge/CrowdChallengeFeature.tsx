import React, { useState } from 'react';
import { challengeData } from '../../data';
import { Challenge, SupportPackage } from '../../types';
import ProgressBar from '../../components/ProgressBar';
import { ShareIcon, UsersIcon, XMarkIcon } from '../../components/Icons';

const SupportModal: React.FC<{ challenge: Challenge; onClose: () => void }> = ({ challenge, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="p-8">
                    <p className="font-semibold text-orange-500">{challenge.organization}</p>
                    <h2 className="text-2xl font-bold text-gray-800 mt-1">選擇您的支持方案</h2>
                    <p className="text-gray-600 mt-2">您的每一份支持，都是圓夢的力量。</p>

                    <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                        {challenge.packages.map((pkg) => (
                            <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:border-orange-400 hover:bg-orange-50 transition-all">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800">{pkg.name}</h4>
                                    <p className="text-sm text-gray-600">{pkg.description}</p>
                                    <p className="text-sm text-gray-500 mt-1">貢獻 {pkg.contribution} 份進度</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-orange-600">${pkg.price}</p>
                                    <button className="mt-1 text-sm bg-orange-500 text-white font-semibold py-1 px-3 rounded-full hover:bg-orange-600">
                                        選擇
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChallengeCard: React.FC<{ challenge: Challenge; onSupportClick: () => void; }> = ({ challenge, onSupportClick }) => {
  const daysLeft = Math.max(0, Math.ceil((new Date(challenge.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <img src={challenge.image} alt={challenge.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-orange-500">{challenge.organization}</p>
        <h3 className="text-xl font-bold mt-2 text-gray-800">{challenge.title}</h3>
        <p className="text-gray-600 mt-2 text-sm h-16 flex-grow">{challenge.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
             <span className="text-sm font-medium text-gray-700">進度</span>
             <span className="text-sm font-bold text-orange-600">{challenge.current} / {challenge.goal} 份</span>
          </div>
          <ProgressBar current={challenge.current} goal={challenge.goal} />
        </div>

        <div className="mt-4 flex justify-between text-center">
            <div>
                <p className="text-2xl font-bold text-gray-800">{daysLeft}</p>
                <p className="text-xs text-gray-500">剩餘天數</p>
            </div>
             <div>
                <p className="text-2xl font-bold text-gray-800">{challenge.participants}</p>
                <p className="text-xs text-gray-500">參與人數</p>
            </div>
        </div>

        <div className="mt-6 flex space-x-4">
            <button 
                onClick={onSupportClick}
                className="flex-1 bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
                <UsersIcon className="w-5 h-5"/>
                <span>支持挑戰</span>
            </button>
            <button className="bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                <ShareIcon className="w-5 h-5"/>
            </button>
        </div>
      </div>
    </div>
  );
};


const CrowdChallengeFeature: React.FC = () => {
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  return (
    <div>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">群體支持挑戰</h2>
            <p className="text-gray-600 mt-2">集眾人之力，完成有意義的目標。每一次支持，都在創造改變。</p>
        </div>
      <div className="grid md:grid-cols-2 gap-8">
        {challengeData.map((challenge) => (
          <ChallengeCard 
            key={challenge.id} 
            challenge={challenge} 
            onSupportClick={() => setSelectedChallenge(challenge)}
          />
        ))}
      </div>
      {selectedChallenge && <SupportModal challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} />}
    </div>
  );
};

export default CrowdChallengeFeature;
