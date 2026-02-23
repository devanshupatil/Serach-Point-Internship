import { useEffect, useState } from 'react';

const detectContentType = (mimeType, text) => {
  if (!mimeType && text) {
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return { type: 'link', category: 'Links' };
    }
    return { type: 'note', category: 'Notes' };
  }

  if (mimeType) {
    if (mimeType.startsWith('image/')) {
      return { type: 'image', category: 'Images' };
    }
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) {
      return { type: 'document', category: 'Documents' };
    }
    if (mimeType.startsWith('text/')) {
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        return { type: 'link', category: 'Links' };
      }
      return { type: 'note', category: 'Notes' };
    }
  }

  return { type: 'note', category: 'Notes' };
};

const ShareHandler = ({ onShareReceived }) => {
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    const handleShare = async () => {
      const params = new URLSearchParams(window.location.search);
      const sharedText = params.get('text');
      const sharedType = params.get('type');
      const sharedUrl = params.get('url');

      if (sharedText || sharedUrl || sharedType) {
        const content = sharedText || sharedUrl || '';
        const { type, category } = detectContentType(sharedType, content);
        
        const data = { type, category, content };
        setShareData(data);
        onShareReceived?.(data);
      }
    };

    handleShare();
  }, [onShareReceived]);

  return shareData;
};

export default ShareHandler;
export { detectContentType };
