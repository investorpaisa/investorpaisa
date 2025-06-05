
import React, { useState } from 'react';
import { SystemButton, SystemCard, Typography } from '@/components/ui/design-system';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { OnboardingData } from './OnboardingFlow';

interface RiskAssessmentStepProps {
  data: Partial<OnboardingData>;
  onComplete: (data: Partial<OnboardingData>) => void;
  onPrevious: () => void;
  showPrevious: boolean;
}

const riskQuestions = [
  {
    id: 'market_drop',
    text: 'How would you react to a 20% drop in your portfolio value?',
    options: [
      { text: 'Sell everything immediately to avoid further losses', score: 1 },
      { text: 'Sell some holdings but keep the rest', score: 2 },
      { text: 'Hold all investments and wait for recovery', score: 3 },
      { text: 'Buy more at lower prices', score: 4 }
    ]
  },
  {
    id: 'investment_horizon',
    text: 'What is your typical investment time horizon?',
    options: [
      { text: 'Less than 1 year', score: 1 },
      { text: '1-3 years', score: 2 },
      { text: '3-7 years', score: 3 },
      { text: 'More than 7 years', score: 4 }
    ]
  },
  {
    id: 'income_stability',
    text: 'How stable is your income?',
    options: [
      { text: 'Very unstable, varies significantly', score: 1 },
      { text: 'Somewhat unstable with seasonal variations', score: 2 },
      { text: 'Generally stable with minor fluctuations', score: 3 },
      { text: 'Very stable and predictable', score: 4 }
    ]
  },
  {
    id: 'emergency_fund',
    text: 'Do you have an emergency fund covering 6+ months of expenses?',
    options: [
      { text: 'No emergency fund', score: 1 },
      { text: '1-3 months covered', score: 2 },
      { text: '3-6 months covered', score: 3 },
      { text: '6+ months covered', score: 4 }
    ]
  },
  {
    id: 'investment_knowledge',
    text: 'How would you rate your investment knowledge?',
    options: [
      { text: 'Beginner - I know very little', score: 1 },
      { text: 'Basic - I understand fundamentals', score: 2 },
      { text: 'Intermediate - I actively research investments', score: 3 },
      { text: 'Advanced - I have extensive experience', score: 4 }
    ]
  }
];

export const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({
  data,
  onComplete,
  onPrevious,
  showPrevious
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>(
    data.risk_profile ? {} : {}
  );

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateRiskProfile = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = riskQuestions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 35) return 'conservative';
    if (percentage <= 60) return 'moderate';
    if (percentage <= 85) return 'aggressive';
    return 'very_aggressive';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(answers).length !== riskQuestions.length) {
      return;
    }

    const riskProfile = calculateRiskProfile();
    onComplete({ risk_profile: riskProfile });
  };

  const isComplete = Object.keys(answers).length === riskQuestions.length;

  const getRiskProfileDescription = (profile: string) => {
    switch (profile) {
      case 'conservative':
        return 'You prefer stable investments with lower risk and steady returns.';
      case 'moderate':
        return 'You seek a balance between growth potential and risk management.';
      case 'aggressive':
        return 'You are comfortable with higher risk for potentially greater returns.';
      case 'very_aggressive':
        return 'You actively seek maximum returns and are comfortable with high volatility.';
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {riskQuestions.map((question) => (
          <SystemCard key={question.id} variant="default" className="p-4">
            <Typography.H3 className="text-base mb-4 font-medium">{question.text}</Typography.H3>
            <RadioGroup
              value={answers[question.id]?.toString() || ''}
              onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.score.toString()} id={`${question.id}-${index}`} />
                  <Label 
                    htmlFor={`${question.id}-${index}`} 
                    className="text-sm cursor-pointer leading-relaxed text-white/80"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </SystemCard>
        ))}

        {isComplete && (
          <SystemCard variant="glass" className="p-4 border-gold/20">
            <Typography.H3 className="text-base mb-2">Your Risk Profile</Typography.H3>
            <div className="mb-2">
              <span className="text-gold font-medium capitalize text-lg">
                {calculateRiskProfile().replace('_', ' ')}
              </span>
            </div>
            <Typography.Small className="text-white/70">
              {getRiskProfileDescription(calculateRiskProfile())}
            </Typography.Small>
          </SystemCard>
        )}
      </div>

      <div className="flex gap-3">
        {showPrevious && (
          <SystemButton variant="outline" onClick={onPrevious}>
            Previous
          </SystemButton>
        )}
        <SystemButton 
          type="submit" 
          disabled={!isComplete}
          className="flex-1"
        >
          Continue
        </SystemButton>
      </div>
    </form>
  );
};
