import { useState } from 'react';
import questionsData from './data/questions.json';

function App() {
  const [currentStep, setCurrentStep] = useState('intro'); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({
    밀착: 0, 진로: 0, 취업: 0, 사례: 0, 자신감: 0
  });

  const handleAnswer = (scoreValue) => {
    const currentModule = questionsData[currentQuestionIndex].module;
    setScores((prev) => ({ ...prev, [currentModule]: prev[currentModule] + scoreValue }));

    const isLastQuestion = currentQuestionIndex === questionsData.length - 1;
    if (isLastQuestion) setCurrentStep('result');
    else setCurrentQuestionIndex((prev) => prev + 1);
  };

  const getTopModule = () => {
    const maxScore = Math.max(...Object.values(scores));
    const topModuleName = Object.keys(scores).find(module => scores[module] === maxScore);
    return { name: topModuleName, score: maxScore };
  };

  const resetTest = () => {
    setScores({ 밀착: 0, 진로: 0, 취업: 0, 사례: 0, 자신감: 0 });
    setCurrentQuestionIndex(0);
    setCurrentStep('intro');
  };

  // --- 화면 렌더링 ---
  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in">
      <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
        💡
      </div>
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">청년 맞춤형 도움 진단</h1>
      <p className="text-gray-500 mb-10">지금 나에게 가장 필요한 도움은 무엇일까요?</p>
      <button 
        onClick={() => setCurrentStep('test')}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 transition active:scale-95"
      >
        진단 시작하기
      </button>
    </div>
  );

  const renderTest = () => {
    const currentQuestion = questionsData[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questionsData.length) * 100;

    return (
      <div className="flex flex-col h-full px-6 py-10 animate-fade-in">
        {/* 프로그레스 바 */}
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

        {/* 질문 영역 */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 leading-snug break-keep mb-8">
            <span className="text-blue-500 mr-2">Q.</span>
            {currentQuestion.text}
          </h2>
          
          {/* 5점 척도 버튼 리스트 */}
          <div className="flex flex-col gap-3">
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
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const topModule = getTopModule();

    // 💡 기획 & 개발 포인트: 모듈별 고유 컬러 매핑 (배경, 테두리, 텍스트 색상)
    const moduleColors = {
      '밀착': { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600' },
      '사례': { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600' },
      '자신감': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600' },
      '진로': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600' },
      '취업': { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600' }
    };

    // 만약 예기치 않은 데이터가 올 경우를 대비한 기본값(Fallback) 설정
    const currentColors = moduleColors[topModule.name] || moduleColors['진로'];

    return (
      <div className="flex flex-col h-full px-6 py-10 animate-fade-in">
        {/* 상단 캡처 유도 배너 */}
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 text-sm font-bold flex items-center justify-center shadow-sm">
          🚨 이 화면을 부스 담당자에게 보여주세요
        </div>

        {/* 결과 카드 */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-gray-500 font-medium mb-2">당신에게 가장 필요한 지원은</h2>
          
          {/* 💡 매핑된 컬러를 동적으로 주입 */}
          <div className={`${currentColors.bg} border-2 ${currentColors.border} rounded-2xl p-8 shadow-lg w-full mb-8 transition-colors duration-300`}>
            <h1 className={`text-4xl font-extrabold ${currentColors.text} mb-3`}>
              [{topModule.name}]
            </h1>
            <p className="text-gray-700 font-medium">해당 분야의 집중 상담을 추천합니다.</p>
          </div>
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
    // 모바일 뷰포트 레이아웃 (가운데 정렬된 480px 컨테이너)
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