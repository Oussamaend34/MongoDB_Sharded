import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useVoting } from '../hooks/useVoting';

interface VoteButtonsProps {
  initialUpvotes: number;
  postId: string;
  onVoteChange?: (newVotes: number) => void;
}

export default function VoteButtons({ initialUpvotes, postId, onVoteChange }: VoteButtonsProps) {
  const { upvotes, userVote, isLoading, handleUpvote, handleDownvote } = useVoting({
    initialUpvotes,
    postId,
    onVoteChange,
  });

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleUpvote}
        disabled={isLoading}
        className={`transition-colors ${
          userVote === 'up' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ArrowUp size={20} />
      </button>
      <span className="font-medium text-gray-800">{upvotes}</span>
      <button
        onClick={handleDownvote}
        disabled={isLoading}
        className={`transition-colors ${
          userVote === 'down' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <ArrowDown size={20} />
      </button>
    </div>
  );
}