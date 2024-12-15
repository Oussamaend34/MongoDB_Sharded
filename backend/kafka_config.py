from KafkaProducer import RedditKafkaProducer
from KafkaConsumer import RedditKafkaConsumer
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_PORT = os.getenv('MONGO_PORT', 27017)
MONGO_HOST = os.getenv('MONGO_HOST', 'localhost')
KAFKA_HOST = os.getenv('KAFKA_HOST', 'localhost')
KAFKA_PORT = os.getenv('KAFKA_PORT', 9092)

print("MONGO_PORT",MONGO_HOST)
print("KAFKA_HOST",KAFKA_HOST)
print("KAFKA_PORT",KAFKA_PORT)
# Consumer Configuration
MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"
DB_NAME = os.getenv('DB_NAME', 'reddit_data')
KAFKA_CONSUMER_CONFIG = {
        'bootstrap.servers': f'{KAFKA_HOST}:{KAFKA_PORT}',
        'group.id': 'reddit-consumer-group',
        'auto.offset.reset': 'earliest'
}

# Producer Configuration

CLIENT_ID = 'fWtprROWI1PMYDJWn1_4RQ'
CLIENT_SECRET = 't7Yafyr1Of_Id1h-JZdjD-V85HT_OQ'
USER_AGENT = 'MyApp/0.0.1'
KAFKA_PRODUCER_CONFIG = {'bootstrap.servers': f'{KAFKA_HOST}:{KAFKA_PORT}'}
SUBREDDIT = "pics"

# Initialize Consumer
consumer = RedditKafkaConsumer(
    kafka_config=KAFKA_CONSUMER_CONFIG,
   mongo_uri=MONGO_URI,
    db_name=DB_NAME
)

# Initialize Producer
producer = RedditKafkaProducer(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    user_agent=USER_AGENT,
    kafka_config=KAFKA_PRODUCER_CONFIG,
    subreddit=SUBREDDIT
)

