const API_BASE_URL = 'http://localhost:8000/api';

interface Post {
  post_id: string;
  title: string;
  content: string;
  upvotes: number;
  comments: Comment[];
}

interface Comment {
  comment_id: string;
  post_id: string;
  content: string;
}

export const api = {
  // Posts endpoints
  getPosts: async (limit: number = 20): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/data?limit=${limit}`);
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  },

  getPost: async (postId: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    return response.json();
  },

  deletePost: async (postId: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    return response.json();
  },

  // Comments endpoints
  getPostComments: async (postId: string): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const postData = await response.json();
    return postData.comments || [];
  },

  deleteComment: async (commentId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
    return;
  },

  // Voting endpoints
  upvotePost: async (postId: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/upvote/${postId}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to upvote post');
    }
    return response.json();
  },

  downvotePost: async (postId: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/downvote/${postId}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to downvote post');
    }
    return response.json();
  },

  // Search endpoint
  searchSubreddit: async (subreddit: string): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/search/${encodeURIComponent(subreddit)}`);
    if (!response.ok) {
      throw new Error('Failed to search subreddit');
    }
    return response.json();
  },

  // Subreddit endpoints
  getSubredditPosts: async (subreddit: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/subreddit/${subreddit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subreddit posts');
    }
    return response.json();
  },


  searchSubredditByName: async (subreddit: string) => {
    const response = await fetch(`${API_BASE_URL}/search/${subreddit}`);
    if (!response.ok) {
      throw new Error('Failed to search subreddit');
    }
    return response.json();
  },


  searchSubredditByTitle: async (subreddit: string) => {
    const response = await fetch(`${API_BASE_URL}/posts/search/title?keyword=${subreddit}`);
    if (!response.ok) {
      throw new Error('Failed to search subreddit');
    }
    return response.json();
  },


  // Kafka Producer endpoints
  startKafkaProducer: async (pollInterval: number) => {
    const response = await fetch(`${API_BASE_URL}/kafka/producer/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ poll_interval: pollInterval }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to start producer');
    }
  
    return response.json();
  },

  stopKafkaProducer: async () => {
    const response = await fetch(`${API_BASE_URL}/kafka/producer/stop`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to stop producer');
    }
    return response.json();
  },

  // Kafka Consumer endpoints
  startKafkaConsumer: async () => {
    const response = await fetch(`${API_BASE_URL}/kafka/consumer/start`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to start consumer');
    }
    return response.json();
  },

  stopKafkaConsumer: async () => {
    const response = await fetch(`${API_BASE_URL}/kafka/consumer/stop`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to stop consumer');
    }
    return response.json();
  },

  // Kafka Producer Update endpoint
  updateKafkaProducer: async (params: {
    subreddit?: string;
    post_limit?: number;
    comment_limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.subreddit) queryParams.append('subreddit', params.subreddit);
    if (params.post_limit) queryParams.append('post_limit', params.post_limit.toString());
    if (params.comment_limit) queryParams.append('comment_limit', params.comment_limit.toString());

    const response = await fetch(`${API_BASE_URL}/kafka/producer/update?${queryParams}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to update producer');
    }
    return response.json();
  },
};
