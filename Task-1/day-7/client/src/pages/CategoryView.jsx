import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItems, updateItem, deleteItem as moveToTrash } from '../services/api';
import ItemModal from '../components/ItemModal';
import { GridSkeleton, ListSkeleton } from '../components/Skeletons';

const CategoryView = () => {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadItems(true);
  }, [type]);

  const loadItems = async (reset = false) => {
    const newPage = reset ? 1 : page;
    try {
      const response = await getItems({ type, page: newPage, limit: 20 });
      if (response.success) {
        if (reset) {
          setItems(response.data);
        } else {
          setItems(prev => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === 20);
        setPage(newPage + 1);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => setEditingItem(item);

  const handleSaveItem = async (data) => {
    try {
      await updateItem(editingItem._id, data);
      setEditingItem(null);
      loadItems(true);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleMoveToTrash = async (item) => {
    if (!confirm('Move to trash?')) return;
    try {
      await moveToTrash(item._id);
      loadItems(true);
    } catch (error) {
      console.error('Error moving to trash:', error);
    }
  };

  const handleStarItem = async (item) => {
    try {
      await updateItem(item._id, { isStarred: !item.isStarred });
      loadItems(true);
    } catch (error) {
      console.error('Error starring item:', error);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const getTypeLabel = () => ({ image: 'Images', document: 'Documents', link: 'Links', video: 'Videos', note: 'Notes' }[type] || type);

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4"><div className="max-w-7xl mx-auto flex items-center gap-4"><Link to="/home" className="text-slate-600 hover:text-slate-800">← Back</Link><h1 className="text-xl font-bold text-slate-800">{getTypeLabel()}</h1></div></nav>
      <div className="max-w-7xl mx-auto px-6 py-8"><GridSkeleton count={10} type="category" /></div>
    </div>
  );

  const renderImagesGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group relative">
          <div className="aspect-square bg-slate-100 flex items-center justify-center">
            {item.metadata?.url ? <img src={item.metadata.url} alt={item.title} className="w-full h-full object-cover" loading="lazy" /> : <span className="text-4xl">🖼️</span>}
          </div>
          <div className="p-3">
            <p className="font-medium text-slate-800 truncate text-sm">{item.title}</p>
            <p className="text-xs text-slate-500 mt-1">{formatDate(item.createdAt)}</p>
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onClick={() => handleStarItem(item)} className="bg-white p-1 rounded shadow text-yellow-500">{item.isStarred ? '⭐' : '☆'}</button>
            <button onClick={() => handleEditItem(item)} className="bg-white p-1 rounded shadow text-blue-500">✏️</button>
            <button onClick={() => handleMoveToTrash(item)} className="bg-white p-1 rounded shadow text-red-500">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDocumentsList = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition group">
          <span className="text-2xl">📄</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 truncate">{item.title}</p>
            <p className="text-sm text-slate-500 truncate">{item.content}</p>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
            <button onClick={() => handleStarItem(item)} className="text-yellow-500">{item.isStarred ? '⭐' : '☆'}</button>
            <button onClick={() => handleEditItem(item)} className="text-blue-500">✏️</button>
            <button onClick={() => handleMoveToTrash(item)} className="text-red-500">🗑️</button>
          </div>
          <div className="text-right"><p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p></div>
        </div>
      ))}
    </div>
  );

  const renderLinksPreview = () => (
    <div className="grid gap-4">
      {items.map((item) => (
        <a key={item._id} href={item.content} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition hover:border-blue-300 block group relative">
          <div className="flex items-start gap-4">
            <span className="text-2xl">🔗</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{item.title}</p>
              <p className="text-sm text-blue-600 truncate">{item.content}</p>
              <p className="text-xs text-slate-500 mt-2">{formatDate(item.createdAt)}</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onClick={(e) => { e.preventDefault(); handleStarItem(item); }} className="bg-white p-1 rounded shadow text-yellow-500">{item.isStarred ? '⭐' : '☆'}</button>
            <button onClick={(e) => { e.preventDefault(); handleEditItem(item); }} className="bg-white p-1 rounded shadow text-blue-500">✏️</button>
            <button onClick={(e) => { e.preventDefault(); handleMoveToTrash(item); }} className="bg-white p-1 rounded shadow text-red-500">🗑️</button>
          </div>
        </a>
      ))}
    </div>
  );

  const renderVideosEmbedded = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group">
          <div className="aspect-video bg-slate-900 flex items-center justify-center">
            {item.metadata?.url ? (item.metadata.url.includes('youtube') || item.metadata.url.includes('youtu.be') ? <iframe src={item.metadata.url.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title={item.title} loading="lazy" /> : <video src={item.metadata.url} controls className="w-full h-full object-contain" />) : <span className="text-4xl">🎬</span>}
          </div>
          <div className="p-4">
            <p className="font-medium text-slate-800 truncate">{item.title}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p>
              <div className="flex gap-2">
                <button onClick={() => handleStarItem(item)} className="text-yellow-500">{item.isStarred ? '⭐' : '☆'}</button>
                <button onClick={() => handleEditItem(item)} className="text-blue-500">✏️</button>
                <button onClick={() => handleMoveToTrash(item)} className="text-red-500">🗑️</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNotesList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group relative">
          <div className="flex items-start gap-3">
            <span className="text-xl">📝</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{item.title}</p>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">{item.content}</p>
              <p className="text-xs text-slate-400 mt-3">{formatDate(item.createdAt)}</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button onClick={() => handleStarItem(item)} className="bg-white p-1 rounded shadow text-yellow-500">{item.isStarred ? '⭐' : '☆'}</button>
            <button onClick={() => handleEditItem(item)} className="bg-white p-1 rounded shadow text-blue-500">✏️</button>
            <button onClick={() => handleMoveToTrash(item)} className="bg-white p-1 rounded shadow text-red-500">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'image': return renderImagesGrid();
      case 'document': return renderDocumentsList();
      case 'link': return renderLinksPreview();
      case 'video': return renderVideosEmbedded();
      case 'note': return renderNotesList();
      default: return renderDocumentsList();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/home" className="text-slate-600 hover:text-slate-800">← Back</Link>
          <h1 className="text-xl font-bold text-slate-800">{getTypeLabel()}<span className="ml-2 text-sm font-normal text-slate-500">({items.length} items)</span></h1>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
        {hasMore && !loading && (
          <div className="text-center mt-6">
            <button onClick={() => loadItems(false)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Load More</button>
          </div>
        )}
      </div>
      {editingItem && <ItemModal item={editingItem} onSave={handleSaveItem} onClose={() => setEditingItem(null)} />}
    </div>
  );
};

export default CategoryView;
