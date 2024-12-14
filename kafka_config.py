from KafkaProducer import RedditKafkaProducer
from KafkaConsumer import RedditKafkaConsumer

# Consumer Configuration

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "reddit_data"
KAFKA_CONSUMER_CONFIG = {
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'reddit-consumer-group',
        'auto.offset.reset': 'earliest'
}

# Producer Configuration

CLIENT_ID = 'fWtprROWI1PMYDJWn1_4RQ'
CLIENT_SECRET = 't7Yafyr1Of_Id1h-JZdjD-V85HT_OQ'
USER_AGENT = 'MyApp/0.0.1'
KAFKA_PRODUCER_CONFIG = {'bootstrap.servers': 'localhost:9092'}
SUBREDDIT = "AskReddit"

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

