import React from 'react';
import PostCard from './PostCard';

export default function PostList({ posts, onDelete, onVoteChange }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDelete}
          onVoteChange={onVoteChange}
        />
      ))}
    </div>
  );
}