import React, { useEffect, useState } from 'react';
import { 
  X, MapPin, Calendar, IndianRupee, Sparkles, Utensils, 
  Compass, Bed, Calculator, AlertCircle, Heart, Star, 
  CheckCircle2, Share2, Check, Route
} from 'lucide-react';

export default function StateModal({ 
  state, 
  onClose, 
  isBookmarked, 
  onToggleBookmark, 
  onCalculateBudget, 
  onFindStays,
  onGenerateItinerary
}) {
  const [activeTab, setActiveTab] = useState('attractions');
  const [copiedLink, setCopiedLink] = useState(false);

  // Hook called unconditionally at the top level
  useEffect(() => {
    if (!state) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state, onClose]);

  if (!state) return null;

  const handleShare = () => {
    const text = `🇮🇳 Discover ${state.name} (${state.tagline}) on BharatYatra Guide!`;
    if (navigator.share) {
      navigator.share({ title: state.name, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} - ${window.location.href}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Banner */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-950 shrink-0 overflow-hidden">
          <img 
            src={state.banner} 
            alt={state.name} 
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

          {/* Top Floating Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105"
              title="Share destination"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onToggleBookmark(state.id)}
              className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105"
              title={isBookmarked ? "Remove from saved wishlist" : "Save destination"}
            >
              <Heart className={`w-5 h-5 transition-colors ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md hover:scale-105"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Meta Info */}
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-orange-600 text-white shadow-md">
                {state.region} India
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-black/60 backdrop-blur-md border border-white/20 text-amber-300">
                {state.landscape}
              </span>
              {state.type === 'Union Territory' && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase bg-amber-400 text-slate-950">
                  Union Territory
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg text-white">
                  {state.name}
                </h2>
                <p className="mt-1 text-sm sm:text-base text-slate-200 max-w-2xl font-medium drop-shadow-sm">
                  {state.tagline}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 self-start sm:self-auto shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm text-white">{state.rating || '4.8'}</span>
                <span className="text-xs text-slate-300">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-5 sm:px-8 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Capital / Hub</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold truncate">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>{state.capital}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Best Season</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold truncate">
              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{state.bestMonths || 'Oct – Mar'}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Benchmark Daily Cost</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold truncate">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>₹{(state.avgBudgetPerDay || 2200).toLocaleString('en-IN')}/day</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Peak Climate Window</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-slate-900 font-bold truncate">
              <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{state.peakSeason || 'Winter'}</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-8 pt-4 pb-2 border-b border-slate-100 overflow-x-auto scrollbar-none bg-white">
          <button
            onClick={() => setActiveTab('attractions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'attractions'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Top Attractions ({state.attractions?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('cuisine')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cuisine'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Signature Cuisines</span>
          </button>

          <button
            onClick={() => setActiveTab('culture')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'culture'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Heritage & Arts</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tips'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Travel Advisory</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* Destination Narrative Overview */}
          <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 sm:p-5">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mb-1.5 flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-600" />
              <span>Destination Essence</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {state.description || state.tagline}
            </p>
          </div>

          {/* TAB 1: Attractions */}
          {activeTab === 'attractions' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span>Must-Visit Places & Landmarks</span>
                </h3>
                <span className="text-xs text-slate-400">Curated by local travel historians</span>
              </div>

              {state.attractions && state.attractions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {state.attractions.map((spot, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                    >
                      <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                        <img 
                          src={spot.image} 
                          alt={spot.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                        
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
                          {spot.tag}
                        </span>

                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-extrabold">
                          📍 {spot.city}
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display font-bold text-base text-slate-900 group-hover:text-orange-600 transition-colors">
                            {spot.name}
                          </h4>
                          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                            {spot.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Attractions data loading for this destination.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Cuisines */}
          {activeTab === 'cuisine' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-orange-600" />
                  <span>Iconic Culinary Specialties</span>
                </h3>
                <span className="text-xs text-slate-400">Authentic regional flavors</span>
              </div>

              {state.famousCuisine && state.famousCuisine.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {state.famousCuisine.map((food, idx) => (
                    <div 
                      key={idx} 
                      className="p-5 rounded-2xl bg-gradient-to-b from-orange-50/60 to-amber-50/30 border border-orange-200/70 hover:border-orange-300 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center text-lg mb-3">
                          🍲
                        </div>
                        <h4 className="text-sm font-bold text-orange-950 font-display mb-1.5">
                          {food.name}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {food.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Cuisine details loading for this destination.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Culture & Heritage */}
          {activeTab === 'culture' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Living Heritage, Folk Arts & Crafts</span>
                </h3>
                <span className="text-xs text-slate-400">Centuries of tradition</span>
              </div>

              {state.culturalHighlights && state.culturalHighlights.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {state.culturalHighlights.map((highlight, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-amber-950 text-xs sm:text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Cultural highlights loading for this destination.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Travel Advisory & Tips */}
          {activeTab === 'tips' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3.5">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm text-blue-950 mb-1">
                    Insider Travel Advisory & Cultural Etiquette
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-900/90 leading-relaxed">
                    {state.travelTips || "Dress modestly when visiting heritage monuments and active places of worship. Keep electronic copies of your government IDs on your smartphone."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                    Ideal Visit Duration
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Recommended: <strong>4 to 7 days</strong> to experience both major urban/monumental landmarks and natural landscapes without feeling rushed.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                    Local Connectivity
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Connected via state transport buses, Indian Railways (including high-speed Vande Bharat trains), and regional airport connections.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Exploring <strong>{state.name}</strong> • Plan your full journey
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onGenerateItinerary && (
              <button
                onClick={() => {
                  onClose();
                  onGenerateItinerary(state);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Route className="w-4 h-4 text-amber-400" />
                <span>Build Itinerary</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onCalculateBudget(state);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>₹ Budget Planner</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onFindStays(state);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Bed className="w-4 h-4" />
              <span>View Stays</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
