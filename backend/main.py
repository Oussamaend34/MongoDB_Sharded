from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.posts_routes import posts_router
from routes.kafka_routes import kafka_router
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://frontend:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow requests from these origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Include routes
app.include_router(posts_router, prefix="/api", tags=["Reddit Data"])
app.include_router(kafka_router, prefix="/api/kafka", tags=["Kafka Data"])

# Health Check
@app.get("/")
async def root():
    return {"message": "Welcome to the Reddit Data API"}
