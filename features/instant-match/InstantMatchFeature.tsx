import React, { useState } from 'react';
import { cateringProviders } from '../../data';
import { CateringProvider } from '../../types';
import { XMarkIcon } from '../../components/Icons';

const ProviderDetailsModal: React.FC<{ provider: CateringProvider; onClose: () => void }> = ({ provider, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="grid md:grid-cols-2 gap-0">
                    <img src={provider.image} alt={provider.name} className="w-full h-48 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-t-none" />
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-orange-600">{provider.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{provider.issue}</p>
                        <p className="text-gray-700 mt-4">{provider.description}</p>
                        <div className="mt-4 space-y-2 text-sm text-gray-800">
                             <p><span className="font-semibold">特色餐點：</span>{provider.specialties.join('、')}</p>
                            <p><span className="font-semibold">建議人數：</span>{provider.minPeople} - {provider.maxPeople} 人</p>
                            <p><span className="font-semibold">預估單價：</span>${provider.pricePerPerson} / 人</p>
                            <p><span className="font-semibold">預估出貨：</span>{provider.deliveryTime}</p>
                        </div>
                        <button className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                            確認訂購此方案
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const MatchResultCard: React.FC<{ provider: CateringProvider; onSelect: () => void; }> = ({ provider, onSelect }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
        <h3 className="text-xl font-bold text-orange-600">{provider.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{provider.issue}</p>
        <div className="mt-4 space-y-2 text-gray-700 flex-grow">
            <p><span className="font-semibold">特色餐點：</span>{provider.specialties.join('、')}</p>
            <p><span className="font-semibold">建議人數：</span>{provider.minPeople} - {provider.maxPeople} 人</p>
            <p><span className="font-semibold">預估單價：</span>${provider.pricePerPerson} / 人</p>
            <p><span className="font-semibold">預估出貨：</span>{provider.deliveryTime}</p>
        </div>
        <button onClick={onSelect} className="w-full mt-6 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
            選擇此方案
        </button>
    </div>
)

const InstantMatchFeature: React.FC = () => {
  const [people, setPeople] = useState('');
  const [budget, setBudget] = useState('');
  const [eventType, setEventType] = useState('company');
  const [details, setDetails] = useState('');
  const [results, setResults] = useState<CateringProvider[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CateringProvider | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPeople = parseInt(people, 10);
    const budgetPerPerson = parseInt(budget, 10);

    if (isNaN(numPeople) || isNaN(budgetPerPerson) || numPeople <= 0 || budgetPerPerson <= 0) {
        const genericProviders = [...cateringProviders]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        setResults(genericProviders);
        setSubmitted(true);
        return;
    }
    
    const scoredProviders = cateringProviders.map(provider => {
        let score = 0;
        
        if (numPeople >= provider.minPeople) {
            score += 5;
            if (numPeople <= provider.maxPeople) {
                score += 3;
            } else {
                score -= Math.min(5, (numPeople - provider.maxPeople) / 10);
            }
        } else {
             score -= 10;
        }

        if (budgetPerPerson >= provider.pricePerPerson) {
            score += 5;
            score += (budgetPerPerson - provider.pricePerPerson) / 50;
        } else {
            score -= Math.min(8, (provider.pricePerPerson - budgetPerPerson) / 20);
        }
        return { ...provider, score };
    });

    scoredProviders.sort((a, b) => b.score - a.score);

    setResults(scoredProviders.slice(0, 3));
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">即時媒合外燴需求</h2>
            <p className="text-gray-600 mt-2">告訴我們您的需求，讓我們為您快速找到最合適的公益外燴方案。</p>
        </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">人數</label>
            <input
              type="text"
              id="people"
              inputMode="numeric"
              pattern="[0-9]*"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              placeholder="例如：30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">每人預算 (TWD)</label>
            <input
              type="text"
              id="budget"
              inputMode="numeric"
              pattern="[0-9]*"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="例如：200"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
           <div className="md:col-span-2">
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">活動類型</label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="company">企業活動</option>
              <option value="school">學校聚會</option>
              <option value="personal">私人派對</option>
              <option value="wedding">婚禮宴客</option>
              <option value="holiday">節慶贈禮</option>
              <option value="other">其他</option>
            </select>
          </div>
           <div className="md:col-span-2">
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">其他需求說明</label>
                 <textarea
                    id="details"
                    rows={3}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    placeholder="例如：需要無麩質選項、希望有客製化包裝等..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
           </div>
          <button type="submit" className="md:col-span-2 w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors text-lg mt-2">
            開始媒合
          </button>
        </form>
      </div>

      {submitted && (
        <div>
          <h3 className="text-2xl font-bold text-center mb-6">
             「為您推薦以下 3 個方案」
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(provider => <MatchResultCard key={provider.id} provider={provider} onSelect={() => setSelectedProvider(provider)} />)}
          </div>
        </div>
      )}

      {selectedProvider && <ProviderDetailsModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />}
    </div>
  );
};

export default InstantMatchFeature;
