import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SubredditSearchProps {
  onSearch: (subreddit: string) => void;
}

export default function SubredditSearch({ onSearch }: SubredditSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mb-6"
    >
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subreddits..."
          className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-full 
                   focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                   placeholder-gray-500"
        />
        <Search 
          className="absolute left-3 top-2.5 text-gray-400" 
          size={20}
        />
        <button
          type="submit"
          className="absolute right-2 top-1 px-4 py-1 bg-orange-500 text-white rounded-full
                   hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          Search
        </button>
      </div>
    </form>
  );
}
