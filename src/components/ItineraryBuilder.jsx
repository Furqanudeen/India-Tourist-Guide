import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, Utensils, 
  Sparkles, Share2, Check, Printer, 
  ArrowRight, Layers, Compass 
} from 'lucide-react';

export default function ItineraryBuilder({ 
  states = [], 
  initialState, 
  onCalculateBudget, 
  onFindStays 
}) {
  const [selectedStateId, setSelectedStateId] = useState(initialState?.id || 'rajasthan');
  const [tripDuration, setTripDuration] = useState(5); // 3, 5, 7, 10 days
  const [travelTheme, setTravelTheme] = useState('heritage'); // heritage, nature, adventure, foodie
  const [copied, setCopied] = useState(false);

  const activeState = useMemo(() => {
    return states.find(s => s.id === selectedStateId) || states[0];
  }, [states, selectedStateId]);

  const themes = [
    { id: 'heritage', label: 'Monuments & Royalty', icon: '🏰', desc: 'Focus on palaces, forts, temples & ancient history' },
    { id: 'nature', label: 'Scenic & Slow Travel', icon: '🌿', desc: 'Scenic vistas, lakes, plantation walks & sunsets' },
    { id: 'adventure', label: 'Active & Outdoors', icon: '🧗', desc: 'Treks, wildlife safaris, water sports & rural trails' },
    { id: 'foodie', label: 'Culinary & Culture', icon: '🍲', desc: 'Iconic street food, cooking classes & local bazaars' }
  ];

  // Dynamically synthesize a rich day-by-day plan using the state's real attractions and cuisine
  const itineraryDays = useMemo(() => {
    if (!activeState) return [];
    const attractions = activeState.attractions || [];
    const cuisines = activeState.famousCuisine || [];
    const days = [];

    for (let dayNum = 1; dayNum <= tripDuration; dayNum++) {
      const primarySpot = attractions[(dayNum - 1) % attractions.length] || {
        name: `Signature Landmark of ${activeState.name}`,
        city: activeState.capital,
        tag: 'Must-See Spot',
        desc: activeState.tagline
      };

      const secondarySpot = attractions[(dayNum) % attractions.length] || attractions[0];
      const featuredMeal = cuisines[(dayNum - 1) % cuisines.length] || {
        name: 'Regional Thali Special',
        desc: 'Assorted seasonal regional curries with handmade flatbreads.'
      };

      days.push({
        dayNumber: dayNum,
        title: dayNum === 1 
          ? `Arrival in ${activeState.capital} & Royal First Impressions` 
          : dayNum === tripDuration 
          ? `Local Souvenirs, Farewell Sunset & Cultural Wrap` 
          : `Exploring ${primarySpot.city || activeState.capital}: Highlights & Living Heritage`,
        morning: {
          time: '08:30 AM – 12:30 PM',
          activity: `Morning visit to ${primarySpot.name} (${primarySpot.city})`,
          details: primarySpot.desc,
          tip: 'Arrive early to beat mid-day lines and capture soft morning photography light.'
        },
        lunch: {
          time: '01:00 PM – 02:30 PM',
          dish: featuredMeal.name,
          details: featuredMeal.desc
        },
        afternoon: {
          time: '03:30 PM – 06:30 PM',
          activity: dayNum % 2 === 0 
            ? `Afternoon excursion to ${secondarySpot.name}` 
            : `Heritage bazaar stroll & artisan workshops in ${primarySpot.city}`,
          details: dayNum % 2 === 0 
            ? secondarySpot.desc 
            : `Discover traditional handicrafts, handlooms, and spices in local town markets.`
        },
        evening: {
          time: '07:30 PM – 09:30 PM',
          activity: `Traditional evening dinner and cultural folk performance / riverside stroll`,
          details: `Relax and reflect over authentic spiced dessert and local herbal tea.`
        },
        estDayBudget: Math.round(activeState.avgBudgetPerDay || 2200)
      });
    }

    return days;
  }, [activeState, tripDuration]);

  const handleCopyItinerary = () => {
    if (!activeState) return;
    let markdown = `# 🇮🇳 ${tripDuration}-Day Personalized Itinerary for ${activeState.name}\n\n`;
    markdown += `**Destination:** ${activeState.name} (${activeState.region} India)\n`;
    markdown += `**Theme:** ${themes.find(t => t.id === travelTheme)?.label}\n`;
    markdown += `**Avg Daily Budget:** ₹${activeState.avgBudgetPerDay || 2200}/day\n\n`;

    itineraryDays.forEach(d => {
      markdown += `### Day ${d.dayNumber}: ${d.title}\n`;
      markdown += `- **Morning:** ${d.morning.activity} — ${d.morning.details}\n`;
      markdown += `- **Must-Try Meal:** ${d.lunch.dish} (${d.lunch.details})\n`;
      markdown += `- **Afternoon:** ${d.afternoon.activity} — ${d.afternoon.details}\n`;
      markdown += `- **Evening:** ${d.evening.activity}\n\n`;
    });

    markdown += `\nPlanned with Incredible India Tourist Guide`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="itinerary-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Intelligent Day-by-Day Journey Planner</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Custom India Tour Itinerary Builder
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Generate a detailed, balanced, day-by-day travel plan with real spots, regional cuisines, morning timings, and insider logistics.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-10 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          
          {/* 1. Destination Picker */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>1. Select Indian Destination</span>
            </label>
            <select
              value={selectedStateId}
              onChange={(e) => setSelectedStateId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {states.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.region} • {st.landscape})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Duration Preset */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>2. Trip Length: {tripDuration} Days</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 10].map((d) => (
                <button
                  key={d}
                  onClick={() => setTripDuration(d)}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    tripDuration === d
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          {/* 3. Travel Pace/Theme */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-600" />
              <span>3. Primary Travel Theme</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.slice(0, 2).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTravelTheme(t.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                    travelTheme === t.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="mr-1">{t.icon}</span> {t.label.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Selected Destination Highlights Bar */}
        {activeState && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{activeState.name}:</span>
              <span className="text-slate-600">{activeState.tagline}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onCalculateBudget(activeState)}
                className="text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>₹ Check Budget for this state</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Generated Itinerary Output */}
      <div className="space-y-6">
        
        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
              {tripDuration}-Day Curated Journey: {activeState?.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed with balanced travel pace and authentic regional gastronomy
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyItinerary}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-6">
          {itineraryDays.map((day) => (
            <div 
              key={day.dayNumber}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Day Badge Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-extrabold text-sm flex items-center justify-center font-display shadow-md shadow-orange-500/20">
                    D{day.dayNumber}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider block">
                      Day {day.dayNumber} of {tripDuration}
                    </span>
                    <h4 className="font-display font-bold text-base sm:text-lg text-slate-900">
                      {day.title}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Daily Outlay</span>
                  <span className="text-sm font-extrabold text-emerald-700">₹{day.estDayBudget.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Day Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                
                {/* Morning */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-2">
                  <div className="flex items-center justify-between text-orange-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-600" /> Morning
                    </span>
                    <span className="text-[10px] text-orange-600/80">{day.morning.time}</span>
                  </div>
                  <h5 className="font-display font-bold text-sm text-slate-900">{day.morning.activity}</h5>
                  <p className="text-slate-600 leading-relaxed">{day.morning.details}</p>
                  <p className="text-[11px] text-orange-900/80 italic font-medium">💡 Tip: {day.morning.tip}</p>
                </div>

                {/* Lunch & Food Focus */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between text-amber-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" /> Regional Cuisine
                    </span>
                    <span className="text-[10px] text-amber-700">{day.lunch.time}</span>
                  </div>
                  <h5 className="font-display font-bold text-sm text-slate-900">🍲 {day.lunch.dish}</h5>
                  <p className="text-slate-600 leading-relaxed">{day.lunch.details}</p>
                  <div className="pt-1 text-[11px] text-amber-900 font-medium">
                    Recommended: Pair with fresh sugarcane juice or regional buttermilk.
                  </div>
                </div>

                {/* Afternoon & Evening */}
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
                  <div className="flex items-center justify-between text-teal-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-teal-600" /> Afternoon & Evening
                    </span>
                    <span className="text-[10px] text-teal-700">{day.afternoon.time}</span>
                  </div>
                  <h5 className="font-display font-bold text-sm text-slate-900">{day.afternoon.activity}</h5>
                  <p className="text-slate-600 leading-relaxed">{day.afternoon.details}</p>
                  <p className="text-slate-500 text-[11px] pt-1 border-t border-teal-100/60">
                    🌙 {day.evening.activity}
                  </p>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Bottom Booking & Budget Bridge */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block mb-1">
              Ready to turn this itinerary into reality?
            </span>
            <h4 className="font-display font-extrabold text-2xl text-white">
              Estimated Total for {tripDuration} Days in {activeState?.name}: ₹{(tripDuration * (activeState?.avgBudgetPerDay || 2200)).toLocaleString('en-IN')}
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Explore verified hostels, heritage homestays, and palaces tailored for your exact route.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onCalculateBudget(activeState)}
              className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              Refine in ₹ Calculator
            </button>

            <button
              onClick={() => onFindStays(activeState)}
              className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              Browse Stays
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
