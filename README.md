# 🇮🇳 BharatYatra — India Ultimate Tourist Guide & Budget Planner

A modern, responsive, and highly interactive travel planning web application built to showcase India's extraordinary cultural, climatic, and geographical diversity across all **28 States and 8 Union Territories**.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-orange)
![Currency](https://img.shields.io/badge/Currency-Indian%20Rupees%20(%E2%82%B9)-emerald)
![Coverage](https://img.shields.io/badge/Coverage-28%20States%20%2B%208%20UTs-blue)

---

## 🌟 Key Features

### 1. Multi-Dimensional Navigation Hub (28 States & 8 UTs)
- **Geographic Zone Filtering**: Explore states by North, South, East, West, North-East, Central, or Union Territories.
- **Landscape & Terrain Selector**: Fast-track by Himalayan Valleys, Coastal Beaches, Heritage Forts & Palaces, Wildlife Jungles, Sacred Ghats, and Desert & Dunes.
- **State Deep-Dive Modal**: In-depth view showcasing top tourist spots with UNESCO badges, iconic traditional cuisines (*Dal Baati Churma, Appam with Stew, Siddu, Goan Prawn Curry, Thukpa*), folk traditions, and travel advisories.
- **Saved Favorites**: One-click state bookmarking for personalized itinerary planning.

### 2. Seasonal & Climate-Based Recommendations
- **4 Dynamic Seasons**: Categorized into **Winter (Nov–Feb)**, **Summer (Mar–June)**, **Monsoon (July–Sep)**, and **Autumn (October)**.
- **Microclimate Intelligence**: Average temperatures across plains and hill stations, smart packing checklists, and festive cultural calendars (*Pushkar Camel Fair, Rann Utsav, Hornbill, Hemis, Onam, Durga Puja, Diwali*).

### 3. Interactive Budget Planner & Calculator (in ₹ Indian Rupees)
- **Dynamic Cost Calculator**: Select destination terrain (*Metro & Heritage, Himalayan Passes, Coastal, Offbeat*), trip duration (1–30 days), and group size (1–6 travelers with realistic shared lodging and cab economics).
- **Travel Style Tiers**:
  - 🎒 **Backpacker / Budget**: ₹800 – ₹1,850/day
  - 🧳 **Comfortable Mid-Range**: ₹2,800 – ₹5,400/day
  - 👑 **Royal & Luxury**: ₹12,000 – ₹25,000+/day
- **Itemized Visual Breakdown**: Live percentage progress bars for **Lodging, Food & Chai, Local Transit, and Sightseeing & Permits**.
- **One-Click Share**: Copy formatted budget summary to clipboard.

### 4. "Stay Finder" Accommodation Modules (in ₹)
- **Verified Price Tiers**: Budget Hostels (starting at ₹699/night, e.g. Zostel style), Boutique Heritage Homestays, and Luxury Palaces (e.g. Taj Lake Palace, Wildflower Hall).
- **Filters**: Pricing slider, amenities (WiFi, AC, Breakfast, Pool, Mountain View), and proximity to landmarks.
- **Interactive Booking Preview**: Instant reservation calculator with dates, guests, and local taxes.

### 5. Cultural Insights & Travel Essentials
- Indian Railways & Vande Bharat guidance.
- Digital India & UPI cashless payments guide.
- Temple customs, sacred etiquettes, and eco-friendly tourism.
- Official Government of India 24x7 Tourist Helpline (**1363**) and Emergency Services (**112**).

---

## 🛠️ Technology Stack

- **Frontend**: [React 18+](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Plus Jakarta Sans, Outfit, Playfair Display (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed:
```bash
node -v
npm -v
```

### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git

# Navigate to project directory
cd india-tourist-guide

# Install dependencies
npm install

# Start development preview server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Directory Structure

```text
india-tourist-guide/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   └── india-guide-data.json      # Complete data for states, seasons, stays, and budget matrices
│   ├── components/
│   │   ├── Navbar.jsx                 # Glassmorphic header, search, bookmarks, mobile drawer
│   │   ├── Hero.jsx                   # Visual banner, stats counter, quick filter chips
│   │   ├── StateExplorer.jsx          # Multi-dimensional filter hub (28 States + 8 UTs)
│   │   ├── StateCard.jsx              # Responsive state card with badges and actions
│   │   ├── StateModal.jsx             # Deep-dive cultural drawer/modal
│   │   ├── SeasonalGuide.jsx          # 4-season climate planner & festivals
│   │   ├── BudgetCalculator.jsx       # Interactive ₹ budget estimator & export
│   │   ├── StayFinder.jsx             # Accommodations module with ₹ filters & booking modal
│   │   ├── CulturalInsights.jsx       # Train guide, UPI, etiquette, emergency numbers
│   │   └── Footer.jsx                 # Links, emergency helpline (112, 1363), disclaimer
```

---

## 📜 License
Crafted with admiration for Incredible India. Feel free to use and adapt!
