
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfessionalBackground from '@/components/profile/ProfessionalBackground';
import ProfileActivityTabs from '@/components/profile/ProfileActivityTabs';
import { useProfileData } from '@/hooks/useProfileData';

const ProfileNew = () => {
  const { profileData, loading } = useProfileData();
  
  if (loading || !profileData) {
    return <div className="flex justify-center items-center h-64">Loading profile data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <ProfileHeader profile={profileData} />
      
      <ProfessionalBackground 
        career={profileData.career}
        education={profileData.education}
        certifications={profileData.certifications}
        achievements={profileData.achievements}
      />

      <ProfileActivityTabs 
        posts={profileData.posts}
        interactions={profileData.interactions}
      />
    </div>
  );
};

export default ProfileNew;
