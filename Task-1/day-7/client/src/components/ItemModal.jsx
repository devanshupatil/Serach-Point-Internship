import { useState, useEffect } from 'react';

const ItemModal = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    isStarred: false,
    isArchived: false,
    reminder: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        content: item.content || '',
        description: item.description || '',
        isStarred: item.isStarred || false,
        isArchived: item.isArchived || false,
        reminder: item.reminder ? new Date(item.reminder).toISOString().slice(0, 16) : ''
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      reminder: formData.reminder || null
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Edit Item</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              placeholder="Enter title" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea 
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              rows="3" 
              placeholder="Enter content" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
              rows="2" 
              placeholder="Enter description" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">🔔 Set Reminder</label>
            <input 
              type="datetime-local" 
              value={formData.reminder} 
              onChange={(e) => setFormData({ ...formData, reminder: e.target.value })} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formData.isStarred} 
                onChange={(e) => setFormData({ ...formData, isStarred: e.target.checked })} 
                className="w-4 h-4 text-yellow-500 rounded border-slate-300 focus:ring-yellow-500" 
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">⭐ Starred</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={formData.isArchived} 
                onChange={(e) => setFormData({ ...formData, isArchived: e.target.checked })} 
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900">📦 Archived</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm active:transform active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;
