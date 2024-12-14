from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB Configuration
MONGO_URI = "mongodb://localhost:27017"  # Adjust this based on your MongoDB setup
DATABASE_NAME = "reddit_data"

# Initialize client and database
client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# Collections
posts_collection = db["posts"]
comments_collection = db["comments"]

# Dependency for using database in routes
def get_database():
    return db