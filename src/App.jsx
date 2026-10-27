import React, { useState, useEffect } from 'react';
import indiaGuideData from './data/india-guide-data.json';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StateExplorer from './components/StateExplorer';
import InteractiveMap from './components/InteractiveMap';
import StateModal from './components/StateModal';
import SeasonalGuide from './components/SeasonalGuide';
import BudgetCalculator from './components/BudgetCalculator';
import StayFinder from './components/StayFinder';
import CulturalInsights from './components/CulturalInsights';
import ItineraryBuilder from './components/ItineraryBuilder';
import SavedDrawer from './components/SavedDrawer';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('states');
  const [selectedStateForModal, setSelectedStateForModal] = useState(null);
  
  // Persist bookmarks in localStorage for professional user experience
  const [bookmarkedStates, setBookmarkedStates] = useState(() => {
    try {
      const saved = localStorage.getItem('bharatyatra_saved_states');
      return saved ? JSON.parse(saved) : ['rajasthan', 'kerala', 'ladakh', 'goa'];
    } catch {
      return ['rajasthan', 'kerala', 'ladakh', 'goa'];
    }
  });

  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLandscapeFilter, setActiveLandscapeFilter] = useState('All Landscapes');
  const [preselectedBudgetDestination, setPreselectedBudgetDestination] = useState(null);
  const [preselectedItineraryState, setPreselectedItineraryState] = useState(null);
  const [initialStayTier, setInitialStayTier] = useState('all');
  const [initialStayState, setInitialStayState] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem('bharatyatra_saved_states', JSON.stringify(bookmarkedStates));
    } catch {
      // Storage unavailable or disabled
    }
  }, [bookmarkedStates]);

  const toggleBookmark = (stateId) => {
    setBookmarkedStates((prev) => 
      prev.includes(stateId) ? prev.filter(id => id !== stateId) : [...prev, stateId]
    );
  };

  const handleSelectState = (state) => {
    setSelectedStateForModal(state);
  };

  const handleCalculateBudgetForState = (state) => {
    setPreselectedBudgetDestination(state);
    setActiveTab('budget');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateItineraryForState = (state) => {
    setPreselectedItineraryState(state);
    setActiveTab('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFindStaysForState = (state) => {
    setInitialStayState(state.name);
    setInitialStayTier('all');
    setActiveTab('stays');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFindStaysForBudgetStyle = (travelStyle) => {
    const tierMap = {
      'backpacker': 'budget',
      'midrange': 'mid-range',
      'luxury': 'luxury'
    };
    setInitialStayTier(tierMap[travelStyle] || 'all');
    setInitialStayState('all');
    setActiveTab('stays');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Sticky Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkedStates={bookmarkedStates}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero banner shown on main state explorer tab */}
        {activeTab === 'states' && (
          <Hero
            setActiveTab={setActiveTab}
            onFilterLandscape={(landscape) => {
              setActiveLandscapeFilter(landscape);
              const el = document.getElementById('states-hub');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            totalStatesCount={indiaGuideData.states.length}
          />
        )}

        {/* 1. Explore All 36 States & UTs */}
        {activeTab === 'states' && (
          <StateExplorer
            states={indiaGuideData.states}
            onSelectState={handleSelectState}
            bookmarkedStates={bookmarkedStates}
            onToggleBookmark={toggleBookmark}
            onCalculateBudget={handleCalculateBudgetForState}
            onFindStays={handleFindStaysForState}
            onGenerateItinerary={handleGenerateItineraryForState}
            onOpenMap={() => {
              setActiveTab('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeLandscapeFilter={activeLandscapeFilter}
            setActiveLandscapeFilter={setActiveLandscapeFilter}
          />
        )}

        {/* 2. Interactive Vector India Map */}
        {activeTab === 'map' && (
          <InteractiveMap
            states={indiaGuideData.states}
            onSelectState={handleSelectState}
            bookmarkedStates={bookmarkedStates}
            onToggleBookmark={toggleBookmark}
            onCalculateBudget={handleCalculateBudgetForState}
            onFindStays={handleFindStaysForState}
            onGenerateItinerary={handleGenerateItineraryForState}
          />
        )}

        {/* 2. Custom Itinerary Planner */}
        {activeTab === 'itinerary' && (
          <ItineraryBuilder
            key={preselectedItineraryState?.id || 'default-itinerary'}
            states={indiaGuideData.states}
            initialState={preselectedItineraryState}
            onCalculateBudget={handleCalculateBudgetForState}
            onFindStays={handleFindStaysForState}
          />
        )}

        {/* 3. Best by Season Guide */}
        {activeTab === 'seasons' && (
          <SeasonalGuide
            seasonsData={indiaGuideData.seasons}
            states={indiaGuideData.states}
            onSelectState={handleSelectState}
            onCalculateBudget={handleCalculateBudgetForState}
          />
        )}

        {/* 4. Interactive Indian Rupee Budget Calculator */}
        {activeTab === 'budget' && (
          <BudgetCalculator
            key={preselectedBudgetDestination?.id || 'default-budget'}
            budgetMatrices={indiaGuideData.budgetMatrices}
            allStates={indiaGuideData.states}
            onFindStaysForBudget={handleFindStaysForBudgetStyle}
            preselectedDestination={preselectedBudgetDestination}
          />
        )}

        {/* 5. Handpicked Stay Finder */}
        {activeTab === 'stays' && (
          <StayFinder
            key={`${initialStayTier}-${initialStayState}`}
            stays={indiaGuideData.stays}
            initialTierFilter={initialStayTier}
            initialLocationFilter={initialStayState}
          />
        )}

        {/* 6. Cultural Wisdom & Travel Guide */}
        {activeTab === 'culture' && (
          <CulturalInsights />
        )}
      </main>

      {/* State Deep-Dive Modal */}
      {selectedStateForModal && (
        <StateModal
          key={selectedStateForModal.id}
          state={selectedStateForModal}
          onClose={() => setSelectedStateForModal(null)}
          isBookmarked={bookmarkedStates.includes(selectedStateForModal.id)}
          onToggleBookmark={toggleBookmark}
          onCalculateBudget={handleCalculateBudgetForState}
          onFindStays={handleFindStaysForState}
          onGenerateItinerary={handleGenerateItineraryForState}
        />
      )}

      {/* Slide-over Saved Wishlist Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        bookmarkedStates={bookmarkedStates}
        allStates={indiaGuideData.states}
        onToggleBookmark={toggleBookmark}
        onSelectState={handleSelectState}
        onCalculateBudget={handleCalculateBudgetForState}
        onFindStays={handleFindStaysForState}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
