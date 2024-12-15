from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# Post Model
class Post(BaseModel):
    post_id: str
    author: str
    body: Optional[str]
    image: Optional[str]
    subreddit: str
    time: datetime
    title: str
    upvotes: int
    class Config:
        from_attributes = True


# Comment Model
class Comment(BaseModel):
    comment_id: str
    author: Optional[str]
    body: str
    post_id: str
    time: datetime
    class Config:
        from_attributes = True

class PostWithComments(Post):
    comments: Optional[List[Comment]]