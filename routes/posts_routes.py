from fastapi import APIRouter, HTTPException
from database import posts_collection, comments_collection
from models import Post, PostWithComments
from typing import List

posts_router = APIRouter()


@posts_router.get("/posts/{post_id}", response_model = PostWithComments)
async def get_post(post_id: str) -> PostWithComments:
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post:
        post["id"] = str(post.pop("_id"))
        post["comments"] = await comments_collection.find({"post_id": post["post_id"]})
    return post

@posts_router.get("/data")
async def get_posts_data(limit:int = 20) -> List[PostWithComments]:
    posts = await posts_collection.find().to_list(limit)
    for post in posts:
        post["comments"] = await comments_collection.find({"post_id": post["post_id"]}).to_list(3)

    return posts


@posts_router.put("/posts/upvote/{post_id}", response_model= Post)
async def upvote_post(post_id:str):
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post:
        post["upvotes"] += 1
        await posts_collection.update_one({"post_id": post['post_id']}, {"$set": post}, upsert=True)
    return post

@posts_router.put("/posts/downvote/{post_id}", response_model= Post)
async def downvote_post(post_id:str):
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post :
        post["upvotes"] -= 1
        await posts_collection.update_one({"post_id": post['post_id']}, {"$set": post}, upsert=True)
    return post

@posts_router.delete("/posts/{post_id}")
async def delete_post(post_id: str):
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post:
        await posts_collection.delete_one({"post_id": post['post_id']})
    return post["post_id"]

@posts_router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str):
    comment = await comments_collection.find_one({"comment_id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment:
        await comments_collection.delete_one({"comment_id": comment_id})
    return comment

@posts_router.get("/posts/search/title/")
async def search_posts_by_title(keyword: str):
    posts = await posts_collection.find({"title": {"$regex": keyword, "$options": "i"}}).to_list(4)
    for post in posts:
        post["id"] = str(post.pop("_id"))
    return posts