const STORAGE_KEYS = {
  USERS: 'glow_grace_users',
  SHOPS: 'glow_grace_shops',
  BOOKINGS: 'glow_grace_bookings',
  USER_PROFILE: 'glow_grace_user_profile',
  NOTIFICATIONS: 'glow_grace_notifications',
  PREFERENCES: 'glow_grace_preferences',
};

const SERVICE_TYPES = ['Hair', 'Nails', 'Spa', 'Facial', 'Massage', 'Barbers'];
const PRICE_LEVELS = ['$', '$$', '$$$'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Weekend'];

const generateShops = () => [
  { id: '1', name: 'Luxe Artistry Studio', rating: 4.9, type: 'Hair', price: '$$$', distance: 1.2, waitTime: '15 min', tags: ['Hair', 'Color', 'Styling'], img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=300&fit=crop', address: '123 Madison Ave, NY' },
  { id: '2', name: 'The Velvet Touch', rating: 4.7, type: 'Nails', price: '$$', distance: 0.8, waitTime: '10 min', tags: ['Nail Art', 'Manicure', 'Pedicure'], img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=300&fit=crop', address: '456 Fifth Ave, NY' },
  { id: '3', name: 'Serenity Spa & Wellness', rating: 4.8, type: 'Spa', price: '$$$', distance: 1.5, waitTime: '20 min', tags: ['Spa', 'Massage', 'Facial'], img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&h=300&fit=crop', address: '789 Park Ave, NY' },
  { id: '4', name: 'The Grooming Lounge', rating: 4.5, type: 'Barbers', price: '$', distance: 0.5, waitTime: '8 min', tags: ['Haircut', 'Shave', 'Beard'], img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=300&fit=crop', address: '321 Broadway, NY' },
  { id: '5', name: 'Bloom Hair Lab', rating: 4.9, type: 'Hair', price: '$$$', distance: 2.4, waitTime: '25 min', tags: ['Hair', 'Balayage', 'Color'], img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=300&fit=crop', address: '555 Lexington Ave, NY' },
  { id: '6', name: 'Pure Zen Massage', rating: 4.6, type: 'Massage', price: '$$', distance: 1.8, waitTime: '5 min', tags: ['Massage', 'Deep Tissue', 'Acupuncture'], img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&h=300&fit=crop', address: '888 Third Ave, NY' },
  { id: '7', name: 'Glamour Nails Co', rating: 4.4, type: 'Nails', price: '$', distance: 0.9, waitTime: '12 min', tags: ['Nails', 'Gel', 'Acrylic'], img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=300&fit=crop', address: '222 W 42nd St, NY' },
  { id: '8', name: 'Rejuvenate Facial Studio', rating: 4.7, type: 'Facial', price: '$$$', distance: 2.1, waitTime: '18 min', tags: ['Facial', 'Skin Care', 'Anti-Aging'], img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&h=300&fit=crop', address: '777 Seventh Ave, NY' },
  { id: '9', name: 'Urban Cut Barbershop', rating: 4.3, type: 'Barbers', price: '$', distance: 0.6, waitTime: '7 min', tags: ['Barbers', 'Fade', 'Shave'], img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&h=300&fit=crop', address: '444 Canal St, NY' },
  { id: '10', name: 'Tranquil Spa Haven', rating: 4.8, type: 'Spa', price: '$$$', distance: 3.0, waitTime: '15 min', tags: ['Spa', 'Sauna', 'Aromatherapy'], img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&h=300&fit=crop', address: '999 Fifth Ave, NY' },
  { id: '11', name: 'Style Studio Hair', rating: 4.6, type: 'Hair', price: '$$', distance: 1.7, waitTime: '22 min', tags: ['Hair', 'Cut', 'Styling'], img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=300&fit=crop', address: '111 W 57th St, NY' },
  { id: '12', name: 'Nail Art Paradise', rating: 4.5, type: 'Nails', price: '$$', distance: 1.1, waitTime: '14 min', tags: ['Nails', 'Art', 'Design'], img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=300&fit=crop', address: '333 E 23rd St, NY' },
];

const generateBookings = () => [
  { id: 'b1', shopId: '1', shopName: 'Luxe Artistry Studio', service: 'Signature Hydrafacial', date: '2024-10-24', time: '10:30 AM', status: 'confirmed', price: '$85', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop' },
  { id: 'b2', shopId: '2', shopName: 'The Bloom Bar', service: 'Gel Mani + Pedi', date: '2024-11-02', time: '02:15 PM', status: 'pending', price: '$55', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop' },
  { id: 'b3', shopId: '5', shopName: 'Velvet Hair Co.', service: 'Balayage', date: '2024-10-10', time: '11:00 AM', status: 'completed', price: '$180', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop' },
  { id: 'b4', shopId: '6', shopName: 'Pure Zen Massage', service: 'Deep Tissue', date: '2024-09-28', time: '03:00 PM', status: 'cancelled', price: '$90', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop' },
];

const generateNotifications = () => [
  { id: 'n1', title: 'Booking Confirmed', message: 'Your appointment at Lumière Studio is confirmed for Oct 24 at 10:30 AM', type: 'success', read: false, timestamp: Date.now() - 3600000 },
  { id: 'n2', title: 'Special Offer', message: 'Get 20% off on all spa services this weekend!', type: 'offer', read: false, timestamp: Date.now() - 7200000 },
  { id: 'n3', title: 'Reminder', message: 'Don\'t forget your appointment at The Bloom Bar tomorrow at 2:15 PM', type: 'reminder', read: true, timestamp: Date.now() - 86400000 },
];

const defaultProfile = {
  id: 'user1',
  name: 'Alexandra Chen',
  email: 'alexandra.chen@email.com',
  phone: '+1 (555) 123-4567',
  memberSince: '2023',
  membership: 'Premium Member',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  preferences: {
    priceRange: 3,
    favoriteServices: ['Balayage', 'Facial', 'Manicure', 'Spa Therapy'],
    idealTimeSlots: ['Afternoon'],
    location: 'Downtown, NY',
  },
  notificationsEnabled: true,
};

const defaultServices = [
  { id: 's1', shopId: '1', name: 'Signature Haircut', desc: 'Precision cut with scalp massage & blow-out', price: '$45', duration: '45 mins', category: 'Hair' },
  { id: 's2', shopId: '1', name: 'Balayage / Ombre', desc: 'Hand-painted highlights for natural dimension', price: '$120+', duration: '2 hrs', category: 'Hair' },
  { id: 's3', shopId: '1', name: 'Deep Conditioning Ritual', desc: 'Revitalize with premium essential oils', price: '$65', duration: '60 mins', category: 'Spa' },
  { id: 's4', shopId: '2', name: 'Gel Manicure', desc: 'Long-lasting gel polish application', price: '$35', duration: '45 mins', category: 'Nails' },
  { id: 's5', shopId: '2', name: 'Gel Pedicure', desc: 'Luxurious foot care with gel polish', price: '$40', duration: '50 mins', category: 'Nails' },
  { id: 's6', shopId: '3', name: 'Swedish Massage', desc: 'Relaxing full-body massage', price: '$90', duration: '60 mins', category: 'Massage' },
  { id: 's7', shopId: '3', name: 'Deep Tissue Massage', desc: 'Intensive muscle relief therapy', price: '$110', duration: '60 mins', category: 'Massage' },
  { id: 's8', shopId: '4', name: 'Classic Haircut', desc: 'Traditional cut and style', price: '$25', duration: '30 mins', category: 'Barbers' },
  { id: 's9', shopId: '5', name: 'Full Color', desc: 'Complete hair color transformation', price: '$150', duration: '2 hrs', category: 'Hair' },
  { id: 's10', shopId: '6', name: 'Aromatherapy Massage', desc: 'Scented oil relaxation massage', price: '$95', duration: '75 mins', category: 'Massage' },
];

export const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(generateShops()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(generateBookings()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(generateNotifications()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PREFERENCES)) {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(defaultProfile.preferences));
  }
};

export const StorageService = {
  initializeData: () => initializeData(),
  getShops: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]'),
  
  getShopById: (id) => {
    const shops = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]');
    return shops.find(s => s.id === id);
  },
  
  getBookings: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]'),
  
  addBooking: (booking) => {
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    const newBooking = { ...booking, id: 'b' + Date.now(), status: 'confirmed' };
    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  },
  
  getProfile: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || '{}'),
  
  updateProfile: (updates) => {
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || '{}');
    const updated = { ...profile, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    return updated;
  },
  
  getPreferences: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}'),
  
  updatePreferences: (updates) => {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}');
    const updated = { ...prefs, ...updates };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || '{}');
    profile.preferences = { ...profile.preferences, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    
    return updated;
  },
  
  getNotifications: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'),
  
  addNotification: (notification) => {
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const newNotification = { 
      ...notification, 
      id: 'n' + Date.now(), 
      read: false, 
      timestamp: Date.now() 
    };
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return newNotification;
  },
  
  markNotificationRead: (id) => {
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },
  
  getUnreadCount: () => {
    const notifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
    return notifications.filter(n => !n.read).length;
  },
  
  searchShops: (query, filters = {}) => {
    let shops = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPS) || '[]');
    
    if (query) {
      const q = query.toLowerCase();
      shops = shops.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.type.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    if (filters.category && filters.category !== 'All') {
      shops = shops.filter(s => s.type === filters.category);
    }
    
    if (filters.price) {
      shops = shops.filter(s => s.price === filters.price);
    }
    
    if (filters.rating) {
      shops = shops.filter(s => s.rating >= parseFloat(filters.rating));
    }
    
    return shops;
  },
  
  getServicesForShop: (shopId) => {
    return defaultServices.filter(s => s.shopId === shopId);
  },
  
  resetData: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    initializeData();
  },
};

initializeData();

export default StorageService;