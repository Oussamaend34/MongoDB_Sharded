import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { analyzeSentiment, getSentimentColor } from '../utils/sentiment';

export default function Comment({ comment, onDelete }) {
  const commentSentiment = analyzeSentiment(comment.content);

  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>u/{comment.author}</span>
          <span>•</span>
          <span>{formatDistanceToNow(comment.createdAt)} ago</span>
          <span>•</span>
          <span className={`font-medium ${getSentimentColor(commentSentiment.score)}`}>
            {commentSentiment.label}
          </span>
        </div>
        <button
          onClick={() => onDelete(comment.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className="mt-1 text-gray-700">{comment.content}</p>
    </div>
  );
}