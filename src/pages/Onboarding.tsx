
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingData, RiskProfile } from '@/types/app';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Financial Goals', description: 'Tell us about your investment objectives' },
  { id: 2, title: 'Risk Assessment', description: 'Understand your risk tolerance' },
  { id: 3, title: 'Interests', description: 'Choose topics that interest you' }
];

const RISK_PROFILES: { value: RiskProfile; label: string; description: string }[] = [
  { value: 'conservative', label: 'Conservative', description: 'Prefer stable, low-risk investments' },
  { value: 'moderate', label: 'Moderate', description: 'Balance between growth and safety' },
  { value: 'aggressive', label: 'Aggressive', description: 'Willing to take higher risks for potential returns' },
  { value: 'very_aggressive', label: 'Very Aggressive', description: 'Maximum risk tolerance for high returns' }
];

const TOPICS = [
  'Stock Market', 'Cryptocurrency', 'Mutual Funds', 'Real Estate',
  'Personal Finance', 'Tax Planning', 'Retirement Planning', 'Insurance',
  'Trading Strategies', 'Market Analysis', 'Economics', 'Startups'
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OnboardingData>({
    financial_goals: {
      primary_goal: '',
      investment_timeline: '',
      target_amount: undefined
    },
    risk_profile: 'moderate',
    experience_level: '',
    preferred_topics: []
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeOnboarding(formData);
      toast.success('Welcome to InvestorPaisa! Your profile is complete.');
      navigate('/home');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFinancialGoals = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      financial_goals: {
        ...prev.financial_goals,
        [field]: value
      }
    }));
  };

  const toggleTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_topics: prev.preferred_topics.includes(topic)
        ? prev.preferred_topics.filter(t => t !== topic)
        : [...prev.preferred_topics, topic]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primary_goal">What's your primary investment goal?</Label>
              <RadioGroup
                value={formData.financial_goals.primary_goal}
                onValueChange={(value) => updateFinancialGoals('primary_goal', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wealth_building" id="wealth_building" />
                  <Label htmlFor="wealth_building">Wealth Building</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retirement" id="retirement" />
                  <Label htmlFor="retirement">Retirement Planning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Generate Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="education" id="education" />
                  <Label htmlFor="education">Education Funding</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Investment Timeline</Label>
              <RadioGroup
                value={formData.financial_goals.investment_timeline}
                onValueChange={(value) => updateFinancialGoals('investment_timeline', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">Short-term (1-3 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium-term (3-7 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long">Long-term (7+ years)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount (Optional)</Label>
              <Input
                id="target_amount"
                type="number"
                placeholder="e.g., 1000000"
                value={formData.financial_goals.target_amount || ''}
                onChange={(e) => updateFinancialGoals('target_amount', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>What's your risk tolerance?</Label>
              <RadioGroup
                value={formData.risk_profile}
                onValueChange={(value) => updateFormData('risk_profile', value as RiskProfile)}
              >
                {RISK_PROFILES.map((profile) => (
                  <div key={profile.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={profile.value} id={profile.value} />
                    <div className="space-y-1">
                      <Label htmlFor={profile.value}>{profile.label}</Label>
                      <p className="text-sm text-muted-foreground">{profile.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Investment Experience</Label>
              <RadioGroup
                value={formData.experience_level}
                onValueChange={(value) => updateFormData('experience_level', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner (0-2 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate (2-5 years)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced (5+ years)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label>Select topics you're interested in (choose at least 3):</Label>
            <div className="grid grid-cols-2 gap-3">
              {TOPICS.map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox
                    id={topic}
                    checked={formData.preferred_topics.includes(topic)}
                    onCheckedChange={() => toggleTopic(topic)}
                  />
                  <Label htmlFor={topic} className="text-sm">{topic}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.financial_goals.primary_goal && formData.financial_goals.investment_timeline;
      case 2:
        return formData.risk_profile && formData.experience_level;
      case 3:
        return formData.preferred_topics.length >= 3;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to InvestorPaisa</CardTitle>
          <CardDescription>
            Let's personalize your experience in {STEPS.length} quick steps
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{STEPS[currentStep - 1].title}</h3>
            <p className="text-muted-foreground">{STEPS[currentStep - 1].description}</p>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>

            {currentStep === STEPS.length ? (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || loading}
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
