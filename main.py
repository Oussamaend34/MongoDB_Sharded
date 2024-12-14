from fastapi import FastAPI
from routes.posts_routes import posts_router
from routes.kafka_routes import kafka_router

app = FastAPI()

# Include routes
app.include_router(posts_router, prefix="/api", tags=["Reddit Data"])
# app.include_router(kafka_router, prefix="/api/kafka", tags=["Kafka Data"])

# Health Check
@app.get("/")
async def root():
    return {"message": "Welcome to the Reddit Data API"}
