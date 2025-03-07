
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { createCircle } from '@/services/circles';
import { CircleType } from '@/services/circles/types';
import { useAuth } from '@/contexts/AuthContext';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCircleModal({ isOpen, onClose }: CreateCircleModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user from AuthContext
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [circleType, setCircleType] = useState<'public' | 'private'>('public');
  const [loading, setLoading] = useState(false);

  const handleCreateCircle = async () => {
    if (!name.trim()) {
      toast.error('Please provide a name for your circle');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a circle');
      return;
    }

    setLoading(true);
    
    try {
      // Create the circle with the current user's ID
      const newCircle = await createCircle({
        name,
        description,
        type: circleType,
        created_by: user.id // Add the required created_by property
      });
      
      toast.success('Circle created successfully');
      onClose();
      
      // Navigate to the new circle
      if (newCircle && newCircle.id) {
        navigate(`/app/circles/${newCircle.id}`);
      }
    } catch (error) {
      console.error('Error creating circle:', error);
      toast.error('Failed to create circle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Circle</DialogTitle>
          <DialogDescription>
            Create your own circle to connect with like-minded investors.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Circle Name</Label>
            <Input
              id="name"
              placeholder="Enter a unique name for your circle"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What is this circle about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Circle Type</Label>
            <RadioGroup value={circleType} onValueChange={setCircleType as (value: string) => void}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="cursor-pointer">Public (Anyone can join)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="cursor-pointer">Private (Requires approval)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateCircle} disabled={loading}>
            {loading ? 'Creating...' : 'Create Circle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
