
import React from 'react';
import { Briefcase, GraduationCap, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfessionalBackgroundProps {
  career?: string;
  education?: string;
  certifications?: string;
  achievements?: string;
}

const ProfessionalBackground = ({ 
  career, 
  education, 
  certifications, 
  achievements 
}: ProfessionalBackgroundProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {career && (
          <div className="flex items-start">
            <Briefcase className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Career</h3>
              <p className="text-muted-foreground">{career}</p>
            </div>
          </div>
        )}
        
        {education && (
          <div className="flex items-start">
            <GraduationCap className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Education</h3>
              <p className="text-muted-foreground">{education}</p>
            </div>
          </div>
        )}
        
        {certifications && (
          <div className="flex items-start">
            <Award className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Certifications</h3>
              <p className="text-muted-foreground">{certifications}</p>
            </div>
          </div>
        )}
        
        {achievements && (
          <div className="flex items-start">
            <Award className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
            <div>
              <h3 className="font-medium">Achievements</h3>
              <p className="text-muted-foreground">{achievements}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalBackground;
