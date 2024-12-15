import { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface UseVotingProps {
  initialUpvotes: number;
  postId: string;
  onVoteChange?: (newVotes: number) => void;
}

export function useVoting({ initialUpvotes, postId, onVoteChange }: UseVotingProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with initialUpvotes when it changes
  useEffect(() => {
    setUpvotes(initialUpvotes);
  }, [initialUpvotes]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      let newUpvotes = upvotes;
      
      if (userVote === voteType) {
        // For now, we'll just undo the vote locally since there's no un-vote endpoint
        newUpvotes = voteType === 'up' ? upvotes - 1 : upvotes + 1;
        setUserVote(null);
      } else {
        // Call the appropriate API endpoint
        const response = await (voteType === 'up' 
          ? api.upvotePost(postId)
          : api.downvotePost(postId)
        );
        
        // Update votes based on the response
        if (userVote !== null) {
          newUpvotes = voteType === 'up' ? upvotes + 2 : upvotes - 2;
        } else {
          newUpvotes = voteType === 'up' ? upvotes + 1 : upvotes - 1;
        }
        setUserVote(voteType);
      }

      setUpvotes(newUpvotes);
      onVoteChange?.(newUpvotes);
    } catch (error) {
      console.error('Failed to vote:', error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return {
    upvotes,
    userVote,
    isLoading,
    handleUpvote: () => handleVote('up'),
    handleDownvote: () => handleVote('down'),
  };
}