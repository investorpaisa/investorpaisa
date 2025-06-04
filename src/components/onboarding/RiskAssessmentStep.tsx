
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

    if (percentage <= 40) return 'conservative';
    if (percentage <= 70) return 'moderate';
    return 'aggressive';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {riskQuestions.map((question) => (
          <Card key={question.id} className="p-4">
            <h3 className="font-medium mb-4">{question.text}</h3>
            <RadioGroup
              value={answers[question.id]?.toString() || ''}
              onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.score.toString()} id={`${question.id}-${index}`} />
                  <Label 
                    htmlFor={`${question.id}-${index}`} 
                    className="text-sm cursor-pointer leading-relaxed"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>
        ))}

        {isComplete && (
          <Card className="p-4 bg-premium-gold/5 border-premium-gold/20">
            <h4 className="font-medium mb-2">Your Risk Profile</h4>
            <p className="text-sm text-muted-foreground">
              Based on your answers, you have a{' '}
              <span className="font-medium text-premium-gold capitalize">
                {calculateRiskProfile()}
              </span>{' '}
              risk profile.
            </p>
          </Card>
        )}
      </div>

      <div className="flex gap-3">
        {showPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={!isComplete}
          className="btn-premium flex-1"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};
