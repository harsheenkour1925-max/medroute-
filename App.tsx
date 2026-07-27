import React, { useState, useEffect, createContext } from 'react';
import { UserRole, User } from './types.ts';
import { LanguageProvider } from './LanguageContext.tsx';
import LandingPage from './components/LandingPage.tsx';
import AuthPage from './components/AuthPage.tsx';
import DonorDashboard from './components/DonorDashboard.tsx';
import ReceiverDashboard from './components/ReceiverDashboard.tsx';
import NGODashboard from './components/NGODashboard.tsx';
import GovDashboard from './components/GovDashboard.tsx';
import DeliveryDashboard from './components/DeliveryDashboard.tsx';
import DonorLandingPage from './components/DonorLandingPage.tsx';
import ReceiverLandingPage from './components/ReceiverLandingPage.tsx';
import NGOLandingPage from './components/NGOLandingPage.tsx';
import GovLandingPage from './components/GovLandingPage.tsx';
import AboutPage from './components/AboutPage.tsx';
import Navbar from './components/Navbar.tsx';
import LiveNotifications from './components/LiveNotifications.tsx';
import GeminiVoiceAssistant from './components/GeminiVoiceAssistant.tsx';
import { SupabaseModal } from './components/SupabaseModal.tsx';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'LANDING' | 'MAIN_PHASE' | 'AUTH' | 'DONOR_LANDING' | 'RECEIVER_LANDING' | 'NGO_LANDING' | 'ADMIN_LANDING' | 'ABOUT'>('LANDING');
  const [authConfig, setAuthConfig] = useState<{ role: UserRole; isLogin: boolean }>({ role: UserRole.DONOR, isLogin: false });
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('medroute_user');
      if (saved) {
        setUser(JSON.parse(saved));
        setView('MAIN_PHASE');
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem('medroute_user');
    }
  }, []);

  const login = (email: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };
    setUser(newUser);
    localStorage.setItem('medroute_user', JSON.stringify(newUser));
    setView('MAIN_PHASE');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medroute_user');
    setView('LANDING');
  };

  const renderContent = () => {
    if (view === 'AUTH') {
      return <AuthPage 
        initialRole={authConfig.role} 
        initialIsLogin={authConfig.isLogin} 
        onBack={() => setView('LANDING')} 
      />;
    }

    if (view === 'DONOR_LANDING') {
      return <DonorLandingPage 
        onStart={() => {
          setAuthConfig({ role: UserRole.DONOR, isLogin: false });
          setView('AUTH');
        }} 
        onBack={() => setView('LANDING')} 
      />;
    }

    if (view === 'RECEIVER_LANDING') {
      return <ReceiverLandingPage 
        onStart={() => {
          setAuthConfig({ role: UserRole.RECEIVER, isLogin: false });
          setView('AUTH');
        }} 
        onBack={() => setView('LANDING')} 
      />;
    }

    if (view === 'NGO_LANDING') {
      return <NGOLandingPage 
        onStart={() => {
          setAuthConfig({ role: UserRole.NGO, isLogin: false });
          setView('AUTH');
        }} 
        onBack={() => setView('LANDING')} 
      />;
    }

    if (view === 'ADMIN_LANDING') {
      return <GovLandingPage 
        onStart={() => {
          setAuthConfig({ role: UserRole.ADMIN, isLogin: true });
          setView('AUTH');
        }} 
        onBack={() => setView('LANDING')} 
      />;
    }

    if (view === 'ABOUT') {
      return <AboutPage onBack={() => setView('LANDING')} />;
    }

    if (view === 'MAIN_PHASE') {
      if (user) {
        switch (user.role) {
          case UserRole.DONOR: return <DonorDashboard />;
          case UserRole.RECEIVER: return <ReceiverDashboard />;
          case UserRole.NGO: return <NGODashboard />;
          case UserRole.ADMIN: return <GovDashboard />;
          case UserRole.DELIVERY: return <DeliveryDashboard />;
          default: return <DonorDashboard />;
        }
      }
      return <DonorDashboard />;
    }

    return <LandingPage 
      onAuth={() => {
        setAuthConfig({ role: UserRole.DONOR, isLogin: true });
        setView('AUTH');
      }} 
      onStart={() => setView('MAIN_PHASE')} 
      onDonate={() => setView('DONOR_LANDING')}
      onRequest={() => setView('RECEIVER_LANDING')}
      onNGO={() => setView('NGO_LANDING')}
      onGov={() => setView('ADMIN_LANDING')}
    />;
  };

  return (
    <LanguageProvider>
      <AuthContext.Provider value={{ user, login, logout }}>
        <div className="min-h-screen flex flex-col bg-[#f8f9f5] relative selection:bg-[#5b7b62]/30 selection:text-[#2c3e2e]">
          <Navbar 
            onAuth={() => {
              setAuthConfig({ role: UserRole.DONOR, isLogin: true });
              setView('AUTH');
            }} 
            onDonate={() => setView('DONOR_LANDING')} 
            onRequest={() => setView('RECEIVER_LANDING')}
            onNGO={() => setView('NGO_LANDING')}
            onGov={() => setView('ADMIN_LANDING')}
            onHome={() => setView('LANDING')} 
            onAbout={() => setView('ABOUT')}
          />
          
          <main className="flex-grow">
            {renderContent()}
          </main>

          {!user && (
            <footer className="bg-[#2c3e2e] text-white pt-32 pb-12 px-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 pb-24">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#5b7b62] rounded-2xl flex items-center justify-center text-white relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.5 9.5C2.5 8.39543 3.39543 7.5 4.5 7.5H13.5C14.0523 7.5 14.5 7.94772 14.5 8.5V16.5C14.5 17.0523 14.0523 17.5 13.5 17.5H4.5C3.39543 17.5 2.5 16.6046 2.5 15.5V9.5Z" fill="white"/>
                          <path d="M14.5 8.5H16.5C17.6046 8.5 18.5 9.39543 18.5 10.5V11.5L21.3147 13.3765C21.7417 13.6611 22 14.1374 22 14.6472V16.5C22 17.0523 21.5523 17.5 21 17.5H14.5V8.5Z" fill="white"/>
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold font-serif tracking-tighter">MedRoute</h3>
                    </div>
                    <p className="text-[#a3b18a] font-medium leading-relaxed">
                      Transforming unused medicines into life-saving resources through smart redistribution.
                    </p>
                    <div className="flex gap-4">
                      {['Instagram', 'Facebook', 'Twitter', 'LinkedIn'].map(platform => (
                        <div key={platform} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition cursor-pointer">
                          <div className="w-4 h-4 bg-[#a3b18a] rounded-sm"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">Quick Links</h4>
                    <ul className="space-y-4 font-bold text-[#a3b18a] text-sm">
                      <li><button onClick={() => setView('LANDING')} className="hover:text-white transition">Home</button></li>
                      <li><button onClick={() => setView('DONOR_LANDING')} className="hover:text-white transition">Donate Medicines</button></li>
                      <li><button onClick={() => setView('RECEIVER_LANDING')} className="hover:text-white transition">Request Medicines</button></li>
                      <li><button onClick={() => setView('ABOUT')} className="hover:text-white transition">About Us</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">For Organizations</h4>
                    <ul className="space-y-4 font-bold text-[#a3b18a] text-sm">
                      <li><button onClick={() => setView('NGO_LANDING')} className="hover:text-white transition">NGO Portal</button></li>
                      <li><button onClick={() => setView('ADMIN_LANDING')} className="hover:text-white transition">Admin Dashboard</button></li>
                      <li><button className="hover:text-white transition">API Access</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-[11px] mb-8">Contact Us</h4>
                    <ul className="space-y-4 font-bold text-[#a3b18a] text-sm">
                      <li className="text-white">contact@medroute.org</li>
                      <li className="text-white">+91 123-456-7890</li>
                      <li><button className="hover:text-white transition">Terms of Service</button></li>
                      <li><button className="hover:text-white transition">Privacy Policy</button></li>
                    </ul>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-[#a3b18a] font-bold text-[10px] uppercase tracking-widest">
                    © 2026 MedRoute. All rights reserved. Made with ❤️ for India.
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="email" placeholder="Your email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-[#5b7b62] w-64" />
                    <button className="px-6 py-3 bg-[#5b7b62] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#4a6350] transition">Subscribe</button>
                  </div>
                </div>
              </div>
            </footer>
          )}

          <LiveNotifications />
          <GeminiVoiceAssistant />
        </div>
      </AuthContext.Provider>
    </LanguageProvider>
  );
};

export default App;