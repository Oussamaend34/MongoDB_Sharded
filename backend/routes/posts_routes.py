from fastapi import APIRouter, HTTPException
from database import posts_collection, comments_collection
from cache_database import redis_client
from models import PostWithComments
from typing import List
import json
posts_router = APIRouter()

async def get_posts_comments(post):
    post["id"] = str(post.pop("_id"))
    post["comments"] = await comments_collection.find({"post_id": post["post_id"]}).to_list()
    for comment in post["comments"]:
        comment["id"] = str(comment.pop("_id"))
    return post


@posts_router.get("/posts/{post_id}", response_model = PostWithComments)
async def get_post(post_id: str) -> PostWithComments:
    post = await redis_client.get(post_id)
    if post:
        post = json.loads(post)
        return post
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post:
        post = await get_posts_comments(post)
        await redis_client.set(post_id, json.dumps(post), ex= 1800)
    return post

@posts_router.get("/data")
async def get_posts_data(limit:int = 20) -> List[PostWithComments]:
    pipeline = [
        {"$sample": {"size": limit}}  # Randomly select 'limit' documents
    ]
    posts = await posts_collection.aggregate(pipeline).to_list(length=limit)
    for post in posts:
        post["comments"] = await comments_collection.find({"post_id": post["post_id"]}).to_list()
    return posts


@posts_router.put("/posts/upvote/{post_id}", response_model= PostWithComments)
async def upvote_post(post_id:str):
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post:
        post["upvotes"] += 1
        await posts_collection.update_one({"post_id": post['post_id']}, {"$set": post}, upsert=True)
        post = await get_posts_comments(post)
        await redis_client.set(post_id, json.dumps(post), ex=1800)
    return post

@posts_router.put("/posts/downvote/{post_id}", response_model= PostWithComments)
async def downvote_post(post_id:str):
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post :
        post["upvotes"] -= 1
        await posts_collection.update_one({"post_id": post['post_id']}, {"$set": post}, upsert=True)
        post = await get_posts_comments(post)
        await redis_client.set(post_id, json.dumps(post), ex=1800)
    return post

@posts_router.delete("/posts/{post_id}")
async def delete_post(post_id: str):
    post = await posts_collection.find_one({"post_id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post:
        await posts_collection.delete_one({"post_id": post['post_id']})
        await comments_collection.delete_many({"post_id": post['post_id']})
        await redis_client.delete(post_id)
        keys = await redis_client.keys(f"keyword:*")
        keys += await redis_client.keys(f"subreddit:*")
        for key in keys:
            list_post_ids = await redis_client.get(key)
            list_post_ids = json.loads(list_post_ids)
            if post['post_id'] in list_post_ids:
                list_post_ids.remove(post['post_id'])
                await redis_client.set(key, json.dumps(list_post_ids), ex=1800)
    return post["post_id"]


@posts_router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str):
    comment = await comments_collection.find_one({"comment_id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment:
        await comments_collection.delete_one({"comment_id": comment_id})
        post = await redis_client.get(comment["post_id"])
        if post:
            post = json.loads(post)
            for index, post_comment in enumerate(post["comments"]):
                if comment["comment_id"] == post_comment["comment_id"]:
                    post["comments"].pop(index)
                    break
            await redis_client.set(comment["post_id"], json.dumps(post), ex=1800)
    return comment['comment_id']

@posts_router.get("/posts/search/title/", response_model = List[PostWithComments])
async def search_posts_by_title(keyword: str):
    list_post_ids = await redis_client.get(f"keyword:{keyword}")
    if list_post_ids:
        list_post_ids = json.loads(list_post_ids)
        missing_posts = []
        deserialized_posts = []
        for post_id in list_post_ids:
            post = await redis_client.get(post_id)
            if post:
                deserialized_posts.append(json.loads(post))
            else:
                missing_posts.append(post_id)
        if missing_posts:
            missing_posts = await posts_collection.find({"post_id":{"$in":missing_posts}}).to_list(len(missing_posts))
            for post in missing_posts:
                post['id'] = str(post.pop("_id"))
                post["comments"] = await comments_collection.find({"post_id": post["post_id"]}).to_list()
                for comment in post["comments"]:
                    comment["id"] = str(comment.pop("_id"))
                deserialized_posts.append(json.loads(post))
                await redis_client.set(post["post_id"], json.dumps(post), ex=1800)
        return deserialized_posts
    posts = await posts_collection.find({"title": {"$regex": keyword, "$options": "i"}}).to_list(4)
    list_post_ids = [post["post_id"] for post in posts]
    await redis_client.set(f'keyword:{keyword}', json.dumps(list_post_ids), ex=900)
    for post in posts:
        post["id"] = str(post.pop("_id"))
        post["comments"] = await comments_collection.find({"post_id": post["post_id"]}).to_list()
        for comment in post["comments"]:
            comment["id"] = str(comment.pop("_id"))
        await redis_client.set(post["post_id"], json.dumps(post), ex = 1800)
    return posts

@posts_router.get("/posts/subreddit/{subreddit_name}", response_model = List[PostWithComments])
async def subreddit(subreddit_name:str) -> List[PostWithComments]:
    list_post_ids = await redis_client.get(f"subreddit:{subreddit_name}")
    if list_post_ids:
        list_post_ids = json.loads(list_post_ids)
        missing_posts = []
        deserialized_posts = []
        for post_id in list_post_ids:
            post = await redis_client.get(post_id)
            if post:
                deserialized_posts.append(json.loads(post))
            else:
                missing_posts.append(post_id)
        if missing_posts:
            missing_posts = await posts_collection.find({"post_id":{"$in":missing_posts}}).to_list(len(missing_posts))
            for post in missing_posts:
                post["id"] = str(post.pop("_id"))
                post["comments"] = await comments_collection.find({"post_id": post["post_id"]}).to_list()
                for comment in post["comments"]:
                    comment["id"] = str(comment.pop("_id"))
                deserialized_posts.append(json.loads(post))
                await redis_client.set(post["post_id"], json.dumps(post), ex=1800)
        return deserialized_posts
    pipeline = [
        {"$match": {"subreddit":subreddit_name}},
        {"$sample": {"size": 100}}
    ]
    posts = await posts_collection.aggregate(pipeline=pipeline).to_list()
    list_post_ids = [post["post_id"] for post in posts]
    if list_post_ids:
        await redis_client.set(f'subreddit:{subreddit_name}', json.dumps(list_post_ids), ex=900)
    for post in posts:
        post["id"] = str(post.pop("_id"))
        post["comments"] = await comments_collection.find({"post_id": post["post_id"]}).to_list()
        for comment in post["comments"]:
            comment["id"] = str(comment.pop("_id"))
        await redis_client.set(post["post_id"], json.dumps(post), ex=1800)
    return posts
