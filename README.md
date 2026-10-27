# 🇮🇳 BharatYatra — Incredible India Ultimate Tourist Guide & Travel Suite

A modern, responsive, and highly interactive travel planning web application built to showcase India's extraordinary cultural, climatic, and geographical diversity across all **28 States and 8 Union Territories**.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS-orange)
![Currency](https://img.shields.io/badge/Currency-Indian%20Rupees%20(%E2%82%B9)%20%7C%20USD%20%7C%20EUR%20%7C%20GBP-emerald)
![Coverage](https://img.shields.io/badge/Coverage-28%20States%20%2B%208%20UTs%20(100%25)-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

---

## 🌟 Key Features & Capabilities

### 1. Multi-Dimensional Navigation Hub (All 36 States & UTs)
- **100% Complete Data Coverage**: Every single one of India's 28 States and 8 Union Territories features verified signature tourist landmarks with high-resolution imagery, authentic traditional cuisines, cultural heritage highlights, and practical travel advisories.
- **Geographic Zone Filtering**: Explore states across North, South, East, West, North-East, Central, or Union Territories.
- **Landscape & Terrain Selector**: Fast-track by Himalayan Valleys, Coastal Beaches, Heritage Forts & Palaces, Wildlife Jungles, Sacred Ghats, and Desert & Dunes.
- **Tabbed State Deep-Dive Modal**: In-depth modal with tabbed sections for *Top Attractions*, *Signature Cuisines*, *Heritage & Arts*, and *Travel Advisory*, with keyboard `Esc` dismiss and direct action links.

### 2. Interactive Vector Map of India (`InteractiveMap.jsx`)
- **Full Geographic SVG Cartography**: Interactive clickable and hoverable vector map rendering all states and union territories.
- **Thematic Color Modes**: Switch on-the-fly between **By Landscape** (Forts, Mountains, Beaches, Jungles, Dunes), **By Region** (North, South, East, West, North-East, Central, UTs), **By Budget** (Budget, Mid-Range, Luxury), and **By Best Season**.
- **Live Tooltip & Spotlight Dossier**: Hover for instant rating, best season, capital, and daily cost in ₹; click any region to inspect its dossier with instant links to itineraries, stays, and budget calculators.
- **Zoom, Pan & Quick Territory Pins**: Smooth vector zoom controls, state label toggles, and dedicated pins for small territories and islands (Delhi, Goa, Chandigarh, Puducherry, Lakshadweep, Andaman & Nicobar).
- **Dual-Zone Northern Selector**: Dedicated toggle for Jammu & Kashmir and Ladakh.

### 3. Custom Day-by-Day Itinerary Planner (`ItineraryBuilder.jsx`)
- **Automated Journey Generation**: Choose any of the 36 States/UTs, select trip length (3, 5, 7, or 10 days), and select your travel theme (Royalty & Monuments, Scenic & Slow Travel, Active Outdoors, Foodie & Culture).
- **Structured Timelines**: Day-by-day morning, afternoon, and evening itineraries complete with realistic timings, featured meal recommendations, estimated daily budgets, and insider logistics tips.
- **Export & Print**: Copy the formatted markdown itinerary to clipboard or print directly.

### 3. Interactive Budget Planner & Currency Suite (`BudgetCalculator.jsx`)
- **Dual Calculation Modes**: Calculate either by specific State (using localized daily benchmark averages) or by Regional Circuit (Golden Triangle, Himalayan Passes, Coastal, Offbeat Heartland).
- **Multi-Currency Preview**: Real-time currency switcher previewing amounts in **₹ INR (Default)**, **$ USD**, **€ EUR**, and **£ GBP**.
- **Dynamic Group & Sharing Economics**: Duration slider (1–30 days) and group size (1–6 travelers) with automatic room sharing and transport discount economics.
- **Itemized Visual Breakdown**: Live percentage progress bars for **Stays & Rooms**, **Food & Regional Dining**, **Transit & Rail**, **Sightseeing & Permits**, and an optional **Souvenir/Shopping Reserve Buffer**.
- **One-Click Share**: Copy formatted budget summary to clipboard.

### 4. Slide-Over Travel Wishlist Drawer (`SavedDrawer.jsx`)
- **Persistent Bookmarks**: Saved destinations persist in `localStorage` across browsing sessions.
- **Slide-Over Panel**: Accessible at any time via the heart icon in the navigation bar.
- **Wishlist Intelligence**: Computes combined daily benchmarks across all saved destinations and supports one-click export.

### 5. "Stay Finder" Accommodations Module (`StayFinder.jsx`)
- **Verified Price Tiers**: Social Backpacker Hostels (starting at ₹699/night, e.g., Zostel style), Boutique Heritage Homestays, and Luxury Royal Palaces (e.g., Taj Lake Palace, Wildflower Hall, Haveli Dharampura).
- **Real-Time Filters**: Keyword search, State filter, amenity filters (WiFi, AC, Breakfast, Views, Spa, Pool), and price range slider.
- **Interactive Booking Preview**: Instant reservation calculator with nights, guests, GST calculation, and confirmation voucher preview.

### 6. Seasonal & Climate Intelligence (`SeasonalGuide.jsx`)
- **4 Dynamic Seasons**: Categorized into **Winter (Nov–Feb)**, **Summer (Mar–June)**, **Monsoon (July–Sep)**, and **Autumn (October)**.
- **Microclimate Guidance**: Average temperatures, smart packing checklists, and festive cultural calendars (*Pushkar Camel Fair, Rann Utsav, Hornbill, Hemis, Onam, Durga Puja, Diwali*).

### 7. Cultural Wisdom & Essential Phrases (`CulturalInsights.jsx`)
- **Indian Travel Phrases**: Interactive phonetic Hindi phrases cheat sheet with one-click copying.
- **Digital India & UPI Guide**: Practical advice on QR code payments accepted nationwide.
- **Railways Guidance**: Vande Bharat high-speed routes, IRCTC 60-day booking rules, and class breakdown.
- **Emergency Helplines**: Official Government of India 24x7 Tourist Helpline (**1363**) and National Emergency Service (**112**).

---

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Outfit, Plus Jakarta Sans, Playfair Display (Google Fonts)
- **Linter**: [oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Local Development
```bash
# Clone the repository
git clone https://github.com/<your-username>/india-tourist-guide.git

# Navigate to project directory
cd india-tourist-guide

# Install dependencies
npm install

# Start development preview server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Quality Assurance & Linting
```bash
# Run oxlint (0 errors, 0 warnings)
npm run lint
```

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Directory Structure

```text
india-tourist-guide/
├── index.html
├── package.json
├── vite.config.js
├── .oxlintrc.json
├── .github/
│   └── workflows/
│       └── deploy.yml                 # Automated GitHub Pages CI/CD workflow
├── src/
│   ├── main.jsx
│   ├── App.jsx                        # Master coordinator, tab routing, drawer & persistence
│   ├── index.css                      # Tailwind base, typography, glassmorphism, scrollbars
│   ├── data/
│   │   └── india-guide-data.json      # 100% populated data for all 36 States, UTs, stays & seasons
│   └── components/
│       ├── Navbar.jsx                 # Glassmorphic header, search, wishlist trigger, mobile drawer
│       ├── Hero.jsx                   # Visual banner, metrics counter, quick landscape filters
│       ├── StateExplorer.jsx          # Multi-dimensional filter hub (28 States + 8 UTs)
│       ├── StateCard.jsx              # Responsive state card with badges, budget & itinerary links
│       ├── StateModal.jsx             # Tabbed deep-dive modal (Attractions, Cuisine, Culture, Tips)
│       ├── ItineraryBuilder.jsx       # Intelligent Day-by-Day personalized journey planner
│       ├── SeasonalGuide.jsx          # 4-season climate planner & cultural festivals
│       ├── BudgetCalculator.jsx       # Interactive ₹ budget estimator & multi-currency converter
│       ├── StayFinder.jsx             # Accommodations module with ₹ filters & reservation modal
│       ├── SavedDrawer.jsx            # Slide-over saved wishlist & bucket list manager
│       ├── CulturalInsights.jsx       # Train guide, UPI, travel phrases, emergency helplines
│       └── Footer.jsx                 # Quick navigation, emergency contacts (112, 1363)
```

---

## 📜 License
Crafted with admiration for Incredible India. Feel free to use and adapt!
