
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileEditForm } from '@/components/profile/ProfileEditForm';

const EditProfile = () => {
  const navigate = useNavigate();
  const { profileData, refreshProfile } = useProfileData();

  const handleSave = (updatedProfile: any) => {
    refreshProfile(updatedProfile);
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-2xl"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
            <p className="text-slate-600">Update your professional information</p>
          </div>
        </div>

        {/* Edit Form */}
        <ProfileEditForm
          profile={profileData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditProfile;
