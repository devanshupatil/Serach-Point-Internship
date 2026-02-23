import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getItems, getFolders } from '../services/api';
import AddItemModal from '../components/AddItemModal';

const Home = () => {
  const { user, logout, token } = useAuth();
  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState([]);
  const [shareText, setShareText] = useState('');
  const [shareType, setShareType] = useState('text/plain');
  const [sharing, setSharing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (token) {
      try {
        const [itemsData, foldersData] = await Promise.all([
          getItems(),
          getFolders()
        ]);
        setItems(itemsData);
        setFolders(foldersData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleShare = async () => {
    if (!shareText.trim()) return;
    
    setSharing(true);
    
    try {
      if (navigator.share) {
        const shareData = {
          title: 'Share to KeepBox',
          text: shareText,
          url: shareText.startsWith('http') ? shareText : undefined
        };
        
        await navigator.share(shareData);
      } else {
        const params = new URLSearchParams();
        params.set('text', shareText);
        params.set('type', shareType);
        window.location.href = `/share?${params.toString()}`;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    } finally {
      setSharing(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Images': return 'bg-pink-100 text-pink-600';
      case 'Links': return 'bg-blue-100 text-blue-600';
      case 'Documents': return 'bg-orange-100 text-orange-600';
      case 'Notes': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getFolderName = (folderId) => {
    if (!folderId) return null;
    const folder = folders.find(f => f._id === folderId);
    return folder ? folder.name : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 pb-20">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              KeepBox
            </span>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">{user?.email}</span>
              <button onClick={logout} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-indigo-50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Auto Share</h2>
              <p className="text-gray-500 text-sm">Quickly share text or links from your clipboard</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                placeholder="Paste a link or note here to quickly save it..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 focus:outline-none h-24 resize-none transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: sharing ? 1 : 1.01 }}
              whileTap={{ scale: sharing ? 1 : 0.99 }}
              onClick={handleShare}
              disabled={!shareText.trim() || sharing}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {sharing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Quick Save'
              )}
            </motion.button>
          </div>
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Gallery</h1>
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nothing here yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Tap the ➕ button to manually add links, documents, or images to your collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
              >
                <div className={`h-2 w-full ${getCategoryColor(item.category).split(' ')[0]}`} />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      {item.folderId && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 border border-gray-200">
                          📁 {getFolderName(item.folderId)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.name || (item.type === 'link' ? 'Untitled Link' : 'Untitled Item')}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 break-all">
                    {item.content}
                  </p>

                  {item.description && (
                    <p className="text-gray-400 text-xs italic mb-4 line-clamp-2 border-l-2 border-gray-100 pl-3">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                      View Details
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[90] focus:outline-none"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <AddItemModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onItemAdded={fetchData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
