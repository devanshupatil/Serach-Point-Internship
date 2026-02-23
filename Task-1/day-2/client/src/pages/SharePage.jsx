import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { saveItem } from '../services/api';
import { detectContentType } from '../components/ShareHandler';
import ConfirmationCard from '../components/ConfirmationCard';
import Toast from '../components/Toast';

const SharePage = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [shareData, setShareData] = useState(null);
  const [savedItem, setSavedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    const processShare = async () => {
      const sharedText = searchParams.get('text');
      const sharedType = searchParams.get('type');
      const sharedUrl = searchParams.get('url');

      if (!token) {
        setLoading(false);
        return;
      }

      if (sharedText || sharedUrl) {
        const content = sharedText || sharedUrl || '';
        const data = detectContentType(sharedType, content);
        setShareData(data);
        
        try {
          const item = await saveItem(data.type, data.category, content);
          setSavedItem(item);
          setToast({ visible: true, message: `Saved to ${data.category}`, type: 'success' });
        } catch (error) {
          setToast({ visible: true, message: error.response?.data?.message || 'Save failed', type: 'error' });
        }
      }
      
      setLoading(false);
    };

    processShare();
  }, [searchParams, token]);

  const handleChangeFolder = async () => {
    const categories = ['Images', 'Links', 'Documents', 'Notes'];
    const currentIndex = categories.indexOf(savedItem?.category);
    const nextCategory = categories[(currentIndex + 1) % categories.length];
    
    const typeMap = {
      'Images': 'image',
      'Links': 'link',
      'Documents': 'document',
      'Notes': 'note'
    };

    if (savedItem) {
      setLoading(true);
      try {
        const item = await saveItem(typeMap[nextCategory], nextCategory, shareData.content);
        setSavedItem(item);
        setToast({ visible: true, message: `Moved to ${nextCategory}`, type: 'success' });
      } catch (error) {
        setToast({ visible: true, message: 'Failed to change folder', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-4">Please login to save shared content</p>
          <Link
            to="/login"
            className="inline-block py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:scale-105 transition-transform"
          >
            Go to Login
          </Link>
        </motion.div>
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={toast.visible} 
          onClose={() => setToast({ ...toast, visible: false })} 
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Saving content...</p>
        </motion.div>
      </div>
    );
  }

  if (savedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <ConfirmationCard 
          item={savedItem} 
          onChangeFolder={handleChangeFolder}
          loading={loading}
        />
        <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={toast.visible} 
          onClose={() => setToast({ ...toast, visible: false })} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">KeepBox</h2>
        <p className="text-gray-500 mb-4">Share content from any app to save it here</p>
        <Link
          to="/home"
          className="inline-block py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:scale-105 transition-transform"
        >
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default SharePage;
