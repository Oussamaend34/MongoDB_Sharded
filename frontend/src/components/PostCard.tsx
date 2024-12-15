import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../types/post';
import VoteButtons from './VoteButtons';
import { analyzeSentiment, getSentimentColor } from '../utils/sentiment';
import { truncateText } from '../utils/textUtils';

interface PostCardProps {
  post: Post;
  onDelete: (id: string) => void;
  onVoteChange?: (id: string, newVotes: number) => void;
}

export default function PostCard({ post, onDelete, onVoteChange }: PostCardProps) {
  const sentiment = analyzeSentiment(post.body || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedBody = truncateText(post.body || '', 100);
  const shouldTruncate = (post.body?.split(/\s+/) || []).length > 100;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex gap-4">
          <VoteButtons
            postId={post.post_id}
            initialUpvotes={post.upvotes}
            onVoteChange={(newVotes) => onVoteChange?.(post.post_id, newVotes)}
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Link to={`/post/${post.post_id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <button
                onClick={() => onDelete(post.post_id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Delete post"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
              <span>Posted by u/{post.author}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.time))} ago</span>
              {post.subreddit && (
                <>
                  <span>•</span>
                  <span>r/{post.subreddit}</span>
                </>
              )}
              <span>•</span>
              <span className={`font-medium ${getSentimentColor(sentiment.score)}`}>
                {sentiment.label}
              </span>
            </div>
            
            {post.image && post.image !== "" && post.image !== "null" && (
              <div className="mt-4">
                {post.image.startsWith('http') ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="rounded-lg max-h-96 w-full object-cover "
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
            )}
            
            <div className="mt-2">
              <p className="text-gray-700">
                {isExpanded ? post.body : truncatedBody}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-gray-500">
              <MessageSquare size={20} />
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}