import React from 'react';

export default function Navbar() {
  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-indigo-400">
          DevBlog
        </h1>
        <span className="text-sm text-slate-400 hidden sm:inline">
          Full Stack Application
        </span>
      </div>
    </header>
  );
}
