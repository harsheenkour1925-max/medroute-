import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext.tsx';
import { 
  Map, 
  Search, 
  BarChart3, 
  AlertTriangle, 
  Users, 
  Database, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  History,
  Scale,
  Globe,
  Award,
  Lock,
  Leaf,
  Package,
  Home,
  LineChart,
  ArrowRight,
  LogIn,
  Zap,
  ShieldAlert,
  X,
  Clock,
  AlertCircle,
  Lightbulb,
  UserPlus,
  Phone,
  Handshake,
  PauseCircle,
  FileSpreadsheet
} from 'lucide-react';
import LiveMap from './LiveMap.tsx';

import GovReports from './GovReports.tsx';
import GovEmergencyReports from './GovEmergencyReports.tsx';

interface Props {
  onStart: () => void;
  onBack: () => void;
}

const GovLandingPage: React.FC<Props> = ({ onStart, onBack }) => {
  const { t } = useLanguage();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showEmergencyReports, setShowEmergencyReports] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleEmergencyClick = () => {
    if (isEmergencyMode) {
      setIsEmergencyMode(false);
    } else {
      setShowPinPopup(true);
    }
  };

  const handlePinSubmit = () => {
    if (pin === '1905') {
      if (!isAuthorized) {
        setIsAuthorized(true);
      } else {
        setIsEmergencyMode(true);
      }
      setShowPinPopup(false);
      setPin('');
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  if (showReports) {
    return <GovReports onBack={() => setShowReports(false)} />;
  }

  if (showEmergencyReports) {
    return <GovEmergencyReports onBack={() => setShowEmergencyReports(false)} />;
  }

  if (!isAuthorized) {
    return (
      <div className="bg-[#f8f9f5] text-[#2c3e2e] min-h-screen flex items-center justify-center px-6 selection:bg-[#5b7b62]/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white border border-[#2c3e2e]/5 rounded-[2.5rem] p-10 shadow-soft relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <button onClick={onBack} className="p-2 hover:bg-[#f8f9f5] rounded-full transition-colors text-[#556b5a] hover:text-[#2c3e2e]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-[#5b7b62]/10 flex items-center justify-center text-[#5b7b62] mb-6 shadow-sm">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-[#2c3e2e] tracking-tight mb-2 font-serif">{t('gov.portal')}</h2>
            <p className="text-[#556b5a] text-sm font-medium">{t('gov.restricted')}</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-[#556b5a] uppercase tracking-widest mb-3 ml-1">{t('gov.securePin')}</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className={`w-full bg-[#f8f9f5] border ${pinError ? 'border-rose-500 focus:ring-rose-500/20' : 'border-[#2c3e2e]/10 focus:ring-[#5b7b62]/20'} rounded-2xl px-6 py-5 text-2xl font-bold tracking-[1em] text-center outline-none focus:ring-4 transition-all placeholder:text-[#2c3e2e]/10 placeholder:tracking-normal text-[#2c3e2e]`}
                  onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                  autoFocus
                />
                <Lock className={`absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 ${pinError ? 'text-rose-500' : 'text-[#556b5a]'}`} />
              </div>
              {pinError && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-rose-500 text-xs font-bold mt-4 flex items-center gap-2"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {t('gov.invalidPin')}
                </motion.p>
              )}
            </div>

            <button 
              onClick={handlePinSubmit}
              disabled={pin.length === 0}
              className="w-full py-5 bg-[#2c3e2e] hover:opacity-90 disabled:opacity-50 disabled:hover:bg-[#2c3e2e] text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-[#2c3e2e]/10 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {t('gov.verifyIdentity')}
              <ArrowRight className="w-5 h-5" />
            </button>

            <button 
              onClick={onBack}
              className="w-full py-2 text-[#556b5a] hover:text-[#2c3e2e] text-sm font-bold transition-colors"
            >
              {t('gov.returnPublic')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`bg-[#f8f9f5] text-[#2c3e2e] min-h-screen selection:bg-[#5b7b62]/30 ${isEmergencyMode ? 'border-t-4 border-rose-600' : ''}`}>
      {/* PIN Popup */}
      <AnimatePresence>
        {showPinPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPinPopup(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-rose-500 tracking-tight">{t('gov.emergencyAccess')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-3">{t('gov.emergencyPin')}</label>
                  <input 
                    type="password" 
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className={`w-full bg-white/5 border ${pinError ? 'border-rose-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-xl font-black tracking-[1em] outline-none focus:ring-2 focus:ring-rose-500 transition-all`}
                    onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-rose-500 text-xs font-bold mt-3">Invalid PIN. Please try again.</p>
                  )}
                  <p className="text-slate-500 text-xs font-medium mt-4">
                    Restricted access. PIN required for emergency activation.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowPinPopup(false)}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition"
                  >
                    {t('auth.back')}
                  </button>
                  <button 
                    onClick={handlePinSubmit}
                    className="flex-1 px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold transition shadow-lg shadow-rose-900/40"
                  >
                    {t('gov.activate')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] ${isEmergencyMode ? 'bg-rose-500/10' : 'bg-[#5b7b62]/5'} rounded-full blur-[160px]`}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center px-4 py-1.5 rounded-full ${isEmergencyMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' : 'bg-[#5b7b62]/10 border-[#5b7b62]/20 text-[#5b7b62]'} text-sm font-bold mb-8 uppercase tracking-widest`}
          >
            {t('gov.forGov')}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-serif leading-[1.1] tracking-tighter mb-8 text-[#2c3e2e]"
          >
            {t('gov.hero.title1')} <br />
            {t('gov.hero.title2')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#556b5a] text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
          >
            {t('gov.hero.desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col xl:flex-row items-center justify-center gap-4 px-6"
          >
            <button 
              onClick={() => {
                setIsFrozen(!isFrozen);
                alert(isFrozen ? "Deliveries and requests have been resumed." : "All deliveries and requests have been frozen across the network.");
              }}
              className={`w-full xl:w-auto px-8 py-4 ${isFrozen ? 'bg-amber-600 hover:bg-amber-500' : 'bg-white hover:bg-[#f8f9f5]'} border border-[#2c3e2e]/10 text-[#2c3e2e] rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-soft group`}
            >
              <PauseCircle className="w-5 h-5" />
              {isFrozen ? t('gov.resume') : t('gov.freeze')}
            </button>

            <button 
              onClick={() => setShowReports(true)}
              className="w-full xl:w-auto px-8 py-4 bg-[#2c3e2e] hover:opacity-90 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#2c3e2e]/10 group"
            >
              <FileSpreadsheet className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {t('gov.getReports')}
            </button>

            <button 
              onClick={handleEmergencyClick}
              className={`w-full xl:w-auto px-8 py-4 ${isEmergencyMode ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${isEmergencyMode ? 'shadow-rose-900/40' : 'shadow-emerald-900/40'} group`}
            >
              {isEmergencyMode ? (
                <>
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  {t('gov.exitEmergency')}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {t('gov.activateEmergency')}
                </>
              )}
            </button>
          </motion.div>
        </div>
      </section>

        {/* Gov Network Map Section */}
        {!isEmergencyMode && (
          <section className="py-24 px-6 border-y border-[#2c3e2e]/5 bg-white/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 px-6">
                <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter mb-4 text-[#2c3e2e]">{t('gov.networkMap')}</h2>
                <p className="text-[#556b5a] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                  {t('gov.networkDesc')} 
                  <span className="block text-sm text-[#5b7b62] mt-2 font-bold uppercase tracking-widest">{t('gov.realtimeMonitoring')}</span>
                </p>
              </div>
              
              <div className="bg-white rounded-[3rem] border border-[#2c3e2e]/5 overflow-hidden p-4 shadow-soft">
                 <LiveMap mapType={isEmergencyMode ? "gov-emergency" : "gov"} height="h-[600px]" />
              </div>
            </div>
          </section>
        )}

      {/* Emergency Mode View - Map Section */}
      {isEmergencyMode && (
        <>
          <section className="py-24 px-6 border-y border-rose-600/20 bg-rose-50/10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 px-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-bold uppercase tracking-widest mb-6">
                  <AlertTriangle className="w-4 h-4" />
                  {t('gov.emergencyActive')}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter mb-4 text-rose-950">{t('gov.emergencyGrid')}</h2>
                <p className="text-rose-900/70 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                  {t('gov.emergencyDesc')} 
                  <span className="block text-sm text-rose-600 mt-2 font-bold uppercase tracking-widest">Live redirection & priority clearance enabled</span>
                </p>
              </div>
              
              <div className="bg-white rounded-[3rem] border border-rose-500/30 overflow-hidden p-4 shadow-2xl shadow-rose-900/10">
                 <LiveMap mapType="gov-emergency" height="h-[700px]" />
              </div>

              <div className="mt-12 text-center">
                <button 
                  onClick={() => setShowEmergencyReports(true)}
                  className="px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-xl transition-all shadow-xl shadow-rose-900/20 flex items-center justify-center gap-4 mx-auto group"
                >
                  <FileSpreadsheet className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  {t('gov.openImpactAudit')}
                </button>
              </div>
            </div>
          </section>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-6 space-y-12 mb-32 pt-12"
        >
          {/* Emergency Alert Banner */}
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-[2rem] p-8 flex items-center gap-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shrink-0 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-rose-900 uppercase tracking-tighter">{t('gov.emergencyActive')}</h3>
              <p className="text-rose-800/80 font-medium">3 active disaster zones requiring immediate medical supply. Priority routing enabled for critical deliveries.</p>
            </div>
          </div>

          {/* Disaster Zones */}
          <div>
            <h3 className="text-2xl font-bold font-serif mb-8 tracking-tight text-[#2c3e2e]">{t('gov.activeZones')}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  zone: "Kerala Flood Zone - Pathanamthitta", 
                  type: "Flood", 
                  pop: "45,000", 
                  supply: 30, 
                  urgent: ["Antibiotics", "Water Purification Tablets", "Anti-diarrheal", "First Aid"],
                  priority: "CRITICAL",
                  time: "2 hours ago"
                },
                { 
                  zone: "Gujarat Earthquake Zone - Bhuj", 
                  type: "Earthquake", 
                  pop: "62,000", 
                  supply: 45, 
                  urgent: ["Pain Relief", "Antibiotics", "Bandages", "Antiseptics"],
                  priority: "HIGH",
                  time: "4 hours ago"
                },
                { 
                  zone: "Odisha Cyclone Zone - Puri", 
                  type: "Cyclone", 
                  pop: "78,000", 
                  supply: 25, 
                  urgent: ["Cold & Flu", "Antibiotics", "Vitamins", "Oral Rehydration"],
                  priority: "CRITICAL",
                  time: "1 hour ago"
                }
              ].map((zone, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-[#2c3e2e]/5 relative overflow-hidden group shadow-soft">
                  <div className={`absolute top-0 right-0 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest ${zone.priority === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-600'} text-white rounded-bl-xl`}>
                    {zone.priority}
                  </div>
                  <div className="text-[10px] font-bold text-[#556b5a] uppercase tracking-widest mb-4">{zone.time}</div>
                  <h4 className="text-lg font-bold mb-4 text-[#2c3e2e] font-serif">{zone.zone}</h4>
                  <div className="flex items-center gap-2 text-[#556b5a] text-xs mb-6">
                    <Home className="w-4 h-4" />
                    <span>{zone.type}</span>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#556b5a]">Affected Population</span>
                      <span className="text-[#2c3e2e]">{zone.pop}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-[#556b5a]">Supply Status</span>
                        <span className={zone.priority === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}>{zone.supply}% of required supply available</span>
                      </div>
                      <div className="h-2 bg-[#f8f9f5] rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${zone.supply}%` }}
                          className={`h-full ${zone.priority === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[#556b5a] uppercase tracking-widest mb-2">Urgent Medicines</div>
                    <div className="flex flex-wrap gap-2">
                      {zone.urgent.map((med, j) => (
                        <span key={j} className="px-3 py-1 bg-[#f8f9f5] border border-[#2c3e2e]/5 rounded-lg text-[10px] font-bold text-[#556b5a]">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Deliveries */}
          <div>
            <h3 className="text-2xl font-bold font-serif mb-8 tracking-tight text-[#2c3e2e]">Active Emergency Deliveries</h3>
            <div className="space-y-4">
              {[
                { 
                  id: "1", 
                  type: "Antibiotics & Water Purification", 
                  from: "Bangalore Medical Hub", 
                  to: "Kerala Flood Zone", 
                  qty: "5,000 units", 
                  eta: "6 hours", 
                  priority: "CRITICAL" 
                },
                { 
                  id: "2", 
                  type: "Pain Relief & First Aid", 
                  from: "Ahmedabad Supply Center", 
                  to: "Bhuj Earthquake Zone", 
                  qty: "3,500 units", 
                  eta: "4 hours", 
                  priority: "HIGH" 
                },
                { 
                  id: "3", 
                  type: "Cold & Flu + ORS", 
                  from: "Kolkata Distribution Hub", 
                  to: "Puri Cyclone Zone", 
                  qty: "4,200 units", 
                  eta: "8 hours", 
                  priority: "CRITICAL" 
                },
                { 
                  id: "4", 
                  type: "Anti-diarrheal & Vitamins", 
                  from: "Mumbai Emergency Stock", 
                  to: "Kerala Flood Zone", 
                  qty: "2,800 units", 
                  eta: "12 hours", 
                  priority: "HIGH" 
                }
              ].map((delivery, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-[#2c3e2e]/5 flex items-center justify-between group hover:bg-[#f8f9f5] transition-all shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl ${delivery.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'} flex items-center justify-center`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${delivery.priority === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`}>{delivery.priority} PRIORITY</span>
                        <span className="text-[#556b5a] text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ETA: {delivery.eta}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#2c3e2e]">{delivery.type}</h4>
                      <div className="flex items-center gap-2 text-[#556b5a] text-xs mt-1 font-medium">
                        <span>{delivery.from}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-[#2c3e2e]">{delivery.to}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-[#556b5a] uppercase tracking-widest mb-1">Quantity</div>
                    <div className="text-lg font-bold text-[#2c3e2e]">{delivery.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div>
            <h3 className="text-2xl font-bold font-serif mb-8 tracking-tight text-[#2c3e2e]">AI-Generated Policy Recommendations</h3>
            <div className="space-y-4">
              {[
                { 
                  title: "Increase Pre-positioned Stock", 
                  desc: "Establish 3 additional emergency medicine stockpiles in disaster-prone coastal areas.", 
                  impact: "Reduce emergency response time by 40%", 
                  priority: "High",
                  color: "emerald"
                },
                { 
                  title: "Strengthen Last-Mile Logistics", 
                  desc: "Partner with local NGOs and community health workers for rapid distribution in affected areas.", 
                  impact: "Reach 25% more beneficiaries in first 48 hours", 
                  priority: "Critical",
                  color: "rose"
                },
                { 
                  title: "Mobile Health Units Deployment", 
                  desc: "Deploy 5 additional mobile medical units to disaster zones for on-site treatment and medicine distribution.", 
                  impact: "Provide immediate care to 10,000+ affected citizens", 
                  priority: "High",
                  color: "sky"
                }
              ].map((rec, i) => (
                <div key={i} className={`bg-white p-8 rounded-[2.5rem] border border-[#2c3e2e]/5 flex items-start gap-6 group hover:shadow-soft transition-all`}>
                  <div className={`w-12 h-12 rounded-2xl bg-[#5b7b62]/10 flex items-center justify-center text-[#5b7b62] shrink-0`}>
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-[#2c3e2e] font-serif">{rec.title}</h4>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${rec.priority === 'Critical' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-[#556b5a] text-sm font-medium leading-relaxed mb-4">{rec.desc}</p>
                    <div className="flex items-center gap-2 text-[#5b7b62] text-xs font-bold">
                      <LineChart className="w-4 h-4" />
                      <span>{rec.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-[#5b7b62]/20 shadow-soft">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-[#5b7b62]/10 flex items-center justify-center text-[#5b7b62] shrink-0">
                  <Handshake className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-serif text-[#2c3e2e] mb-2">Can You Help in Emergency Response?</h3>
                  <p className="text-[#556b5a] font-medium">We need volunteers with medical training, logistics support, or local area knowledge to help coordinate emergency medicine distribution in disaster zones.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <button className="px-8 py-4 bg-[#5b7b62] hover:opacity-90 text-white rounded-2xl font-bold transition flex items-center gap-3 shadow-lg shadow-[#5b7b62]/10">
                  <UserPlus className="w-5 h-5" />
                  Register as Volunteer
                </button>
                <button className="px-8 py-4 bg-[#a3b18a] hover:opacity-90 text-[#2c3e2e] rounded-2xl font-bold transition flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Emergency Helpline: 1800-XXX-XXXX
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        </>
      )}

      {/* Dashboard Features Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('gov.dbFeatures.title')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('gov.dbFeatures.desc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('gov.dbFeatures.mapping'),
                icon: <Map className="w-6 h-6 text-[#5b7b62]" />,
                desc: t('gov.dbFeatures.mappingDesc')
              },
              {
                title: t('gov.dbFeatures.audit'),
                icon: <Search className="w-6 h-6 text-[#7b9a82]" />,
                desc: t('gov.dbFeatures.auditDesc')
              },
              {
                title: t('gov.dbFeatures.analytics'),
                icon: <BarChart3 className="w-6 h-6 text-[#a3b18a]" />,
                desc: t('gov.dbFeatures.analyticsDesc')
              },
              {
                title: t('gov.dbFeatures.emergency'),
                icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
                desc: t('gov.dbFeatures.emergencyDesc')
              },
              {
                title: t('gov.dbFeatures.stakeholders'),
                icon: <Users className="w-6 h-6 text-[#2c3e2e]" />,
                desc: t('gov.dbFeatures.stakeholdersDesc')
              },
              {
                title: t('gov.dbFeatures.api'),
                icon: <Database className="w-6 h-6 text-[#a3b18a]" />,
                desc: t('gov.dbFeatures.apiDesc')
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-[#2c3e2e]/5 shadow-soft hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[#f8f9f5] rounded-2xl flex items-center justify-center mb-8">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#2c3e2e] font-serif">{card.title}</h3>
                <p className="text-[#556b5a] text-sm font-medium leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Transparency Section */}
      <section className="py-24 px-6 bg-[#f0f2eb]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('gov.transparency.title')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('gov.transparency.desc')}</p>
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-[#2c3e2e]/5 space-y-10 shadow-soft">
            {[
              { title: t('gov.transparency.tracking'), desc: t('gov.transparency.trackingDesc'), icon: <Database className="text-[#5b7b62]" /> },
              { title: t('gov.transparency.optimization'), desc: t('gov.transparency.optimizationDesc'), icon: <Truck className="text-[#7b9a82]" /> },
              { title: t('gov.transparency.verification'), desc: t('gov.transparency.verificationDesc'), icon: <CheckCircle2 className="text-[#a3b18a]" /> },
              { title: t('gov.transparency.immutable'), desc: t('gov.transparency.immutableDesc'), icon: <History className="text-[#2c3e2e]" /> }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-8 group">
                <div className="w-14 h-14 bg-[#f8f9f5] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-[#2c3e2e] font-serif">{item.title}</h4>
                  <p className="text-[#556b5a] text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Impact Metrics Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('gov.metrics.title')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('gov.metrics.desc')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { stat: "₹34.2 Cr", label: t('gov.metrics.waste'), icon: <span className="text-[#5b7b62] font-bold">Rs</span> },
              { stat: "142 tons", label: t('gov.metrics.co2'), icon: <Leaf className="text-[#7b9a82]" /> },
              { stat: "2.8 Lakh", label: t('gov.metrics.citizens'), icon: <Users className="text-[#a3b18a]" /> },
              { stat: "850+", label: t('gov.metrics.facilities'), icon: <Globe className="text-[#2c3e2e]" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] text-center border border-[#2c3e2e]/5 shadow-soft">
                <div className="w-12 h-12 bg-[#f8f9f5] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  {item.icon}
                </div>
                <div className="text-3xl font-bold text-[#2c3e2e] mb-2 font-serif">{item.stat}</div>
                <div className="text-xs font-bold text-[#556b5a] uppercase tracking-widest leading-relaxed">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Compliance Section */}
      <section className="py-24 px-6 bg-[#f0f2eb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('gov.compliance.title')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('gov.compliance.desc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('gov.compliance.act'), desc: t('gov.compliance.actDesc'), icon: <Scale className="text-[#5b7b62]" /> },
              { title: t('gov.compliance.cdsco'), desc: t('gov.compliance.cdscoDesc'), icon: <Award className="text-[#7b9a82]" /> },
              { title: t('gov.compliance.iso'), desc: t('gov.compliance.isoDesc'), icon: <ShieldCheck className="text-[#a3b18a]" /> },
              { title: t('gov.compliance.it'), desc: t('gov.compliance.itDesc'), icon: <Lock className="text-[#2c3e2e]" /> },
              { title: t('gov.compliance.env'), desc: t('gov.compliance.envDesc'), icon: <Leaf className="text-rose-600" /> },
              { title: t('gov.compliance.gdp'), desc: t('gov.compliance.gdpDesc'), icon: <Package className="text-amber-600" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-[#2c3e2e]/5 text-center shadow-soft">
                <div className="w-12 h-12 bg-[#f8f9f5] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-[#2c3e2e] font-serif">{item.title}</h4>
                <p className="text-[#556b5a] text-xs font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Use Cases Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('gov.useCases.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-12 rounded-[3rem] border border-[#2c3e2e]/5 shadow-soft">
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 text-rose-600">
                <Home className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-[#2c3e2e] font-serif">{t('gov.useCases.disaster')}</h3>
              <p className="text-[#556b5a] text-sm font-medium leading-relaxed mb-8">
                {t('gov.useCases.disasterDesc')}
              </p>
              <ul className="space-y-4">
                {[
                  t('gov.useCases.disasterItem1'),
                  t('gov.useCases.disasterItem2'),
                  t('gov.useCases.disasterItem3'),
                  t('gov.useCases.disasterItem4')
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#556b5a] text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-12 rounded-[3rem] border border-[#2c3e2e]/5 shadow-soft">
              <div className="w-14 h-14 bg-[#5b7b62]/10 rounded-2xl flex items-center justify-center mb-8 text-[#5b7b62]">
                <LineChart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-[#2c3e2e] font-serif">{t('gov.useCases.planning')}</h3>
              <p className="text-[#556b5a] text-sm font-medium leading-relaxed mb-8">
                {t('gov.useCases.planningDesc')}
              </p>
              <ul className="space-y-4">
                {[
                  t('gov.useCases.planningItem1'),
                  t('gov.useCases.planningItem2'),
                  t('gov.useCases.planningItem3'),
                  t('gov.useCases.planningItem4')
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#556b5a] text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5b7b62] mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GovLandingPage;
