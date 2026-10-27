import React, { useState, useMemo } from 'react';
import { 
  IndianRupee, Users, Clock, ArrowRight, Bed, 
  Sparkles, Check, Share2, MapPin, 
  RotateCcw, Sliders
} from 'lucide-react';

const CURRENCY_RATES = {
  INR: { symbol: '₹', rate: 1.0, label: 'Indian Rupee' },
  USD: { symbol: '$', rate: 0.012, label: 'US Dollar (1 USD ≈ ₹83)' },
  EUR: { symbol: '€', rate: 0.011, label: 'Euro (1 EUR ≈ ₹90)' },
  GBP: { symbol: '£', rate: 0.0094, label: 'British Pound (1 GBP ≈ ₹106)' }
};

const DESTINATION_CIRCUITS = [
  { id: 'metro-heritage', label: 'Golden Triangle & Heritage (Delhi, Jaipur, Agra, Varanasi)', factor: 1.0, icon: '🏰' },
  { id: 'himalayan', label: 'Himalayan & Mountain Passes (Himachal, Ladakh, Kashmir, Sikkim)', factor: 1.18, icon: '🏔️' },
  { id: 'coastal', label: 'Coastal & Island Paradises (Goa, Kerala, Andaman, Lakshadweep)', factor: 1.22, icon: '🏖️' },
  { id: 'offbeat', label: 'Northeast & Heartland (Meghalaya, Assam, Hampi, Madhya Pradesh)', factor: 0.95, icon: '🌿' }
];

