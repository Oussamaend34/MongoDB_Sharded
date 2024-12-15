import { useState } from 'react';
import {usePosts} from "./usePosts.ts";
import {useSubredditPosts} from "./useSubredditPosts.ts";

const usePostManagement = () => {
    const {
        posts: allPosts,
        isLoading: isLoadingAll,
        error: errorAll,
        deletePost,
        refreshPosts,
    } = usePosts();

    const {
        posts: subredditPosts,
        isLoading: isLoadingSubreddit,
        error: errorSubreddit,
        fetchSubredditPosts,
    } = useSubredditPosts();

    const [searchTerm, setSearchTerm] = useState('');
    const [timeFilter, setTimeFilter] = useState<number | null>(null);

    // Determine which posts to display
    const posts = subredditPosts.length > 0 ? subredditPosts : allPosts;
    const isLoading = isLoadingAll || isLoadingSubreddit;
    const error = errorSubreddit || errorAll;

    // Generalized search handler
    const handleSearch = (term: string, isTitleSearch: boolean) => {
        const trimmedTerm = term.trim();
        setSearchTerm(term);

        if (trimmedTerm) {
            fetchSubredditPosts(trimmedTerm, isTitleSearch);
        } else {
            refreshPosts(); // Refresh all posts
        }
    };

    // Handle search by title
    const handleTitleSearch = (term: string) => {
        handleSearch(term, true);
    };

    // Handle search by subreddit
    const handleSubredditSearch = (subreddit: string) => {
        handleSearch(subreddit, false);
    };

    return {
        posts,
        isLoading,
        error,
        deletePost,
        refreshPosts,
        handleTitleSearch,
        handleSubredditSearch,
        timeFilter,
        setTimeFilter,
    };
};

export default usePostManagement;
