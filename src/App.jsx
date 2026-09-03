import { useState } from 'react';
import questionsData from './data/questions.json';

import combinedLogo from './logo/logos.png';
import characterImg from './logo/gwandbc.png';

function App() {
  const [currentStep, setCurrentStep] = useState('intro'); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({
    밀착: 0, 진로: 0, 취업: 0, 사례: 0, 자신감: 0
  });

  const [answerHistory, setAnswerHistory] = useState([]);
  
  // 💡 [추가됨] 카드 뒤집기 상태를 관리하는 State
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAnswer = (scoreValue) => {
    const currentModule = questionsData[currentQuestionIndex].module;
    setAnswerHistory((prev) => {
      const newHistory = [...prev];
      newHistory[currentQuestionIndex] = scoreValue;
      return newHistory;
    });
    setScores((prev) => ({ ...prev, [currentModule]: prev[currentModule] + scoreValue }));

    const isLastQuestion = currentQuestionIndex === questionsData.length - 1;
    if (isLastQuestion) setCurrentStep('result');
    else setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleGoBack = () => {
    if (currentQuestionIndex === 0) {
      setCurrentStep('intro');
      return;
    }
    const prevIndex = currentQuestionIndex - 1;
    const prevModule = questionsData[prevIndex].module;
    const scoreToSubtract = answerHistory[prevIndex];

    setScores((prev) => ({
      ...prev,
      [prevModule]: prev[prevModule] - scoreToSubtract
    }));
    setCurrentQuestionIndex(prevIndex);
  };

  const getTopModule = () => {
    const maxScore = Math.max(...Object.values(scores));
    const topModuleName = Object.keys(scores).find(module => scores[module] === maxScore);
    return { name: topModuleName, score: maxScore };
  };

  const resetTest = () => {
    setScores({ 밀착: 0, 진로: 0, 취업: 0, 사례: 0, 자신감: 0 });
    setCurrentQuestionIndex(0);
    setAnswerHistory([]); 
    setIsFlipped(false); // 💡 다시하기 누를 때 카드 앞면으로 원복
    setCurrentStep('intro');
  };

  // --- 화면 렌더링 ---
  const renderIntro = () => (
    <div className="flex flex-col min-h-screen px-6 py-10 text-center animate-fade-in">
      <div className="flex-1"></div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-12 shadow-lg overflow-hidden bg-transparent">
          <img 
            src={characterImg} 
            alt="청년도전지원사업 마스코트" 
            className="w-20 h-auto object-contain drop-shadow-sm" 
          />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-4">청년 맞춤형 컬러 진단</h1>
        <p className="text-gray-500 mb-10 break-keep leading-relaxed">
          청년도전지원사업의 모듈 중 나에게 지금 가장 필요한 것은 무엇일까요?<br />
          여러분에게 꼭 필요한 모듈을 찾아드립니다 💡
        </p>
        <button 
          onClick={() => setCurrentStep('test')}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 transition active:scale-95 mb-12"
        >
          진단 시작하기
        </button>
        <div className="flex justify-center items-center w-full px-2">
          <img 
            src={combinedLogo} 
            alt="고용노동부 및 협력기관 로고" 
            className="w-11/12 max-w-sm h-auto object-contain" 
          />
        </div>
        <div className="flex-1 flex items-end justify-end w-full pb-2">
        <p className="text-[10px] text-gray-400 text-right break-keep opacity-80">
        해당 테스트는 관악청년도전지원사업 또래서포터즈 활동의 일환으로 제작되었습니다.
        </p>
      </div>
      </div>
      <div className="flex-1 flex items-end justify-end w-full pb-2">
      </div>
    </div>
  );

  const renderTest = () => {
    const currentQuestion = questionsData[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questionsData.length) * 100;

    return (
      <div className="flex flex-col h-full px-6 py-10 animate-fade-in relative">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
            <span>진행률</span>
            <span>{currentQuestionIndex + 1} / {questionsData.length}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col pb-12">
          <h2 className="text-xl font-bold text-gray-800 leading-snug break-keep mb-8">
            <span className="text-blue-500 mr-2">Q.</span>
            {currentQuestion.text}
          </h2>
          
          <div className="flex flex-col gap-3 mb-6">
            {[
              { label: '매우 그렇다', value: 5, bg: 'bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold' },
              { label: '그렇다', value: 4, bg: 'bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold' },
              { label: '보통이다', value: 3, bg: 'bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold' },
              { label: '아니다', value: 2, bg: 'bg-red-50 hover:bg-red-100 text-red-500 font-bold' },
              { label: '매우 아니다', value: 1, bg: 'bg-red-100 hover:bg-red-200 text-red-700 font-bold' },
            ].map((btn) => (
              <button 
                key={btn.value} 
                onClick={() => handleAnswer(btn.value)}
                className={`w-full py-4 px-6 text-left rounded-xl transition duration-200 active:scale-95 ${btn.bg}`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button 
            onClick={handleGoBack}
            className="text-gray-400 font-medium text-sm underline underline-offset-4 hover:text-gray-600 transition self-center mt-2"
          >
            {currentQuestionIndex === 0 ? '← 처음으로 돌아가기' : '← 이전 질문으로 돌아가기'}
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const topModule = getTopModule();

    const moduleColors = {
      '밀착': { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600' },
      '사례': { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600' },
      '자신감': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600' },
      '진로': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600' },
      '취업': { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600' }
    };
    const currentColors = moduleColors[topModule.name] || moduleColors['진로'];

    // 💡 1. 각 모듈의 성격에 맞는 맞춤형 이모지 딕셔너리 추가
    const moduleEmojis = {
      '밀착': '🤝', // 손잡기 (상담, 지지)
      '사례': '📋', // 클립보드 (계획, 관리)
      '자신감': '💪', // 팔뚝 (회복, 힘)
      '진로': '🧭', // 나침반 (방향 탐색)
      '취업': '💼'  // 서류가방 (구직, 실전)
    };

    const moduleDescriptions = {
      '밀착': '1:1 맞춤형 심층 상담을 통해 일상과 진로에 대한 고민을 함께 나누고 해결책을 찾아갑니다.',
      '사례': '주거, 금융, 건강 등 생활 전반의 어려움을 파악하고 필요한 외부 서비스를 연계해 드립니다.',
      '자신감': '다양한 활동과 성취 경험을 통해 잃어버린 자존감을 회복하고 새로운 도전을 준비합니다.',
      '진로': '나의 강점과 적성을 탐색하여 명확한 진로 목표를 설정하고 나만의 방향성을 찾아갑니다.',
      '취업': '이력서/자소서 컨설팅, 면접 코칭 등 실전 구직 역량을 강화하여 성공적인 취업을 돕습니다.'
    };

    return (
      <div className="flex flex-col h-full px-6 py-10 animate-fade-in relative">
        
        <style>{`
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
          
          @keyframes flip-hint {
            0%, 100% { transform: perspective(1000px) rotateY(0deg); }
            50% { transform: perspective(1000px) rotateY(15deg); }
          }
          .animate-flip-hint { animation: flip-hint 1.2s ease-in-out 2; }
        `}</style>

        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 text-sm font-bold flex items-center justify-center shadow-sm">
          🚨 이 화면을 부스 담당자에게 보여주세요
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <h2 className="text-gray-500 font-medium mb-4">당신에게 가장 필요한 지원은</h2>

          <div 
            className="w-full h-64 cursor-pointer perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : 'animate-flip-hint'}`}>
              
              {/* --- 앞면 --- */}
              <div className={`absolute w-full h-full backface-hidden ${currentColors.bg} border-2 ${currentColors.border} rounded-3xl p-8 shadow-lg flex flex-col items-center justify-center`}>
                <h1 className={`text-4xl font-extrabold ${currentColors.text} mb-3`}>
                  [{topModule.name}]
                </h1>
                <p className="text-gray-700 font-medium">해당 분야의 집중 상담을 추천합니다.</p>
              </div>

              {/* --- 뒷면 (모듈 설명) --- */}
              <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${currentColors.bg} border-2 ${currentColors.border} rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center text-center`}>
                
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-2xl">{moduleEmojis[topModule.name]}</span>
                </div>
                
                <h3 className={`text-xl font-extrabold ${currentColors.text} mb-3`}>
                  {topModule.name} 모듈이란?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed break-keep px-2">
                  {moduleDescriptions[topModule.name]}
                </p>
              </div>

            </div>
          </div>

          <p className="text-sm text-gray-400 mt-6 animate-pulse font-medium">
            👆 카드를 터치해서 설명을 확인해 보세요!
          </p>
        </div>

        <button 
          onClick={resetTest} 
          className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl shadow-md hover:bg-gray-900 transition active:scale-95"
        >
          처음부터 다시하기
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-x-hidden">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'test' && renderTest()}
        {currentStep === 'result' && renderResult()}
      </div>
    </div>
  );
}

export default App;