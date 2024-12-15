import { useState } from 'react';
import { api } from '../utils/api';

export default function AdminPage() {
  const [subreddit, setSubreddit] = useState('');
  const [postLimit, setPostLimit] = useState('10');
  const [commentLimit, setCommentLimit] = useState('3');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleStartProducer = async () => {
    try {
      setIsLoading(true);
      await api.startKafkaProducer(60);
      setMessage({ text: 'Producer started successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to start producer', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopProducer = async () => {
    try {
      setIsLoading(true);
      await api.stopKafkaProducer();
      setMessage({ text: 'Producer stopped successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to stop producer', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsumer = async () => {
    try {
      setIsLoading(true);
      await api.startKafkaConsumer();
      setMessage({ text: 'Consumer started successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to start consumer', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopConsumer = async () => {
    try {
      setIsLoading(true);
      await api.stopKafkaConsumer();
      setMessage({ text: 'Consumer stopped successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to stop consumer', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setIsLoading(true);
      await api.updateKafkaProducer({
        subreddit,
        post_limit: Number(postLimit),
        comment_limit: Number(commentLimit)
      });
      setMessage({ text: 'Settings updated successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update settings', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Producer Settings</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subreddit
                  </label>
                  <input
                    type="text"
                    value={subreddit}
                    onChange={(e) => setSubreddit(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., programming"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Post Limit
                    </label>
                    <input
                      type="number"
                      value={postLimit}
                      onChange={(e) => setPostLimit(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comment Limit
                    </label>
                    <input
                      type="number"
                      value={commentLimit}
                      onChange={(e) => setCommentLimit(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateSettings}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Update Settings
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Producer Controls</h2>
                <div className="space-y-4">
                  <button
                    onClick={handleStartProducer}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Start Producer
                  </button>
                  <button
                    onClick={handleStopProducer}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Stop Producer
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Consumer Controls</h2>
                <div className="space-y-4">
                  <button
                    onClick={handleStartConsumer}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Start Consumer
                  </button>
                  <button
                    onClick={handleStopConsumer}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Stop Consumer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
