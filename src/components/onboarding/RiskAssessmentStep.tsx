
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OnboardingData } from './OnboardingFlow';
import { RiskAssessmentQuestion } from '@/types/financial';

interface RiskAssessmentStepProps {
  data: Partial<OnboardingData>;
  onComplete: (data: Partial<OnboardingData>) => void;
  onPrevious: () => void;
  showPrevious: boolean;
}

const riskQuestions: RiskAssessmentQuestion[] = [
  {
    id: 'market_drop',
    text: 'How would you react to a 20% drop in your portfolio value?',
    options: [
      { text: 'Sell immediately to prevent further losses', score: 1 },
      { text: 'Hold and monitor the situation', score: 3 },
      { text: 'Buy more while prices are low', score: 5 }
    ]
  },
  {
    id: 'investment_timeline',
    text: 'What is your typical investment timeline?',
    options: [
      { text: 'Less than 2 years', score: 1 },
      { text: '2-5 years', score: 3 },
      { text: 'More than 5 years', score: 5 }
    ]
  },
  {
    id: 'return_expectation',
    text: 'What annual return do you expect from your investments?',
    options: [
      { text: '5-8% (Bank FD level)', score: 1 },
      { text: '8-15% (Balanced growth)', score: 3 },
      { text: '15%+ (High growth)', score: 5 }
    ]
  },
  {
    id: 'experience_level',
    text: 'How would you describe your investment experience?',
    options: [
      { text: 'Beginner (less than 1 year)', score: 1 },
      { text: 'Intermediate (1-5 years)', score: 3 },
      { text: 'Advanced (5+ years)', score: 5 }
    ]
  }
];

export const RiskAssessmentStep: React.FC<RiskAssessmentStepProps> = ({
  data,
  onComplete,
  onPrevious,
  showPrevious
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<string>('');

  const handleAnswerChange = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    setErrors('');
  };

  const calculateRiskProfile = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = riskQuestions.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 40) return 'conservative';
    if (percentage <= 70) return 'moderate';
    return 'aggressive';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(answers).length !== riskQuestions.length) {
      setErrors('Please answer all questions to continue');
      return;
    }

    const risk_profile = calculateRiskProfile();
    onComplete({ risk_profile });
  };

  const getRiskDescription = () => {
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions === 0) return null;

    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const avgScore = totalScore / answeredQuestions;

    if (avgScore <= 2) {
      return {
        type: 'Conservative',
        description: 'You prefer stable investments with lower risk and consistent returns.',
        color: 'text-blue-600'
      };
    } else if (avgScore <= 3.5) {
      return {
        type: 'Moderate',
        description: 'You balance growth potential with risk management.',
        color: 'text-yellow-600'
      };
    } else {
      return {
        type: 'Aggressive',
        description: 'You seek high growth potential and are comfortable with higher risk.',
        color: 'text-red-600'
      };
    }
  };

  const riskProfile = getRiskDescription();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {riskQuestions.map((question, index) => (
          <Card key={question.id} className="p-4">
            <h3 className="font-medium mb-3">
              {index + 1}. {question.text}
            </h3>
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.score.toString()} id={`${question.id}-${optionIndex}`} />
                  <Label htmlFor={`${question.id}-${optionIndex}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>
        ))}

        {riskProfile && (
          <Card className="p-4 bg-gradient-to-r from-premium-gold/10 to-transparent">
            <h3 className="font-medium mb-2">Your Risk Profile</h3>
            <p className={`font-semibold ${riskProfile.color}`}>
              {riskProfile.type}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {riskProfile.description}
            </p>
          </Card>
        )}

        {errors && <p className="text-red-500 text-sm">{errors}</p>}
      </div>

      <div className="flex gap-3">
        {showPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        )}
        <Button type="submit" className="btn-premium flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
};
