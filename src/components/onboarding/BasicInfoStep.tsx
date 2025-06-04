
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingData } from './OnboardingFlow';

interface BasicInfoStepProps {
  data: Partial<OnboardingData>;
  onComplete: (data: Partial<OnboardingData>) => void;
  onPrevious: () => void;
  showPrevious: boolean;
}

const professions = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'Designer',
  'Marketing Manager', 'Sales Executive', 'Teacher', 'Doctor',
  'Lawyer', 'Consultant', 'Entrepreneur', 'Student',
  'Financial Analyst', 'Accountant', 'Engineer', 'Other'
];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onComplete,
  onPrevious,
  showPrevious
}) => {
  const [formData, setFormData] = useState({
    full_name: data.full_name || '',
    location: data.location || '',
    profession: data.profession || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.profession) {
      newErrors.profession = 'Profession is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onComplete(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            placeholder="Enter your full name"
            className={errors.full_name ? 'border-red-500' : ''}
          />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, Country (e.g., Mumbai, India)"
            className={errors.location ? 'border-red-500' : ''}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <Label htmlFor="profession">Profession *</Label>
          <Select
            value={formData.profession}
            onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}
          >
            <SelectTrigger className={errors.profession ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your profession" />
            </SelectTrigger>
            <SelectContent>
              {professions.map((profession) => (
                <SelectItem key={profession} value={profession}>
                  {profession}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
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
