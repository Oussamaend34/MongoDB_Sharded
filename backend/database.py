from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_PORT = os.getenv('MONGO_PORT', 27017)
MONGO_HOST = os.getenv('MONGO_HOST', 'localhost')
DATABASE_NAME = os.getenv('DB_NAME', 'reddit_data')

# MongoDB Configuration
MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"  # Adjust this based on your MongoDB setup

# Initialize client and database
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
posts_collection = db["posts"]
comments_collection = db["comments"]

# Dependency for using database in routes
def get_database():
    return db