export default function BudgetCalculator({ 
  budgetMatrices, 
  allStates = [], 
  onFindStaysForBudget, 
  preselectedDestination 
}) {
  const [calculationMode, setCalculationMode] = useState('state'); // 'state' or 'circuit'
  const [selectedStateId, setSelectedStateId] = useState(preselectedDestination?.id || 'rajasthan');
  const [circuitTier, setCircuitTier] = useState(() => {
    if (preselectedDestination?.landscape?.toLowerCase().includes('himalay')) return 'himalayan';
    if (preselectedDestination?.landscape?.toLowerCase().includes('coast') || preselectedDestination?.landscape?.toLowerCase().includes('beach')) return 'coastal';
    return 'metro-heritage';
  });
  const [durationDays, setDurationDays] = useState(7);
  const [travelStyle, setTravelStyle] = useState('midrange');
  const [travelersCount, setTravelersCount] = useState(2);
  const [selectedCurrency, setSelectedCurrency] = useState('INR'); // INR, USD, EUR, GBP
  const [includeShoppingBuffer, setIncludeShoppingBuffer] = useState(true);
  const [copied, setCopied] = useState(false);

  const travelStyles = [
    {
      id: 'backpacker',
      label: 'Backpacker / Budget Explorer',
      badge: '₹900 – ₹1,900 / day',
      desc: 'Clean dorms & Zostel beds, local dhabas & street eats, trains & state buses, independent walking tours.',
      icon: '🎒'
    },
    {
      id: 'midrange',
      label: 'Comfortable Boutique Mid-Range',
      badge: '₹2,900 – ₹5,800 / day',
      desc: 'Private rooms in heritage homestays, AC cabs & Vande Bharat trains, reputable restaurants, guided experiences.',
      icon: '🧳'
    },
    {
      id: 'luxury',
      label: 'Royal Palace & Luxury Indulgence',
      badge: '₹14,000 – ₹28,000+ / day',
      desc: '5-star royal heritage palaces, private chauffeur SUVs, fine dining thalis, private boat charters & VIP monument entries.',
      icon: '👑'
    }
  ];

  // Currently selected state object
  const activeStateObj = useMemo(() => {
    return allStates.find(s => s.id === selectedStateId) || allStates[0] || null;
  }, [allStates, selectedStateId]);

  // Calculation Logic
  const calculation = useMemo(() => {
    const styleData = budgetMatrices?.styles?.[travelStyle] || {
      lodging: 2400,
      food: 1100,
      transport: 1200,
      sightseeing: 600
    };

    let destMultiplier = 1.0;

    if (calculationMode === 'state' && activeStateObj) {
      // Use state benchmark: ratio against baseline 2200
      const benchmark = activeStateObj.avgBudgetPerDay || 2200;
      destMultiplier = benchmark / 2200;
    } else {
      destMultiplier = budgetMatrices?.destinationMultipliers?.[circuitTier]?.factor || 1.0;
    }

    // Accommodation: 1 person = 1 room/bed, 2 persons = 1 room (shared), 3 = 2 rooms, etc.
    const roomsCount = Math.ceil(travelersCount / 2);
    const dailyLodgingTotal = styleData.lodging * destMultiplier * roomsCount;

    // Food: per person
    const dailyFoodTotal = styleData.food * destMultiplier * travelersCount;

    // Local Transport: shared vehicle for group (1-4 pax fits 1 cab, 5-6 pax fits an Innova/van)
    const vehiclesCount = Math.ceil(travelersCount / 4);
    const transportSharingDiscount = travelersCount === 1 ? 1 : 1.35 * vehiclesCount;
    const dailyTransportTotal = styleData.transport * destMultiplier * transportSharingDiscount;

    // Sightseeing & Activities: per person
    const dailySightseeingTotal = styleData.sightseeing * destMultiplier * travelersCount;

    // Optional Shopping & Emergency Buffer (approx 8% of total daily spend)
    const dailyBuffer = includeShoppingBuffer ? (dailyFoodTotal + dailyLodgingTotal) * 0.08 : 0;

    const totalLodging = Math.round(dailyLodgingTotal * durationDays);
    const totalFood = Math.round(dailyFoodTotal * durationDays);
    const totalTransport = Math.round(dailyTransportTotal * durationDays);
    const totalSightseeing = Math.round(dailySightseeingTotal * durationDays);
    const totalBuffer = Math.round(dailyBuffer * durationDays);

    const totalCostINR = totalLodging + totalFood + totalTransport + totalSightseeing + totalBuffer;
    const perPersonCostINR = Math.round(totalCostINR / travelersCount);
    const perDayCostINR = Math.round(totalCostINR / durationDays);

    // Percentages
    const lodgingPct = Math.round((totalLodging / totalCostINR) * 100);
    const foodPct = Math.round((totalFood / totalCostINR) * 100);
    const transportPct = Math.round((totalTransport / totalCostINR) * 100);
    const sightseeingPct = Math.round((totalSightseeing / totalCostINR) * 100);
    const bufferPct = 100 - lodgingPct - foodPct - transportPct - sightseeingPct;

    // Currency Conversion
    const activeCurrencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.INR;
    const cRate = activeCurrencyInfo.rate;
    const cSymbol = activeCurrencyInfo.symbol;

    return {
      totalCostINR,
      perPersonCostINR,
      perDayCostINR,
      convertedTotal: Math.round(totalCostINR * cRate),
      convertedPerPerson: Math.round(perPersonCostINR * cRate),
      convertedPerDay: Math.round(perDayCostINR * cRate),
      totalLodging,
      totalFood,
      totalTransport,
      totalSightseeing,
      totalBuffer,
      lodgingPct,
      foodPct,
      transportPct,
      sightseeingPct,
      bufferPct: Math.max(0, bufferPct),
      currencySymbol: cSymbol,
      estDailyStayRateINR: Math.round(styleData.lodging * destMultiplier)
    };
  }, [
    budgetMatrices, calculationMode, activeStateObj, circuitTier, 
    durationDays, travelStyle, travelersCount, includeShoppingBuffer, 
    selectedCurrency
  ]);

  const handleCopyBudget = () => {
    const destName = calculationMode === 'state' && activeStateObj ? activeStateObj.name : 'All-India Circuit';
    const summary = `🇮🇳 BharatYatra Trip Budget Estimate:
Destination: ${destName}
Duration: ${durationDays} Days | Travelers: ${travelersCount}
Style: ${travelStyles.find(s => s.id === travelStyle)?.label}
Total Cost: ₹${calculation.totalCostINR.toLocaleString('en-IN')} (₹${calculation.perPersonCostINR.toLocaleString('en-IN')} / person)
- 🏨 Lodging: ₹${calculation.totalLodging.toLocaleString('en-IN')}
- 🍲 Food & Dining: ₹${calculation.totalFood.toLocaleString('en-IN')}
- 🚆 Local Transport: ₹${calculation.totalTransport.toLocaleString('en-IN')}
- 🎟️ Sightseeing & Entries: ₹${calculation.totalSightseeing.toLocaleString('en-IN')}
${includeShoppingBuffer ? `- 🛍️ Shopping Buffer: ₹${calculation.totalBuffer.toLocaleString('en-IN')}` : ''}
Planned with Incredible India Tourist Guide & Budget Planner`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="budget-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-3 shadow-xs">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
          <span>Transparent Indian Rupee (₹) Financial Estimator</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Interactive India Trip Budget Calculator
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Calculate your end-to-end travel expenses based on real Indian market rates for accommodations, delicious regional dining, transit, and entry tickets.
        </p>

        {/* Currency Switcher */}
        <div className="mt-5 inline-flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 px-2.5">Display Currency:</span>
          {Object.keys(CURRENCY_RATES).map((curr) => (
            <button
              key={curr}
              onClick={() => setSelectedCurrency(curr)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCurrency === curr 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {curr} ({CURRENCY_RATES[curr].symbol})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Mode Switcher: By Specific State vs By Circuit */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-orange-600" />
                <span>1. Choose Destination Selection Method</span>
              </label>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setCalculationMode('state')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    calculationMode === 'state' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Specific State (36)
                </button>
                <button
                  onClick={() => setCalculationMode('circuit')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    calculationMode === 'circuit' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Regional Circuit
                </button>
              </div>
            </div>

            {/* Destination Selection based on mode */}
            {calculationMode === 'state' ? (
              <div className="space-y-2">
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600 pointer-events-none" />
                  <select
                    value={selectedStateId}
                    onChange={(e) => setSelectedStateId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl pl-10 pr-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {allStates.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} — {st.region} India ({st.landscape}) • Avg ₹{st.avgBudgetPerDay}/day
                      </option>
                    ))}
                  </select>
                </div>

                {activeStateObj && (
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-orange-50/70 border border-orange-100 text-xs">
                    <span className="text-orange-950 font-medium">
                      Tailored for <strong>{activeStateObj.name}</strong> ({activeStateObj.capital})
                    </span>
                    <span className="font-bold text-orange-700">
                      Standard Benchmark: ₹{activeStateObj.avgBudgetPerDay}/day
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DESTINATION_CIRCUITS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCircuitTier(opt.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      circuitTier === opt.id
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
            )}
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>2. Trip Duration: </span>
                <strong className="text-slate-900 text-sm font-extrabold">{durationDays} Days ({durationDays - 1} Nights)</strong>
              </label>

              <div className="flex gap-1.5">
                {[3, 5, 7, 10, 14, 21].map((days) => (
                  <button
                    key={days}
                    onClick={() => setDurationDays(days)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                      durationDays === days 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
              <span>1 Day (Day Excursion)</span>
              <span>7 Days (Classic Circuit)</span>
              <span>14 Days (In-Depth)</span>
              <span>30 Days (Grand Bharat Yatra)</span>
            </div>
          </div>

          {/* Travelers Count */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span>3. Number of Travelers: </span>
              <strong className="text-slate-900 text-sm font-extrabold">
                {travelersCount} {travelersCount === 1 ? 'Solo Adventurer' : travelersCount === 2 ? 'Couple / 2 Friends' : 'Family / Group'}
              </strong>
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setTravelersCount(num)}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
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
              <p className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Room sharing & cab split economics automatically applied.</span>
              </p>
            )}
          </div>

          {/* Travel Style Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              4. Travel Comfort Style & Tier
            </label>

            <div className="space-y-2.5">
              {travelStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    travelStyle === style.id
                      ? 'border-orange-600 bg-orange-50/70 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{style.icon}</span>
                      <div>
                        <span className="font-display font-bold text-sm sm:text-base text-slate-900">
                          {style.label}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{style.desc}</p>
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

          {/* Extra Toggle: Shopping & Emergency Buffer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="shopping-buffer"
                checked={includeShoppingBuffer}
                onChange={(e) => setIncludeShoppingBuffer(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded-md border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="shopping-buffer" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Include Souvenir Shopping & Contingency Buffer (approx 8%)
              </label>
            </div>

            <button
              onClick={() => {
                setDurationDays(7);
                setTravelersCount(2);
                setTravelStyle('midrange');
                setSelectedCurrency('INR');
                setIncludeShoppingBuffer(true);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

        </div>

        {/* Right Column: Dynamic Real-Time Output Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Calculation Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
            {/* Glow Accent */}
            <div className="absolute top-0 right-0 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Total Estimated Outlay
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-orange-400">
                    {calculation.currencySymbol}
                  </span>
                  <span className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
                    {selectedCurrency === 'INR' 
                      ? calculation.totalCostINR.toLocaleString('en-IN')
                      : calculation.convertedTotal.toLocaleString()}
                  </span>
                  {selectedCurrency !== 'INR' && (
                    <span className="text-xs text-slate-400 ml-1">
                      (≈ ₹{calculation.totalCostINR.toLocaleString('en-IN')})
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-300 font-semibold block">
                  {durationDays} Days / {durationDays - 1} Nts
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {travelersCount} Traveler(s)
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Per Person</span>
                <span className="text-lg font-bold text-emerald-400">
                  {calculation.currencySymbol}
                  {selectedCurrency === 'INR' 
                    ? calculation.perPersonCostINR.toLocaleString('en-IN') 
                    : calculation.convertedPerPerson.toLocaleString()}
                </span>
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Per Day (Total)</span>
                <span className="text-lg font-bold text-amber-400">
                  {calculation.currencySymbol}
                  {selectedCurrency === 'INR' 
                    ? calculation.perDayCostINR.toLocaleString('en-IN') 
                    : calculation.convertedPerDay.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Itemized Cost Breakdown Bars */}
            <div className="space-y-4 pt-2">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">
                Itemized Expense Allocation
              </span>

              {/* Lodging */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span>🏨</span> Stays & Rooms ({calculation.lodgingPct}%)
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
                    <span>🍲</span> Food & Regional Dining ({calculation.foodPct}%)
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
                    <span>🚆</span> Local Cabs, Metro & Rail ({calculation.transportPct}%)
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

              {/* Shopping & Buffer */}
              {includeShoppingBuffer && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span>🛍️</span> Souvenirs & Emergency Reserve ({calculation.bufferPct}%)
                    </span>
                    <span className="font-bold text-white">
                      ₹{calculation.totalBuffer.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full transition-all duration-300" style={{ width: `${calculation.bufferPct}%` }}></div>
                  </div>
                </div>
              )}

            </div>

            {/* CTAs: Find Stays / Copy */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <button
                onClick={() => onFindStaysForBudget(travelStyle)}
                className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                <Bed className="w-4 h-4" />
                <span>Find Stays for this Budget (₹{calculation.estDailyStayRateINR}/night)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={handleCopyBudget}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-800 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Trip Budget Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-400" />
                    <span>Copy Complete Budget Breakdown</span>
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
            <ul className="text-xs text-amber-900/90 space-y-2 leading-relaxed">
              <li>• <strong>Instant UPI Everywhere:</strong> 99% of vendors across India accept instant digital QR code payments (Google Pay, PhonePe, Paytm) — even for ₹10 chai!</li>
              <li>• <strong>IRCTC Advance Train Bookings:</strong> Book Vande Bharat & 2AC/3AC train berths 60–120 days in advance to avoid last-minute Tatkal surge charges.</li>
              <li>• <strong>ASI Monument QR E-Tickets:</strong> Purchase monument tickets online via official ASI QR portals to get instant discounts and skip ticketing queues.</li>
            </ul>
          </div>

        </div>

      </div>

    </section>
  );
}
