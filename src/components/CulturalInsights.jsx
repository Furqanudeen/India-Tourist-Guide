import React, { useState } from 'react';
import { 
  Sparkles, Train, Smartphone, HeartHandshake, Languages, 
  Compass, Shield, Check, Copy 
} from 'lucide-react';

export default function CulturalInsights() {
  const [copiedPhrase, setCopiedPhrase] = useState(null);

  const essentials = [
    {
      icon: Train,
      color: 'text-orange-600 bg-orange-100',
      title: 'Indian Railways & High-Speed Vande Bharat',
      description: 'The lifeline of India travel. Experience modern semi-high-speed Vande Bharat trains connecting key heritage circuits. For overnight journeys, book 2AC or 3AC berths via IRCTC 60–120 days in advance.'
    },
    {
      icon: Smartphone,
      color: 'text-emerald-600 bg-emerald-100',
      title: 'UPI & Cashless Payments Everywhere',
      description: 'India leads the world in instant digital QR code payments (UPI via PhonePe, Google Pay, Paytm). Even remote Himalayan tea stalls and tender coconut vendors accept instant QR codes.'
    },
    {
      icon: HeartHandshake,
      color: 'text-amber-600 bg-amber-100',
      title: 'Sacred Customs & Temple Etiquette',
      description: 'Always remove shoes outside temples, mosques, and gurudwaras. Dress modestly covering shoulders and knees. In Sikh Gurudwaras, keep your head covered with a clean scarf provided at entry.'
    },
    {
      icon: Languages,
      color: 'text-teal-600 bg-teal-100',
      title: 'Languages & Timeless Hospitality',
      description: 'India celebrates 22 official languages. English and Hindi are widely understood across tourist corridors, hotels, trains, and flight hubs. The ancient philosophy of "Atithi Devo Bhava" (Guest is God) warms every encounter.'
    },
    {
      icon: Shield,
      color: 'text-purple-600 bg-purple-100',
      title: 'Eco-Tourism & Leave No Trace',
      description: 'Keep the Himalayas, Western Ghats, and Andaman coral reefs pristine. Avoid single-use plastic bottles; utilize filtered RO water stations and carry reusable insulated flasks.'
    },
    {
      icon: Compass,
      color: 'text-blue-600 bg-blue-100',
      title: 'Culinary Journey & Spice Levels',
      description: 'Indian food is extraordinarily regional. You can always specify "Mild Spice" (Kam Teekha) at restaurants. Always sample regional Thalis for the most wholesome, balanced nutrition.'
    }
  ];

  const travelPhrases = [
    { hindi: 'नमस्ते', roman: 'Namaste', meaning: 'Hello / Greetings (respectful)', note: 'With folded palms at chest level' },
    { hindi: 'धन्यवाद / शुक्रिया', roman: 'Dhanyavaad / Shukriya', meaning: 'Thank you', note: 'Widely understood everywhere' },
    { hindi: 'यह कितने का है?', roman: 'Yeh kitne ka hai?', meaning: 'How much does this cost?', note: 'Handy in local bazaars & rickshaws' },
    { hindi: 'कम तीखा बनाइए', roman: 'Kam teekha banaiye', meaning: 'Please make it less spicy', note: 'Essential restaurant phrase' },
    { hindi: 'कृपया मदद कीजिए', roman: 'Kripya madad kijiye', meaning: 'Please help me', note: 'Polite distress phrase' },
    { hindi: 'हाँ / नहीं', roman: 'Haan / Nahin', meaning: 'Yes / No', note: 'Basic conversational response' },
  ];

  const handleCopyPhrase = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedPhrase(idx);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  return (
    <section id="cultural-insights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Cultural Wisdom & Travel Essentials</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Navigate India with Confidence & Respect
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Essential insights into digital payments, train journeys, cultural etiquettes, handy travel phrases, and culinary customs across Bharat.
        </p>
      </div>

      {/* Grid of Essentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {essentials.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Useful Hindi Phrases Cheat Sheet */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-orange-600" />
              <span>Essential Indian Travel Phrases</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Handy phonetic phrases that bring warm smiles from locals everywhere
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click any card to copy phrase</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {travelPhrases.map((phrase, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyPhrase(phrase.roman, idx)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 transition-all cursor-pointer flex items-start justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-lg text-slate-900">{phrase.hindi}</span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100/60 px-2 py-0.5 rounded-md">
                    {phrase.roman}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{phrase.meaning}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{phrase.note}</p>
              </div>

              <span className="text-slate-400 group-hover:text-orange-600 p-1">
                {copiedPhrase === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 24x7 Tourist Helpline Callout */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            Government of India Official Tourist Helpline
          </span>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Toll-Free 24x7 Multi-Lingual Tourist Support: <span className="text-amber-300">1363</span>
          </h3>
          <p className="text-sm text-slate-100 mt-1 max-w-xl leading-relaxed">
            Available in 12 languages (including English, French, Spanish, German, Russian, and Japanese) plus all-India emergency services at <strong>112</strong>.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="text-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <span className="text-xs text-amber-200 block uppercase font-bold">National Emergency</span>
            <span className="text-2xl font-black font-display text-white">112</span>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <span className="text-xs text-amber-200 block uppercase font-bold">Tourist Support</span>
            <span className="text-2xl font-black font-display text-white">1363</span>
          </div>
        </div>
      </div>

    </section>
  );
}
