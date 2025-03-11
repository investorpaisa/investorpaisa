
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';
import { EditProfileForm } from '@/components/profile/edit/EditProfileForm';

const EditProfile = () => {
  const navigate = useNavigate();
  const { profileData, loading, refreshProfile } = useProfileData();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading profile data...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <EditProfileForm 
        profileData={profileData} 
        refreshProfile={refreshProfile} 
      />
    </div>
  );
};

export default EditProfile;
