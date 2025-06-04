
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { FinancialProfileService } from '@/services/financial/profileService';
import { UserAchievement } from '@/types/financial';

interface AchievementsBadgesProps {
  userId?: string;
}

export const AchievementsBadges: React.FC<AchievementsBadgesProps> = ({
  userId
}) => {
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!userId) return;

      try {
        const userAchievements = await FinancialProfileService.getUserAchievements(userId);
        setAchievements(userAchievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-premium-gold" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-premium-gold" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Keep investing to unlock achievement badges!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-premium-gold" />
          Achievements ({achievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <Badge
              key={achievement.id}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {achievement.badge_icon && (
                <span className="text-sm">{achievement.badge_icon}</span>
              )}
              <span className="font-medium">{achievement.badge_name}</span>
            </Badge>
          ))}
        </div>
        
        {achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Latest Achievement</h4>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{achievements[0].badge_icon}</span>
              <div>
                <p className="font-medium">{achievements[0].badge_name}</p>
                <p className="text-sm text-muted-foreground">
                  {achievements[0].description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Earned {new Date(achievements[0].earned_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
