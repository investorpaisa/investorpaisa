
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Upload, Save, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Public Profile States
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [userId, setUserId] = useState(user?.username || '');
  const [career, setCareer] = useState('');
  const [education, setEducation] = useState('');
  const [certifications, setCertifications] = useState('');
  const [achievements, setAchievements] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  // Function to handle profile update
  const handleUpdateProfile = async () => {
    try {
      // In a real app, this would be an API call to update the profile
      setTimeout(() => {
        toast.success('Profile updated successfully');
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Mock financial categories for interests
  const financialCategories = [
    'Stocks', 'Mutual Funds', 'Bonds', 'ETFs', 'Real Estate', 
    'Tax Planning', 'Retirement', 'Insurance', 'Cryptocurrency',
    'Financial Planning', 'Budgeting', 'Debt Management'
  ];

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
    <div className="container max-w-2xl mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mr-2">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar || '/placeholder.svg'} />
              <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">Recommended: Square JPG or PNG, 300x300 pixels</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Your unique user ID"
              />
              <p className="text-xs text-muted-foreground">This will be your @username for others to find you</p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Professional Info */}
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

          <Separator />

          {/* Interests and Expertise */}
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/profile')}>
            Cancel
          </Button>
          <Button onClick={handleUpdateProfile}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Private Profile section could be added here but omitting for now since it requires API integration */}
    </div>
  );
};

export default EditProfile;
