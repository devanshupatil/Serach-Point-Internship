import React, { useState, useEffect } from 'react'
import StorageService from './storage'

// ==================== Icons ====================
const Icon = ({ name, filled = false }) => (
  <span 
    className="material-symbols-outlined" 
    style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
  >
    {name}
  </span>
)

// ==================== Sidebar ====================
const Sidebar = ({ currentPage, onNavigate, profile }) => (
  <aside className="sidebar">
    <div className="p-6">
      <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--primary)' }}>
        Glow & Grace
      </h1>
      <div className="mt-6 flex items-center gap-3">
        <div className="avatar">
          <img src={profile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'} alt="Profile" />
        </div>
        <div>
          <p className="text-sm font-bold">{profile?.name || 'Alexandra Chen'}</p>
          <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--on-surface-variant)' }}>Premium Member</p>
        </div>
      </div>
    </div>
    
    <nav className="flex-1 px-3 py-4">
      {[
        { id: 'home', icon: 'home', label: 'Home' },
        { id: 'search', icon: 'search', label: 'Search' },
        { id: 'bookings', icon: 'calendar_today', label: 'Bookings' },
        { id: 'profile', icon: 'person', label: 'Profile' },
      ].map(item => (
        <a
          key={item.id}
          href="#"
          className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
        >
          <Icon name={item.icon} filled={currentPage === item.id} />
          <span className="text-sm font-semibold">{item.label}</span>
        </a>
      ))}
    </nav>
    
    <div className="p-4 border-t border-outline-light">
      <a href="#" className="nav-link">
        <Icon name="help" />
        <span className="text-sm font-semibold">Help Center</span>
      </a>
      <a href="#" className="nav-link">
        <Icon name="logout" />
        <span className="text-sm font-semibold">Sign Out</span>
      </a>
    </div>
  </aside>
)

// ==================== Mobile Header ====================
const MobileHeader = ({ onMenuToggle, profile }) => (
  <header className="mobile-header">
    <div className="flex items-center gap-3">
      <button onClick={onMenuToggle} className="p-2 rounded-lg" style={{ background: 'var(--surface-low)' }}>
        <Icon name="menu" />
      </button>
      <h1 className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--primary)' }}>
        Glow & Grace
      </h1>
    </div>
      <div className="avatar">
        <img src={profile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'} alt="Profile" />
      </div>
  </header>
)

// ==================== Mobile Menu ====================
const MobileMenu = ({ isOpen, onClose, currentPage, onNavigate, profile }) => {
  if (!isOpen) return null;
  
  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu-panel slide-in" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'var(--primary)' }}>
            Glow & Grace
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <div className="avatar" style={{ width: 48, height: 48 }}>
              <img src={profile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'} alt="Profile" />
            </div>
            <div>
              <p className="text-sm font-bold">{profile?.name || 'Alexandra Chen'}</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--on-surface-variant)' }}>Premium Member</p>
            </div>
          </div>
        </div>
        
        <nav className="px-3 py-4">
          {[
            { id: 'home', icon: 'home', label: 'Home' },
            { id: 'search', icon: 'search', label: 'Search' },
            { id: 'bookings', icon: 'calendar_today', label: 'Bookings' },
            { id: 'profile', icon: 'person', label: 'Profile' },
          ].map(item => (
            <a
              key={item.id}
              href="#"
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); onNavigate(item.id); onClose(); }}
            >
              <Icon name={item.icon} filled={currentPage === item.id} />
              <span className="text-sm font-semibold">{item.label}</span>
            </a>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-light">
          <a href="#" className="nav-link">
            <Icon name="help" />
            <span className="text-sm font-semibold">Help Center</span>
          </a>
          <a href="#" className="nav-link">
            <Icon name="logout" />
            <span className="text-sm font-semibold">Sign Out</span>
          </a>
        </div>
      </div>
    </div>
  )
}

// ==================== Bottom Navigation ====================
const BottomNav = ({ currentPage, onNavigate }) => (
  <nav className="bottom-nav">
    {[
      { id: 'home', icon: 'home', label: 'Home' },
      { id: 'search', icon: 'search', label: 'Search' },
      { id: 'bookings', icon: 'calendar_today', label: 'Bookings' },
      { id: 'profile', icon: 'person', label: 'Profile' },
    ].map(item => (
      <a
        key={item.id}
        href="#"
        className={`bottom-nav-item ${currentPage === item.id ? 'active' : ''}`}
        onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
      >
        <Icon name={item.icon} filled={currentPage === item.id} />
        <span>{item.label}</span>
      </a>
    ))}
  </nav>
)

// ==================== Toast ====================
const Toast = ({ message, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className="toast fade-in">
      <Icon name="check_circle" />
      <span>{message}</span>
    </div>
  )
}

