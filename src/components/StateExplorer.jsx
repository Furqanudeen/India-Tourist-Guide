import React, { useState, useMemo } from 'react';
import StateCard from './StateCard';
import { Search, Filter, SlidersHorizontal, Sparkles, Map, RefreshCw, Heart } from 'lucide-react';

export default function StateExplorer({ 
  states, 
  onSelectState, 
  bookmarkedStates, 
  onToggleBookmark, 
  onCalculateBudget, 
  onFindStays,
  searchQuery,
  setSearchQuery,
  activeLandscapeFilter,
  setActiveLandscapeFilter
}) {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  const regions = [
    { id: 'All', label: 'All Regions', count: states.length },
    { id: 'North', label: 'North India' },
    { id: 'South', label: 'South India' },
    { id: 'East', label: 'East India' },
    { id: 'West', label: 'West India' },
    { id: 'North-East', label: 'North-East' },
    { id: 'Central', label: 'Central India' },
    { id: 'Union Territory', label: 'Union Territories' }
  ];

  const landscapes = [
    'All Landscapes',
    'Himalayan & Valleys',
    'Coastal & Beaches',
    'Heritage & Forts',
    'Wildlife & Jungles',
    'Spiritual & Ghats',
    'Desert & Dunes'
  ];

  // Filtering & Sorting
  const filteredStates = useMemo(() => {
    return states.filter((st) => {
      // Region match
      if (selectedRegion !== 'All') {
        if (selectedRegion === 'Union Territory') {
          if (st.type !== 'Union Territory') return false;
        } else {
          if (st.region !== selectedRegion) return false;
        }
      }

      // Landscape match
      if (activeLandscapeFilter && activeLandscapeFilter !== 'All Landscapes') {
        if (st.landscape !== activeLandscapeFilter) return false;
      }

      // Saved toggle
      if (showOnlySaved && !bookmarkedStates.includes(st.id)) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = st.name.toLowerCase().includes(q);
        const inCap = st.capital ? st.capital.toLowerCase().includes(q) : false;
        const inTag = st.tagline ? st.tagline.toLowerCase().includes(q) : false;
        const inDesc = st.description ? st.description.toLowerCase().includes(q) : false;
        const inAttractions = st.attractions 
          ? st.attractions.some(a => a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q))
          : false;

        if (!inName && !inCap && !inTag && !inDesc && !inAttractions) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5);
      if (sortBy === 'price-low') return (a.avgBudgetPerDay || 2000) - (b.avgBudgetPerDay || 2000);
      if (sortBy === 'price-high') return (b.avgBudgetPerDay || 2000) - (a.avgBudgetPerDay || 2000);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [states, selectedRegion, activeLandscapeFilter, showOnlySaved, bookmarkedStates, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedRegion('All');
    setActiveLandscapeFilter('All Landscapes');
    setSearchQuery('');
    setShowOnlySaved(false);
  };

  const hasActiveFilters = selectedRegion !== 'All' || 
    (activeLandscapeFilter && activeLandscapeFilter !== 'All Landscapes') || 
    searchQuery.trim().length > 0 || 
    showOnlySaved;

  return (
    <section id="states-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
            <Map className="w-3.5 h-3.5 text-orange-600" />
            <span>Interactive Multi-Dimensional Hub</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore All 28 States & 8 Union Territories
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600">
            Discover signature spots, royal heritage, diverse cuisines, and localized daily costs in ₹.
          </p>
        </div>

        {/* Saved Toggle Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowOnlySaved(!showOnlySaved)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              showOnlySaved 
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${showOnlySaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>Saved States</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold">
              {bookmarkedStates.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Filter Control Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8 space-y-5">
        
        {/* Region Tabs (Horizontal Scrollable) */}
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2.5">
            1. Select Geographic Zone
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {regions.map((reg) => {
              const isSelected = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/30' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Bar: Landscape, Search & Sort */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          
          {/* Landscape Dropdown */}
          <div className="md:col-span-4">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Landscape & Terrain
            </label>
            <select
              value={activeLandscapeFilter || 'All Landscapes'}
              onChange={(e) => setActiveLandscapeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium cursor-pointer"
            >
              {landscapes.map((land) => (
                <option key={land} value={land}>{land}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="md:col-span-5">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Fuzzy Search by Name / Spot
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="E.g., Jaipur, Munnar, Pangong, Kaziranga..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
              />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium cursor-pointer"
            >
              <option value="rating">Top Rated & Popular</option>
              <option value="name-asc">Alphabetical (A to Z)</option>
              <option value="price-low">Budget: Low to High (₹)</option>
              <option value="price-high">Budget: High to Low (₹)</option>
            </select>
          </div>

        </div>

        {/* Active Filters Pill Row */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-medium">Active Filters:</span>
              {selectedRegion !== 'All' && (
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold">
                  Region: {selectedRegion}
                </span>
              )}
              {activeLandscapeFilter && activeLandscapeFilter !== 'All Landscapes' && (
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                  Terrain: {activeLandscapeFilter}
                </span>
              )}
              {searchQuery.trim() && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Query: "{searchQuery}"
                </span>
              )}
              {showOnlySaved && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                  Saved Only
                </span>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{filteredStates.length}</span> of {states.length} destinations
        </p>

        {filteredStates.length > 0 && (
          <span className="text-xs text-slate-400">
            Click any card to open cultural deep-dive
          </span>
        )}
      </div>

      {/* States Grid */}
      {filteredStates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStates.map((state) => (
            <StateCard
              key={state.id}
              state={state}
              onSelectState={onSelectState}
              isBookmarked={bookmarkedStates.includes(state.id)}
              onToggleBookmark={onToggleBookmark}
              onCalculateBudget={onCalculateBudget}
              onFindStays={onFindStays}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center text-2xl mb-4">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-display">No Destinations Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            We couldn't find any state matching your selected filters or search query.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-sm shadow-orange-600/20"
          >
            Clear Filters & View All 36 Regions
          </button>
        </div>
      )}

    </section>
  );
}
