import React, { useState, useMemo } from 'react';
import { Calculator, IndianRupee, Users, Clock, Compass, ShieldCheck, ArrowRight, Bed, Sparkles, Check, Info, Share2 } from 'lucide-react';

export default function BudgetCalculator({ budgetMatrices, onFindStaysForBudget, preselectedDestination }) {
  const [destinationTier, setDestinationTier] = useState('metro-heritage');
  const [durationDays, setDurationDays] = useState(7);
  const [travelStyle, setTravelStyle] = useState('midrange');
  const [travelersCount, setTravelersCount] = useState(2);
  const [copied, setCopied] = useState(false);

  const destinationOptions = [
    { id: 'metro-heritage', label: 'Golden Triangle & Heritage (Delhi, Jaipur, Agra, Varanasi)', factor: 1.0, icon: '🏰' },
    { id: 'himalayan', label: 'Himalayan & Mountain Pass (Himachal, Ladakh, Kashmir)', factor: 1.15, icon: '🏔️' },
    { id: 'coastal', label: 'Coastal & Beach Haven (Goa, Kerala, Andaman)', factor: 1.20, icon: '🏖️' },
    { id: 'offbeat', label: 'Northeast & Offbeat Heartland (Meghalaya, Hampi, Coorg)', factor: 0.95, icon: '🌿' }
  ];

  const travelStyles = [
    {
      id: 'backpacker',
      label: 'Backpacker / Budget',
      badge: '₹800 – ₹1,850 / day',
      desc: 'Shared dorms / Zostel, local dhabas & street treats, state buses & trains, self-guided visits.',
      icon: '🎒'
    },
    {
      id: 'midrange',
      label: 'Comfortable Mid-Range',
      badge: '₹2,800 – ₹5,400 / day',
      desc: 'Private rooms in boutique homestays, AC cabs & trains, reputable restaurants, guided tours.',
      icon: '🧳'
    },
    {
      id: 'luxury',
      label: 'Royal & Luxury',
      badge: '₹12,000 – ₹25,000+ / day',
      desc: '5-star heritage palaces, private chauffeur cars, fine dining, VIP monument passes & safaris.',
      icon: '👑'
    }
  ];

  // Calculation Logic
  const calculation = useMemo(() => {
    const styleData = budgetMatrices.styles[travelStyle] || budgetMatrices.styles.midrange;
    const destFactor = budgetMatrices.destinationMultipliers[destinationTier]?.factor || 1.0;

    // Room sharing factor: 1 person = 1 room, 2 persons = 1 room (shared), 3 = 2 rooms, etc.
    const roomsCount = Math.ceil(travelersCount / 2);
    const dailyLodgingTotal = styleData.lodging * destFactor * roomsCount;

    // Food is per person
    const dailyFoodTotal = styleData.food * destFactor * travelersCount;

    // Local Transport: shared vehicle for group (1-4 fits 1 cab)
    const vehiclesCount = Math.ceil(travelersCount / 4);
    const dailyTransportTotal = styleData.transport * destFactor * (travelersCount === 1 ? 1 : 1.4 * vehiclesCount);

    // Sightseeing is per person
    const dailySightseeingTotal = styleData.sightseeing * destFactor * travelersCount;

    const totalLodging = Math.round(dailyLodgingTotal * durationDays);
    const totalFood = Math.round(dailyFoodTotal * durationDays);
    const totalTransport = Math.round(dailyTransportTotal * durationDays);
    const totalSightseeing = Math.round(dailySightseeingTotal * durationDays);

    const totalCost = totalLodging + totalFood + totalTransport + totalSightseeing;
    const perPersonCost = Math.round(totalCost / travelersCount);
    const perDayCost = Math.round(totalCost / durationDays);

    // Percentage breakdown
    const lodgingPct = Math.round((totalLodging / totalCost) * 100);
    const foodPct = Math.round((totalFood / totalCost) * 100);
    const transportPct = Math.round((totalTransport / totalCost) * 100);
    const sightseeingPct = 100 - lodgingPct - foodPct - transportPct;

    return {
      totalCost,
      perPersonCost,
      perDayCost,
      totalLodging,
      totalFood,
      totalTransport,
      totalSightseeing,
      lodgingPct,
      foodPct,
      transportPct,
      sightseeingPct,
      estDailyStayRate: Math.round(styleData.lodging * destFactor)
    };
  }, [budgetMatrices, destinationTier, durationDays, travelStyle, travelersCount]);

  return (
    <section id="budget-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
          <span>Transparent Indian Rupee (₹) Estimator</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Interactive India Budget Calculator
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Calculate your complete travel expenses in ₹ based on realistic localized Indian market rates for stays, meals, intercity travel, and sightseeing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Destination Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              1. Choose Destination Geography
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destinationOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDestinationTier(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all duration-150 cursor-pointer ${
                    destinationTier === opt.id
                      ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <span className="font-display font-bold text-xs sm:text-sm text-slate-900 block">
                      {opt.label.split('(')[0]}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {opt.label.match(/\((.*?)\)/)?.[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>2. Trip Duration: </span>
                <strong className="text-slate-900 text-sm">{durationDays} Days</strong>
              </label>
              <div className="flex gap-1.5">
                {[3, 7, 14, 21].map((days) => (
                  <button
                    key={days}
                    onClick={() => setDurationDays(days)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold cursor-pointer ${
                      durationDays === days ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="30"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
              <span>1 Day (Quick Getaway)</span>
              <span>15 Days</span>
              <span>30 Days (Grand Bharat Yatra)</span>
            </div>
          </div>

          {/* Travelers Count */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span>3. Number of Travelers: </span>
              <strong className="text-slate-900 text-sm">
                {travelersCount} {travelersCount === 1 ? 'Solo Adventurer' : travelersCount === 2 ? 'Couple / 2 Friends' : 'Group / Family'}
              </strong>
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setTravelersCount(num)}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    travelersCount === num
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'Solo' : 'pax'}
                </button>
              ))}
            </div>
            {travelersCount >= 2 && (
              <p className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1">
                <Check className="w-3 h-3" /> Shared room & cab economics automatically applied.
              </p>
            )}
          </div>

          {/* Travel Style Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              4. Select Travel Comfort Style
            </label>

            <div className="space-y-2.5">
              {travelStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer ${
                    travelStyle === style.id
                      ? 'border-orange-600 bg-orange-50/70 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <span className="font-display font-bold text-sm sm:text-base text-slate-900">
                          {style.label}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">{style.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 shrink-0 ml-2">
                      {style.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Real-Time Output Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Calculation Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            {/* Glow Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Estimated Total Outlay
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-orange-400">₹</span>
                  <span className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
                    {calculation.totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">For {durationDays} Days</span>
                <span className="text-[11px] text-slate-400 block">{travelersCount} Traveler(s)</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Per Person</span>
                <span className="text-lg font-bold text-emerald-400">
                  ₹{calculation.perPersonCost.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Per Day (Total)</span>
                <span className="text-lg font-bold text-amber-400">
                  ₹{calculation.perDayCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Itemized Breakdown Bars */}
            <div className="space-y-4 pt-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
                Cost Breakdown Categories
              </span>

              {/* Lodging */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span>🏨</span> Lodging & Rooms ({calculation.lodgingPct}%)
                  </span>
                  <span className="font-bold text-white">
                    ₹{calculation.totalLodging.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${calculation.lodgingPct}%` }}></div>
                </div>
              </div>

              {/* Food */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span>🍲</span> Food, Snacks & Dining ({calculation.foodPct}%)
                  </span>
                  <span className="font-bold text-white">
                    ₹{calculation.totalFood.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${calculation.foodPct}%` }}></div>
                </div>
              </div>

              {/* Transport */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span>🚆</span> Local Cabs, Metro & Transit ({calculation.transportPct}%)
                  </span>
                  <span className="font-bold text-white">
                    ₹{calculation.totalTransport.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full transition-all duration-300" style={{ width: `${calculation.transportPct}%` }}></div>
                </div>
              </div>

              {/* Sightseeing */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span>🎟️</span> Sightseeing, Permits & Guides ({calculation.sightseeingPct}%)
                  </span>
                  <span className="font-bold text-white">
                    ₹{calculation.totalSightseeing.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full transition-all duration-300" style={{ width: `${calculation.sightseeingPct}%` }}></div>
                </div>
              </div>

            </div>

            {/* Action Buttons: Copy / Stays */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => onFindStaysForBudget(travelStyle)}
                className="w-full py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                <Bed className="w-4 h-4" />
                <span>Find Stays for this Budget (₹{calculation.estDailyStayRate}/night)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  const summary = `🇮🇳 BharatYatra Trip Budget Estimate (in ₹):
Duration: ${durationDays} Days | Travelers: ${travelersCount}
Travel Style: ${travelStyles.find(s => s.id === travelStyle)?.label}
Total Cost: ₹${calculation.totalCost.toLocaleString('en-IN')} (₹${calculation.perPersonCost.toLocaleString('en-IN')} / person)
- Lodging: ₹${calculation.totalLodging.toLocaleString('en-IN')}
- Food: ₹${calculation.totalFood.toLocaleString('en-IN')}
- Transport: ₹${calculation.totalTransport.toLocaleString('en-IN')}
- Sightseeing: ₹${calculation.totalSightseeing.toLocaleString('en-IN')}
Planned with Incredible India Tourist Guide`;
                  navigator.clipboard.writeText(summary);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Budget Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>Copy Budget Summary to Clipboard</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* India Smart Travel Money Tips */}
          <div className="bg-amber-50/80 rounded-3xl p-5 border border-amber-200/80 space-y-3">
            <h4 className="font-display font-bold text-sm text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>India Travel Money Pro-Tips:</span>
            </h4>
            <ul className="text-xs text-amber-900/90 space-y-1.5 leading-relaxed">
              <li>• <strong>UPI Everywhere:</strong> 99% of vendors accept digital UPI scan payments (GPay/PhonePe), even for ₹10 coconut water.</li>
              <li>• <strong>IRCTC Advance Train Bookings:</strong> Book Vande Bharat & 2AC / 3AC berths 60–120 days in advance to avoid Tatkal surge fees.</li>
              <li>• <strong>ASI Monument Composite Passes:</strong> Carry student IDs or buy ASI e-tickets online via ASI QR portals for 10% instant discounts.</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
}
