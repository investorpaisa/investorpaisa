
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProfessionalInfoSectionProps {
  career: string;
  setCareer: (value: string) => void;
  education: string;
  setEducation: (value: string) => void;
  certifications: string;
  setCertifications: (value: string) => void;
  achievements: string;
  setAchievements: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
}

export const ProfessionalInfoSection = ({
  career,
  setCareer,
  education,
  setEducation,
  certifications,
  setCertifications,
  achievements,
  setAchievements,
  location,
  setLocation
}: ProfessionalInfoSectionProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="career">Professional Career</Label>
        <Textarea
          id="career"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          placeholder="Describe your professional experience"
          rows={3}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="education">Education History</Label>
        <Textarea
          id="education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="List your educational background"
          rows={3}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="certifications">Certifications</Label>
        <Textarea
          id="certifications"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          placeholder="List your professional certifications"
          rows={3}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="achievements">Achievements</Label>
        <Textarea
          id="achievements"
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          placeholder="Highlight your key achievements"
          rows={3}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="location">Current Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country"
        />
      </div>
    </div>
  );
};
