
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { OnboardingData } from './OnboardingFlow';

interface FinancialGoalsStepProps {
  data: Partial<OnboardingData>;
  onComplete: (data: Partial<OnboardingData>) => void;
  onPrevious: () => void;
  showPrevious: boolean;
}

const goalTypes = [
  'Retirement Planning',
  'Emergency Fund',
  'Home Purchase',
  'Education Fund',
  'Wealth Building',
  'Travel Fund',
  'Business Investment',
  'Other'
];

const timeframes = [
  '1-2 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

export const FinancialGoalsStep: React.FC<FinancialGoalsStepProps> = ({
  data,
  onComplete,
  onPrevious,
  showPrevious
}) => {
  const [formData, setFormData] = useState({
    primary_goal: data.financial_goals?.primary_goal || '',
    target_amount: data.financial_goals?.target_amount || '',
    timeframe: data.financial_goals?.timeframe || '',
    monthly_investment: data.financial_goals?.monthly_investment || '',
    selected_goals: data.financial_goals?.selected_goals || []
  });

  const handleGoalToggle = (goal: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selected_goals: [...prev.selected_goals, goal]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selected_goals: prev.selected_goals.filter(g => g !== goal)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const financial_goals = {
      primary_goal: formData.primary_goal,
      target_amount: formData.target_amount ? parseInt(formData.target_amount) : null,
      timeframe: formData.timeframe,
      monthly_investment: formData.monthly_investment ? parseInt(formData.monthly_investment) : null,
      selected_goals: formData.selected_goals,
      created_at: new Date().toISOString()
    };

    onComplete({ financial_goals });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="primary_goal">Primary Financial Goal</Label>
          <Select
            value={formData.primary_goal}
            onValueChange={(value) => setFormData(prev => ({ ...prev, primary_goal: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent>
              {goalTypes.map((goal) => (
                <SelectItem key={goal} value={goal}>
                  {goal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target_amount">Target Amount (₹)</Label>
            <Input
              id="target_amount"
              type="number"
              value={formData.target_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, target_amount: e.target.value }))}
              placeholder="e.g., 5000000"
            />
          </div>

          <div>
            <Label htmlFor="timeframe">Timeframe</Label>
            <Select
              value={formData.timeframe}
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeframe: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe} value={timeframe}>
                    {timeframe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="monthly_investment">Monthly Investment Capacity (₹)</Label>
          <Input
            id="monthly_investment"
            type="number"
            value={formData.monthly_investment}
            onChange={(e) => setFormData(prev => ({ ...prev, monthly_investment: e.target.value }))}
            placeholder="e.g., 10000"
          />
        </div>

        <div>
          <Label className="text-base font-medium">Additional Goals (Optional)</Label>
          <div className="grid grid-cols-2 gap-3 mt-3">
            {goalTypes.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={goal}
                  checked={formData.selected_goals.includes(goal)}
                  onCheckedChange={(checked) => handleGoalToggle(goal, checked as boolean)}
                />
                <Label htmlFor={goal} className="text-sm cursor-pointer">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
        </div>
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
