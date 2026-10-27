import React, { useState } from 'react';
import { 
  Compass, Calendar, Calculator, Bed, Sparkles, 
  Search, Heart, Menu, X, Route, Map
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  bookmarkedStates, 
  searchQuery, 
  setSearchQuery, 
  onOpenSavedDrawer 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'states', label: 'Explore 36 Regions', icon: Compass, badge: '36' },
    { id: 'map', label: 'Interactive Map', icon: Map, badge: 'Live', highlight: true },
    { id: 'itinerary', label: 'Trip Planner', icon: Route, badge: 'New' },
    { id: 'seasons', label: 'Best by Season', icon: Calendar },
    { id: 'budget', label: '₹ Budget Planner', icon: Calculator },
    { id: 'stays', label: 'Stay Finder', icon: Bed },
    { id: 'culture', label: 'Culture & Tips', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => { setActiveTab('states'); }} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl">🇮🇳</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl tracking-tight text-slate-900">
                  BHARAT<span className="text-orange-600">YATRA</span>
                </span>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Incredible India Official Travel Guide</p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden xl:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search 28 states, 8 UTs, foods..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'states') setActiveTab('states');
                }}
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 rounded-full pl-9 pr-8 py-2 border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 relative cursor-pointer ${
                    isActive 
                      ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/25' 
                      : item.highlight
                      ? 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive 
                        ? 'bg-orange-700 text-white' 
                        : item.badge === 'New' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Badges */}
          <div className="flex items-center gap-2.5">
            {/* Currency Pill */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="font-extrabold text-sm">₹</span>
              <span>INR</span>
            </div>

            {/* Saved Bookmarks Trigger Button */}
            <button
              onClick={onOpenSavedDrawer}
              title="Open Saved Wishlist"
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
            >
              <Heart className={`w-5 h-5 ${bookmarkedStates.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {bookmarkedStates.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {bookmarkedStates.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          {/* Mobile Search */}
          <div className="relative w-full pt-1 pb-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search 28 states, 8 UTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm text-slate-800 rounded-xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-orange-600 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Currency: <strong>Indian Rupee (₹ INR)</strong></span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSavedDrawer();
              }}
              className="text-rose-600 font-bold hover:underline"
            >
              Saved ({bookmarkedStates.length})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
