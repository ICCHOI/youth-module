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
  
  // 💡 [추가됨] 유저가 누른 점수를 문항 순서대로 기억하는 배열 (롤백용)
  const [answerHistory, setAnswerHistory] = useState([]);

  const handleAnswer = (scoreValue) => {
    const currentModule = questionsData[currentQuestionIndex].module;

    // 1. 현재 문항에서 누른 점수를 히스토리에 저장
    setAnswerHistory((prev) => {
      const newHistory = [...prev];
      newHistory[currentQuestionIndex] = scoreValue;
      return newHistory;
    });

    // 2. 점수 누적
    setScores((prev) => ({ ...prev, [currentModule]: prev[currentModule] + scoreValue }));

    // 3. 다음 화면 이동 체크
    const isLastQuestion = currentQuestionIndex === questionsData.length - 1;
    if (isLastQuestion) setCurrentStep('result');
    else setCurrentQuestionIndex((prev) => prev + 1);
  };

  // 💡 [핵심 로직 추가] 뒤로 가기 및 점수 롤백
  const handleGoBack = () => {
    // 첫 번째 질문이라면 인트로 화면으로 돌려보냄
    if (currentQuestionIndex === 0) {
      setCurrentStep('intro');
      return;
    }

    const prevIndex = currentQuestionIndex - 1;
    const prevModule = questionsData[prevIndex].module;
    const scoreToSubtract = answerHistory[prevIndex];

    // 이전 문항의 점수 차감 (롤백)
    setScores((prev) => ({
      ...prev,
      [prevModule]: prev[prevModule] - scoreToSubtract
    }));

    // 인덱스 뒤로 이동
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
    setAnswerHistory([]); // 히스토리도 깔끔하게 초기화
    setCurrentStep('intro');
  };

  // --- 화면 렌더링 ---
 const renderIntro = () => (
    <div className="flex flex-col min-h-screen px-6 py-10 text-center animate-fade-in">
      
      <div className="flex-1"></div>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mb-12 shadow-lg overflow-hidden">
          <img 
            src={characterImg} 
            alt="청년도전지원사업 마스코트" 
            className="w-20 h-auto object-contain drop-shadow-sm" 
          />
        </div>
        
        <h1 className="text-2xl font-extrabold text-gray-800 mb-4">청년 맞춤형 컬러 진단</h1>
        
        {/* 💡 합쳐진 문장 영역 */}
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
          해당 테스트는 관악청년도전지원사업 또래서포터즈가 활동의 일환으로 제작되었습니다.
          </p>
        </div>
      </div>

      <div className="flex-1"></div>
      
    </div>
  );

  const renderTest = () => {
    const currentQuestion = questionsData[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questionsData.length) * 100;

    return (
      <div className="flex flex-col h-full px-6 py-10 animate-fade-in relative">
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
        <div className="flex-1 flex flex-col pb-12">
          <h2 className="text-xl font-bold text-gray-800 leading-snug break-keep mb-8">
            <span className="text-blue-500 mr-2">Q.</span>
            {currentQuestion.text}
          </h2>
          
          {/* 5점 척도 버튼 리스트 (그라데이션 색상 적용됨) */}
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

          {/* 💡 [UI 추가됨] 뒤로 가기 버튼 */}
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

    return (
      <div className="flex flex-col h-full px-6 py-10 animate-fade-in">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8 text-sm font-bold flex items-center justify-center shadow-sm">
          🚨 이 화면을 부스 담당자에게 보여주세요
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-gray-500 font-medium mb-2">당신에게 가장 필요한 지원은</h2>
          <div className={`${currentColors.bg} border-2 ${currentColors.border} rounded-2xl p-8 shadow-lg w-full mb-8 transition-colors duration-300`}>
            <h1 className={`text-4xl font-extrabold ${currentColors.text} mb-3`}>
              [{topModule.name}]
            </h1> 
            <p className="text-gray-700 font-medium">해당 분야의 모듈을 추천합니다.</p>
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