import React from 'react';
import { 
  MapPin, Calendar, Star, Heart, ArrowUpRight, 
  Bed, Calculator, Route 
} from 'lucide-react';

export default function StateCard({ 
  state, 
  onSelectState, 
  isBookmarked, 
  onToggleBookmark, 
  onCalculateBudget, 
  onFindStays,
  onGenerateItinerary
}) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full card-hover-lift">
      
      {/* Banner & Badges Container */}
      <div 
        className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 cursor-pointer"
        onClick={() => onSelectState(state)}
      >
        <img 
          src={state.banner} 
          alt={state.name} 
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
              {state.region}
            </span>
            {state.type === 'Union Territory' && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-500/90 text-slate-950 backdrop-blur-md">
                UT
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(state.id);
            }}
            title={isBookmarked ? "Remove from wishlist" : "Save destination"}
            className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all pointer-events-auto cursor-pointer hover:scale-110 shadow-xs"
          >
            <Heart className={`w-4 h-4 transition-colors ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Bottom Banner Details */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-0.5">
              {state.landscape}
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
              {state.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-bold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{state.rating || '4.8'}</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Capital & Best Season */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1 font-medium truncate max-w-[50%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Capital: <strong className="text-slate-700">{state.capital}</strong></span>
            </div>
            <div className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>{state.bestMonths || 'Oct - Mar'}</span>
            </div>
          </div>

          {/* Tagline */}
          <p 
            onClick={() => onSelectState(state)}
            className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed cursor-pointer hover:text-slate-900 transition-colors"
          >
            {state.tagline}
          </p>

          {/* Quick Spots Badges */}
          {state.attractions && state.attractions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {state.attractions.slice(0, 3).map((att) => (
                <span key={att.name} className="inline-block px-2 py-0.5 rounded-md bg-orange-50 text-[11px] font-medium text-orange-900 border border-orange-100/80 truncate max-w-[150px]">
                  {att.name}
                </span>
              ))}
              {state.attractions.length > 3 && (
                <span className="inline-block px-1.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-500">
                  +{state.attractions.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Quick Shortcuts */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Estimated Daily Avg.
              </span>
              <div className="flex items-baseline gap-1 text-slate-900 font-extrabold text-base sm:text-lg">
                <span className="text-orange-600 text-xs sm:text-sm">₹</span>
                <span>{(state.avgBudgetPerDay || 2200).toLocaleString('en-IN')}</span>
                <span className="text-slate-400 text-xs font-normal">/ day</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onCalculateBudget(state)}
                title="Calculate trip budget for this state"
                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Budget</span>
              </button>

              <button
                onClick={() => onFindStays(state)}
                title="Explore accommodations in this state"
                className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Bed className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stays</span>
              </button>

              {onGenerateItinerary && (
                <button
                  onClick={() => onGenerateItinerary(state)}
                  title="Generate custom trip itinerary for this state"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Route className="w-3.5 h-3.5 text-amber-600" />
                </button>
              )}
            </div>
          </div>

          {/* Primary View Details Button */}
          <button
            onClick={() => onSelectState(state)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 group/btn cursor-pointer shadow-xs"
          >
            <span>Explore Full Guide & Culture</span>
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
}
