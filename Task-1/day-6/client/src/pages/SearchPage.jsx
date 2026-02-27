import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useOffline } from '../context/OfflineContext';
import { updateItem, deleteItem as moveToTrash } from '../services/api';
import { ListSkeleton } from '../components/Skeletons';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { isOnline } = useOffline();
  const { query, setQuery, results, loading, error, performSearch, fetchSuggestions, suggestions } = useSearch();
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q, selectedType);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query, selectedType);
    }
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
    if (query.trim()) {
      performSearch(query, type);
    }
  };

  const handleStarItem = async (item) => {
    try {
      await updateItem(item._id, { isStarred: !item.isStarred });
      performSearch(query, selectedType);
    } catch (error) {
      console.error('Error starring item:', error);
    }
  };

  const handleMoveToTrash = async (item) => {
    if (!confirm('Move to trash?')) return;
    try {
      await moveToTrash(item._id);
      performSearch(query, selectedType);
    } catch (error) {
      console.error('Error moving to trash:', error);
    }
  };

  const getTypeIcon = (type) => ({ image: '🖼️', link: '🔗', document: '📄', video: '🎬', note: '📝' }[type] || '📁');
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/home" className="text-slate-600 hover:text-slate-800">← Back</Link>
            <h1 className="text-xl font-bold text-slate-800">Search Results</h1>
            {!isOnline && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Offline</span>}
          </div>
          
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.length >= 2) fetchSuggestions(e.target.value);
              }}
              placeholder="🔍 Search items, folders..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg"
              autoFocus
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 z-50">
                {suggestions.slice(0, 5).map((s, i) => (
                  <div
                    key={i}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setQuery(s.name);
                      performSearch(s.name, selectedType);
                    }}
                  >
                    <span>{s.type === 'folder' ? '📁' : '📄'}</span>
                    <span className="text-slate-700">{s.name}</span>
                    <span className="text-xs text-slate-400 ml-auto">{s.type}</span>
                  </div>
                ))}
              </div>
            )}
          </form>

          <div className="flex gap-2 mt-4">
            <button onClick={() => handleTypeFilter(null)} className={`px-3 py-1 rounded-lg text-sm ${!selectedType ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>All</button>
            <button onClick={() => handleTypeFilter('image')} className={`px-3 py-1 rounded-lg text-sm ${selectedType === 'image' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>🖼️ Images</button>
            <button onClick={() => handleTypeFilter('document')} className={`px-3 py-1 rounded-lg text-sm ${selectedType === 'document' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>📄 Documents</button>
            <button onClick={() => handleTypeFilter('link')} className={`px-3 py-1 rounded-lg text-sm ${selectedType === 'link' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>🔗 Links</button>
            <button onClick={() => handleTypeFilter('video')} className={`px-3 py-1 rounded-lg text-sm ${selectedType === 'video' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>🎬 Videos</button>
            <button onClick={() => handleTypeFilter('note')} className={`px-3 py-1 rounded-lg text-sm ${selectedType === 'note' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>📝 Notes</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <ListSkeleton count={5} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-slate-600">{error}</p>
          </div>
        ) : query.trim() === '' ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-500 text-lg">Enter a search term to find items</p>
          </div>
        ) : results.total === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-500 text-lg">No results found for "{query}"</p>
            <p className="text-slate-400 mt-2">Try different keywords</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.folders.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">📁 Folders ({results.folders.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.folders.map((folder) => (
                    <div key={folder._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
                      <div className="text-2xl mb-2">📁</div>
                      <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">📄 Items ({results.items.length})</h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                {results.items.map((item) => (
                  <div key={item._id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition group">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{item.title || item.content}</p>
                      <p className="text-sm text-slate-500 truncate">{item.content}</p>
                      {item.folderId && <p className="text-xs text-blue-600 mt-1">📁 {item.folderId.name}</p>}
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleStarItem(item)} className="text-yellow-500">{item.isStarred ? '⭐' : '☆'}</button>
                      <button onClick={() => handleMoveToTrash(item)} className="text-red-500">🗑️</button>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(item.createdAt)}</span>
                  </div>
                ))}
              </div>
            </section>

            <p className="text-sm text-slate-500 text-center">
              Found {results.total} result{results.total !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
