import React, { useState, useMemo, useRef } from 'react';
import svgMapsIndia from '@svg-maps/india';
import { 
  Star, Heart, ArrowRight, Bed, Calculator, Route, 
  Search, ZoomIn, ZoomOut, RotateCcw, Layers,
  Compass, Calendar, Info, Check, Eye
} from 'lucide-react';

// Map SVG Location IDs to Guide Data State IDs
const STATE_CODE_TO_ID = {
  an: 'andaman-and-nicobar-islands',
  ap: 'andhra-pradesh',
  ar: 'arunachal-pradesh',
  as: 'assam',
  br: 'bihar',
  ch: 'chandigarh-ut',
  ct: 'chhattisgarh',
  dd: 'dadra-nagar-haveli-daman-diu',
  dl: 'delhi',
  dn: 'dadra-nagar-haveli-daman-diu',
  ga: 'goa',
  gj: 'gujarat',
  hp: 'himachal-pradesh',
  hr: 'haryana',
  jh: 'jharkhand',
  jk: 'jammu-and-kashmir',
  ka: 'karnataka',
  kl: 'kerala',
  ld: 'lakshadweep',
  mh: 'maharashtra',
  ml: 'meghalaya',
  mn: 'manipur',
  mp: 'madhya-pradesh',
  mz: 'mizoram',
  nl: 'nagaland',
  or: 'odisha',
  pb: 'punjab',
  py: 'puducherry',
  rj: 'rajasthan',
  sk: 'sikkim',
  tg: 'telangana',
  tn: 'tamil-nadu',
  tr: 'tripura',
  up: 'uttar-pradesh',
  ut: 'uttarakhand',
  wb: 'west-bengal'
};

const STATE_ABBR = {
  an: 'AN', ap: 'AP', ar: 'AR', as: 'AS', br: 'BR', ch: 'CH', ct: 'CG',
  dd: 'DD', dl: 'DL', dn: 'DN', ga: 'GA', gj: 'GJ', hp: 'HP', hr: 'HR',
  jh: 'JH', jk: 'JK', ka: 'KA', kl: 'KL', ld: 'LD', mh: 'MH', ml: 'ML',
  mn: 'MN', mp: 'MP', mz: 'MZ', nl: 'NL', or: 'OD', pb: 'PB', py: 'PY',
  rj: 'RJ', sk: 'SK', tg: 'TS', tn: 'TN', tr: 'TR', up: 'UP', ut: 'UK', wb: 'WB'
};

const STATE_CENTERS = {
  an: { cx: 521, cy: 608 },
  ap: { cx: 263, cy: 500 },
  ar: { cx: 550, cy: 224 },
  as: { cx: 516, cy: 271 },
  br: { cx: 368, cy: 275 },
  ch: { cx: 180, cy: 160 },
  ct: { cx: 296, cy: 388 },
  dd: { cx: 54, cy: 391 },
  dl: { cx: 186, cy: 210 },
  dn: { cx: 102, cy: 405 },
  ga: { cx: 122, cy: 512 },
  gj: { cx: 66, cy: 355 },
  hp: { cx: 190, cy: 133 },
  hr: { cx: 164, cy: 195 },
  jh: { cx: 365, cy: 327 },
  jk: { cx: 145, cy: 65 },
  ka: { cx: 171, cy: 519 },
  kl: { cx: 166, cy: 615 },
  ld: { cx: 99, cy: 627 },
  mh: { cx: 180, cy: 435 },
  ml: { cx: 484, cy: 283 },
  mn: { cx: 538, cy: 301 },
  mp: { cx: 214, cy: 319 },
  mz: { cx: 516, cy: 337 },
  nl: { cx: 546, cy: 270 },
  or: { cx: 340, cy: 405 },
  pb: { cx: 151, cy: 152 },
  py: { cx: 268, cy: 546 },
  rj: { cx: 119, cy: 257 },
  sk: { cx: 425, cy: 235 },
  tg: { cx: 237, cy: 457 },
  tn: { cx: 211, cy: 610 },
  tr: { cx: 493, cy: 325 },
  up: { cx: 265, cy: 245 },
  ut: { cx: 233, cy: 175 },
  wb: { cx: 412, cy: 310 }
};

