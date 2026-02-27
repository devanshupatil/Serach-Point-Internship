import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { getRecentItems, getCategories, getFolders, togglePinFolder, deleteFolder, updateItem, deleteItem as moveToTrash, createFolder, getStarredItems } from '../services/api';
import { useSearch } from '../hooks/useSearch';
import ItemModal from '../components/ItemModal';
import ConfirmModal from '../components/ConfirmModal';
import { GridSkeleton, ListSkeleton } from '../components/Skeletons';

const Home = () => {
  const { user, logout } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  
  const [recentItems, setRecentItems] = useState([]);
  const [starredItems, setStarredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [folders, setFolders] = useState({ pinned: [], recent: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [editingItem, setEditingItem] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', data: null });
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);
  
  const { query, setQuery, suggestions, fetchSuggestions, performSearch, clearSearch } = useSearch();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recentRes, categoriesRes, foldersRes, starredRes] = await Promise.all([
        getRecentItems(20),
        getCategories(),
        getFolders(),
        getStarredItems()
      ]);

      if (recentRes.success) setRecentItems(recentRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (foldersRes.success) {
        setFolders({
          pinned: foldersRes.data.pinned || [],
          recent: foldersRes.data.recent || []
        });
      }
      if (starredRes.success) setStarredItems(starredRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 2) {
      fetchSuggestions(value);
    } else {
      fetchSuggestions('');
    }
  }, [setQuery, fetchSuggestions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
      navigate('/search');
    }
  };

  const handleTogglePin = async (folderId) => {
    try {
      await togglePinFolder(folderId);
      loadData();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDeleteFolder = (folder) => {
    setConfirmModal({
      show: true,
      type: 'folder',
      data: { folder, itemCount: folder.itemCount || 0 }
    });
  };

  const confirmDeleteFolder = async () => {
    const { folder, moveItems } = confirmModal.data;
    try {
      await deleteFolder(folder._id, moveItems);
      setConfirmModal({ show: false, type: '', data: null });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting folder');
    }
  };

  const handleEditItem = (item) => setEditingItem(item);

  const handleSaveItem = async (data) => {
    try {
      await updateItem(editingItem._id, data);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleStarItem = async (item) => {
    try {
      await updateItem(item._id, { isStarred: !item.isStarred });
      loadData();
    } catch (error) {
      console.error('Error starring item:', error);
    }
  };

  const handleMoveToTrash = (item) => {
    setConfirmModal({
      show: true,
      type: 'item',
      data: { item, action: 'trash' }
    });
  };

  const confirmMoveToTrash = async () => {
    const { item } = confirmModal.data;
    try {
      await moveToTrash(item._id);
      setConfirmModal({ show: false, type: '', data: null });
      loadData();
    } catch (error) {
      console.error('Error moving to trash:', error);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      await createFolder({ name: newFolderName });
      setNewFolderName('');
      setShowFolderInput(false);
      loadData();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const getTypeIcon = (type) => ({ image: '🖼️', link: '🔗', document: '📄', video: '🎬', note: '📝' }[type] || '📁');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800">Search Point</h1>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <GridSkeleton count={5} type="category" />
          <GridSkeleton count={6} type="folder" />
          <ListSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Search Point</h1>
          
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-8 relative">
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="🔍 Search items, folders..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 z-50">
                {suggestions.slice(0, 5).map((s, i) => (
                  <div
                    key={i}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setQuery(s.name);
                      performSearch(s.name);
                      navigate('/search');
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
          
          <div className="flex items-center gap-4">
            {!isOnline && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Offline</span>}
            <Link to="/trash" className="text-slate-600 hover:text-slate-800 text-sm font-medium">🗑️ Trash</Link>
            <span className="text-slate-600">{user?.email}</span>
            <button onClick={logout} className="text-slate-600 hover:text-slate-800 text-sm font-medium">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          {['home', 'pinned', 'starred', 'timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'home' && (
          <div className="space-y-8">
            {folders.pinned.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">📌 Pinned Folders</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {folders.pinned.map((folder) => (
                    <div key={folder._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group relative">
                      <div className="text-2xl mb-2">📁</div>
                      <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{folder.itemCount || 0} items</p>
                      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition absolute top-2 right-2">
                        <button onClick={(e) => { e.stopPropagation(); handleTogglePin(folder._id); }} className="text-xs bg-slate-100 p-1 rounded hover:bg-slate-200">📌</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder); }} className="text-xs bg-slate-100 p-1 rounded hover:bg-red-100">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Auto Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.filter(c => c.count > 0).map((cat) => (
                  <Link key={cat.name} to={`/category/${cat.type}`} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition hover:border-blue-300">
                    <div className="text-3xl mb-2">
                      {cat.type === 'image' && '🖼️'} {cat.type === 'document' && '📄'} {cat.type === 'link' && '🔗'} {cat.type === 'video' && '🎬'} {cat.type === 'note' && '📝'}
                    </div>
                    <p className="font-medium text-slate-800">{cat.name}</p>
                    <p className="text-sm text-slate-500">{cat.count} items</p>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Recent Folders</h2>
                <button onClick={() => setShowFolderInput(true)} className="text-sm text-blue-600 hover:text-blue-700">+ New Folder</button>
              </div>
              {showFolderInput && (
                <form onSubmit={handleCreateFolder} className="mb-4 flex gap-2">
                  <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Folder name" className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" autoFocus />
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
                  <button type="button" onClick={() => setShowFolderInput(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">Cancel</button>
                </form>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.recent.map((folder) => (
                  <div key={folder._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group relative">
                    <div className="text-2xl mb-2">📁</div>
                    <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{folder.itemCount || 0} items</p>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition absolute top-2 right-2">
                      <button onClick={(e) => { e.stopPropagation(); handleTogglePin(folder._id); }} className="text-xs bg-slate-100 p-1 rounded hover:bg-slate-200">📌</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder); }} className="text-xs bg-slate-100 p-1 rounded hover:bg-red-100">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'timeline' && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recently Saved</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
              {recentItems.map((item) => (
                <div key={item._id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition group">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{item.title || item.content}</p>
                    <p className="text-sm text-slate-500 truncate">{item.content}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleStarItem(item)} className="text-yellow-500 hover:text-yellow-600">{item.isStarred ? '⭐' : '☆'}</button>
                    <button onClick={() => handleEditItem(item)} className="text-blue-500 hover:text-blue-600">✏️</button>
                    <button onClick={() => handleMoveToTrash(item)} className="text-red-500 hover:text-red-600">🗑️</button>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(item.createdAt)}</span>
                </div>
              ))}
              {recentItems.length === 0 && <p className="p-8 text-center text-slate-500">No items yet</p>}
            </div>
          </section>
        )}

        {activeTab === 'starred' && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">⭐ Starred Items</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
              {starredItems.map((item) => (
                <div key={item._id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition group">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{item.title || item.content}</p>
                    <p className="text-sm text-slate-500 truncate">{item.content}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleStarItem(item)} className="text-yellow-500 hover:text-yellow-600">⭐</button>
                    <button onClick={() => handleEditItem(item)} className="text-blue-500 hover:text-blue-600">✏️</button>
                    <button onClick={() => handleMoveToTrash(item)} className="text-red-500 hover:text-red-600">🗑️</button>
                  </div>
                </div>
              ))}
              {starredItems.length === 0 && <p className="p-8 text-center text-slate-500">No starred items</p>}
            </div>
          </section>
        )}

        {activeTab === 'pinned' && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">📌 Pinned Folders</h2>
            {folders.pinned.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.pinned.map((folder) => (
                  <div key={folder._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer">
                    <div className="text-2xl mb-2">📁</div>
                    <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{folder.itemCount || 0} items</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-500">No pinned folders</p>}
          </section>
        )}
      </div>

      {editingItem && <ItemModal item={editingItem} onSave={handleSaveItem} onClose={() => setEditingItem(null)} />}
      {confirmModal.show && <ConfirmModal type={confirmModal.type} data={confirmModal.data} onConfirm={confirmModal.type === 'folder' ? confirmDeleteFolder : confirmMoveToTrash} onCancel={() => setConfirmModal({ show: false, type: '', data: null })} />}
    </div>
  );
};

export default Home;
