import { useState } from 'react';
import { Post } from '../types/post';
import { api } from '../utils/api';

export function useSubredditPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearPosts = () => {
    setPosts([]);
    setError(null);
  };

  const fetchSubredditPosts = async (subreddit: string,isTitle :boolean) => {
    if (!subreddit.trim()) {
      clearPosts();
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = isTitle? await api.searchSubredditByTitle(subreddit) : await api.getSubredditPosts(subreddit);
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching subreddit posts:', err);
      if (err instanceof Error) {
        if (err.message.includes('404')) {
          setError(`No posts found in r/${subreddit}`);
        } else {
          setError(`Failed to fetch posts from r/${subreddit}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
      setPosts([]); // Clear posts on error
    } finally {
      setIsLoading(false);
    }
  };

  return { posts, isLoading, error, fetchSubredditPosts, clearPosts };
}
