import React, { useContext, useState } from 'react';
import { AuthContext } from '../App.tsx';
import { useLanguage, Language } from '../LanguageContext.tsx';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';

interface Props {
  onAuth: () => void;
  onDonate: () => void;
  onRequest: () => void;
  onNGO: () => void;
  onGov: () => void;
  onHome: () => void;
  onAbout: () => void;
}

const Navbar: React.FC<Props> = ({ onAuth, onDonate, onRequest, onNGO, onGov, onHome, onAbout }) => {
  const auth = useContext(AuthContext);
  const { language, setLanguage, t } = useLanguage();
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleBrandClick = () => {
    if (auth?.user) {
      return;
    }
    onHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages = [
    { code: Language.ENGLISH, label: 'English' },
    { code: Language.HINDI, label: 'हिन्दी' },
    { code: Language.PUNJABI, label: 'ਪੰਜਾਬੀ' },
    { code: Language.TAMIL, label: 'தமிழ்' },
    { code: Language.MARATHI, label: 'मराठी' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#f8f9f5]/90 backdrop-blur-xl border-b border-[#2c3e2e]/5 px-8 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          className={`flex items-center gap-3 group ${auth?.user ? 'cursor-default' : 'cursor-pointer'}`} 
          onClick={handleBrandClick}
        >
          <div className="w-10 h-10 bg-[#5b7b62] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5b7b62]/20 group-hover:scale-105 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 9.5C2.5 8.39543 3.39543 7.5 4.5 7.5H13.5C14.0523 7.5 14.5 7.94772 14.5 8.5V16.5C14.5 17.0523 14.0523 17.5 13.5 17.5H4.5C3.39543 17.5 2.5 16.6046 2.5 15.5V9.5Z" fill="currentColor"/>
              <path d="M14.5 8.5H16.5C17.6046 8.5 18.5 9.39543 18.5 10.5V11.5L21.3147 13.3765C21.7417 13.6611 22 14.1374 22 14.6472V16.5C22 17.0523 21.5523 17.5 21 17.5H14.5V8.5Z" fill="currentColor"/>
              <circle cx="6.5" cy="18.5" r="2.5" fill="currentColor"/>
              <circle cx="17.5" cy="18.5" r="2.5" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-2xl font-bold font-serif text-[#2c3e2e] tracking-tight">MedRoute</span>
        </div>

        {/* Navigation Links */}
        {!auth?.user ? (
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={onHome} className="text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition">{t('nav.home')}</button>
            <button onClick={onDonate} className="text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition">{t('nav.donate')}</button>
            <button onClick={onRequest} className="text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition">{t('nav.request')}</button>
            <button onClick={onNGO} className="text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition">{t('nav.ngo')}</button>
            <button onClick={onAbout} className="text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition">{t('nav.about')}</button>
            <button onClick={onGov} className="text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition">{t('nav.gov')}</button>
            
            {/* Translate Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsTranslateOpen(!isTranslateOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition"
              >
                <Globe size={14} />
                {t('nav.translate')}
                <ChevronDown size={14} className={`transition-transform ${isTranslateOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTranslateOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-[#2c3e2e]/10 rounded-xl shadow-2xl overflow-hidden py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsTranslateOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold transition hover:bg-[#f8f9f5] ${
                        language === lang.code ? 'text-[#5b7b62] bg-[#5b7b62]/5' : 'text-[#556b5a]'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* When signed in: ONLY display Translate option contextually */
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsTranslateOpen(!isTranslateOpen)}
                className="flex items-center gap-1.5 text-sm font-bold text-[#556b5a] hover:text-[#2c3e2e] transition bg-[#2c3e2e]/5 px-3 py-1.5 rounded-xl border border-[#2c3e2e]/5"
              >
                <Globe size={14} />
                {t('nav.translate')}
                <ChevronDown size={14} className={`transition-transform ${isTranslateOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isTranslateOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-[#2c3e2e]/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsTranslateOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold transition hover:bg-[#f8f9f5] ${
                        language === lang.code ? 'text-[#5b7b62] bg-[#5b7b62]/5' : 'text-[#556b5a]'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {auth?.user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#2c3e2e]">{auth.user.name}</div>
                <div className="text-[10px] text-[#5b7b62] font-black uppercase tracking-widest">{auth.user.role}</div>
              </div>
              <button 
                onClick={auth.logout}
                className="px-4 py-2 sm:px-5 sm:py-2 rounded-xl bg-[#2c3e2e]/5 border border-[#2c3e2e]/10 text-[#2c3e2e] text-xs font-bold hover:bg-[#2c3e2e]/10 transition animate-in fade-in duration-200"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={onAuth}
                className="text-sm font-medium text-[#556b5a] hover:text-[#2c3e2e] transition hidden sm:inline-block"
              >
                {t('nav.signin')}
              </button>
              <button 
                onClick={onAuth}
                className="px-5 py-2.5 sm:px-8 sm:py-3 bg-[#2c3e2e] text-white rounded-xl font-bold text-xs sm:text-sm hover:opacity-90 transition shadow-lg shadow-[#2c3e2e]/10"
              >
                {t('nav.getstarted')}
              </button>
            </>
          )}

          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#556b5a] hover:text-[#2c3e2e] transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pt-4 border-t border-[#2c3e2e]/5 flex flex-col gap-2 bg-[#f8f9f5] rounded-2xl p-4 shadow-inner">
          {!auth?.user ? (
            <>
              <button 
                onClick={() => { onHome(); setIsMobileMenuOpen(false); }} 
                className="text-left py-2.5 px-4 text-sm font-bold text-[#556b5a] hover:text-[#2c3e2e] hover:bg-[#2c3e2e]/5 rounded-xl transition"
              >
                {t('nav.home')}
              </button>
              <button 
                onClick={() => { onDonate(); setIsMobileMenuOpen(false); }} 
                className="text-left py-2.5 px-4 text-sm font-bold text-[#556b5a] hover:text-[#2c3e2e] hover:bg-[#2c3e2e]/5 rounded-xl transition"
              >
                {t('nav.donate')}
              </button>
              <button 
                onClick={() => { onRequest(); setIsMobileMenuOpen(false); }} 
                className="text-left py-2.5 px-4 text-sm font-bold text-[#556b5a] hover:text-[#2c3e2e] hover:bg-[#2c3e2e]/5 rounded-xl transition"
              >
                {t('nav.request')}
              </button>
              <button 
                onClick={() => { onNGO(); setIsMobileMenuOpen(false); }} 
                className="text-left py-2.5 px-4 text-sm font-bold text-[#556b5a] hover:text-[#2c3e2e] hover:bg-[#2c3e2e]/5 rounded-xl transition"
              >
                {t('nav.ngo')}
              </button>
              <button 
                onClick={() => { onAbout(); setIsMobileMenuOpen(false); }} 
                className="text-left py-2.5 px-4 text-sm font-bold text-[#556b5a] hover:text-[#2c3e2e] hover:bg-[#2c3e2e]/5 rounded-xl transition"
              >
                {t('nav.about')}
              </button>
              <button 
                onClick={() => { onGov(); setIsMobileMenuOpen(false); }} 
                className="text-left py-2.5 px-4 text-sm font-bold text-[#556b5a] hover:text-[#2c3e2e] hover:bg-[#2c3e2e]/5 rounded-xl transition"
              >
                {t('nav.gov')}
              </button>
            </>
          ) : (
            <div className="py-2.5 px-4 border-b border-[#2c3e2e]/5">
              <div className="text-xs font-bold text-[#2c3e2e]">{auth.user.name}</div>
              <div className="text-[10px] text-[#5b7b62] font-black uppercase tracking-wider">{auth.user.role} Terminal</div>
            </div>
          )}

          {/* Mobile Translation Section */}
          <div className="border-t border-[#2c3e2e]/5 mt-2 pt-4 flex flex-col gap-2">
            <span className="text-[10px] font-black text-[#5b7b62] uppercase tracking-[0.15em] mb-1 flex items-center gap-1">
              <Globe size={12} /> {t('nav.translate')}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-center py-2 px-3 rounded-xl text-xs font-bold transition ${
                    language === lang.code ? 'text-[#5b7b62] bg-[#5b7b62]/10 border border-[#5b7b62]/20' : 'text-[#556b5a] bg-white border border-[#2c3e2e]/5'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;