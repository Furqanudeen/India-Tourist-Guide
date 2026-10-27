import React, { useState } from 'react';
import { 
  Sun, CloudRain, Snowflake, Leaf, Thermometer, 
  Calendar, ArrowRight, Compass, Sparkles, ShieldCheck 
} from 'lucide-react';

export default function SeasonalGuide({ 
  seasonsData, 
  states = [], 
  onSelectState, 
  onCalculateBudget 
}) {
  const [activeSeasonKey, setActiveSeasonKey] = useState('winter');

  const seasonKeys = [
    { key: 'winter', label: 'Winter', months: 'Nov – Feb', icon: Snowflake },
    { key: 'summer', label: 'Summer', months: 'Mar – June', icon: Sun },
    { key: 'monsoon', label: 'Monsoon', months: 'July – Sep', icon: CloudRain },
    { key: 'autumn', label: 'Autumn', months: 'October', icon: Leaf },
  ];

  const currentSeason = seasonsData[activeSeasonKey] || seasonsData['winter'];

  // Match states whose peak season corresponds or are explicitly recommended
  const recommendedStateCards = states.filter((st) => {
    if (st.peakSeason && st.peakSeason.toLowerCase() === activeSeasonKey.toLowerCase()) return true;
    if (currentSeason.recommendedRegions && currentSeason.recommendedRegions.some(reg => reg.toLowerCase().includes(st.name.toLowerCase()))) {
      return true;
    }
    return false;
  }).slice(0, 6);

  return (
    <section id="seasons-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-3 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>India Seasonal & Climate Guide</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Best Places in India by Season
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          India's vast geography features distinct microclimates. Plan your journey around ideal weather windows, snowscapes, lush monsoon waterfalls, and colorful harvest celebrations.
        </p>
      </div>

      {/* Season Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
        {seasonKeys.map((s) => {
          const Icon = s.icon;
          const isSelected = activeSeasonKey === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setActiveSeasonKey(s.key)}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-950/20 scale-102'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                isSelected 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-base sm:text-lg block">
                {s.label}
              </span>
              <span className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {s.months}
              </span>
            </button>
          );
        })}
      </div>

      {/* Season Climate Card Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
              {currentSeason.badge}
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentSeason.name}
            </h3>

            <p className="text-base font-semibold text-orange-700">
              "{currentSeason.tagline}"
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {currentSeason.climateSummary}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="font-bold text-slate-700 self-center mr-1">Recommended Terrains:</span>
              {currentSeason.recommendedRegions?.map((region, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 font-semibold border border-teal-100">
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Right Metrics Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl p-5 border border-orange-200/60 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Thermometer className="w-4 h-4 text-orange-600" />
                Average Temperatures
              </span>
              <p className="text-sm sm:text-base font-bold text-slate-900 bg-white/80 p-2.5 rounded-xl border border-orange-100">
                {currentSeason.avgTemp}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Smart Packing Checklist
              </span>
              <p className="text-xs sm:text-sm text-slate-700 bg-white/80 p-2.5 rounded-xl border border-orange-100 leading-relaxed">
                {currentSeason.packingTips}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Seasonal Festivals */}
      {currentSeason.festivals && currentSeason.festivals.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Major Cultural Festivals in {currentSeason.name.split(' ')[0]}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">Living traditions and harvest festivities celebrated across India</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentSeason.festivals.map((fest, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-xs text-orange-600 font-bold mb-1.5">
                    <span>{fest.location}</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[11px] font-semibold">{fest.month}</span>
                  </div>
                  <h4 className="font-display font-bold text-base text-slate-900">{fest.name}</h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{fest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peak Destination Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-600" />
              <span>Top Recommended Destinations for {currentSeason.name.split(' ')[0]}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">Optimal weather conditions and clear vistas right now</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedStateCards.map((st) => (
            <div 
              key={st.id} 
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <div 
                className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer"
                onClick={() => onSelectState(st)}
              >
                <img 
                  src={st.banner} 
                  alt={st.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {st.region}
                </span>
                <span className="absolute bottom-3 left-3 font-display font-bold text-xl text-white drop-shadow-md">
                  {st.name}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 line-clamp-2">{st.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Daily Avg.</span>
                    <span className="font-bold text-slate-900 text-sm">₹{(st.avgBudgetPerDay || 2200).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCalculateBudget(st)}
                      className="text-xs font-semibold px-2 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer"
                    >
                      ₹ Budget
                    </button>
                    <button
                      onClick={() => onSelectState(st)}
                      className="text-xs font-bold text-slate-900 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
                    >
                      Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
