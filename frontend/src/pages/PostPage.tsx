import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import VoteButtons from '../components/VoteButtons';
import { analyzeSentiment, getSentimentColor } from '../utils/sentiment';
import { api } from '../utils/api';
import { Post } from '../types/post';
import { useComments } from '../hooks/useComments';
import { usePost } from '../hooks/usePost';

const safeParseDate = (dateString: string | undefined): Date | null => {
  if (!dateString) return null;

  try {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (dateRegex.test(dateString)) {
      return new Date(dateString);
    }
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  } catch {
    return null;
  }
};

export default function PostPage() {
  const { id } = useParams();
  const { post, isLoading: postLoading, error: postError, refreshPost } = usePost(id);
  const { comments, deleteComment, setComments } = useComments(id);

  const handleDeleteComment = async (commentId: string) => {
    try {
      const success = await deleteComment(commentId);
      if (success) {
        // First refresh the post to update comment count
        await refreshPost();
        // Then refresh comments
        const updatedComments = await api.getPostComments(id!);
        setComments(updatedComments);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl text-gray-600">Loading post...</h1>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const postSentiment = analyzeSentiment(post.body || '');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span>Back to posts</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex gap-4">
              <VoteButtons
                postId={post.post_id}
                initialUpvotes={post.upvotes}
                onVoteChange={(newVotes) => refreshPost()}
              />

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>

                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                  <span>Posted by u/{post.author}</span>
                  <span>•</span>
                  <span>
                    {safeParseDate(post.time)
                      ? `${formatDistanceToNow(safeParseDate(post.time)!)} ago`
                      : 'Unknown date'}
                  </span>
                  <span>•</span>
                  <span>r/{post.subreddit}</span>
                  <span>•</span>
                  <span className={`font-medium ${getSentimentColor(postSentiment.score)}`}>
                    {postSentiment.label}
                  </span>
                </div>

                {post.image && post.image.startsWith('http') && (
                  <div className="mt-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="rounded-lg w-full "
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="mt-4 p-4 rounded-lg bg-gray-50">
                  <p className="text-gray-800">{post.body}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
              </h2>

              <div className="space-y-4">
                {comments.map(comment => {
                  const commentSentiment = analyzeSentiment(comment.body);

                  return (
                    <div
                      key={comment.comment_id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {comment.author[0].toUpperCase()}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm text-gray-800">
                                u/{comment.author}
                              </span>
                              <span className="text-xs text-gray-500">
                                {safeParseDate(comment.time)
                                  ? formatDistanceToNow(safeParseDate(comment.time)!, { addSuffix: true })
                                  : 'Unknown date'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${getSentimentColor(commentSentiment.score)}`}
                            >
                              {commentSentiment.label}
                            </span>
                            <button
                              onClick={() => handleDeleteComment(comment.comment_id)}
                              className="text-gray-500 hover:text-red-600 transition-colors duration-200"
                              title="Delete comment"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
