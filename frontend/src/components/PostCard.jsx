import React from 'react';
import { Trash2 } from 'lucide-react';

export default function PostCard({ post, onDelete }) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1">
      <div>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x300'; }}
          />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-slate-800 line-clamp-2">{post.title}</h3>
            <button
              onClick={() => onDelete(post._id)}
              className="text-slate-400 hover:text-red-500 p-1 transition-colors"
              title="Delete Post"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <p className="text-xs text-indigo-600 font-semibold mb-4">
            By {post.author || 'Anonymous'} • {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="text-slate-600 text-sm whitespace-pre-line line-clamp-4">{post.content}</p>
        </div>
      </div>
    </article>
  );
}
