import json
from typing import Dict, Any
from confluent_kafka import Consumer, KafkaError
from pymongo import MongoClient
from pymongo.errors import PyMongoError


class RedditKafkaConsumer:
    def __init__(self, kafka_config: Dict[str, str], mongo_uri:str, db_name:str):
        """
        Initialize the RedditKafkaConsumer.
        :param kafka_config: Kafka consumer configuration.
        :param mongo_uri: MongoDB connection URI.
        :param db_name: MongoDB database name.
        """
        # Kafka setup
        self.consumer = Consumer(kafka_config)
        self.consumer.subscribe(['reddit-posts', 'reddit-comments'])

        # Mongodb setup
        self.mongo_client = MongoClient(mongo_uri)
        self.db = self.mongo_client[db_name]
        self.posts_collection = self.db["posts"]
        self.comments_collection = self.db["comments"]
        self.running = True

    def save_to_mongodb(self, topic:str, data:Dict[str, Any]) -> None:
        """
        Save data to the appropriate MongoDB collection based on the topic.
        :param topic: The Kafka topic (either 'reddit-posts' or 'reddit-comments').
        :param data: The data to save.
        """
        try:
            if topic == "reddit-posts":
                self.posts_collection.update_one(
                    {"post_id": data['post_id']}, {"$set": data}, upsert=True
                )
                print(f"Post {data['post_id']} saved to MongoDB")
            elif topic == "reddit-comments":
                self.comments_collection.update_one(
                    {"comment_id": data['comment_id']}, {"$set": data}, upsert=True
                )
                print(f"Comment {data['comment_id']} saved to MongoDB.")
            else:
                print(f"Unknown topic: {topic}")
        except PyMongoError as e:
            print(f"Error saving to MongoDB: {e}")

    def consume_messages(self) -> None:
        """
        Consume messages from Kafka and process them.
        """
        try:
            while self.running:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue

                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        print(f"End of partition: {msg.topic()} {msg.partition()}")
                    else:
                        print(f"Kafka error: {msg.error()}")
                    continue

                topic = msg.topic()
                try:
                    data = json.loads(msg.value().decode('utf-8'))
                    self.save_to_mongodb(topic, data)
                except json.JSONDecodeError as e:
                    print(f"Error decoding message: {e}")
        except KeyboardInterrupt:
            print("Consumer interrupted by user.")
        finally:
            self.consumer.close()
            print("Kafka consumer closed.")

    def close(self) -> None:
        """
        Clean up resources.
        """
        self.mongo_client.close()
        self.consumer.close()

if __name__ == "__main__":
    # Kafka and MongoDB configurations
    KAFKA_CONFIG = {
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'reddit-consumer-group',
        'auto.offset.reset': 'earliest'
    }
    MONGO_URI = "mongodb://localhost:27017/"
    DB_NAME = "reddit_data"

    consumer = RedditKafkaConsumer(kafka_config=KAFKA_CONFIG, mongo_uri=MONGO_URI, db_name=DB_NAME)
    try:
        consumer.consume_messages()
    finally:
        consumer.close()