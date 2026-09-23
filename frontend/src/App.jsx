import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostCard from './components/PostCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (err) {
      // This is the case that used to silently render "No articles available."
      // Surface it clearly instead so it's obvious the request failed.
      const message = err.response
        ? `Server responded with an error: ${err.response.status} ${err.response.data?.message || ''}`
        : `Could not reach the API at ${API_URL}. Is the backend running and is VITE_API_URL set correctly?`;
      console.error('Failed to fetch posts:', err);
      console.error('Resolved API_URL was:', API_URL);
      setFetchError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (newPost) => {
    try {
      const res = await axios.post(API_URL, newPost);
      setPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to publish article.';
      throw new Error(message);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <PostForm onPostCreated={handleCreatePost} />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Recent Articles</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden sm:inline">API: {API_URL}</span>
            <button
              onClick={fetchPosts}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading articles...</div>
        ) : fetchError ? (
          <div className="text-center py-12 px-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p className="font-semibold mb-1">Couldn't load articles</p>
            <p className="text-sm">{fetchError}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No articles available. Start writing!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
