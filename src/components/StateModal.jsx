import React, { useEffect } from 'react';
import { X, MapPin, Calendar, IndianRupee, Sparkles, Utensils, Compass, Bed, Calculator, AlertCircle, Heart, Star, CheckCircle2 } from 'lucide-react';

export default function StateModal({ 
  state, 
  onClose, 
  isBookmarked, 
  onToggleBookmark, 
  onCalculateBudget, 
  onFindStays 
}) {
  if (!state) return null;

  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header / Banner */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900 shrink-0">
          <img 
            src={state.banner} 
            alt={state.name} 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Close & Action Buttons at top */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(state.id)}
              className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-colors cursor-pointer"
              title={isBookmarked ? "Remove from saved" : "Save state"}
            >
              <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Meta Info */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-orange-600 text-white shadow-sm">
                {state.region} India
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-black/50 backdrop-blur-md border border-white/20 text-amber-300">
                {state.landscape}
              </span>
              {state.type === 'Union Territory' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-400 text-slate-950">
                  Union Territory
                </span>
              )}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {state.name}
            </h2>

            <p className="mt-1 text-sm sm:text-base text-slate-200 max-w-2xl font-medium drop-shadow-xs">
              {state.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Capital</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="truncate">{state.capital}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Best Months</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold text-sm">
                <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{state.bestMonths || 'Oct – Mar'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Est. Daily Budget</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold text-sm">
                <IndianRupee className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>₹{(state.avgBudgetPerDay || 2200).toLocaleString('en-IN')}/day</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Traveler Rating</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                <span>{state.rating || '4.8'} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Overview Narrative */}
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-600" />
              <span>About the Destination</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {state.description || state.tagline}
            </p>
          </div>

          {/* Cultural Heritage & Folk Arts */}
          {state.culturalHighlights && state.culturalHighlights.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
              <h3 className="font-display text-lg font-bold text-amber-950 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Local Traditions & Cultural Heritage</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {state.culturalHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Tourist Spots */}
          {state.attractions && state.attractions.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span>Signature Attractions & Highlights</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {state.attractions.map((spot, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col">
                    <div className="h-40 w-full overflow-hidden bg-slate-100 relative">
                      <img 
                        src={spot.image} 
                        alt={spot.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                        {spot.tag}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-bold">
                        {spot.city}
                      </span>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display font-bold text-base text-slate-900">{spot.name}</h4>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{spot.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Iconic Local Cuisines */}
          {state.famousCuisine && state.famousCuisine.length > 0 && (
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-600" />
                <span>Must-Try Local Cuisines & Delicacies</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {state.famousCuisine.map((food, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60">
                    <span className="text-xs font-bold text-orange-700 font-display block mb-1">
                      🍲 {food.name}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">{food.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Travel Tips */}
          {state.travelTips && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-100 text-slate-700 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Travel Advisory & Etiquette</strong>
                <p>{state.travelTips}</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Ready to plan your trip to <strong>{state.name}</strong>?
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onCalculateBudget(state);
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate ₹ Budget</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onFindStays(state);
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Bed className="w-4 h-4" />
              <span>View Stays in ₹</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
