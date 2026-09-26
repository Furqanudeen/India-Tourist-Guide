import React from 'react';
import { Compass, Heart, ArrowUp } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                <span className="text-xl">🇮🇳</span>
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                BHARAT<span className="text-orange-500">YATRA</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's comprehensive, interactive travel guide and planning suite covering all 28 States and 8 Union Territories. Grounded in transparent local economics in Indian Rupees (₹).
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold">
                अतिथि देवो भव (Guest is God)
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-teal-400 text-xs font-semibold">
                वसुधैव कुटुम्बकम्
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => { setActiveTab('states'); scrollToTop(); }}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Explore 28 States & 8 UTs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('seasons'); scrollToTop(); }}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Seasonal & Climate Planner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('budget'); scrollToTop(); }}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Interactive ₹ Budget Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('stays'); scrollToTop(); }}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Handpicked Stays & Hostels
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('culture'); scrollToTop(); }}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Cultural Etiquette & Tips
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Official Helplines */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-white tracking-wider">
              Essential Tourist Helplines
            </h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">National Emergency</span>
                  <span className="font-bold text-white text-base">112</span>
                </div>
                <span className="text-xs text-slate-500">Police / Ambulance</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Ministry of Tourism 24x7</span>
                  <span className="font-bold text-amber-400 text-base">1363 / 1800-11-1363</span>
                </div>
                <span className="text-xs text-slate-500">12 Languages</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} BharatYatra Tourist Guide. Crafted with admiration for Incredible India.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
