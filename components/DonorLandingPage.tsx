import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext.tsx';
import { 
  UserRound, Heart, Recycle, ReceiptText, Store, Hospital, 
  CheckCircle2, XCircle, Leaf, ArrowRight, MapPin, TrendingUp, Check, X, FileText
} from 'lucide-react';

interface Props {
  onStart: () => void;
  onBack: () => void;
}

const DonorLandingPage: React.FC<Props> = ({ onStart, onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#f8f9f5] text-[#2c3e2e] min-h-screen selection:bg-[#5b7b62]/30_sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#5b7b62]/5 rounded-full blur-[160px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#5b7b62]/10 border border-[#5b7b62]/20 text-[#5b7b62] text-sm font-semibold mb-8 tracking-wide"
          >
            {t('donor.forDonors')}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-[5.5rem] font-bold font-serif leading-[1.05] tracking-tight mb-8 text-[#2c3e2e]"
          >
            {t('donor.hero.title1')}<br />
            {t('donor.hero.title2')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#556b5a] text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
          >
            {t('donor.hero.desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
          >
            <button 
              onClick={onStart}
              className="px-8 py-3.5 bg-[#2c1d11] hover:opacity-90 text-white rounded-xl font-bold text-base transition-all flex items-center gap-2.5 shadow-md shadow-[#2c3e2e]/10 group"
            >
              <Heart className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
              {t('donor.startNow')}
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('guidelines-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-3.5 bg-[#f0f2eb] hover:bg-[#e6e8e1] text-[#2c3e2e] rounded-xl font-bold text-base transition-all flex items-center gap-2"
            >
              <span>Learn Guidelines</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Who Can Donate Section */}
      <section className="py-24 px-6 bg-white/40 border-t border-[#2c3e2e]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">
              {t('donor.whoDonate')}
            </h2>
            <p className="text-[#556b5a] font-medium text-lg">
              {t('donor.everyoneDiff')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('donor.who.individuals') || 'Individuals',
                icon: <UserRound className="w-7 h-7 text-[#2c3e2e]" />,
                items: [
                  t('donor.who.individuals.item1') || 'Leftover prescription medicines',
                  t('donor.who.individuals.item2') || 'Over-the-counter medications',
                  t('donor.who.individuals.item3') || 'Vitamins & supplements',
                  t('donor.who.individuals.item4') || 'First aid supplies'
                ]
              },
              {
                title: t('donor.who.pharmacies') || 'Pharmacies',
                icon: <Store className="w-7 h-7 text-[#2c3e2e]" />,
                items: [
                  t('donor.who.pharmacies.item1') || 'Near-expiry inventory',
                  t('donor.who.pharmacies.item2') || 'Overstocked items',
                  t('donor.who.pharmacies.item3') || 'Discontinued products',
                  t('donor.who.pharmacies.item4') || 'Sample medications'
                ]
              },
              {
                title: t('donor.who.hospitals') || 'Hospitals',
                icon: <Hospital className="w-7 h-7 text-[#2c3e2e]" />,
                items: [
                  t('donor.who.hospitals.item1') || 'Surplus inventory',
                  t('donor.who.hospitals.item2') || 'Patient leftover medicines',
                  t('donor.who.hospitals.item3') || 'Unopened supplies',
                  t('donor.who.hospitals.item4') || 'Bulk donations'
                ]
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -6 }}
                className="bg-white p-10 rounded-[2rem] border border-[#2c3e2e]/10 text-center shadow-sm transition-all"
              >
                <div className="w-16 h-16 bg-[#eef1eb] rounded-full flex items-center justify-center mb-6 mx-auto">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-6 text-[#2c3e2e] font-serif">{card.title}</h3>
                <div className="inline-block text-left w-full max-w-[240px]">
                  <ul className="space-y-4">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[#556b5a] text-sm font-medium leading-tight">
                        <Check className="w-4 h-4 text-[#5b7b62] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Donate Section */}
      <section className="py-24 px-6 bg-[#f0f2eb]/70 border-t border-b border-[#2c3e2e]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">
              {t('donor.howTo')}
            </h2>
            <p className="text-[#556b5a] font-medium text-lg">
              {t('donor.simpleSafe')}
            </p>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 relative">
            {[
              { 
                step: "01", 
                title: t('donor.how.steps.register') || 'Register', 
                desc: t('donor.how.steps.registerDesc') || 'Create your free account and complete your donor profile.', 
                icon: <FileText className="w-6 h-6" /> 
              },
              { 
                step: "02", 
                title: t('donor.how.steps.list') || 'List Medicines', 
                desc: t('donor.how.steps.listDesc') || 'Upload details, scan barcodes, check expiry dates, and add quantities.', 
                icon: <CheckCircle2 className="w-6 h-6" /> 
              },
              { 
                step: "03", 
                title: t('donor.how.steps.method') || 'Choose Method', 
                desc: t('donor.how.steps.methodDesc') || 'Drop at nearest hub or schedule a free pickup from your location.', 
                icon: <MapPin className="w-6 h-6" /> 
              },
              { 
                step: "04", 
                title: t('donor.how.steps.track') || 'Track Impact', 
                desc: t('donor.how.steps.trackDesc') || 'Monitor your donation journey and the impact in real-time.', 
                icon: <TrendingUp className="w-6 h-6" /> 
              }
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-8 rounded-[2rem] border border-[#2c3e2e]/5 shadow-sm text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl bg-[#f0f2eb] text-[#2c3e2e] flex items-center justify-center mb-6 group-hover:bg-[#2c3e2e] group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                
                <span className="text-xs font-bold text-[#5b7b62]/80 uppercase tracking-widest mb-2">{item.step}</span>
                <h4 className="text-lg font-bold mb-3 text-[#2c3e2e] font-serif">{item.title}</h4>
                <p className="text-[#556b5a] text-sm leading-relaxed font-semibold px-2">
                  {item.desc}
                </p>

                {/* Connecting Arrow for desktop */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-[4.5rem] -right-6 w-12 border-t-2 border-dashed border-[#5b7b62]/40 z-20">
                    <div className="absolute right-0 -top-[5px] border-solid border-r-2 border-b-2 border-[#5b7b62]/40 w-2 h-2 rotate-[-45deg]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Guidelines Section */}
      <section id="guidelines-section" className="py-24 px-6 bg-[#f8f9f5]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">
              {t('donor.guidelines')}
            </h2>
            <p className="text-[#556b5a] font-medium text-lg">
              {t('donor.guidelines.subtitle') || 'Help us maintain safety and quality for those in need'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What We Accept Card */}
            <div className="p-10 rounded-[2.5rem] bg-[#ecf0e9]/50 border border-emerald-500/10 relative overflow-hidden flex flex-col justify-between shadow-sm min-h-[400px]">
              <div>
                <div className="flex items-center gap-3 mb-8 text-[#5b7b62]">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="text-sm font-bold tracking-widest uppercase">{t('donor.guide.accept')}</h3>
                </div>
                <ul className="space-y-5 relative z-10">
                  {[
                    t('donor.guide.accept.item1'),
                    t('donor.guide.accept.item2'),
                    t('donor.guide.accept.item3'),
                    t('donor.guide.accept.item4'),
                    t('donor.guide.accept.item5')
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-[#2c3e2e] font-semibold text-sm leading-snug">
                      <Check className="w-5 h-5 text-[#5b7b62] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Leaf className="absolute -bottom-10 -right-10 w-44 h-44 text-[#5b7b62]/5 rotate-45 pointer-events-none" />
            </div>

            {/* What We Don't Accept Card */}
            <div className="p-10 rounded-[2.5rem] bg-[#fdf4f2] border border-rose-500/10 flex flex-col justify-between shadow-sm min-h-[400px]">
              <div>
                <div className="flex items-center gap-3 mb-8 text-[#2c3e2e]">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm font-bold tracking-widest uppercase text-rose-700">{t('donor.guide.reject')}</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    t('donor.guide.reject.item1'),
                    t('donor.guide.reject.item2'),
                    t('donor.guide.reject.item3'),
                    t('donor.guide.reject.item4'),
                    t('donor.guide.reject.item5')
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3.5 text-[#5c4946] font-semibold text-sm leading-snug">
                      <X className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-[#f0f2eb]/70 border-t border-b border-[#2c3e2e]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">
              {t('donor.benefits')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('donor.benefit.lives'), desc: t('donor.benefit.livesDesc'), icon: <Heart className="w-5 h-5 text-[#5b7b62]" /> },
              { title: t('donor.benefit.env'), desc: t('donor.benefit.envDesc'), icon: <Recycle className="w-5 h-5 text-[#5b7b62]" /> },
              { title: t('donor.benefit.tax'), desc: t('donor.benefit.taxDesc'), icon: <ReceiptText className="w-5 h-5 text-[#5b7b62]" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-[#2c3e2e]/5 shadow-sm hover:shadow-md transition-all flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-[#f0f2eb] flex items-center justify-center mt-0.5 shrink-0 text-[#5b7b62]">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold font-serif mb-2 text-[#2c3e2e]">{item.title}</h4>
                  <p className="text-[#556b5a] text-sm leading-relaxed font-semibold">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#f8f9f5]">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#2c3e2e] p-16 md:p-24 text-center">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <Leaf className="absolute -left-12 -bottom-12 w-64 h-64 text-white -rotate-45" />
              <Leaf className="absolute -right-12 -top-12 w-64 h-64 text-white rotate-45" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-serif text-white tracking-tight mb-6 relative z-10">
              {t('donor.ready')}
            </h2>
            <p className="text-[#a3b18a]/90 text-lg md:text-xl max-w-2xl mx-auto font-semibold mb-12 relative z-10 leading-relaxed font-serif">
              {t('donor.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button 
                onClick={onStart}
                className="px-10 py-4 bg-white text-[#2c3e2e] hover:bg-white/95 rounded-xl font-bold text-base transition-all shadow-lg active:scale-[0.98]"
              >
                {t('donor.createAccount')}
              </button>
              <button 
                onClick={onBack}
                className="px-10 py-4 bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-xl font-bold text-base transition-all active:scale-[0.98]"
              >
                {t('nav.home')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonorLandingPage;