// ==================== Home Page ====================
const HomePage = ({ onNavigate, recommendedShops, nearbyShops, profile, searchQuery, setSearchQuery }) => (
  <div className="page-container">
    {/* Desktop Hero */}
    <section className="hero-section hidden lg:flex">
      <div className="hero-bg-circle" />
      <div className="relative" style={{ maxWidth: 600 }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--primary)' }}>
          Monday, October 14
        </p>
        <h2 className="text-4xl font-extrabold leading-tight mb-4">
          Good Morning,<br />{profile?.name || 'Alexandra'}
        </h2>
        <p className="text-lg mb-8" style={{ color: 'var(--on-surface-variant)' }}>
          Your digital concierge has curated today's top aesthetics and wellness destinations tailored to your style.
        </p>
        <div className="flex flex-wrap gap-4 items-center" style={{ maxWidth: 500 }}>
          <div className="flex-1 flex items-center rounded-full px-4 py-3" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <Icon name="search" />
            <input 
              className="flex-1 bg-transparent ml-3" 
              placeholder="Find a service or salon..."
              value={searchQuery || ''}
              onChange={(e) => {
                setSearchQuery?.(e.target.value);
                onNavigate?.('search');
              }}
            />
          </div>
          <button className="chip chip-primary shadow-primary btn-press" style={{ padding: '0.75rem 2rem', fontSize: '0.875rem' }} onClick={() => onNavigate?.('search')}>
            Explore Now
          </button>
        </div>
      </div>
    </section>
    
    {/* Mobile Hero */}
    <section className="pt-20 px-4 pb-6 lg:hidden" style={{ background: 'linear-gradient(135deg, var(--primary-bg), var(--surface))' }}>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--primary)', opacity: 0.7 }}>
        Welcome back
      </p>
      <h2 className="text-2xl font-bold">Good Morning, {profile?.name || 'Alexandra'}</h2>
      <p className="text-sm font-medium mt-1" style={{ color: 'var(--on-surface-variant)' }}>
        Ready for your self-care Monday?
      </p>
    </section>

    {/* Search & Filter (Mobile) */}
    <section className="px-4 py-4 lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center rounded-2xl px-4 py-3" style={{ background: 'var(--surface-low)' }}>
          <Icon name="search" />
          <input 
            className="flex-1 bg-transparent text-sm font-medium ml-2" 
            placeholder="Find hair, nails, or spa..."
            value={searchQuery || ''}
            onChange={(e) => {
              setSearchQuery?.(e.target.value);
              onNavigate?.('search');
            }}
          />
        </div>
        <button className="p-3.5 rounded-2xl btn-press" style={{ background: 'var(--primary)', color: 'white' }} onClick={() => onNavigate?.('search')}>
          <Icon name="tune" />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar mt-4 py-1">
        <span className="chip chip-primary">All Services</span>
        <span className="chip chip-secondary">Hair</span>
        <span className="chip chip-secondary">Nails</span>
        <span className="chip chip-secondary">Facial</span>
        <span className="chip chip-secondary">Massage</span>
      </div>
    </section>

    <div className="page-content space-y-8">
      {/* Recommended Section */}
      <section className="space-y-4">
        <div className="section-header">
          <h3 className="text-xl lg:text-2xl font-bold">Recommended for You</h3>
          <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>View All</span>
        </div>
        
        <div className="scroll-container">
          {recommendedShops.map(salon => (
            <div key={salon.id} className="scroll-item">
              <div className="salon-card" onClick={() => { onNavigate('shop-detail'); localStorage.setItem('currentShopId', salon.id); }}>
                <div className="salon-card-image">
                  <img src={salon.img} alt={salon.name} />
                  {salon.id === '1' && (
                    <span 
                      className="chip absolute top-3 left-3" 
                      style={{ 
                        fontSize: '0.625rem', 
                        background: 'var(--primary)',
                        color: 'white'
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>
                <div className="salon-card-content">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-base leading-tight">{salon.name}</h4>
                    <div className="flex items-center" style={{ color: 'var(--tertiary)' }}>
                      <Icon name="star" filled />
                      <span className="text-xs font-bold ml-0.5">{salon.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{salon.type}</span>
                    <span className="font-bold">{salon.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Near You Section */}
      <section className="p-4 lg:p-8 rounded-3xl" style={{ background: 'var(--surface-low)' }}>
        <div className="section-header">
          <h3 className="text-xl lg:text-2xl font-bold">Near You</h3>
          <div className="flex items-center text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>
            <Icon name="location_on" />
            <span>Downtown, NY</span>
          </div>
        </div>
        
        <div className="space-y-4 mt-4">
          {nearbyShops.map((salon, idx) => (
            <div 
              key={salon.id} 
              className="flex items-center gap-4 p-4 rounded-2xl card-hover cursor-pointer" 
              style={{ background: 'var(--surface-lowest)' }}
              onClick={() => { onNavigate('shop-detail'); localStorage.setItem('currentShopId', salon.id); }}
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img src={salon.img} alt={salon.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold">{salon.name}</h4>
                  <span className="price-badge">{salon.price}</span>
                </div>
                <div className="flex items-center gap-3 text-sm mt-1" style={{ color: 'var(--on-surface-variant)' }}>
                  <div className="flex items-center" style={{ color: 'var(--tertiary)' }}>
                    <Icon name="star" filled />
                    <span className="text-xs">{salon.rating}</span>
                  </div>
                  <span style={{ color: 'var(--outline)' }}>•</span>
                  <span className="text-xs">{salon.distance} km away</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {salon.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#eadaf6', color: 'var(--secondary)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
)

// ==================== Shop Detail Page ====================
const ShopDetailPage = ({ onNavigate, shops }) => {
  const shopId = localStorage.getItem('currentShopId');
  const shop = shops?.find(s => s.id === shopId) || shops?.[0];
  
  const services = [
    { icon: 'content_cut', name: 'Signature Haircut', desc: 'Precision cut with scalp massage & blow-out', price: '$45' },
    { icon: 'palette', name: 'Balayage / Ombre', desc: 'Hand-painted highlights for natural dimension', price: '$120+' },
    { icon: 'spa', name: 'Deep Conditioning Ritual', desc: 'Revitalize with premium essential oils', price: '$65' },
  ];
  
  const similarShops = shops?.filter(s => s.id !== shop?.id).slice(0, 2) || [];
  
  if (!shop) return null;
  
  return (
    <div className="page-container">
    {/* Hero */}
    <section className="shop-hero">
      <img 
        src={shop.img} 
        alt={shop.name} 
        className="w-full h-full object-cover"
      />
      <div className="shop-hero-overlay" />
      <button 
        className="fab absolute" 
        style={{ top: '1.5rem', left: '1.5rem' }}
        onClick={() => onNavigate('home')}
      >
        <Icon name="arrow_back" />
      </button>
      <button className="fab absolute" style={{ top: '1.5rem', right: '1.5rem' }}>
        <Icon name="favorite_border" />
      </button>
    </section>
    
    {/* Shop Info */}
    <section className="px-4 lg:px-8 pb-8" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
      <div className="rounded-t-3xl lg:rounded-t-2xl p-6 lg:p-10" style={{ background: 'var(--surface)' }}>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div>
            <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">{shop.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center" style={{ color: 'var(--tertiary)' }}>
                <Icon name="star" filled />
                <span className="font-bold text-sm">{shop.rating}</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--on-surface-variant)', opacity: 0.6 }}>Reviews</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-extrabold" style={{ color: 'var(--primary)' }}>{shop.price}</span>
            <span className="text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--on-surface-variant)', opacity: 0.7 }}>{shop.type}</span>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 overflow-x-auto hide-scrollbar">
          {[
            { icon: 'location_on', value: `${shop.distance} km`, label: 'Distance' },
            { icon: 'schedule', value: shop.waitTime || '15 min', label: 'Wait Time' },
            { icon: 'verified', value: 'Top Rated', label: 'Badge' },
          ].map((stat, idx) => (
            <div key={idx} className="quick-stat">
              <Icon name={stat.icon} />
              <span className="text-xs font-bold">{stat.value}</span>
              <span className="text-[10px] uppercase tracking-tighter" style={{ color: 'var(--on-surface-variant)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 mt-6 overflow-x-auto hide-scrollbar">
          {shop.tags?.map((tag, idx) => (
            <span key={idx} className="chip chip-secondary">{tag}</span>
          ))}
        </div>
      </div>
    </section>
    
    {/* Services */}
    <section className="px-4 lg:px-8 py-6">
      <h2 className="text-xl lg:text-2xl font-bold flex items-center justify-between mb-4">
        Our Services
        <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>View Menu</span>
      </h2>
      
      <div className="space-y-4">
        {services.map((service, idx) => (
          <div key={idx} className="service-card" onClick={() => { localStorage.setItem('currentService', JSON.stringify(service)); onNavigate('booking'); }}>
            <div className="service-icon">
              <Icon name={service.icon} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{service.name}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--on-surface-variant)' }}>{service.desc}</p>
                </div>
                <span className="text-lg font-extrabold">{service.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    
    {/* You May Also Like */}
    <section className="px-4 lg:px-8 py-6">
      <h2 className="text-xl lg:text-2xl font-bold mb-4">You May Also Like</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
        {similarShops.map((salon, idx) => (
          <div key={salon.id} className="flex-shrink-0 w-[260px] lg:w-[300px] cursor-pointer" onClick={() => { localStorage.setItem('currentShopId', salon.id); onNavigate('shop-detail'); }}>
            <div className="relative h-40 rounded-2xl overflow-hidden mb-3 card-hover">
              <img src={salon.img} alt={salon.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: 'var(--shadow-soft)' }}>
                <Icon name="star" filled />
                <span className="text-[10px] font-bold">{salon.rating}</span>
              </div>
            </div>
            <h3 className="font-bold text-lg">{salon.name}</h3>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--on-surface-variant)' }}>
              <span>{salon.price}</span><span>•</span><span>{salon.distance} km</span>
            </div>
          </div>
        ))}
      </div>
    </section>
    
    <div className="h-24 lg:hidden" />
  </div>
  )
}

// ==================== Booking Page ====================
const BookingPage = ({ onNavigate, onConfirm, shops }) => {
  const shopId = localStorage.getItem('currentShopId');
  const shop = shops?.find(s => s.id === shopId) || shops?.[0];
  const serviceData = JSON.parse(localStorage.getItem('currentService') || '{}');
  
  const service = serviceData.name ? serviceData : { name: 'Signature Haircut', desc: 'Precision cut with styling', price: '$45', duration: '45 mins' };
  const priceNum = parseInt(service.price.replace(/[^0-9]/g, '')) || 45;
  const tax = priceNum * 0.08;
  const total = priceNum + tax;
  
  return (
    <div className="page-container">
    <header className="sticky top-0 lg:top-0 bg-surface/95 backdrop-filter z-30 px-4 py-3 flex items-center gap-4 border-b border-outline-light">
      <button onClick={() => onNavigate('shop-detail')} className="p-2 rounded-lg" style={{ background: 'var(--surface-low)' }}>
        <Icon name="arrow_back" />
      </button>
      <h1 className="text-lg font-bold">Book Appointment</h1>
    </header>
    
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex justify-between items-center px-2">
        <div className="progress-step">
          <div className="progress-dot active">1</div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>Service</span>
        </div>
        <div className="progress-line active" />
        <div className="progress-step">
          <div className="progress-dot active">2</div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>DateTime</span>
        </div>
        <div className="progress-line" />
        <div className="progress-step">
          <div className="progress-dot inactive">3</div>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Confirm</span>
        </div>
      </div>
      
      {/* Service Header */}
      <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'var(--surface-low)' }}>
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <img src={shop?.img || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop'} alt="Salon" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="font-bold">{shop?.name || 'Salon'}</h2>
          <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{shop?.address || 'Location'}</p>
        </div>
      </div>
      
      {/* Selected Service */}
      <div className="p-5 rounded-2xl shadow-soft" style={{ background: 'var(--surface-lowest)' }}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>{service.name}</span>
            <span className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{service.duration || '45 mins'} • Senior Stylist</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">{service.price}</span>
            <div className="text-xs font-semibold flex items-center gap-1 justify-end mt-1 cursor-pointer" style={{ color: 'var(--primary)' }}>
              <Icon name="edit" />
              Change
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Select Date</h3>
          <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>October 2024</span>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar p-4 rounded-2xl" style={{ background: 'var(--surface-low)' }}>
          {['Mon 14', 'Tue 15', 'Wed 16', 'Thu 17', 'Fri 18', 'Sat 19'].map((date, idx) => (
            <button key={idx} className={`date-btn ${idx === 1 ? 'selected' : ''}`}>
              <span className="text-[10px] font-bold uppercase" style={{ color: idx === 1 ? 'white' : 'var(--on-surface-variant)' }}>
                {date.split(' ')[0]}
              </span>
              <span className="text-base font-bold">{date.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </section>
      
      {/* Time Slots */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Available Times</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { time: '09:00 AM', disabled: false },
            { time: '10:30 AM', disabled: false },
            { time: '11:30 AM', disabled: false, selected: true },
            { time: '01:00 PM', disabled: false },
            { time: '02:30 PM', disabled: false },
            { time: '04:00 PM', disabled: true },
          ].map((slot, idx) => (
            <button key={idx} className={`time-slot ${slot.selected ? 'selected' : ''} ${slot.disabled ? 'disabled' : ''}`}>
              {slot.time}
            </button>
          ))}
        </div>
      </section>
      
      {/* Summary */}
      <section className="p-5 rounded-3xl" style={{ background: 'var(--surface-high)' }}>
        <h3 className="font-bold mb-4">Payment Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--on-surface-variant)' }}>{service.name}</span>
            <span className="font-semibold">{service.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--on-surface-variant)' }}>Service Tax (8%)</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="h-px" style={{ background: 'var(--outline-light)' }} />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </section>
    </div>
    
    {/* Bottom CTA */}
    <div className="fixed bottom-0 left-0 right-0 p-4 glass-effect border-t z-40 lg:hidden border-outline-light">
      <button 
        onClick={() => onConfirm({ shopId: shop?.id, shopName: shop?.name, service: service.name, date: 'Oct 24, 2024', time: '11:30 AM', price: service.price, img: shop?.img })}
        className="w-full py-4 rounded-full font-extrabold text-base shadow-primary btn-press flex items-center justify-center gap-2"
        style={{ background: 'var(--primary)', color: 'white' }}
      >
        Confirm Booking
        <Icon name="chevron_right" />
      </button>
    </div>
    
    <div className="desktop-cta">
      <button 
        onClick={() => onConfirm({ shopId: shop?.id, shopName: shop?.name, service: service.name, date: 'Oct 24, 2024', time: '11:30 AM', price: service.price, img: shop?.img })}
        className="py-4 px-8 rounded-full font-extrabold text-base shadow-primary btn-press flex items-center justify-center gap-2"
        style={{ background: 'var(--primary)', color: 'white' }}
      >
        Confirm Booking
        <Icon name="chevron_right" />
      </button>
    </div>
    
    <div className="h-24 lg:hidden" />
  </div>
  )
}

// ==================== Bookings List Page ====================
const BookingsPage = ({ bookings }) => {
  const upcomingBookings = bookings?.filter(b => b.status === 'confirmed' || b.status === 'pending') || [];
  const pastBookings = bookings?.filter(b => b.status === 'completed' || b.status === 'cancelled') || [];
  
  return (
    <div className="page-container">
      <header className="sticky top-0 lg:top-0 bg-surface/95 backdrop-filter z-30 px-4 lg:px-8 py-4 border-b border-outline-light">
        <h1 className="text-2xl lg:text-3xl font-extrabold">My Bookings</h1>
        <p className="text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>
          Manage your self-care journey and history.
        </p>
      </header>
      
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto space-y-8">
        {/* Upcoming */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Upcoming Appointments</h3>
            <span className="badge badge-success">{upcomingBookings.length} Active</span>
          </div>
          
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="p-5 rounded-2xl shadow-soft card-hover" style={{ background: 'var(--surface-lowest)' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden">
                        <img src={booking.img || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop'} alt="Salon" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold">{booking.shopName}</h4>
                        <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{booking.service}</p>
                      </div>
                    </div>
                    <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                      <Icon name={booking.status === 'confirmed' ? 'check_circle' : 'pending'} filled />
                      {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-xl" style={{ background: 'var(--surface-low)' }}>
                    <div className="flex items-center gap-2">
                      <Icon name="calendar_today" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--on-surface-variant)' }}>Date</p>
                        <p className="text-sm font-semibold">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-l pl-3" style={{ borderColor: 'var(--outline-light)' }}>
                      <Icon name="schedule" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--on-surface-variant)' }}>Time</p>
                        <p className="text-sm font-semibold">{booking.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 py-3 rounded-full font-bold text-sm shadow-primary btn-press" style={{ background: 'var(--primary)', color: 'white' }}>
                      Reschedule
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-full btn-press" style={{ background: 'var(--surface-high)', color: 'var(--primary)' }}>
                      <Icon name="directions" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 rounded-2xl" style={{ background: 'var(--surface-low)' }}>
              <Icon name="event_available" style={{ fontSize: 48, color: 'var(--on-surface-variant)', opacity: 0.5 }} />
              <p className="mt-4 font-medium" style={{ color: 'var(--on-surface-variant)' }}>No upcoming appointments</p>
            </div>
          )}
        </section>
        
        {/* History */}
        <section>
          <h3 className="text-lg font-bold mb-4">Booking History</h3>
          
          {pastBookings.length > 0 ? (
            <div className="space-y-3">
              {pastBookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-4 rounded-2xl" 
                  style={{ background: 'var(--surface-low)', opacity: booking.status === 'cancelled' ? 0.7 : 0.8 }}
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-11 h-11 rounded-lg overflow-hidden opacity-80">
                      <img src={booking.img || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&h=150&fit=crop'} alt="Salon" className="w-full h-full object-cover" style={{ filter: booking.status === 'cancelled' ? 'grayscale(100%)' : 'grayscale(30%)' }} />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm">{booking.shopName}</h5>
                      <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{booking.service} • {booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>
                      {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                    {booking.status === 'completed' && (
                      <button className="px-4 py-2 rounded-full font-bold text-[11px] uppercase tracking-wider btn-press" style={{ background: 'var(--surface-highest)', color: 'var(--primary)' }}>
                        Rebook
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 rounded-2xl" style={{ background: 'var(--surface-low)' }}>
              <p style={{ color: 'var(--on-surface-variant)' }}>No booking history</p>
            </div>
          )}
        </section>
      </div>
      
      <div className="h-24 lg:hidden" />
    </div>
  )
}

// ==================== Profile Page ====================
const ProfilePage = ({ profile, onUpdateProfile, onUpdatePreferences, notifications, setToastMessage, setShowToast }) => {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  if (!profile) return null;
  
  const preferences = profile.preferences || {};
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  const handleSaveProfile = () => {
    onUpdateProfile(editForm);
    setShowEditProfile(false);
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  
  const openEditProfile = () => {
    setEditForm({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      avatar: profile.avatar || '',
    });
    setShowEditProfile(true);
  };
  
  const availableServices = ['Balayage', 'Facial', 'Manicure', 'Spa Therapy', 'Haircut', 'Massage', 'Pedicure', 'Color', 'Styling'];
  const [selectedServices, setSelectedServices] = useState(preferences.favoriteServices || []);
  
  const toggleService = (service) => {
    const current = selectedServices;
    const updated = current.includes(service) ? current.filter(s => s !== service) : [...current, service];
    setSelectedServices(updated);
    onUpdatePreferences({ favoriteServices: updated });
  };
  
  return (
    <div className="page-container">
      <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto space-y-8">
        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowEditProfile(false)} />
            <div className="relative w-full max-w-md rounded-3xl p-6" style={{ background: 'var(--surface)' }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Edit Profile</h3>
                <button onClick={() => setShowEditProfile(false)} className="p-2 rounded-lg" style={{ background: 'var(--surface-low)' }}>
                  <Icon name="close" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="avatar" style={{ width: 80, height: 80 }}>
                    <img src={editForm.avatar || profile?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'} alt="Profile" />
                  </div>
                  <label className="mt-3 px-4 py-2 text-sm font-semibold rounded-full cursor-pointer" style={{ color: 'var(--primary)', background: 'var(--primary-bg)' }}>
                    Change Photo
                    <input 
                      type="file" 
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setEditForm({ ...editForm, avatar: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <p className="mt-2 text-xs" style={{ color: 'var(--on-surface-variant)' }}>or enter URL below</p>
                  <input 
                    type="text" 
                    className="w-full mt-1 p-2 rounded-xl text-sm" 
                    style={{ background: 'var(--surface-low)', border: '1px solid var(--outline-light)', color: 'var(--on-surface)', fontFamily: 'inherit' }}
                    placeholder="Paste image URL here"
                    value={editForm.avatar || ''}
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Name</label>
                  <input 
                    type="text" 
                    className="w-full mt-2 p-3 rounded-xl" 
                    style={{ background: 'var(--surface-low)', border: '1px solid var(--outline-light)', color: 'var(--on-surface)', fontFamily: 'inherit' }}
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Email</label>
                  <input 
                    type="email" 
                    className="w-full mt-2 p-3 rounded-xl" 
                    style={{ background: 'var(--surface-low)', border: '1px solid var(--outline-light)', color: 'var(--on-surface)', fontFamily: 'inherit' }}
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Phone</label>
                  <input 
                    type="tel" 
                    className="w-full mt-2 p-3 rounded-xl" 
                    style={{ background: 'var(--surface-low)', border: '1px solid var(--outline-light)', color: 'var(--on-surface)', fontFamily: 'inherit' }}
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  className="flex-1 py-3 rounded-full font-bold"
                  style={{ background: 'var(--surface-low)', color: 'var(--on-surface-variant)' }}
                  onClick={() => setShowEditProfile(false)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 rounded-full font-bold"
                  style={{ background: 'var(--primary)', color: 'white' }}
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowNotifications(false)} />
            <div className="relative w-full max-w-md rounded-3xl p-6 max-h-[80vh] overflow-hidden flex flex-col" style={{ background: 'var(--surface)' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="p-2 rounded-lg" style={{ background: 'var(--surface-low)' }}>
                  <Icon name="close" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {notifications?.length > 0 ? notifications.map(n => (
                  <div key={n.id} className={`p-4 rounded-2xl ${n.read ? 'opacity-60' : ''}`} style={{ background: n.read ? 'var(--surface-low)' : 'var(--surface-lowest)' }}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${n.type === 'success' ? 'bg-green-100' : n.type === 'offer' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                        <Icon name={n.type === 'success' ? 'check_circle' : n.type === 'offer' ? 'local_offer' : 'notifications'} style={{ fontSize: 16, color: n.type === 'success' ? '#22c55e' : n.type === 'offer' ? '#a855f7' : '#3b82f6' }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{n.title}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--on-surface-variant)' }}>{n.message}</p>
                        <p className="text-[10px] mt-2" style={{ color: 'var(--on-surface-variant)', opacity: 0.7 }}>
                          {new Date(n.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <Icon name="notifications_off" style={{ fontSize: 48, color: 'var(--on-surface-variant)', opacity: 0.5 }} />
                    <p className="mt-4" style={{ color: 'var(--on-surface-variant)' }}>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Header */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--on-surface-variant)', opacity: 0.7 }}>
                Member Since {profile.memberSince || '2023'}
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">{profile.name || 'User'}</h2>
              <p className="mt-2 max-w-xs" style={{ color: 'var(--on-surface-variant)' }}>
                {profile.email || 'Curating your personal beauty journey with bespoke recommendations.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                className="relative p-3 rounded-full btn-press" 
                style={{ background: 'var(--surface-low)' }}
                onClick={() => setShowNotifications(true)}
              >
                <Icon name="notifications" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'var(--error)', color: 'white' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              <button className="py-2.5 px-6 rounded-full font-semibold shadow-primary btn-press" style={{ background: 'var(--primary)', color: 'white' }} onClick={openEditProfile}>
                Edit Profile
              </button>
            </div>
          </div>
        </section>
        
        {/* Preferences */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Icon name="auto_awesome" />
            <h3 className="text-lg font-bold">Personal Preferences</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl" style={{ background: 'var(--surface-low)' }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Price Range</span>
                <span className="font-bold" style={{ color: 'var(--primary)' }}>{'$'.repeat(preferences.priceRange || 3)}</span>
              </div>
              <input 
                type="range" 
                className="w-full" 
                value={preferences.priceRange || 3} 
                min={1} 
                max={4} 
                style={{ accentColor: 'var(--primary)' }}
                onChange={(e) => onUpdatePreferences({ priceRange: parseInt(e.target.value) })}
              />
              <p className="text-[10px] mt-3 leading-tight" style={{ color: 'var(--on-surface-variant)' }}>
                Optimizing recommendations for luxury and premium services.
              </p>
            </div>
            
            <div className="p-5 rounded-2xl" style={{ background: 'var(--surface-low)' }}>
              <span className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: 'var(--on-surface-variant)' }}>Frequent Services (tap to toggle)</span>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((service, i) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <span 
                      key={i} 
                      className={`chip ${isSelected ? 'chip-primary' : 'chip-secondary'} cursor-pointer`}
                      onClick={() => toggleService(service)}
                    >
                      {service}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl" style={{ background: 'var(--surface-low)' }}>
            <span className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: 'var(--on-surface-variant)' }}>Ideal Booking Times</span>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {['Morning', 'Afternoon', 'Evening'].map(slot => {
                const isSelected = (preferences.idealTimeSlots || ['Afternoon']).includes(slot);
                return (
                  <div 
                    key={slot}
                    className="flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
                    style={{ 
                      background: isSelected ? 'var(--primary)' : 'var(--surface-lowest)', 
                      border: '1px solid var(--outline-light)',
                      color: isSelected ? 'white' : 'inherit'
                    }}
                    onClick={() => {
                      const current = preferences.idealTimeSlots || ['Afternoon'];
                      const updated = current.includes(slot) ? current.filter(s => s !== slot) : [...current, slot];
                      onUpdatePreferences({ idealTimeSlots: updated });
                    }}
                  >
                    <Icon name={slot === 'Morning' ? 'wb_twilight' : slot === 'Afternoon' ? 'light_mode' : 'dark_mode'} />
                    <span className="text-xs font-bold">{slot}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Icon name="settings" />
            <h3 className="text-lg font-bold">Account Settings</h3>
          </div>
          
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-left">
                <div className="settings-icon"><Icon name="payments" /></div>
                <span className="font-semibold text-sm">Payment Methods</span>
              </div>
              <Icon name="chevron_right" />
            </div>
            <div className="settings-divider" />
            <div className="settings-item" style={{ background: 'var(--surface-high)' }}>
              <div className="settings-item-left">
                <div className="settings-icon"><Icon name="notifications_active" /></div>
                <div>
                  <span className="font-semibold text-sm block">Smart Notifications</span>
                  <span className="text-[10px]" style={{ color: 'var(--on-surface-variant)' }}>Personalized appointment reminders</span>
                </div>
              </div>
              <div className={`toggle-switch ${notificationsOn ? '' : 'off'}`} onClick={() => setNotificationsOn(!notificationsOn)} />
            </div>
            <div className="settings-divider" />
            <div className="settings-item">
              <div className="settings-item-left">
                <div className="settings-icon"><Icon name="help_center" /></div>
                <span className="font-semibold text-sm">Help & Concierge</span>
              </div>
              <Icon name="chevron_right" />
            </div>
            <div className="settings-divider" />
            <div className="settings-item" onClick={() => confirm('Are you sure you want to log out?')}>
              <div className="settings-item-left">
                <div className="settings-icon" style={{ color: 'var(--error)' }}><Icon name="logout" /></div>
                <span className="font-semibold text-sm" style={{ color: 'var(--error)' }}>Log Out</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Branding */}
        <footer className="text-center py-6" style={{ opacity: 0.3 }}>
          <Icon name="spa" />
          <p className="text-xs font-bold uppercase tracking-widest">Glow & Grace</p>
          <p className="text-[10px] mt-1">v2.4.0 — Premium Discovery</p>
        </footer>
      </div>
      
      <div className="h-24 lg:hidden" />
    </div>
  )
}

// ==================== Search Page ====================
const SearchPage = ({ onNavigate, shops, externalSearchQuery, setExternalSearchQuery }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('');

  useEffect(() => {
    if (externalSearchQuery) {
      setSearchQuery(externalSearchQuery);
      setExternalSearchQuery?.('');
    }
  }, [externalSearchQuery]);
  const [filteredShops, setFilteredShops] = useState([]);
  
  React.useEffect(() => {
    let results = [...shops];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.type.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
      results = results.filter(s => s.type === selectedCategory);
    }
    
    if (selectedPrice) {
      results = results.filter(s => s.price === selectedPrice);
    }
    
    setFilteredShops(results);
  }, [searchQuery, selectedCategory, selectedPrice, shops]);
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPrice('');
  };
  
  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedPrice;
  
  return (
    <div className="page-container">
      <header className="sticky top-0 lg:top-0 bg-surface/95 backdrop-filter z-30 px-4 py-4 border-b border-outline-light">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center rounded-2xl px-4 py-3" style={{ background: 'var(--surface-low)' }}>
            <Icon name="search" />
            <input 
              id="searchInput"
              className="flex-1 bg-transparent text-sm font-medium ml-2" 
              placeholder="Search salons, services..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-3 rounded-2xl" style={{ background: 'var(--surface-low)' }} onClick={clearFilters}>
            <Icon name="close" />
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-4 py-1">
          {['All', 'Hair', 'Nails', 'Spa', 'Barbers', 'Facial', 'Massage'].map(cat => (
            <span 
              key={cat} 
              className={`chip ${selectedCategory === cat ? 'chip-primary' : 'chip-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar">
          <button 
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${selectedPrice === '$' ? '' : 'bg-surface-low'}`}
            style={selectedPrice === '$' ? { background: 'var(--primary)', color: 'white' } : {}}
            onClick={() => setSelectedPrice(selectedPrice === '$' ? '' : '$')}
          >
            $
          </button>
          <button 
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${selectedPrice === '$$' ? '' : 'bg-surface-low'}`}
            style={selectedPrice === '$$' ? { background: 'var(--primary)', color: 'white' } : {}}
            onClick={() => setSelectedPrice(selectedPrice === '$$' ? '' : '$$')}
          >
            $$
          </button>
          <button 
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${selectedPrice === '$$$' ? '' : 'bg-surface-low'}`}
            style={selectedPrice === '$$$' ? { background: 'var(--primary)', color: 'white' } : {}}
            onClick={() => setSelectedPrice(selectedPrice === '$$$' ? '' : '$$$')}
          >
            $$$
          </button>
          {hasActiveFilters && (
            <button className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1" style={{ color: 'var(--primary)' }} onClick={clearFilters}>
              <Icon name="filter_alt_off" style={{ fontSize: 14 }} />
              Clear
            </button>
          )}
        </div>
      </header>
      
      <div className="px-4 py-6 space-y-4 max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{hasActiveFilters ? `Results (${filteredShops.length})` : 'Popular Searches'}</h3>
          {hasActiveFilters && (
            <span className="text-xs font-medium" style={{ color: 'var(--on-surface-variant)' }}>
              {filteredShops.length} shops found
            </span>
          )}
        </div>
        
        {filteredShops.length > 0 ? (
          <div className="space-y-4">
            {filteredShops.map((salon, idx) => (
              <div 
                key={salon.id}
                className="flex items-center gap-4 p-4 rounded-2xl card-hover cursor-pointer" 
                style={{ background: 'var(--surface-low)' }}
                onClick={() => { onNavigate('shop-detail'); localStorage.setItem('currentShopId', salon.id); }}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img src={salon.img} alt={salon.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{salon.name}</h4>
                  <p className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{salon.distance} km away • {salon.price}</p>
                </div>
                <div className="flex items-center" style={{ color: 'var(--tertiary)' }}>
                  <Icon name="star" filled />
                  <span className="text-xs font-bold ml-0.5">{salon.rating}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="search_off" style={{ fontSize: 48, color: 'var(--on-surface-variant)', opacity: 0.5 }} />
            <p className="mt-4 font-medium" style={{ color: 'var(--on-surface-variant)' }}>No shops found</p>
            <p className="text-sm" style={{ color: 'var(--on-surface-variant)', opacity: 0.7 }}>Try adjusting your filters</p>
          </div>
        )}
      </div>
      
      <div className="h-24 lg:hidden" />
    </div>
  )
}

// ==================== Main App ====================
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [shops, setShops] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    StorageService.initializeData?.();
    setShops(StorageService.getShops());
    setBookings(StorageService.getBookings());
    setProfile(StorageService.getProfile());
    setNotifications(StorageService.getNotifications());
  }, []);
  
  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleConfirmBooking = (bookingData) => {
    const newBooking = StorageService.addBooking(bookingData);
    setBookings(StorageService.getBookings());
    
    StorageService.addNotification({
      title: 'Booking Confirmed',
      message: `Your appointment at ${bookingData.shopName} is confirmed for ${bookingData.date} at ${bookingData.time}`,
      type: 'success'
    });
    setNotifications(StorageService.getNotifications());
    
    setToastMessage('Booking confirmed! See you soon.');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      handleNavigate('bookings');
    }, 2000);
  };
  
  const updateProfile = (updates) => {
    const updated = StorageService.updateProfile(updates);
    setProfile(updated);
  };
  
  const updatePreferences = (updates) => {
    StorageService.updatePreferences(updates);
    setProfile(StorageService.getProfile());
  };
  
  const getRecommendedShops = () => shops.slice(0, 4);
  const getNearbyShops = () => shops.slice(0, 2);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} shops={shops} recommendedShops={getRecommendedShops()} nearbyShops={getNearbyShops()} profile={profile} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
      case 'shop-detail':
        return <ShopDetailPage onNavigate={handleNavigate} shops={shops} />;
      case 'booking':
        return <BookingPage onNavigate={handleNavigate} onConfirm={handleConfirmBooking} shops={shops} />;
      case 'bookings':
        return <BookingsPage bookings={bookings} />;
      case 'profile':
        return <ProfilePage profile={profile} onUpdateProfile={updateProfile} onUpdatePreferences={updatePreferences} notifications={notifications} setToastMessage={setToastMessage} setShowToast={setShowToast} />;
      case 'search':
        return <SearchPage onNavigate={handleNavigate} shops={shops} externalSearchQuery={searchQuery} setExternalSearchQuery={setSearchQuery} />;
      default:
        return <HomePage onNavigate={handleNavigate} shops={shops} recommendedShops={getRecommendedShops()} nearbyShops={getNearbyShops()} profile={profile} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
    }
  };
  
  return (
    <>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} profile={profile} />
      <MobileHeader onMenuToggle={() => setMobileMenuOpen(true)} profile={profile} />
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        profile={profile}
      />
      
      <main className="main-content">
        <div className="fade-in" key={currentPage}>
          {renderPage()}
        </div>
      </main>
      
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      <Toast message={toastMessage} isVisible={showToast} />
    </>
  );
}

export default App
