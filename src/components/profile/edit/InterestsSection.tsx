
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface InterestsSectionProps {
  interests: string[];
  setInterests: (interests: string[]) => void;
  financialCategories: string[];
}

export const InterestsSection = ({ 
  interests, 
  setInterests, 
  financialCategories 
}: InterestsSectionProps) => {
  
  const toggleInterest = (category: string) => {
    if (interests.includes(category)) {
      setInterests(interests.filter(i => i !== category));
    } else {
      if (interests.length < 5) {
        setInterests([...interests, category]);
      } else {
        toast.error('You can select a maximum of 5 interests');
      }
    }
  };

  return (
    <div>
      <Label className="block mb-2">Interests (Select up to 5)</Label>
      <div className="flex flex-wrap gap-2">
        {financialCategories.map(category => (
          <Button
            key={category}
            type="button"
            variant={interests.includes(category) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleInterest(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Selected: {interests.length}/5
      </p>
    </div>
  );
};
