import React, { useState, useCallback, useRef } from 'react';
import { storyData as initialCards } from '../../data';
import { StoryCard, CardType, Story } from '../../types';
import { HeartIcon, XMarkIcon, SparklesIcon } from '../../components/Icons';

const CollectedStoriesModal: React.FC<{ stories: Story[]; onClose: () => void }> = ({ stories, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">我收藏的故事</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                {stories.length > 0 ? (
                    <div className="overflow-y-auto p-6 space-y-4">
                        {stories.map((story) => (
                            <div key={story.id} className="flex items-start bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <img src={story.image} alt={story.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                                <div className="ml-4">
                                    <p className="font-semibold text-orange-500 text-sm">{story.organization}</p>
                                    <h3 className="font-bold text-gray-800 mt-1">{story.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{story.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
                        <p className="text-lg text-gray-600">您還沒有收藏任何故事。</p>
                        <p className="text-gray-500 mt-2">快去探索並向右滑動來收藏您喜歡的故事吧！</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// A simple card component, defined outside the main component
const Card: React.FC<{ card: StoryCard }> = ({ card }) => {
  if (card.type === CardType.Surprise) {
    return (
      <div className="absolute w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center text-center text-white overflow-hidden select-none">
        <SparklesIcon className="w-16 h-16 text-white opacity-80 mb-4" />
        <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
        <p className="text-lg">{card.content}</p>
      </div>
    );
  }
  return (
    <div className="absolute w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden select-none">
      <img src={card.image} alt={card.title} className="w-full h-2/3 object-cover pointer-events-none" />
      <div className="p-6 h-1/3 flex flex-col justify-between">
        <div>
          <p className="font-semibold text-orange-500">{card.organization}</p>
          <h3 className="text-xl font-bold mt-1 text-gray-800">{card.title}</h3>
          <p className="text-gray-600 text-sm mt-2">{card.content}</p>
        </div>
      </div>
    </div>
  );
};


const StoryDeckFeature: React.FC = () => {
  const [cards, setCards] = useState<StoryCard[]>(initialCards);
  const [collectedCount, setCollectedCount] = useState(0);
  const [collectedStories, setCollectedStories] = useState<Story[]>([]);
  const [isCollectionVisible, setIsCollectionVisible] = useState(false);
  const [animation, setAnimation] = useState<{ x: number; y: number; rot: number; isAnimating: boolean }>({ x: 0, y: 0, rot: 0, isAnimating: false });
  const dragState = useRef({ isDragging: false, startX: 0, currentX: 0 });
  const topCardRef = useRef<HTMLDivElement>(null);

  const removeCard = useCallback((id: number, direction: 'left' | 'right') => {
    if (direction === 'right') {
        const swipedCard = cards[cards.length - 1];
        if (swipedCard && swipedCard.type === CardType.Story) {
            setCollectedStories(prev => [swipedCard as Story, ...prev]);
        }
        setCollectedCount(prev => prev + 1);
    }
    setCards(prevCards => prevCards.slice(0, prevCards.length - 1));
    setAnimation({ x: 0, y: 0, rot: 0, isAnimating: false });
  }, [cards]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (cards.length === 0 || animation.isAnimating) return;

    const topCardId = cards[cards.length - 1].id;
    const endX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const endRot = direction === 'right' ? 30 : -30;

    setAnimation({ x: endX, y: 50, rot: endRot, isAnimating: true });

    setTimeout(() => {
      removeCard(topCardId, direction);
    }, 300);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (cards.length === 0 || animation.isAnimating) return;
    dragState.current = { isDragging: true, startX: e.clientX, currentX: e.clientX };
    topCardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging) return;
    const currentX = e.clientX;
    const deltaX = currentX - dragState.current.startX;
    dragState.current.currentX = currentX;
    const rot = deltaX / 20;
    setAnimation({ x: deltaX, y: 0, rot, isAnimating: false });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDragging) return;
    topCardRef.current?.releasePointerCapture(e.pointerId);
    dragState.current.isDragging = false;
    
    const deltaX = dragState.current.currentX - dragState.current.startX;
    const threshold = 75;

    if (deltaX > threshold) {
      handleSwipe('right');
    } else if (deltaX < -threshold) {
      handleSwipe('left');
    } else {
      setAnimation({ x: 0, y: 0, rot: 0, isAnimating: true });
      setTimeout(() => setAnimation({ x: 0, y: 0, rot: 0, isAnimating: false }), 300);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">探索公益故事</h2>
        <p className="text-gray-600 mt-2">向右滑動收藏，向左滑動跳過。你的每一次互動，都是一份支持。</p>
        <div className="mt-4 flex items-center justify-center space-x-4">
            <p className="text-lg font-medium text-orange-600">已收藏：{collectedCount} 篇</p>
            <button 
                onClick={() => setIsCollectionVisible(true)}
                className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-full border border-orange-300 hover:bg-orange-50 transition-colors shadow-sm"
            >
                查看列表
            </button>
        </div>
      </div>

      <div className="w-full max-w-sm h-[500px] relative mb-8">
        {cards.length > 0 ? (
          cards.map((card, index) => {
            const isTopCard = index === cards.length - 1;
            const style = isTopCard ? {
              transform: `translate(${animation.x}px, ${animation.y}px) rotate(${animation.rot}deg)`,
              transition: dragState.current.isDragging ? 'none' : 'transform 0.3s ease-out',
            } : {
              transform: `scale(${1 - (cards.length - 1 - index) * 0.05}) translateY(${(cards.length - 1 - index) * -10}px)`,
              transition: 'transform 0.5s',
            };

            return (
              <div
                key={card.id}
                ref={isTopCard ? topCardRef : null}
                className="absolute w-full h-full"
                style={{
                  zIndex: index,
                  touchAction: isTopCard ? 'none' : 'auto',
                  cursor: isTopCard ? 'grab' : 'auto',
                   ...style,
                }}
                onPointerDown={isTopCard ? handlePointerDown : undefined}
                onPointerMove={isTopCard ? handlePointerMove : undefined}
                onPointerUp={isTopCard ? handlePointerUp : undefined}
                onPointerCancel={isTopCard ? handlePointerUp : undefined}
              >
                <Card card={card} />
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 rounded-2xl text-center p-4">
            <h3 className="text-2xl font-bold text-gray-700">故事已瀏覽完畢！</h3>
            <p className="text-gray-500 mt-2">謝謝您的關注，歡迎稍後再來探索新故事。</p>
            <p className="mt-4 text-lg">您已收藏了 <span className="font-bold text-orange-500">{collectedCount}</span> 篇動人故事。</p>
          </div>
        )}
      </div>

      <div className="flex space-x-8">
        <button
          onClick={() => handleSwipe('left')}
          disabled={cards.length === 0 || animation.isAnimating}
          className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-transform"
          aria-label="跳過"
        >
          <XMarkIcon className="w-10 h-10" />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          disabled={cards.length === 0 || animation.isAnimating}
          className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 transition-transform"
          aria-label="收藏"
        >
          <HeartIcon className="w-10 h-10" />
        </button>
      </div>

      {isCollectionVisible && (
        <CollectedStoriesModal 
            stories={collectedStories} 
            onClose={() => setIsCollectionVisible(false)} 
        />
      )}
    </div>
  );
};

export default StoryDeckFeature;