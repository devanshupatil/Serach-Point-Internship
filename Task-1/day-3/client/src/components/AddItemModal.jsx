import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveItem, getFolders, saveFolder } from '../services/api';

const AddItemModal = ({ isOpen, onClose, onItemAdded }) => {
  const [activeTab, setActiveTab] = useState('link');
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);

  // Link Form State
  const [linkData, setLinkData] = useState({
    name: '',
    url: '',
    description: '',
    folderId: ''
  });

  // Document Form State
  const [docData, setDocData] = useState({
    name: '',
    type: 'pdf',
    folderId: '',
    file: null
  });

  // Image Form State
  const [imageData, setImageData] = useState({
    name: '',
    note: '',
    folderId: '',
    file: null
  });

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
    }
  }, [isOpen]);

  const fetchFolders = async () => {
    try {
      const data = await getFolders();
      setFolders(data);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folder = await saveFolder({ name: newFolderName });
      setFolders([...folders, folder]);
      setNewFolderName('');
      setShowFolderInput(false);
      
      // Auto select the new folder
      if (activeTab === 'link') setLinkData({ ...linkData, folderId: folder._id });
      else if (activeTab === 'document') setDocData({ ...docData, folderId: folder._id });
      else if (activeTab === 'image') setImageData({ ...imageData, folderId: folder._id });
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let itemData = {};
      
      if (activeTab === 'link') {
        itemData = {
          type: 'link',
          category: 'Links',
          content: linkData.url,
          name: linkData.name,
          description: linkData.description,
          folderId: linkData.folderId
        };
      } else if (activeTab === 'document') {
        itemData = {
          type: 'document',
          category: 'Documents',
          content: docData.file ? docData.file.name : docData.name, // Simulate upload
          name: docData.name,
          fileName: docData.file ? docData.file.name : null,
          fileType: docData.type,
          folderId: docData.folderId
        };
      } else if (activeTab === 'image') {
        itemData = {
          type: 'image',
          category: 'Images',
          content: imageData.file ? 'image-url-placeholder' : 'no-image', // Simulate upload
          name: imageData.name,
          note: imageData.note,
          folderId: imageData.folderId
        };
      }

      await saveItem(itemData);
      onItemAdded();
      onClose();
      // Reset forms
      setLinkData({ name: '', url: '', description: '', folderId: '' });
      setDocData({ name: '', type: 'pdf', folderId: '', file: null });
      setImageData({ name: '', note: '', folderId: '', file: null });
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-xl font-bold text-gray-900">Add New Content</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          {[
            { id: 'link', label: 'Link', icon: '🔗' },
            { id: 'document', label: 'Document', icon: '📄' },
            { id: 'image', label: 'Image', icon: '📸' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"
                />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {activeTab === 'link' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    required
                    type="text"
                    value={linkData.name}
                    onChange={(e) => setLinkData({ ...linkData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="E.g. Portfolio Website"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                  <input
                    required
                    type="url"
                    value={linkData.url}
                    onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <textarea
                    value={linkData.description}
                    onChange={(e) => setLinkData({ ...linkData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                    placeholder="What is this link about?"
                  />
                </div>
              </>
            )}

            {activeTab === 'document' && (
              <>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setDocData({ ...docData, file: e.target.files[0], name: e.target.files[0]?.name || '' })}
                  />
                  <div className="text-4xl mb-2">📤</div>
                  <p className="text-sm text-gray-600">
                    {docData.file ? docData.file.name : 'Click to upload PDF, Word, or PPT'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rename Document</label>
                  <input
                    type="text"
                    value={docData.name}
                    onChange={(e) => setDocData({ ...docData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                  <select
                    value={docData.type}
                    onChange={(e) => setDocData({ ...docData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="pdf">PDF</option>
                    <option value="word">Word</option>
                    <option value="ppt">PowerPoint</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'image' && (
              <>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setImageData({ ...imageData, file: e.target.files[0], name: e.target.files[0]?.name || '' })}
                  />
                  {imageData.file ? (
                    <img 
                      src={URL.createObjectURL(imageData.file)} 
                      alt="Preview" 
                      className="mx-auto max-h-32 rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-sm text-gray-600">Click to upload image</p>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={imageData.name}
                    onChange={(e) => setImageData({ ...imageData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                  <textarea
                    value={imageData.note}
                    onChange={(e) => setImageData({ ...imageData, note: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                    placeholder="Add a note to this image"
                  />
                </div>
              </>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Folder (optional)</label>
                <button
                  type="button"
                  onClick={() => setShowFolderInput(!showFolderInput)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  {showFolderInput ? 'Cancel' : '+ New Folder'}
                </button>
              </div>
              
              {showFolderInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="Folder name"
                  />
                  <button
                    type="button"
                    onClick={handleCreateFolder}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium"
                  >
                    Create
                  </button>
                </div>
              ) : (
                <select
                  value={activeTab === 'link' ? linkData.folderId : activeTab === 'document' ? docData.folderId : imageData.folderId}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (activeTab === 'link') setLinkData({ ...linkData, folderId: val });
                    else if (activeTab === 'document') setDocData({ ...docData, folderId: val });
                    else if (activeTab === 'image') setImageData({ ...imageData, folderId: val });
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">No Folder</option>
                  {folders.map(f => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Save Item'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddItemModal;
