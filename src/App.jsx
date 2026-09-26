import React, { useState } from 'react';
import indiaGuideData from './data/india-guide-data.json';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StateExplorer from './components/StateExplorer';
import StateModal from './components/StateModal';
import SeasonalGuide from './components/SeasonalGuide';
import BudgetCalculator from './components/BudgetCalculator';
import StayFinder from './components/StayFinder';
import CulturalInsights from './components/CulturalInsights';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('states');
  const [selectedStateForModal, setSelectedStateForModal] = useState(null);
  const [bookmarkedStates, setBookmarkedStates] = useState(['rajasthan', 'kerala', 'ladakh']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLandscapeFilter, setActiveLandscapeFilter] = useState('All Landscapes');
  const [preselectedBudgetDestination, setPreselectedBudgetDestination] = useState(null);
  const [initialStayTier, setInitialStayTier] = useState('all');
  const [initialStayState, setInitialStayState] = useState('all');

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800">
      
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkedStates={bookmarkedStates}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectState={handleSelectState}
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

        {/* Dynamic Tab Views */}
        {activeTab === 'states' && (
          <StateExplorer
            states={indiaGuideData.states}
            onSelectState={handleSelectState}
            bookmarkedStates={bookmarkedStates}
            onToggleBookmark={toggleBookmark}
            onCalculateBudget={handleCalculateBudgetForState}
            onFindStays={handleFindStaysForState}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeLandscapeFilter={activeLandscapeFilter}
            setActiveLandscapeFilter={setActiveLandscapeFilter}
          />
        )}

        {activeTab === 'seasons' && (
          <SeasonalGuide
            seasonsData={indiaGuideData.seasons}
            states={indiaGuideData.states}
            onSelectState={handleSelectState}
            onCalculateBudget={handleCalculateBudgetForState}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetCalculator
            budgetMatrices={indiaGuideData.budgetMatrices}
            onFindStaysForBudget={handleFindStaysForBudgetStyle}
            preselectedDestination={preselectedBudgetDestination}
          />
        )}

        {activeTab === 'stays' && (
          <StayFinder
            stays={indiaGuideData.stays}
            initialTierFilter={initialStayTier}
            initialLocationFilter={initialStayState}
          />
        )}

        {activeTab === 'culture' && (
          <CulturalInsights />
        )}
      </main>

      {/* State Deep-Dive Modal */}
      {selectedStateForModal && (
        <StateModal
          state={selectedStateForModal}
          onClose={() => setSelectedStateForModal(null)}
          isBookmarked={bookmarkedStates.includes(selectedStateForModal.id)}
          onToggleBookmark={toggleBookmark}
          onCalculateBudget={handleCalculateBudgetForState}
          onFindStays={handleFindStaysForState}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
