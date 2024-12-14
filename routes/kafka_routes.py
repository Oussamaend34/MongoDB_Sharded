from fastapi import APIRouter, HTTPException, BackgroundTasks
from kafka_config import producer, consumer


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
