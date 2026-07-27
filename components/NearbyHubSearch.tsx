
import React, { useState } from 'react';
import { findNearbyHubs } from '../aiService.ts';
import { useLanguage } from '../LanguageContext.tsx';

const NearbyHubSearch: React.FC = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; sources: any[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    
    // Default coordinates (India center)
    let lat = 20.5937;
    let lng = 78.9629;

    // Try to get actual location
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (err) {
        console.warn("Geolocation failed or denied, using defaults.");
      }
    }
    
    const data = await findNearbyHubs(query, lat, lng);
    setResults(data);
    setLoading(false);
  };

  const parseHubs = (text: string) => {
    return text.split('\n')
      .filter(line => line.trim().startsWith('*'))
      .map(line => {
        const cleaned = line.replace(/^\*\s*/, '');
        const parts = cleaned.split('|').map(p => p.trim());
        return {
          name: parts[0] || t('hub.search.verified'),
          address: parts[1] || t('hub.search.mapsLink'),
          hours: parts[2] || "",
          rating: parts[3] || ""
        };
      });
  };

  const hubData = results ? parseHubs(results.text) : [];

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#2c3e2e]/5 shadow-soft">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('hub.search.placeholder')}
          className="flex-grow bg-gray-50 border border-[#2c3e2e]/10 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#5b7b62]/40 transition-all text-[#2c3e2e]"
        />
        <button 
          disabled={loading}
          className="px-8 py-4 bg-[#2c3e2e] text-white rounded-2xl font-bold text-sm tracking-widest disabled:opacity-50 transition-all hover:opacity-90"
        >
          {loading ? t('hub.search.searching') : t('hub.search.find')}
        </button>
      </form>

      {results && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {hubData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hubData.map((hub, i) => {
                // Match with source uri if available
                const source = results.sources.find(s => s.title.toLowerCase().includes(hub.name.toLowerCase()));
                const mapLink = source?.uri || `https://www.google.com/maps/search/${encodeURIComponent(hub.name + ' ' + hub.address)}`;
                
                return (
                  <a 
                    key={i} 
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 bg-[#f8f9f5] border border-[#2c3e2e]/5 rounded-2xl hover:border-[#5b7b62] hover:bg-white transition-all group flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[#5b7b62] font-bold text-base leading-tight group-hover:underline font-serif">{hub.name}</h4>
                        {hub.rating && (
                          <span className="text-[#7b9a82] text-[10px] font-black">{hub.rating} ★</span>
                        )}
                      </div>
                      <p className="text-[#556b5a] text-[11px] leading-relaxed font-medium mb-3">{hub.address}</p>
                    </div>
                    {hub.hours && (
                      <div className="mt-2 text-[9px] font-black text-[#a3b18a] tracking-widest">
                        {hub.hours}
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="text-[#556b5a] text-sm italic">{results.text || t('hub.search.noResults')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyHubSearch;
