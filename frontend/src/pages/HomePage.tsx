import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { usePosts } from '../hooks/usePosts';
import { useSubredditPosts } from '../hooks/useSubredditPosts';


export default function HomePage() {
    const {
        posts: allPosts,
        isLoading: isLoadingAll,
        error: errorAll,
        deletePost,
        refreshPosts,
    } = usePosts();

    const [searchTerm, setSearchTerm] = useState('');

    const {
        posts: subredditPosts,
        isLoading: isLoadingSubreddit,
        error: errorSubreddit,
        fetchSubredditPosts,

    } = useSubredditPosts();


    const [timeFilter, setTimeFilter] = useState<number | null>(null);

    // Determine which posts to display
    const posts =  subredditPosts.length > 0 ? subredditPosts : allPosts;

    const isLoading = isLoadingAll || isLoadingSubreddit;
    const error = errorSubreddit || errorAll;

// Handle search by title
    const handleSearch = (term: string) => {
        const trimmedTerm = term.trim();
        setSearchTerm(term);

        if (trimmedTerm) {
            fetchSubredditPosts(trimmedTerm,true);
        } else {

            refreshPosts(); // Refresh all posts
        }
    };

// Handle search by subreddit
    const handleSubredditSearch = (subreddit: string) => {
        const trimmedSubreddit = subreddit.trim();

        if (trimmedSubreddit) {

            fetchSubredditPosts(trimmedSubreddit,false);
        } else {

            refreshPosts(); // Refresh all posts
        }
    };


    const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    return posts
      .filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const postTime = new Date(post.time).getTime();
        const currentTime = new Date().getTime();
        const hoursDifference = (currentTime - postTime) / (1000 * 60 * 60);
        
        const matchesTime = timeFilter
          ? hoursDifference <= timeFilter
          : true;
          
        return matchesSearch && matchesTime;
      })
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [posts, searchTerm, timeFilter]);

  const handleDelete = async (id: string) => {
    const success = await deletePost(id);
    if (success) {
      refreshPosts();
    }
  };

  const handleVoteChange = (id: string, newVotes: number) => {
    // Vote changes are handled by the VoteButtons component directly
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          setTimeFilter={setTimeFilter}
          activeTimeFilter={timeFilter}
          onSubredditSearch={handleSubredditSearch}
        />
        <main className="max-w-3xl mx-auto py-8 px-4">
          <div className="text-center">
            <div className="animate-pulse text-lg text-gray-600">Loading posts...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={handleSearch}
        setTimeFilter={setTimeFilter}
        activeTimeFilter={timeFilter}
        onSubredditSearch={handleSubredditSearch}
      />
      
      <main className="max-w-3xl mx-auto py-8 px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">
                {error ? 'Try searching for a different subreddit' : 'No posts found'}
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard
                key={post.post_id}
                post={post}
                onDelete={handleDelete}
                onVoteChange={handleVoteChange}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}