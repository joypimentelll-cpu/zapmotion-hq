import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Clock, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  scenario: string;
  image?: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    scenario: 'Um botão de "Salvar" não fornece nenhum feedback visual quando clicado. O usuário não sabe se a ação foi bem-sucedida. Qual é o problema?',
    options: [
      { id: 'a', text: 'Falta de Gatilho (Trigger)' },
      { id: 'b', text: 'Falta de Feedback' },
      { id: 'c', text: 'Regras mal definidas' },
      { id: 'd', text: 'Problema de Loops & Modos' },
    ],
    correctAnswer: 'b',
    explanation: 'O Feedback é essencial para comunicar ao usuário que sua ação foi reconhecida e processada. Sem ele, o usuário fica perdido.',
  },
  {
    id: 2,
    scenario: 'Um formulário permite envio mesmo com campos obrigatórios vazios, e só mostra erro após recarregar a página. O que está errado?',
    options: [
      { id: 'a', text: 'Validação inline ausente' },
      { id: 'b', text: 'Cores muito escuras' },
      { id: 'c', text: 'Botão muito pequeno' },
      { id: 'd', text: 'Fonte ilegível' },
    ],
    correctAnswer: 'a',
    explanation: 'A validação inline é uma microinteração crucial que previne erros antes do envio, melhorando a experiência do usuário.',
  },
  {
    id: 3,
    scenario: 'Um toggle switch muda de estado instantaneamente, sem nenhuma animação ou transição. Qual princípio de microinteração está sendo violado?',
    options: [
      { id: 'a', text: 'Gatilho está incorreto' },
      { id: 'b', text: 'Regras estão confusas' },
      { id: 'c', text: 'Feedback visual insuficiente' },
      { id: 'd', text: 'Modo errado ativado' },
    ],
    correctAnswer: 'c',
    explanation: 'Animações suaves ajudam o usuário a entender que a ação foi reconhecida. A transição comunica a mudança de estado.',
  },
  {
    id: 4,
    scenario: 'Um sistema de automação RPA foi configurado para rodar 24/7, mas não há logs ou notificações de erro. Qual boa prática está faltando?',
    options: [
      { id: 'a', text: 'Velocidade de execução' },
      { id: 'b', text: 'Monitoramento e logging' },
      { id: 'c', text: 'Interface bonita' },
      { id: 'd', text: 'Mais robôs' },
    ],
    correctAnswer: 'b',
    explanation: 'O monitoramento e logging são essenciais para identificar falhas e garantir a confiabilidade do sistema de automação.',
  },
  {
    id: 5,
    scenario: 'Uma página de carregamento não mostra progresso algum - apenas uma tela em branco. O que melhoraria a experiência?',
    options: [
      { id: 'a', text: 'Remover o carregamento' },
      { id: 'b', text: 'Skeleton loading ou spinner' },
      { id: 'c', text: 'Pop-up de alerta' },
      { id: 'd', text: 'Som de espera' },
    ],
    correctAnswer: 'b',
    explanation: 'Skeleton screens ou spinners indicam que algo está acontecendo, reduzindo a percepção de tempo de espera do usuário.',
  },
];

type GameState = 'idle' | 'playing' | 'answered' | 'finished';

export default function GamePage() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeElapsed(0);
    setQuestionTimes([]);
    setQuestionStartTime(Date.now());
  };

  const handleAnswer = (answerId: string) => {
    if (gameState !== 'playing') return;
    
    setSelectedAnswer(answerId);
    setGameState('answered');
    
    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
    setQuestionTimes([...questionTimes, questionTime]);
    
    if (answerId === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setGameState('playing');
      setQuestionStartTime(Date.now());
    } else {
      setGameState('finished');
    }
  };

  const getResultMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return t('game.results.perfect');
    if (percentage >= 80) return t('game.results.great');
    if (percentage >= 60) return t('game.results.good');
    return t('game.results.needsPractice');
  };

  // Idle State
  if (gameState === 'idle') {
    return (
      <div className="py-12 md:py-20 min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="glass rounded-2xl p-8 md:p-12 shadow-elevated animate-scale-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t('game.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('game.subtitle')}
            </p>
            <Button variant="hero" size="xl" onClick={startGame}>
              <Play className="mr-2 h-5 w-5" />
              {t('game.start')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Finished State
  if (gameState === 'finished') {
    return (
      <div className="py-12 md:py-20 min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="glass rounded-2xl p-8 md:p-12 shadow-elevated animate-bounce-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 mb-6">
              <Trophy className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {t('game.results.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {getResultMessage()}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t('game.results.score')}</p>
                <p className="text-3xl font-bold text-gradient">
                  {score}/{questions.length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">{t('game.results.time')}</p>
                <p className="text-3xl font-bold text-gradient">
                  {formatTime(timeElapsed)}
                </p>
              </div>
            </div>

            <Button variant="hero" size="lg" onClick={startGame}>
              <RotateCcw className="mr-2 h-5 w-5" />
              {t('game.restart')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Playing / Answered State
  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {t('game.question')} {currentQuestionIndex + 1} {t('game.of')} {questions.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-semibold">{score}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <Progress value={progress} className="h-2 progress-animated" />
        </div>

        {/* Question Card */}
        <div className="glass rounded-2xl p-6 md:p-8 shadow-card animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              {currentQuestion.scenario}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={gameState === 'answered'}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all duration-300',
                  'hover:border-primary/50 hover:bg-accent/50',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  'animate-fade-up',
                  gameState === 'answered' && option.id === currentQuestion.correctAnswer && 
                    'border-success bg-success/10',
                  gameState === 'answered' && option.id === selectedAnswer && !isCorrect && 
                    'border-destructive bg-destructive/10',
                  selectedAnswer === option.id && gameState !== 'answered' && 
                    'border-primary bg-primary/5',
                  gameState !== 'answered' && 'border-border'
                )}
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold',
                    gameState === 'answered' && option.id === currentQuestion.correctAnswer 
                      ? 'bg-success text-success-foreground' 
                      : gameState === 'answered' && option.id === selectedAnswer && !isCorrect
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted'
                  )}>
                    {option.id.toUpperCase()}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  {gameState === 'answered' && option.id === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-success success-check" />
                  )}
                  {gameState === 'answered' && option.id === selectedAnswer && !isCorrect && (
                    <XCircle className="h-5 w-5 text-destructive error-shake" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {gameState === 'answered' && (
            <div className={cn(
              'mt-6 p-4 rounded-xl animate-scale-in',
              isCorrect ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'
            )}>
              <p className={cn(
                'font-semibold mb-2',
                isCorrect ? 'text-success' : 'text-destructive'
              )}>
                {isCorrect ? t('game.correct') : t('game.incorrect')}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{t('game.explanation')}:</span> {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {gameState === 'answered' && (
            <Button
              variant="hero"
              size="lg"
              onClick={nextQuestion}
              className="w-full mt-6 animate-fade-up"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  {t('game.nextQuestion')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  {t('game.results.title')}
                  <Trophy className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
