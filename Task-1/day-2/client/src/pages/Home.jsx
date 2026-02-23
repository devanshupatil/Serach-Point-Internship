import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getItems } from '../services/api';

const Home = () => {
  const { user, logout, token } = useAuth();
  const [items, setItems] = useState([]);
  const [shareText, setShareText] = useState('');
  const [shareType, setShareType] = useState('text/plain');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (token) {
      getItems().then(setItems).catch(console.error);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
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
          className="bg-white rounded-2xl shadow-xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Share Content</h2>
              <p className="text-gray-500 text-sm">Share anything - links, photos, docs, notes</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to share?</label>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                placeholder="Paste a link, write a note, or describe your content..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none h-28 resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: sharing ? 1 : 1.02 }}
              whileTap={{ scale: sharing ? 1 : 0.98 }}
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
                  Opening Share Sheet...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share to KeepBox
                </>
              )}
            </motion.button>

            <p className="text-center text-gray-400 text-sm">
              {navigator.share ? 'Tap to open share sheet' : 'Click to share • Works best on mobile'}
            </p>
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Saved Items</h1>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500">No items saved yet. Start sharing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
              >
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <p className="text-gray-700 mt-3 text-sm break-all">{item.content}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
