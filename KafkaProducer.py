import time
import json
from typing import Dict

from confluent_kafka import Producer
from redditAPI import RedditAPI

class RedditKafkaProducer:
    def __init__(self, client_id:str, client_secret:str, user_agent:str, kafka_config:Dict[str, str], subreddit:str, post_limit:int = 10, comment_limit:int = 1):
        """
        Initialize a RedditKafkaProducer object.
        :param client_id: Reddit API client ID.
        :param client_secret: Reddit API client secret.
        :param user_agent: User agent for Reddit API requests.
        :param kafka_config: Kafka producer configuration.
        :param subreddit: Subreddit to monitor.
        :param post_limit: Number of posts to fetch per request.
        :param comment_limit: Number of comments to fetch per post.
        """
        self.reddit_api = RedditAPI(client_id, client_secret, user_agent)
        self.producer = Producer(kafka_config)
        self.recent_posts = []
        self.subreddit = subreddit
        self.post_limit = post_limit
        self.comment_limit = comment_limit
        self.running = False
    def produce_to_kafka(self) -> None:
        """
        Fetches posts and comments from the subreddit and produces them to Kafka topics.
        """
        posts = self.reddit_api.fetch_posts(subreddit_name=self.subreddit, limit=self.post_limit)

        for post in posts:
            post_id = post["post_id"]
            if post_id not in self.recent_posts:
                print(f"Producing to Kafka: {post_id}")
                # Add the post ID to the recent_posts list.
                self.recent_posts.append(post_id)
                if len(self.recent_posts) > self.post_limit + 5: # Keep the list maximum size to self.post_limit
                    self.recent_posts.pop(0)

                # Send the post to Kafka
                self.producer.produce('reddit-posts', key=post_id, value=json.dumps(post))

                # Fetch comments for the post
                comments = self.reddit_api.fetch_comments(post_id=post_id, limit=self.comment_limit)
                for comment in comments:
                    self.producer.produce('reddit-comments', key=comment["comment_id"], value=json.dumps(comment))

                # Flush Kafka producer to ensure messages are sent
                self.producer.flush()
    def run(self, poll_interval:int = 60) -> None:
        """
        Continuously fetches and produces posts and comments to Kafka at regular intervals.

        :param poll_interval: Number of seconds to wait between polls.
        """

        while self.running:
            print("Fetching and producing new posts and comments..")
            try:
                self.produce_to_kafka()
            except Exception as e:
                print(f"Error during producing to Kafka: {e}")

            print(f"Waiting for {poll_interval} seconds before the next fetch...")
            time.sleep(poll_interval)


if __name__ == "__main__":
    CLIENT_ID = 'fWtprROWI1PMYDJWn1_4RQ'
    CLIENT_SECRET = 't7Yafyr1Of_Id1h-JZdjD-V85HT_OQ'
    USER_AGENT = 'MyApp/0.0.1'
    KAFKA_CONFIG = {'bootstrap.servers': 'localhost:9092'}
    SUBREDDIT = "AskReddit"

    producer = RedditKafkaProducer(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        user_agent=USER_AGENT,
        kafka_config=KAFKA_CONFIG,
        subreddit=SUBREDDIT,
        post_limit=10,
        comment_limit=5
    )
    producer.running = True
    producer.run(poll_interval=60)