import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecentItems, getCategories, getFolders, togglePinFolder, deleteFolder } from '../services/api';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [folders, setFolders] = useState({ pinned: [], recent: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recentRes, categoriesRes, foldersRes] = await Promise.all([
        getRecentItems(20),
        getCategories(),
        getFolders()
      ]);

      if (recentRes.success) setRecentItems(recentRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (foldersRes.success) {
        setFolders({
          pinned: foldersRes.data.pinned || [],
          recent: foldersRes.data.recent || []
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Delete this folder?')) return;
    try {
      await deleteFolder(folderId);
      loadData();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    const icons = {
      image: '🖼️',
      link: '🔗',
      document: '📄',
      video: '🎬',
      note: '📝'
    };
    return icons[type] || '📁';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Search Point</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">{user?.email}</span>
            <button
              onClick={logout}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          {['home', 'pinned', 'recent', 'timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'home' && (
          <div className="space-y-8">
            {folders.pinned.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  📌 Pinned Folders
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {folders.pinned.map((folder) => (
                    <div
                      key={folder._id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="text-2xl mb-2">📁</div>
                      <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDate(folder.updatedAt)}
                      </p>
                      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTogglePin(folder._id); }}
                          className="text-xs text-slate-500 hover:text-blue-600"
                        >
                          Unpin
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder._id); }}
                          className="text-xs text-slate-500 hover:text-red-600"
                        >
                          Delete
                        </button>
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
                  <Link
                    key={cat.name}
                    to={`/category/${cat.type}`}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition hover:border-blue-300"
                  >
                    <div className="text-3xl mb-2">
                      {cat.type === 'image' && '🖼️'}
                      {cat.type === 'document' && '📄'}
                      {cat.type === 'link' && '🔗'}
                      {cat.type === 'video' && '🎬'}
                      {cat.type === 'note' && '📝'}
                    </div>
                    <p className="font-medium text-slate-800">{cat.name}</p>
                    <p className="text-sm text-slate-500">{cat.count} items</p>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                🕐 Recent Folders
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.recent.map((folder) => (
                  <div
                    key={folder._id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="text-2xl mb-2">📁</div>
                    <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(folder.updatedAt)}
                    </p>
                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleTogglePin(folder._id); }}
                        className="text-xs text-slate-500 hover:text-blue-600"
                      >
                        Pin
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder._id); }}
                        className="text-xs text-slate-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'timeline' && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🕐 Recently Saved Timeline
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
              {recentItems.map((item) => (
                <div key={item._id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{item.title || item.content}</p>
                    <p className="text-sm text-slate-500 truncate">{item.content}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              ))}
              {recentItems.length === 0 && (
                <p className="p-8 text-center text-slate-500">No items yet</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'pinned' && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              📌 Pinned Folders
            </h2>
            {folders.pinned.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.pinned.map((folder) => (
                  <div
                    key={folder._id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="text-2xl mb-2">📁</div>
                    <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(folder.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No pinned folders</p>
            )}
          </section>
        )}

        {activeTab === 'recent' && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              🕐 Recent Folders
            </h2>
            {folders.recent.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {folders.recent.map((folder) => (
                  <div
                    key={folder._id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="text-2xl mb-2">📁</div>
                    <p className="font-medium text-slate-800 truncate">{folder.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(folder.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No recent folders</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
