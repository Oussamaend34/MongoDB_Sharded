from fastapi import APIRouter, HTTPException, BackgroundTasks
from kafka_config import producer, consumer
from redditAPI import RedditAPI
from typing import Optional
import os

kafka_router = APIRouter()

@kafka_router.post("/producer/start")
async def start_kafka_producer(background_tasks: BackgroundTasks, poll_interval: int = 60):
    if producer is None:
        raise HTTPException(status_code=400, detail="Producer is already initialized.")
    # Start Producer in the background
    producer.running = True
    background_tasks.add_task(producer.run, poll_interval=poll_interval)
    return {"message": "Producer started in the background."}

@kafka_router.post("/consumer/start")
async def start_kafka_consumer(background_tasks: BackgroundTasks):
    if consumer is None:
        raise HTTPException(status_code=400, detail="Consumer is already initialized.")
    consumer.running = True
    background_tasks.add_task(consumer.consume_messages)
    return {"message": "Consumer started in the background."}

@kafka_router.post("/consumer/stop")
async def stop_kafka_consumer():
    if consumer is None:
        raise HTTPException(status_code=400, detail="Consumer is already initialized.")
    consumer.running = False
    return {"message": "Consumer stopped in the background."}
@kafka_router.post("/producer/stop")
async def stop_kafka_producer():
    if producer is None:
        raise HTTPException(status_code=400, detail="Producer is already initialized.")
    producer.running = False
    return {"message": "Producer stopped in the background."}
@kafka_router.put("/producer/update")
async def update_kafka_producer(
        subreddit: Optional[str] = None,
        post_limit: Optional[int] = None,
        comment_limit: Optional[int] = None,
):
    if  producer is None:
        raise HTTPException(status_code=400, detail="Producer is already initialized.")
    if subreddit:
        test_subreddit = RedditAPI(client_id=os.getenv('CLIENT_ID'), client_secret=os.getenv('CLIENT_SECRET'), user_agent=os.getenv('USER_AGENT'))
        print(test_subreddit.test_subreddit(subreddit))
        if test_subreddit.test_subreddit(subreddit):
            producer.subreddit = subreddit
        else:
            raise HTTPException(status_code=400, detail="Subreddit does not exist.")
    if post_limit:
        if post_limit < 3:
            raise HTTPException(status_code=400, detail="Post limit must be greater than 3.")
        producer.post_limit = post_limit
    if comment_limit:
        if comment_limit < 3:
            raise HTTPException(status_code=400, detail="Comment limit must be greater than 3.")
        producer.comment_limit = comment_limit

    return {"message": "Producer updated in the background."}
