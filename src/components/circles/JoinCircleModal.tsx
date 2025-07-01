
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface JoinCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinCircleModal({ isOpen, onClose }: JoinCircleModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    // Mock search results - in a real app, this would call an API
    setTimeout(() => {
      setSearchResults([
        {
          id: '1',
          name: 'Investment Strategies',
          memberCount: 256,
          type: 'public',
          description: 'Discuss various investment strategies and approaches'
        },
        {
          id: '2',
          name: 'Tax Planning',
          memberCount: 128,
          type: 'private',
          description: 'Private group for tax planning and optimization'
        }
      ].filter(circle => 
        circle.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setLoading(false);
    }, 1000);
  };

  const handleJoinCircle = async (circleId: string, isPrivate: boolean) => {
    setLoading(true);
    
    try {
      // Note: Circle functionality has been deprecated
      toast.info('Circle functionality has been replaced with professional networking. Redirecting...');
      onClose();
      navigate('/network');
    } catch (error) {
      console.error('Error joining circle:', error);
      toast.error('Failed to join circle. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join a Circle</DialogTitle>
          <DialogDescription>
            Search for circles by name and request to join.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              placeholder="Search for circles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="mt-4 space-y-4">
            {searchResults.map((circle) => (
              <div key={circle.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{circle.name}</h4>
                      {circle.type === 'private' ? (
                        <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                      ) : (
                        <Globe className="h-4 w-4 ml-2 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{circle.memberCount} members</p>
                    <p className="text-sm mt-2">{circle.description}</p>
                  </div>
                  <Button 
                    variant={circle.type === 'private' ? 'outline' : 'default'}
                    onClick={() => handleJoinCircle(circle.id, circle.type === 'private')}
                    disabled={loading}
                  >
                    {circle.type === 'private' ? 'Request Access' : 'Join'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery && !loading ? (
          <Alert className="mt-4">
            <AlertDescription>
              No circles found matching your search. Try different keywords.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
