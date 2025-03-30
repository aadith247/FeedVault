import { useState } from 'react';
import { Tag, X } from 'lucide-react';

interface InputProps {
  placeholder?: string;
  className?: string;
}

export const Input = ({ placeholder, className = '' }: InputProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const categories = ['YouTube', 'Twitter', 'Google Docs'];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Link Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Paste Link</label>
        <input
          type="text"
          placeholder={placeholder || 'https://'}
          className={`w-full px-4 py-2.5 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${className}`}
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Select Category</label>
        <select
          className="w-full px-4 py-2.5 border-2 border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Add Tags</label>
        <div className="w-full px-4 py-2.5 border-2 border-indigo-600 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                <Tag className="w-4 h-4 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 inline-flex items-center p-0.5 hover:bg-indigo-200 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a tag and press Enter"
            className="w-full focus:outline-none bg-transparent"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">Press Enter to add a tag</p>
      </div>
    </div>
  );
};