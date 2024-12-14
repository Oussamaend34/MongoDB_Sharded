import praw
from praw.models import MoreComments
from typing import List, Dict, Optional
from datetime import datetime


class RedditAPI:
    def __init__(self, client_id:str, client_secret:str, user_agent:str):
        """Initializes the Reddit API wrapper."""
        self.reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent,
        )
    def fetch_posts(self, subreddit_name:str, limit:int=10) -> List[Dict[str, Optional[str]|List]]:
        """
        Fetches posts from a subreddit.
        :param subreddit_name: The name of the subreddit.
        :param limit: The maximum number of posts to fetch.
        :return: list of posts data dictionaries.
        """
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            posts = []
            for post in subreddit.new(limit=limit):
                posts.append({
                    "post_id": post.id,
                    "title": post.title,
                    "body": post.selftext,
                    "image": post.url if post.url.lower().endswith(('jpg', 'jpeg', 'png', 'gif')) else None,
                    "author": str(post.author) if post.author else None,
                    "upvotes": post.score,
                    "subreddit": subreddit_name,
                    "time": datetime.fromtimestamp(post.created_utc).isoformat(),
                })
            return posts
        except Exception as e:
            print(f"Error fetchin posts from {subreddit_name}: {e}")
            return []
    def fetch_comments(self, post_id:str, limit:int =10) -> List[Dict[str, Optional[str]]]:
        """
        Fetch a list of comments for a specific post.
        :param post_id: The ID of the post to fetch comments for.
        :param limit: Maximum number of comments to fetch.
        :return: List of comment data dictionaries.
        """
        try:
            submission = self.reddit.submission(id=post_id)
            submission.comments.replace_more(limit=0)
            comments = []

            for comment in submission.comments[:limit]:
                if isinstance(comment, MoreComments):
                    continue
                if comment.author == "AutoModerator":
                    continue
                comments.append({
                    "comment_id": comment.id,
                    "post_id": post_id,
                    "author": str(comment.author) if comment.author else None,
                    "body": comment.body,
                    "time": datetime.fromtimestamp(comment.created_utc).isoformat(),
                })


            return comments
        except Exception as e:
            print(f"Error fetching comments for {post_id}: {e}")
            return []
    def fetch_posts_and_comments(self, subreddit_name:str, post_limit:int=10, comment_limit:int = 10, ) -> List[Dict[str, Optional[str]]]:
        """
        Fetches posts and comments for a specific subreddit.
        :param subreddit_name: The name of the subreddit.
        :param post_limit: Maximum number of posts to fetch.
        :param comment_limit: Maximum number of comments to fetch.
        :return: List of posts data dictionaries, each including comments.
        """
        posts = self.fetch_posts(subreddit_name=subreddit_name, limit=post_limit)
        for post in posts:
            post["comments"] = self.fetch_comments(post_id=post["post_id"], limit=comment_limit)
        return posts

    def test_subreddit(self, subreddit_name:str):
        """
        This function checks if the subreddit exists.
        :param subreddit_name: The name of the subreddit.
        """
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            posts = []
            for post in subreddit.new(limit=10):
                posts.append({
                    "post_id": post.id,
                    "title": post.title,
                    "body": post.selftext,
                    "image": post.url if post.url.lower().endswith(('jpg', 'jpeg', 'png', 'gif')) else None,
                    "author": str(post.author) if post.author else None,
                    "upvotes": post.score,
                    "subreddit": subreddit_name,
                    "time": datetime.fromtimestamp(post.created_utc).isoformat(),
            })
            return True
        except Exception as e:
            print(f"Error fetching subreddit {subreddit_name}: {e}")
            return False

