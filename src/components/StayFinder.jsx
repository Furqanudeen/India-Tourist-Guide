import React, { useState, useMemo } from 'react';
import { 
  Bed, Star, MapPin, 
  X, Search, 
  RotateCcw, ArrowRight
} from 'lucide-react';

export default function StayFinder({ stays = [], initialTierFilter, initialLocationFilter }) {
  const [selectedTier, setSelectedTier] = useState(initialTierFilter || 'all');
  const [selectedState, setSelectedState] = useState(initialLocationFilter || 'all');
  const [selectedAmenity, setSelectedAmenity] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [maxPrice, setMaxPrice] = useState(30000);
  const [bookingModalStay, setBookingModalStay] = useState(null);
  const [bookingDays, setBookingDays] = useState(3);
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const tiers = [
    { id: 'all', label: 'All Accommodations' },
    { id: 'budget', label: '🎒 Budget Hostels (₹600 – ₹1,200)' },
    { id: 'mid-range', label: '🧳 Boutique Homestays (₹2,000 – ₹5,500)' },
    { id: 'luxury', label: '👑 Heritage & Luxury Palaces (₹12,000+)' },
  ];

  const uniqueStates = useMemo(() => {
    const set = new Set(stays.map(s => s.state));
    if (selectedState && selectedState !== 'all') {
      set.add(selectedState);
    }
    return ['all', ...Array.from(set).sort()];
  }, [stays, selectedState]);

  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      // Tier match
      if (selectedTier !== 'all' && stay.tier !== selectedTier) return false;

      // State match
      if (selectedState !== 'all' && stay.state !== selectedState) return false;

      // Max price
      if (stay.pricePerNight > maxPrice) return false;

      // Amenity
      if (selectedAmenity !== 'all') {
        const hasAmenity = stay.amenities.some(a => 
          a.toLowerCase().includes(selectedAmenity.toLowerCase())
        );
        if (!hasAmenity) return false;
      }

      // Search keyword
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const inName = stay.name.toLowerCase().includes(q);
        const inCity = stay.city.toLowerCase().includes(q);
        const inState = stay.state.toLowerCase().includes(q);
        const inProximity = stay.proximity.toLowerCase().includes(q);
        if (!inName && !inCity && !inState && !inProximity) return false;
      }

      return true;
    });
  }, [stays, selectedTier, selectedState, maxPrice, selectedAmenity, searchKeyword]);

  const handleOpenBooking = (stay) => {
    setBookingModalStay(stay);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setConfirmationCode(`BY-${Math.floor(100000 + Math.random() * 900000)}`);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalStay(null);
      setBookingSuccess(false);
      setConfirmationCode('');
    }, 2500);
  };

  const handleResetFilters = () => {
    setSelectedTier('all');
    setSelectedState('all');
    setSelectedAmenity('all');
    setSearchKeyword('');
    setMaxPrice(30000);
  };

  return (
    <section id="stay-finder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3 shadow-xs">
          <Bed className="w-3.5 h-3.5 text-orange-600" />
          <span>Verified Indian Accommodations & Stays Hub</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Handpicked Stays Tailored in ₹ Rupees
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          From social backpacker hostels starting at ₹699 to fragrant spice plantation homestays and royal fairytale lake palaces.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs mb-8 space-y-5">
        
        {/* Tier Pills */}
        <div>
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2.5">
            1. Select Accommodation Style & Comfort
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {tiers.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  selectedTier === t.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row: Keyword Search, State, Amenity, Price */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          
          {/* Keyword Search */}
          <div>
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Search by City / Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="E.g., Jaipur, Munnar, Goa..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Filter by State / Region
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st === 'all' ? 'All Indian States' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Amenities Filter */}
          <div>
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Key Amenity Focus
            </label>
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Amenities</option>
              <option value="WiFi">High-Speed WiFi (Workation Ready)</option>
              <option value="Air Conditioning">Air Conditioning (AC)</option>
              <option value="Breakfast">Complimentary Breakfast</option>
              <option value="View">Mountain / Lake / Beach View</option>
              <option value="Spa">Spa & Ayurvedic Wellness</option>
              <option value="Pool">Swimming Pool</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Max Price / Night
              </label>
              <span className="text-xs font-bold text-orange-600">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="600"
              max="30000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
          </div>

        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6 px-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Found <strong className="text-slate-900">{filteredStays.length}</strong> verified accommodations matching your criteria
        </p>

        {(selectedTier !== 'all' || selectedState !== 'all' || selectedAmenity !== 'all' || searchKeyword.trim() || maxPrice < 30000) && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Stay Filters</span>
          </button>
        )}
      </div>

      {/* Stay Cards Grid */}
      {filteredStays.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStays.map((stay) => (
            <div
              key={stay.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between card-hover-lift group"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  
                  {/* Type Badge */}
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                    stay.tier === 'budget' 
                      ? 'bg-amber-400 text-slate-950'
                      : stay.tier === 'mid-range'
                      ? 'bg-teal-700 text-white'
                      : 'bg-purple-900/90 text-amber-300 border border-amber-300/30'
                  }`}>
                    {stay.type}
                  </span>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-white text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{stay.rating}</span>
                    <span className="text-[10px] text-slate-300">({stay.reviewsCount})</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>{stay.city}, {stay.state}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                    {stay.name}
                  </h3>

                  {/* Proximity Pill */}
                  <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-orange-50/80 border border-orange-100 text-orange-950 text-xs font-medium leading-relaxed">
                    📍 {stay.proximity}
                  </div>

                  {/* Amenities Badges */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {stay.amenities.map((amenity, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting from</span>
                  <div className="flex items-baseline gap-0.5 text-slate-900 font-extrabold text-xl">
                    <span className="text-orange-600 text-sm">₹</span>
                    <span>{stay.pricePerNight.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400 text-xs font-normal"> / night</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBooking(stay)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
                >
                  Reserve Preview
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center text-2xl mb-4">
            🏨
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-display">
            {selectedState !== 'all' ? `No Verified Stays Catalogued for ${selectedState} Yet` : 'No Stays Found Matching Filters'}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {selectedState !== 'all' 
              ? `We are currently inspecting verified boutique homestays and backpacker hostels in ${selectedState}. Reset filters to explore stays in popular adjacent regions.`
              : "Try adjusting your maximum price slider, clearing your keyword search, or selecting 'All Indian States'."}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Booking / Details Modal */}
      {bookingModalStay && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setBookingModalStay(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setBookingModalStay(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl mb-4 animate-bounce">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">Booking Reservation Held!</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Mock booking held for <strong>{bookingModalStay.name}</strong> ({bookingDays} nights for {bookingGuests} guest(s)).
                </p>
                <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-emerald-900 text-xs font-medium">
                  Direct partner confirmation number: <strong>{confirmationCode}</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-600 block">
                    {bookingModalStay.type}
                  </span>
                  <h3 className="font-display text-2xl font-extrabold text-slate-900 mt-0.5">
                    {bookingModalStay.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {bookingModalStay.city}, {bookingModalStay.state} — {bookingModalStay.proximity}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Nights to Stay</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={bookingDays}
                      onChange={(e) => setBookingDays(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Guests</label>
                    <select
                      value={bookingGuests}
                      onChange={(e) => setBookingGuests(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="1">1 Solo Guest</option>
                      <option value="2">2 Guests (1 Room)</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests (2 Rooms)</option>
                    </select>
                  </div>
                </div>

                {/* Price Breakdown in Modal */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>₹{bookingModalStay.pricePerNight.toLocaleString('en-IN')} × {bookingDays} night(s)</span>
                    <span className="font-bold text-slate-800">
                      ₹{(bookingModalStay.pricePerNight * bookingDays).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST & Indian Hospitality Cess (12%)</span>
                    <span className="font-bold text-slate-800">
                      ₹{Math.round(bookingModalStay.pricePerNight * bookingDays * 0.12).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Estimated (in ₹)</span>
                    <span className="text-emerald-700">
                      ₹{Math.round(bookingModalStay.pricePerNight * bookingDays * 1.12).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Confirm Instant Stay Hold (₹)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
