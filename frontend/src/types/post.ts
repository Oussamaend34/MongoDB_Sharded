export interface Post {
  id?: string;
  post_id: string;
  author: string;
  body?: string;
  image?: string;
  subreddit: string;
  time: string;
  title: string;
  upvotes: number;
  comments: Comment[];
}

export interface Comment {
  comment_id: string;
  author?: string;
  body: string;
  post_id: string;
  time: string;
}