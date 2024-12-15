from redis.asyncio import Redis
from dotenv import load_dotenv
import os

load_dotenv()

# Redis Configuration
REDIS_HOST = os.getenv("REDIS_HOST", 'redis')  # Adjust this based on your Redis setup
REDIS_PORT = os.getenv("REDIS_PORT", 6379)
REDIS_DB = os.getenv("REDIS_DB", 0)


REDIS_URI = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"
# Initialize Redis client
redis_client = Redis.from_url(
    REDIS_URI,
    decode_responses=True  # Decodes responses to strings for easier handling
)

def get_redis_client():
    return redis_client

