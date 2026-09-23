import React, { useState } from 'react';

export default function PostForm({ onPostCreated }) {
  const [formData, setFormData] = useState({ title: '', content: '', author: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    setError(null);
    try {
      await onPostCreated(formData);
      setFormData({ title: '', content: '', author: '', imageUrl: '' });
    } catch (err) {
      setError(err.message || 'Failed to publish article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Create New Article</h2>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Article Title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full"
        />
        <input
          type="text"
          placeholder="Author Name"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full"
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full"
        />
        <textarea
          placeholder="Write your article content... *"
          rows="4"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full resize-y"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Article'}
        </button>
      </div>
    </form>
  );
}
