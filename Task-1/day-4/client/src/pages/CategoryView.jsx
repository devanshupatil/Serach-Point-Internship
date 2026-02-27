import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItems } from '../services/api';

const CategoryView = () => {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [type]);

  const loadItems = async () => {
    try {
      const response = await getItems({ type });
      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeLabel = () => {
    const labels = {
      image: 'Images',
      document: 'Documents',
      link: 'Links',
      video: 'Videos',
      note: 'Notes'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderImagesGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group"
        >
          <div className="aspect-square bg-slate-100 flex items-center justify-center">
            {item.metadata?.url ? (
              <img
                src={item.metadata.url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl">🖼️</span>
            )}
          </div>
          <div className="p-3">
            <p className="font-medium text-slate-800 truncate text-sm">{item.title}</p>
            <p className="text-xs text-slate-500 mt-1">{formatDate(item.createdAt)}</p>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center py-12 text-slate-500">
          No images yet
        </div>
      )}
    </div>
  );

  const renderDocumentsList = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
      {items.map((item) => (
        <div
          key={item._id}
          className="p-4 flex items-center gap-4 hover:bg-slate-50 transition cursor-pointer"
        >
          <span className="text-2xl">📄</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 truncate">{item.title}</p>
            <p className="text-sm text-slate-500 truncate">{item.content}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">{formatDate(item.createdAt)}</p>
            {item.metadata?.size && (
              <p className="text-xs text-slate-400">{(item.metadata.size / 1024).toFixed(1)} KB</p>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          No documents yet
        </div>
      )}
    </div>
  );

  const renderLinksPreview = () => (
    <div className="grid gap-4">
      {items.map((item) => (
        <a
          key={item._id}
          href={item.content}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition hover:border-blue-300 block"
        >
          <div className="flex items-start gap-4">
            <span className="text-2xl">🔗</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{item.title}</p>
              <p className="text-sm text-blue-600 truncate">{item.content}</p>
              <p className="text-xs text-slate-500 mt-2">{formatDate(item.createdAt)}</p>
            </div>
          </div>
        </a>
      ))}
      {items.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No links yet
        </div>
      )}
    </div>
  );

  const renderVideosEmbedded = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
        >
          <div className="aspect-video bg-slate-900 flex items-center justify-center">
            {item.metadata?.url ? (
              item.metadata.url.includes('youtube') || item.metadata.url.includes('youtu.be') ? (
                <iframe
                  src={item.metadata.url.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  title={item.title}
                />
              ) : (
                <video
                  src={item.metadata.url}
                  controls
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <span className="text-4xl">🎬</span>
            )}
          </div>
          <div className="p-4">
            <p className="font-medium text-slate-800 truncate">{item.title}</p>
            <p className="text-sm text-slate-500 mt-1 truncate">{item.content}</p>
            <p className="text-xs text-slate-400 mt-2">{formatDate(item.createdAt)}</p>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center py-12 text-slate-500">
          No videos yet
        </div>
      )}
    </div>
  );

  const renderNotesList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">📝</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{item.title}</p>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">{item.content}</p>
              <p className="text-xs text-slate-400 mt-3">{formatDate(item.createdAt)}</p>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center py-12 text-slate-500">
          No notes yet
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'image':
        return renderImagesGrid();
      case 'document':
        return renderDocumentsList();
      case 'link':
        return renderLinksPreview();
      case 'video':
        return renderVideosEmbedded();
      case 'note':
        return renderNotesList();
      default:
        return renderDocumentsList();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link
            to="/home"
            className="text-slate-600 hover:text-slate-800"
          >
            ← Back
          </Link>
          <h1 className="text-xl font-bold text-slate-800">
            {getTypeLabel()}
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({items.length} items)
            </span>
          </h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default CategoryView;
