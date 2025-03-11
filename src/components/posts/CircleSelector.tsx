
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Circle } from '@/types';

interface CircleSelectorProps {
  userCircles: Circle[];
  selectedCircle: string | null;
  onCircleChange: (value: string) => void;
}

const CircleSelector = ({ userCircles, selectedCircle, onCircleChange }: CircleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="circle">Select Circle</Label>
      <Select 
        value={selectedCircle || ''} 
        onValueChange={onCircleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a circle" />
        </SelectTrigger>
        <SelectContent>
          {userCircles.map((circle) => (
            <SelectItem key={circle.id} value={circle.id}>
              {circle.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CircleSelector;
