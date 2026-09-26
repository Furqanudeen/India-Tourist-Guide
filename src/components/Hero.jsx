import React from 'react';
import { Compass, Sparkles, MapPin, Calculator, ShieldCheck, ArrowRight, Sun, Bed } from 'lucide-react';

export default function Hero({ setActiveTab, onFilterLandscape, totalStatesCount }) {
  const quickPills = [
    { label: '🏰 Royal Forts', filter: 'Heritage & Forts' },
    { label: '🏔️ Himalayas', filter: 'Himalayan & Valleys' },
    { label: '🌴 Backwaters & Coast', filter: 'Coastal & Beaches' },
    { label: '🐅 Jungles & Wildlife', filter: 'Wildlife & Jungles' },
    { label: '🕉️ Sacred Ghats', filter: 'Spiritual & Ghats' },
    { label: '🏜️ Desert & Dunes', filter: 'Desert & Dunes' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-[#FAF8F5] to-[#FAF8F5] pt-10 pb-16 md:pt-16 md:pb-24 border-b border-amber-900/5">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Mini Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-ping"></span>
            <span className="text-xs font-bold text-orange-800 tracking-wide uppercase">
              Explore Bharat — {totalStatesCount} States & UTs Complete Guide
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            India’s Ultimate <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-teal-700">
              Tourist & Travel Guide
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Immerse yourself in centuries of living heritage, snow-capped Himalayan ridges, golden sand dunes, and tranquil tropical backwaters. Complete with seasonal guides, stays, and dynamic budget planning in <span className="font-bold text-slate-900">₹ Indian Rupees</span>.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveTab('states')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-600/25 hover:shadow-orange-600/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Compass className="w-5 h-5" />
              <span>Explore All 36 Regions</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300/80 shadow-xs hover:border-orange-300 transition-all duration-200 cursor-pointer"
            >
              <Calculator className="w-5 h-5 text-orange-600" />
              <span>Budget Planner (₹)</span>
            </button>

            <button
              onClick={() => setActiveTab('seasons')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-sm sm:text-base border border-teal-200/80 transition-all duration-200 cursor-pointer"
            >
              <Sun className="w-5 h-5 text-teal-600" />
              <span>Best by Season</span>
            </button>
          </div>

          {/* Quick Filter Landscape Chips */}
          <div className="mt-10 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
              Fast Track By Landscape
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickPills.map((pill) => (
                <button
                  key={pill.filter}
                  onClick={() => {
                    setActiveTab('states');
                    onFilterLandscape(pill.filter);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 text-xs sm:text-sm font-semibold text-slate-700 hover:text-orange-700 border border-slate-200 hover:border-orange-300 shadow-xs transition-all duration-150 cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-display">28 + 8</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">States & UTs</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Filter by 7 geographic zones</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-display">4 Seasons</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">Climate Planner</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Winter, Summer, Monsoon, Autumn</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">100% in ₹</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">Indian Rupee Calculator</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Food, Transit, Stays & Permits</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 text-center shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">Verified Stays</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">From ₹600 / Night</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hostels, Homestays & Palaces</div>
          </div>
        </div>

      </div>
    </div>
  );
}
