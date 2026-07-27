import React from 'react';
import { motion } from 'motion/react';
import { Pill, Heart, Leaf, Users, CheckCircle, Plus, ArrowRight, ChevronRight, HeartPulse, Boxes, Stethoscope, Globe, Package2, Shapes } from 'lucide-react';
import LiveMap from './LiveMap.tsx';
import AnimatedCounter from './AnimatedCounter.tsx';
import NearbyHubSearch from './NearbyHubSearch.tsx';
import { useLanguage } from '../LanguageContext.tsx';

interface Props {
  onAuth: () => void;
  onStart: () => void;
  onDonate: () => void;
  onRequest: () => void;
  onNGO: () => void;
  onGov: () => void;
}

const LandingPage: React.FC<Props> = ({ onAuth, onStart, onDonate, onRequest, onNGO, onGov }) => {
  const { t } = useLanguage();

  const stats = [
    { 
      label: t('stats.saved'), 
      val: "1,28,830", 
      sub: "Medicines Donated (Units)",
      icon: <Pill className="w-6 h-6" />
    },
    { 
      label: t('stats.lives'), 
      val: "46,272", 
      sub: "Lives Impacted",
      icon: <Heart className="w-6 h-6" />
    },
    { 
      label: t('stats.co2'), 
      val: "9,513+", 
      sub: "KG Medicine Saved",
      icon: <Leaf className="w-6 h-6" />
    },
    { 
      label: t('stats.waste'), 
      val: "₹23,40,819", 
      sub: "Worth of Medicines",
      icon: <Users className="w-6 h-6" />
    }
  ];

  const workflowSteps = [
    {
      title: t('how.step1.title'),
      desc: t('how.step1.desc'),
      icon: <Heart className="w-8 h-8 text-[#5b7b62]" />,
      bg: "bg-[#5b7b62]/10"
    },
    {
      title: t('how.step2.title'),
      desc: t('how.step2.desc'),
      icon: <CheckCircle className="w-8 h-8 text-[#7b9a82]" />,
      bg: "bg-[#7b9a82]/10"
    },
    {
      title: t('how.step3.title'),
      desc: t('how.step3.desc'),
      icon: <Users className="w-8 h-8 text-[#a3b18a]" />,
      bg: "bg-[#a3b18a]/10"
    }
  ];

  return (
    <div className="bg-[#f8f9f5] text-[#2c3e2e] min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative pt-20 pb-32 px-6 overflow-hidden max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#e6e9e1] border border-[#2c3e2e]/5 text-[#5b7b62] text-sm font-semibold mb-10">
              India's Smart Medicine Redistribution Network
            </div>

            <h1 className="text-6xl md:text-7xl font-serif font-bold leading-[1.1] mb-8 text-[#2c3e2e]">
              Turn Your Unused Medicines Into Life-Saving Resources
            </h1>

            <p className="text-[#556b5a] text-lg md:text-xl max-w-xl font-medium mb-12 leading-relaxed">
              MedRoute connects surplus verified medicines from donors to patients who need them most. Fast, transparent, and completely free.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onDonate} 
                className="px-8 py-4 bg-[#2c3e2e] text-white rounded-xl font-bold flex items-center gap-3 hover:opacity-90 transition shadow-lg shadow-[#2c3e2e]/10"
              >
                <HeartPulse className="w-5 h-5 text-[#a3b18a]" strokeWidth={2.5} />
                Donate medicines
              </button>
              <button 
                onClick={onRequest} 
                className="px-8 py-4 bg-[#a3b18a]/20 text-[#2c3e2e] border border-[#a3b18a]/30 rounded-xl font-bold flex items-center gap-3 hover:bg-[#a3b18a]/30 transition"
              >
                <ArrowRight className="w-5 h-5" />
                Request medicines
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Organic shape background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e6e9e1] rounded-full blur-[80px] -z-10 opacity-60"></div>
            
            {/* Representative illustration */}
            <div className="relative z-10 flex justify-center">
              <div className="relative group p-8">
                {/* Soft ambient glow behind the image */}
                <div className="absolute -inset-16 bg-white/40 blur-[100px] rounded-full group-hover:bg-white/60 transition-all duration-1000 -z-10"></div>
                
                <div className="relative">
                   <img 
                     src="https://lh3.googleusercontent.com/d/1agn1LiT78EjxTc1O5Y4S61sbRaLVAMUv" 
                     alt="Medicine Donation" 
                     className="w-[540px] h-auto object-contain transform drop-shadow-3xl group-hover:scale-105 transition-transform duration-1000 mix-blend-multiply opacity-95"
                     referrerPolicy="no-referrer"
                   />
                </div>
                

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section bar */}
      <section className="pb-32">
        <div className="w-full bg-[#7b9a82] py-16 text-white shadow-soft">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-8 items-center">
            {stats.map((stat, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center justify-center gap-6 px-4 lg:px-8 ${i !== 0 ? 'lg:border-l border-white/10' : ''}`}>
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shrink-0 shadow-inner">
                  {stat.icon}
                </div>
                <div className="text-center md:text-left">
                  <AnimatedCounter 
                    value={stat.val} 
                    className="text-4xl lg:text-3xl font-bold font-['Cambria',serif] tracking-tight block mb-1"
                  />
                  <div className="text-[10px] lg:text-xs font-bold text-white/80 uppercase tracking-[0.15em] whitespace-nowrap">
                    {stat.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section Hub */}
      <section className="py-24 px-6 bg-white/30">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-20 items-start">
            <div className="col-span-1 pt-12">
              <h2 className="text-5xl font-serif font-bold text-[#2c3e2e] mb-6 leading-tight">Hub Network</h2>
              <p className="text-[#556b5a] text-lg font-medium leading-relaxed mb-8">
                Explore our network of hubs and dropboxes across India.
              </p>
              <button 
                className="text-[#5b7b62] font-bold text-sm uppercase tracking-widest flex items-center gap-2 group"
              >
                Zoom in to discover local collection points
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="col-span-2 h-[600px] relative rounded-[2.5rem] overflow-hidden shadow-soft border border-[#2c3e2e]/5">
              <LiveMap mapType="default" isLandingPage={true} />
              
              <div className="absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-black/5 min-w-[200px]">
                <div className="text-[10px] font-black uppercase text-[#556b5a] mb-2 tracking-widest">Network Legend</div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#5b7b62] rounded-full border-2 border-white shadow-sm font-bold"></div>
                  <span className="text-xs font-bold text-[#2c3e2e]">Registered Hubs & Dropboxes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Search Feature */}
      <section className="py-24 bg-[#f0f2eb]">
        <div className="max-w-6xl mx-auto px-8">
           <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-[#2c3e2e] mb-2">Locate verified hubs</h3>
              <p className="text-sm font-medium text-[#556b5a]">Find nearest dropbox or collection point near you.</p>
           </div>
           <NearbyHubSearch />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white/40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-serif font-bold text-[#2c3e2e] mb-4">How It Works</h2>
            <p className="text-[#556b5a] font-medium max-w-2xl mx-auto text-lg leading-relaxed">
              Simple, transparent, and efficient medicine redistribution in three steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {workflowSteps.map((step, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="bg-white p-12 rounded-[2.5rem] text-center shadow-soft border border-[#2c3e2e]/5 group transition-all"
              >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8 shadow-inner ${step.bg}`}>
                  {step.icon}
                </div>
                <h4 className="text-2xl font-bold mb-4 font-serif text-[#2c3e2e]">{step.title}</h4>
                <p className="text-[#556b5a] text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA styled as a grid/dark section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#2c3e2e] p-16 md:p-24 text-center">
            <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none">
               <Leaf className="w-64 h-64 rotate-12 text-white" />
            </div>
            
            <div className="grid lg:grid-cols-2 items-center gap-16">
              <div className="hidden lg:block">
                 <div className="relative w-full aspect-square bg-white/5 rounded-[3rem] overflow-hidden flex items-center justify-center">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1Tw4-ERuwug54i8x039VfiaVjWwEHoer6" 
                      alt="Medicine Redistribution Team" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-[#2c3e2e]/20 group-hover:bg-[#2c3e2e]/0 transition-colors duration-700"></div>
                 </div>
              </div>
              
              <div className="text-left">
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">Join the Life-saving Grid</h2>
                <p className="text-[#a3b18a] text-lg md:text-xl font-medium mb-12 leading-relaxed">
                  Don't let medicines go to waste. Join thousands making healthcare accessible for all.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button onClick={onDonate} className="w-full sm:w-auto px-10 py-5 bg-white text-[#2c3e2e] rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-2xl">
                    Start donating now
                  </button>
                  <button className="w-full sm:w-auto px-10 py-5 bg-[#5b7b62]/20 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition">
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
