import React from 'react';
import { MessageSquare } from 'lucide-react';
import Comment from './Comment';

export default function CommentList({ comments, onDeleteComment }) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <MessageSquare size={20} />
        Comments ({comments.length})
      </h2>

      <div className="mt-4 space-y-4">
        {comments.slice(0, 3).map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            onDelete={onDeleteComment}
          />
        ))}
      </div>
    </div>
  );
}