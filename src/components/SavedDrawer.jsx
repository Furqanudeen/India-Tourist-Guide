import React, { useState, useEffect } from 'react';
import { 
  X, Heart, MapPin, Trash2, 
  Share2, Check, Route 
} from 'lucide-react';

export default function SavedDrawer({ 
  isOpen, 
  onClose, 
  bookmarkedStates, 
  allStates, 
  onToggleBookmark, 
  onSelectState, 
  onCalculateBudget, 
  onFindStays,
  onGenerateItinerary
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const savedStateObjects = allStates.filter(s => bookmarkedStates.includes(s.id));
  const totalDailyAvg = savedStateObjects.reduce((acc, s) => acc + (s.avgBudgetPerDay || 2200), 0);

  const handleExportWishlist = () => {
    let text = `🇮🇳 My BharatYatra Travel Wishlist (${savedStateObjects.length} Destinations):\n\n`;
    savedStateObjects.forEach((st, idx) => {
      text += `${idx + 1}. ${st.name} (${st.region} India) - ${st.tagline}\n`;
      text += `   Capital: ${st.capital} | Est. Daily: ₹${st.avgBudgetPerDay}/day\n`;
      text += `   Best Months: ${st.bestMonths || 'Oct - Mar'}\n\n`;
    });
    text += `Planned with Incredible India Tourist Guide`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Travel Wishlist
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {savedStateObjects.length} {savedStateObjects.length === 1 ? 'Destination' : 'Destinations'} Saved
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {savedStateObjects.length > 0 ? (
            savedStateObjects.map((state) => (
              <div 
                key={state.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-xs hover:border-orange-300 transition-all flex gap-3.5 relative group"
              >
                {/* Thumbnail */}
                <div 
                  className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectState(state);
                  }}
                >
                  <img 
                    src={state.banner} 
                    alt={state.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                        {state.region} • {state.landscape}
                      </span>

                      <button
                        onClick={() => onToggleBookmark(state.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 
                      onClick={() => {
                        onClose();
                        onSelectState(state);
                      }}
                      className="font-display font-bold text-sm text-slate-900 hover:text-orange-600 transition-colors cursor-pointer truncate"
                    >
                      {state.name}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{state.capital}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="font-extrabold text-slate-900">
                      ₹{(state.avgBudgetPerDay || 2200).toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/d</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {onGenerateItinerary && (
                        <>
                          <button
                            onClick={() => {
                              onClose();
                              onGenerateItinerary(state);
                            }}
                            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer flex items-center gap-0.5"
                            title="Plan Itinerary"
                          >
                            <Route className="w-3 h-3 text-amber-600" />
                            <span>Plan</span>
                          </button>
                          <span className="text-slate-300">•</span>
                        </>
                      )}
                      <button
                        onClick={() => {
                          onClose();
                          onCalculateBudget(state);
                        }}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-800 cursor-pointer"
                      >
                        ₹ Budget
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        onClick={() => {
                          onClose();
                          onFindStays(state);
                        }}
                        className="text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
                      >
                        Stays
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-2xl mb-3">
                🤍
              </div>
              <h4 className="font-display font-bold text-base text-slate-800">Your Wishlist is Empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click the heart icon on any of the 36 states or UTs to save destinations for easy trip comparison and budgeting.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {savedStateObjects.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Combined Daily Benchmark:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                ₹{totalDailyAvg.toLocaleString('en-IN')}/day
              </span>
            </div>

            <button
              onClick={handleExportWishlist}
              className={`w-full py-3 rounded-2xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                copied 
                  ? 'bg-emerald-600' 
                  : 'bg-slate-900 hover:bg-orange-600'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Wishlist Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy Full Wishlist Plan</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
