from diagrams import Cluster, Diagram
from diagrams.onprem.database import MongoDB
from diagrams.onprem.inmemory import Redis
from diagrams.onprem.queue import Kafka
from diagrams.onprem.client import User
from diagrams.programming.framework import FastAPI
from diagrams.programming.framework import React
from diagrams.custom import Custom

with Diagram("Project Architecture", show=False):
    # Core components
    user = User("Client")
    react_frontend = React("Frontend App")
    fastapi_backend = FastAPI("FastAPI Backend")

    redis_cache = Redis("Redis Cache")

    # MongoDB Sharded Cluster
    with Cluster("MongoDB"):
        mongodb_router = MongoDB("Mongos Router")
        shard1 = MongoDB("Shard1")
        shard2 = MongoDB("Shard2")
        config_server = MongoDB("Config Servers")

    # Reddit API
    reddit_api = Custom("Reddit API", "reddit.png")
    # Kafka System
    kafka_producer = Kafka("Producer")
    kafka_broker = Kafka("Broker")
    kafka_consumer = Kafka("Consumer")
    # zookeeper = Zookeeper("Zookeeper")

    # MongoDB Cluster setup
    mongodb_router >> [shard1, shard2]
    shard1 >> config_server
    shard2 >> config_server
    # Connections
    user >> react_frontend >> fastapi_backend
    fastapi_backend >> redis_cache
    fastapi_backend >> mongodb_router
    fastapi_backend >> kafka_producer
    fastapi_backend >> kafka_consumer
    fastapi_backend >> kafka_consumer
    reddit_api >> kafka_producer
    kafka_producer >>  kafka_broker
    kafka_broker >> kafka_consumer
    kafka_consumer>> mongodb_router

    # Zookeeper enabling Kafka
    # zookeeper >> kafka_broker
