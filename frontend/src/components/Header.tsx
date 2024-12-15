import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import SearchBar from './SearchBar.tsx';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setTimeFilter: (hours: number | null) => void;
  activeTimeFilter: number | null;
  onSubredditSearch: (subreddit: string) => void;
}

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  setTimeFilter, 
  activeTimeFilter,
  onSubredditSearch 
}: HeaderProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState(searchTerm);
  const [subreddit, setSubreddit] = useState('');

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setCurrentSearchTerm('');
      setSubreddit('');
    }
  };

  const handleTitleSearch = () => {
    setSearchTerm(currentSearchTerm);
  };

  const handleSubredditSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSubredditSearch(subreddit);
  };

  return (
    <header className="sticky top-0 bg-white shadow-md p-4 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSearch} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={isSearchVisible ? "Close search" : "Open search"}
            >
              {isSearchVisible ? <X size={24} /> : <Search size={24} />}
            </button>

            {isSearchVisible && (
              <div className="flex flex-wrap gap-4 ml4">
                <div className="flex gap-2">
                  <SearchBar 
                    value={currentSearchTerm} 
                    onChange={setCurrentSearchTerm}
                    placeholder="Search by title..."
                  />
                  <button 
                    onClick={handleTitleSearch}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Search Title
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subreddit}
                    onChange={(e) => setSubreddit(e.target.value)}
                    placeholder="Enter subreddit..."
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSubredditSearch}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Find Posts
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 ml-auto">
            {[1, 12, 24].map((hours) => (
              <button
                key={hours}
                onClick={() => setTimeFilter(hours)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTimeFilter === hours
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {hours}h
              </button>
            ))}
            <button
              onClick={() => setTimeFilter(null)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTimeFilter === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              All time
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}