// Small territory quick pins for easy tapping
const SMALL_TERRITORIES = [
  { id: 'delhi', name: 'Delhi', cx: 186, cy: 210, badge: 'Capital UT' },
  { id: 'goa', name: 'Goa', cx: 122, cy: 512, badge: 'Beaches' },
  { id: 'chandigarh-ut', name: 'Chandigarh', cx: 180, cy: 160, badge: 'City Beautiful' },
  { id: 'puducherry', name: 'Puducherry', cx: 268, cy: 546, badge: 'French Riviera' },
  { id: 'lakshadweep', name: 'Lakshadweep', cx: 99, cy: 627, badge: 'Coral Islands' },
  { id: 'andaman-and-nicobar-islands', name: 'Andaman & Nicobar', cx: 521, cy: 608, badge: 'Emerald Isles' },
  { id: 'dadra-nagar-haveli-daman-diu', name: 'Daman & Diu', cx: 54, cy: 391, badge: 'Coastal UT' }
];

export default function InteractiveMap({
  states,
  onSelectState,
  bookmarkedStates,
  onToggleBookmark,
  onCalculateBudget,
  onFindStays,
  onGenerateItinerary
}) {
  // State lookups
  const statesById = useMemo(() => {
    const map = new Map();
    states.forEach(s => map.set(s.id, s));
    return map;
  }, [states]);

  // Active Map View Theme
  const [colorMode, setColorMode] = useState('landscape'); // 'landscape' | 'region' | 'budget' | 'season'
  const [selectedStateId, setSelectedStateId] = useState('rajasthan');
  const [hoveredLocationId, setHoveredLocationId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false });
  const [showLabels, setShowLabels] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchMapQuery, setSearchMapQuery] = useState('');
  const [activeLegendFilter, setActiveLegendFilter] = useState(null);
  const [activeNorthernTab, setActiveNorthernTab] = useState('jammu-and-kashmir'); // 'jammu-and-kashmir' | 'ladakh'

  const svgContainerRef = useRef(null);

  // Active selected state object
  const selectedState = useMemo(() => {
    if (selectedStateId === 'jk-split') {
      return statesById.get(activeNorthernTab) || statesById.get('jammu-and-kashmir');
    }
    return statesById.get(selectedStateId) || states[0];
  }, [selectedStateId, activeNorthernTab, statesById, states]);

  // Hovered state object
  const hoveredState = useMemo(() => {
    if (!hoveredLocationId) return null;
    const guideId = STATE_CODE_TO_ID[hoveredLocationId];
    return statesById.get(guideId);
  }, [hoveredLocationId, statesById]);

  // Color generator based on mode
  const getStateColor = (locationId) => {
    const guideId = STATE_CODE_TO_ID[locationId];
    const state = statesById.get(guideId);
    if (!state) return '#e2e8f0';

    // If a legend item is filtered and this doesn't match, dim it
    if (activeLegendFilter) {
      if (colorMode === 'landscape' && state.landscape !== activeLegendFilter) return '#f1f5f9';
      if (colorMode === 'region' && state.region !== activeLegendFilter) return '#f1f5f9';
      if (colorMode === 'season' && state.peakSeason !== activeLegendFilter) return '#f1f5f9';
    }

    if (colorMode === 'landscape') {
      const palette = {
        'Heritage & Forts': '#f59e0b',      // Amber
        'Himalayan & Valleys': '#0284c7',    // Sky
        'Coastal & Beaches': '#0d9488',      // Teal
        'Wildlife & Jungles': '#10b981',     // Emerald
        'Spiritual & Ghats': '#ea580c',      // Orange
        'Desert & Dunes': '#eab308'          // Golden
      };
      return palette[state.landscape] || '#cbd5e1';
    }

    if (colorMode === 'region') {
      const palette = {
        'North': '#3b82f6',
        'South': '#10b981',
        'West': '#f59e0b',
        'East': '#8b5cf6',
        'North-East': '#ec4899',
        'Central': '#6366f1',
        'Union Territory': '#14b8a6'
      };
      return palette[state.region] || '#cbd5e1';
    }

    if (colorMode === 'budget') {
      if (state.avgBudgetPerDay <= 1900) return '#10b981'; // Budget friendly
      if (state.avgBudgetPerDay <= 2400) return '#f59e0b'; // Moderate
      return '#8b5cf6'; // Premium
    }

    if (colorMode === 'season') {
      const palette = {
        'Winter': '#0284c7',
        'Summer': '#f97316',
        'Monsoon': '#0d9488',
        'Spring/Autumn': '#8b5cf6',
        'All Year': '#10b981'
      };
      return palette[state.peakSeason] || '#0284c7';
    }

    return '#cbd5e1';
  };

  // Handle State Click
  const handleStateClick = (locationId) => {
    const guideId = STATE_CODE_TO_ID[locationId];
    if (locationId === 'jk') {
      setSelectedStateId('jk-split');
    } else if (guideId) {
      setSelectedStateId(guideId);
    }
  };

  // Handle State Mouse Hover with Tooltip
  const handleMouseEnter = (e, locationId) => {
    setHoveredLocationId(locationId);
    updateTooltipPosition(e);
  };

  const handleMouseMove = (e) => {
    if (hoveredLocationId) {
      updateTooltipPosition(e);
    }
  };

  const handleMouseLeave = () => {
    setHoveredLocationId(null);
    setTooltipPos(prev => ({ ...prev, visible: false }));
  };

  const updateTooltipPosition = (e) => {
    if (!svgContainerRef.current) return;
    const containerRect = svgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    setTooltipPos({ x, y, visible: true });
  };

  // Search Autocomplete filtering
  const searchResults = useMemo(() => {
    if (!searchMapQuery.trim()) return [];
    const q = searchMapQuery.toLowerCase();
    return states.filter(s => 
      s.name.toLowerCase().includes(q) || 
      (s.capital && s.capital.toLowerCase().includes(q)) ||
      (s.landscape && s.landscape.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchMapQuery, states]);

  // Legend Items definition
  const legendItems = useMemo(() => {
    if (colorMode === 'landscape') {
      return [
        { label: 'Heritage & Forts', color: '#f59e0b' },
        { label: 'Himalayan & Valleys', color: '#0284c7' },
        { label: 'Coastal & Beaches', color: '#0d9488' },
        { label: 'Wildlife & Jungles', color: '#10b981' },
        { label: 'Spiritual & Ghats', color: '#ea580c' },
        { label: 'Desert & Dunes', color: '#eab308' },
      ];
    }
    if (colorMode === 'region') {
      return [
        { label: 'North', color: '#3b82f6' },
        { label: 'South', color: '#10b981' },
        { label: 'West', color: '#f59e0b' },
        { label: 'East', color: '#8b5cf6' },
        { label: 'North-East', color: '#ec4899' },
        { label: 'Central', color: '#6366f1' },
        { label: 'Union Territory', color: '#14b8a6' },
      ];
    }
    if (colorMode === 'budget') {
      return [
        { label: 'Budget Friendly (≤ ₹1,900)', color: '#10b981' },
        { label: 'Mid-Range (₹1,901 - ₹2,400)', color: '#f59e0b' },
        { label: 'Premium (> ₹2,400)', color: '#8b5cf6' },
      ];
    }
    if (colorMode === 'season') {
      return [
        { label: 'Winter (Oct - Mar)', color: '#0284c7' },
        { label: 'Summer (Apr - Jun)', color: '#f97316' },
        { label: 'Monsoon (Jul - Sep)', color: '#0d9488' },
      ];
    }
    return [];
  }, [colorMode]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-amber-900/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            Interactive Vector Cartography
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
            Map of <span className="text-orange-600">Incredible India</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Hover over any state or union territory for instant insights, or tap to trigger deep-dive itineraries, verified stays, and real rupee budgets.
          </p>
        </div>

        {/* Quick Map Stats Ticker */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-center px-2">
            <span className="block text-lg sm:text-xl font-extrabold text-orange-600">28</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">States</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="text-center px-2">
            <span className="block text-lg sm:text-xl font-extrabold text-teal-600">8</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">UTs</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="text-center px-2">
            <span className="block text-lg sm:text-xl font-extrabold text-amber-600">100%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Interactive</span>
          </div>
        </div>
      </div>

      {/* Control Bar & Search Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto scrollbar-none text-xs font-bold text-slate-600">
            <button
              onClick={() => { setColorMode('landscape'); setActiveLegendFilter(null); }}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                colorMode === 'landscape' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>By Landscape</span>
            </button>
            <button
              onClick={() => { setColorMode('region'); setActiveLegendFilter(null); }}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                colorMode === 'region' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>By Region</span>
            </button>
            <button
              onClick={() => { setColorMode('budget'); setActiveLegendFilter(null); }}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                colorMode === 'budget' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>By Budget (₹)</span>
            </button>
            <button
              onClick={() => { setColorMode('season'); setActiveLegendFilter(null); }}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                colorMode === 'season' ? 'bg-white text-orange-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>By Season</span>
            </button>
          </div>

          {/* Search State Quick Finder */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Jump to state (e.g. Rajasthan, Kerala, Goa)..."
              value={searchMapQuery}
              onChange={(e) => setSearchMapQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 rounded-full pl-9 pr-8 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
            {searchMapQuery && (
              <button 
                onClick={() => setSearchMapQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}

            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50">
                {searchResults.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStateId(s.id);
                      setSearchMapQuery('');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center justify-between text-xs sm:text-sm text-slate-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.name}</span>
                      <span className="text-[11px] text-slate-400">({s.capital})</span>
                    </div>
                    <span className="text-[11px] font-semibold text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded-full">
                      {s.landscape}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              title="Toggle State Labels"
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                showLabels ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Labels</span>
            </button>

            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
              title="Zoom In"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
              title="Zoom Out"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setZoomLevel(1); setActiveLegendFilter(null); }}
              title="Reset Zoom & Filters"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Dynamic Interactive Legend Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 mr-1 flex items-center gap-1">
            <Info className="w-3 h-3" /> Legend (Click to filter):
          </span>
          {legendItems.map((item) => {
            const isActive = activeLegendFilter === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveLegendFilter(isActive ? null : item.label)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isActive 
                    ? 'ring-2 ring-orange-500 bg-white font-bold border-transparent shadow-xs' 
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span>{item.label}</span>
                {isActive && <Check className="w-3 h-3 text-orange-600 ml-0.5" />}
              </button>
            );
          })}
          {activeLegendFilter && (
            <button
              onClick={() => setActiveLegendFilter(null)}
              className="text-xs text-orange-600 hover:text-orange-800 font-bold ml-2 underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Vector Map (Left 7 cols) & Spotlight Card (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Map Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-md relative overflow-hidden flex flex-col items-center">
          
          {/* Territory Hotspot Quick Bar (For small states and UTs) */}
          <div className="w-full mb-3 pb-3 border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
              Quick Territory Pins:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {SMALL_TERRITORIES.map((ut) => {
                const isSelected = selectedStateId === ut.id;
                return (
                  <button
                    key={ut.id}
                    onClick={() => setSelectedStateId(ut.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900 text-amber-400 shadow-xs' 
                        : 'bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-700'
                    }`}
                  >
                    📍 {ut.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SVG Map Container */}
          <div 
            ref={svgContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full relative flex items-center justify-center min-h-[460px] sm:min-h-[580px] bg-radial from-amber-50/40 via-transparent to-transparent rounded-2xl select-none overflow-hidden"
            style={{ touchAction: 'pan-x pan-y' }}
          >
            <svg
              viewBox="0 0 612 696"
              className="w-full max-h-[620px] transition-transform duration-300 ease-out drop-shadow-sm"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              <defs>
                <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#ea580c" floodOpacity="0.45" />
                </filter>
                <filter id="hover-glow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Render all state vector paths */}
              <g id="india-state-paths">
                {(svgMapsIndia?.locations || svgMapsIndia?.default?.locations || []).map((loc) => {
                  const guideId = STATE_CODE_TO_ID[loc.id];
                  const isSelected = selectedStateId === guideId || (selectedStateId === 'jk-split' && loc.id === 'jk');
                  const isHovered = hoveredLocationId === loc.id;
                  const fillColor = getStateColor(loc.id);

                  return (
                    <path
                      key={loc.id}
                      id={`state-path-${loc.id}`}
                      d={loc.path}
                      fill={fillColor}
                      stroke={isSelected ? '#c2410c' : isHovered ? '#0f172a' : '#ffffff'}
                      strokeWidth={isSelected ? '2.5' : isHovered ? '1.8' : '0.8'}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      filter={isSelected ? 'url(#active-glow)' : isHovered ? 'url(#hover-glow)' : 'none'}
                      onClick={() => handleStateClick(loc.id)}
                      onMouseEnter={(e) => handleMouseEnter(e, loc.id)}
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        transformOrigin: `${STATE_CENTERS[loc.id]?.cx || 300}px ${STATE_CENTERS[loc.id]?.cy || 350}px`,
                        transform: isHovered ? 'scale(1.015)' : 'scale(1)',
                        opacity: hoveredLocationId && !isHovered && !isSelected ? 0.75 : 1
                      }}
                    />
                  );
                })}
              </g>

              {/* Territory Indicator Rings for tiny UTs & Islands */}
              <g id="territory-pins" pointerEvents="none">
                {SMALL_TERRITORIES.map((ut) => (
                  <circle
                    key={ut.id}
                    cx={ut.cx}
                    cy={ut.cy}
                    r={selectedStateId === ut.id ? 8 : 4.5}
                    fill={selectedStateId === ut.id ? '#ea580c' : '#ffffff'}
                    stroke="#0f172a"
                    strokeWidth={selectedStateId === ut.id ? 2.5 : 1.5}
                    className="transition-all duration-200"
                  />
                ))}
              </g>

              {/* State Abbreviation Labels */}
              {showLabels && (
                <g id="state-labels" pointerEvents="none" className="text-[10px] font-black select-none">
                  {Object.entries(STATE_CENTERS).map(([code, center]) => {
                    const guideId = STATE_CODE_TO_ID[code];
                    const isSelected = selectedStateId === guideId;
                    const abbr = STATE_ABBR[code];
                    
                    // Don't clutter tiny dots unless zoomed or selected
                    if (['dd', 'dn', 'ch'].includes(code) && zoomLevel < 1.3) return null;

                    return (
                      <text
                        key={code}
                        x={center.cx}
                        y={center.cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isSelected ? '#ffffff' : '#0f172a'}
                        className={`text-[9px] font-bold ${isSelected ? 'font-black' : ''}`}
                        style={{
                          textShadow: isSelected 
                            ? '0 1px 3px rgba(0,0,0,0.6)' 
                            : '0 0 2px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,0.9)'
                        }}
                      >
                        {abbr}
                      </text>
                    );
                  })}
                </g>
              )}
            </svg>

            {/* Floating Interactive Hover Tooltip */}
            {tooltipPos.visible && hoveredState && (
              <div 
                className="absolute z-50 pointer-events-none bg-slate-950/90 text-white p-3.5 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 max-w-xs transition-opacity duration-150 animate-in fade-in"
                style={{
                  left: `${Math.min(tooltipPos.x + 15, 360)}px`,
                  top: `${Math.max(tooltipPos.y - 70, 10)}px`
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-extrabold text-sm text-white font-display">
                    {hoveredState.name}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{hoveredState.rating}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 flex items-center gap-2 mb-2">
                  <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-200">
                    {hoveredState.capital}
                  </span>
                  <span>•</span>
                  <span className="text-orange-400 font-semibold">{hoveredState.landscape}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/10">
                  <div>
                    <span className="text-slate-400 block">Best Season</span>
                    <span className="font-bold text-white">{hoveredState.peakSeason}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Daily Budget</span>
                    <span className="font-bold text-emerald-400">₹{hoveredState.avgBudgetPerDay.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                  <span className="text-amber-400">⚡</span> Click to inspect full guide & itinerary
                </div>
              </div>
            )}
          </div>

          {/* Quick Helper Bar */}
          <div className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Click any state boundary or marker to inspect
            </span>
            <span className="text-[11px] text-slate-400">
              Vector Scale: {Math.round(zoomLevel * 100)}%
            </span>
          </div>

        </div>

        {/* Right Column: Selected State Dossier / Spotlight Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg lg:sticky lg:top-24 max-h-none lg:max-h-[calc(100vh-7rem)] flex flex-col">
          
          {/* Northern Crown Dual Selector (If J&K or Ladakh is active) */}
          {(selectedState.id === 'jammu-and-kashmir' || selectedState.id === 'ladakh' || selectedStateId === 'jk-split') && (
            <div className="bg-gradient-to-r from-sky-900 to-indigo-950 p-2.5 flex items-center justify-center gap-2 text-xs font-bold text-white border-b border-white/10">
              <span className="text-amber-400">🏔️ Northern Territory:</span>
              <button
                onClick={() => { setSelectedStateId('jammu-and-kashmir'); setActiveNorthernTab('jammu-and-kashmir'); }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  selectedState.id === 'jammu-and-kashmir' 
                    ? 'bg-orange-500 text-white shadow-xs font-extrabold' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                Jammu & Kashmir
              </button>
              <button
                onClick={() => { setSelectedStateId('ladakh'); setActiveNorthernTab('ladakh'); }}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  selectedState.id === 'ladakh' 
                    ? 'bg-orange-500 text-white shadow-xs font-extrabold' 
                    : 'bg-white/10 hover:bg-white/20 text-slate-200'
                }`}
              >
                Ladakh
              </button>
            </div>
          )}

          {/* Destination Banner */}
          <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden">
            <img 
              src={selectedState.banner} 
              alt={selectedState.name}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            {/* Top Badge Strip */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                  {selectedState.region}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-orange-600 text-white shadow-xs">
                  {selectedState.landscape}
                </span>
              </div>

              {/* Bookmark Button */}
              <button
                onClick={() => onToggleBookmark(selectedState.id)}
                title={bookmarkedStates.includes(selectedState.id) ? "Remove from wishlist" : "Save destination"}
                className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              >
                <Heart className={`w-4 h-4 ${bookmarkedStates.includes(selectedState.id) ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
            </div>

            {/* Bottom Title on Banner */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold bg-amber-500/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-amber-400/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedState.rating}</span>
                </div>
                <span className="text-xs text-slate-300 font-medium">Capital: {selectedState.capital}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white drop-shadow-sm">
                {selectedState.name}
              </h2>
            </div>
          </div>

          {/* Dossier Body */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin">
            
            {/* Tagline */}
            <p className="text-sm font-semibold text-slate-700 italic border-l-2 border-orange-500 pl-3">
              "{selectedState.tagline}"
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Best Months</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">{selectedState.bestMonths}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Avg Daily Cost</span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-700">₹{selectedState.avgBudgetPerDay.toLocaleString('en-IN')} / Day</span>
              </div>
            </div>

            {/* Description Snippet */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
              {selectedState.description}
            </p>

            {/* Top 2 Featured Attractions */}
            {selectedState.attractions && selectedState.attractions.length > 0 && (
              <div>
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-2">
                  Featured Attractions
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedState.attractions.slice(0, 2).map((att) => (
                    <div key={att.name} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 line-clamp-1">{att.name}</span>
                        <span className="text-[10px] text-slate-500 block">{att.city}</span>
                      </div>
                      <span className="text-[10px] text-orange-700 font-bold mt-1 line-clamp-1">{att.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Famous Regional Delicacies */}
            {selectedState.famousCuisine && selectedState.famousCuisine.length > 0 && (
              <div>
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-1.5">
                  Famous Flavors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedState.famousCuisine.map((food) => (
                    <span 
                      key={food.name}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/80"
                    >
                      🍛 {food.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTA Grid */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onSelectState(selectedState)}
                className="w-full py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <span>Read Comprehensive {selectedState.name} Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onGenerateItinerary(selectedState)}
                  className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Plan Itinerary"
                >
                  <Route className="w-3.5 h-3.5 text-amber-400" />
                  <span>Itinerary</span>
                </button>

                <button
                  onClick={() => onCalculateBudget(selectedState)}
                  className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Calculate Budget"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Budget (₹)</span>
                </button>

                <button
                  onClick={() => onFindStays(selectedState)}
                  className="py-2.5 px-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Find Stays"
                >
                  <Bed className="w-3.5 h-3.5 text-teal-600" />
                  <span>Stays</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Horizontal State Quick Browser Ribbon */}
      <div className="mt-12 pt-8 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
              All 36 Indian Destinations
            </h3>
            <p className="text-xs text-slate-500">
              Tap any destination thumbnail to center and spotlight on the vector map
            </p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            {states.length} Regions
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-thin">
          {states.map((s) => {
            const isSelected = selectedState.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedStateId(s.id);
                  const el = document.getElementById(`state-path-${Object.keys(STATE_CODE_TO_ID).find(k => STATE_CODE_TO_ID[k] === s.id)}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                className={`flex items-center gap-3 p-2 rounded-2xl border shrink-0 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105' 
                    : 'bg-white hover:bg-orange-50/50 text-slate-800 border-slate-200/80'
                }`}
              >
                <img 
                  src={s.banner} 
                  alt={s.name} 
                  className="w-10 h-10 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=150&q=80";
                  }}
                />
                <div className="text-left pr-2">
                  <span className="text-xs font-bold block leading-tight">{s.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                    {s.landscape}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
