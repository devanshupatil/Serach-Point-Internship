import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTrashItems, restoreItem, deleteItem, emptyTrash } from '../services/api';

const TrashPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    try {
      const response = await getTrashItems();
      if (response.success) setItems(response.data);
    } catch (error) {
      console.error('Error loading trash:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (item) => {
    try {
      await restoreItem(item._id);
      loadTrash();
    } catch (error) {
      console.error('Error restoring item:', error);
    }
  };

  const handlePermanentDelete = async (item) => {
    if (!confirm('Permanently delete this item? This cannot be undone.')) return;
    try {
      await deleteItem(item._id, true);
      loadTrash();
    } catch (error) {
      console.error('Error permanently deleting:', error);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm('Empty trash? All items will be permanently deleted.')) return;
    try {
      await emptyTrash();
      loadTrash();
    } catch (error) {
      console.error('Error emptying trash:', error);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getTypeIcon = (type) => {
    const icons = { image: '🖼️', link: '🔗', document: '📄', video: '🎬', note: '📝' };
    return icons[type] || '📁';
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/home" className="text-slate-600 hover:text-slate-800">← Back</Link>
            <h1 className="text-xl font-bold text-slate-800">🗑️ Trash</h1>
          </div>
          {items.length > 0 && (
            <button onClick={handleEmptyTrash} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
              Empty Trash
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🗑️</div>
            <p className="text-slate-500 text-lg">Trash is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                <span className="text-2xl">{getTypeIcon(item.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{item.title || item.content}</p>
                  <p className="text-sm text-slate-500 truncate">{item.content}</p>
                </div>
                <div className="text-sm text-slate-400">
                  Deleted {formatDate(item.deletedAt)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(item)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(item)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashPage;
