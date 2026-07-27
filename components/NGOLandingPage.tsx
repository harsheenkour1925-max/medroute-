import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext.tsx';
import { 
  Building2, 
  Home, 
  UserPlus, 
  ShieldCheck, 
  Truck, 
  LineChart, 
  FileText, 
  Lock, 
  Network, 
  ClipboardCheck, 
  Search, 
  ShoppingCart, 
  Share2, 
  Award, 
  Users, 
  BarChart3,
  ArrowRight,
  Handshake,
  Leaf
} from 'lucide-react';

interface Props {
  onStart: () => void;
  onBack: () => void;
}

const NGOLandingPage: React.FC<Props> = ({ onStart, onBack }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-[#f8f9f5] text-[#2c3e2e] min-h-screen selection:bg-[#5b7b62]/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#5b7b62]/5 rounded-full blur-[160px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#5b7b62]/10 border border-[#5b7b62]/20 text-[#5b7b62] text-sm font-bold mb-8 uppercase tracking-widest"
          >
            {t('ngo.forNgo')}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-serif leading-[1.1] tracking-tighter mb-8 text-[#2c3e2e]"
          >
            {t('ngo.hero.title1')} <br />
            {t('ngo.hero.title2')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#556b5a] text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
          >
            {t('ngo.hero.desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={onStart}
              className="px-10 py-4 bg-[#2c3e2e] hover:opacity-90 text-white rounded-2xl font-bold text-lg transition-all flex items-center gap-3 shadow-xl shadow-[#2c3e2e]/10 mx-auto group"
            >
              <Handshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {t('ngo.becomePartner')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Who Can Partner Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('ngo.whoTitle')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('ngo.whoDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('ngo.who.orgs'),
                icon: <Building2 className="w-8 h-8 text-[#5b7b62]" />,
                desc: t('ngo.who.orgsDesc')
              },
              {
                title: t('ngo.who.clinics'),
                icon: <Home className="w-8 h-8 text-[#7b9a82]" />,
                desc: t('ngo.who.clinicsDesc')
              },
              {
                title: t('ngo.who.workers'),
                icon: <UserPlus className="w-8 h-8 text-[#a3b18a]" />,
                desc: t('ngo.who.workersDesc')
              }
            ].map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-[#2c3e2e]/5 hover:shadow-soft transition-all text-center"
              >
                <div className="w-16 h-16 bg-[#f8f9f5] rounded-2xl flex items-center justify-center mb-8 mx-auto">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#2c3e2e] font-serif">{card.title}</h3>
                <p className="text-[#556b5a] text-sm font-medium leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-24 px-6 bg-[#f0f2eb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('ngo.benefitTitle')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('ngo.benefitDesc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t('ngo.benefit.verified'), desc: t('ngo.benefit.verifiedDesc'), icon: <ShieldCheck className="w-6 h-6 text-[#5b7b62]" /> },
              { title: t('ngo.benefit.logistics'), desc: t('ngo.benefit.logisticsDesc'), icon: <Truck className="w-6 h-6 text-[#7b9a82]" /> },
              { title: t('ngo.benefit.tracking'), desc: t('ngo.benefit.trackingDesc'), icon: <LineChart className="w-6 h-6 text-[#a3b18a]" /> },
              { title: t('ngo.benefit.docs'), desc: t('ngo.benefit.docsDesc'), icon: <FileText className="w-6 h-6 text-[#2c3e2e]" /> },
              { title: t('ngo.benefit.compliance'), desc: t('ngo.benefit.complianceDesc'), icon: <Lock className="w-6 h-6 text-rose-600" /> },
              { title: t('ngo.benefit.network'), desc: t('ngo.benefit.networkDesc'), icon: <Network className="w-6 h-6 text-amber-600" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-[#2c3e2e]/5 hover:shadow-soft transition-all">
                <div className="w-12 h-12 bg-[#f8f9f5] rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-[#2c3e2e] font-serif">{item.title}</h4>
                <p className="text-[#556b5a] text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('ngo.how.title')}</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: t('ngo.how.steps.register'), desc: t('ngo.how.steps.registerDesc'), icon: <ClipboardCheck className="w-6 h-6" /> },
              { step: "2", title: t('ngo.how.steps.browse'), desc: t('ngo.how.steps.browseDesc'), icon: <Search className="w-6 h-6" /> },
              { step: "3", title: t('ngo.how.steps.orders'), desc: t('ngo.how.steps.ordersDesc'), icon: <ShoppingCart className="w-6 h-6" /> },
              { step: "4", title: t('ngo.how.steps.track'), desc: t('ngo.how.steps.trackDesc'), icon: <Share2 className="w-6 h-6" /> }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-8 inline-block">
                  <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-[#5b7b62] group-hover:bg-[#5b7b62] group-hover:text-white transition-all duration-500 shadow-soft">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#2c3e2e] text-white text-xs font-bold flex items-center justify-center border-4 border-white">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3 text-[#2c3e2e]">{item.title}</h4>
                <p className="text-[#556b5a] text-sm leading-relaxed font-medium px-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Requirements */}
      <section className="py-24 px-6 bg-[#f0f2eb]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('ngo.req.title')}</h2>
          </div>

          <div className="space-y-4">
            {[
              { title: t('ngo.req.reg'), desc: t('ngo.req.regDesc'), icon: <Award className="text-[#5b7b62]" /> },
              { title: t('ngo.req.docs'), desc: t('ngo.req.docsDesc'), icon: <FileText className="text-[#7b9a82]" /> },
              { title: t('ngo.req.staff'), desc: t('ngo.req.staffDesc'), icon: <Users className="text-[#a3b18a]" /> },
              { title: t('ngo.req.reporting'), desc: t('ngo.req.reportingDesc'), icon: <BarChart3 className="text-[#2c3e2e]" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-[#2c3e2e]/5 flex items-start gap-6 shadow-soft">
                <div className="w-12 h-12 bg-[#f8f9f5] rounded-2xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-[#2c3e2e]">{item.title}</h4>
                  <p className="text-[#556b5a] text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('ngo.stories.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                org: "Healthbridge Foundation", 
                stat: "₹2.3L", 
                label: t('ngo.stories.medsRedistributed'), 
                desc: "Serving 15 rural clinics across Rajasthan" 
              },
              { 
                org: "Hope Medical Services", 
                stat: "5,000+", 
                label: t('ngo.stories.patientsTreated'), 
                desc: "Mobile health camps in tribal areas" 
              },
              { 
                org: "Community Care NGO", 
                stat: "12 Districts", 
                label: t('ngo.stories.coverageExpanded'), 
                desc: "Chronic disease management programs" 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[2.5rem] text-center border border-[#2c3e2e]/5 shadow-soft">
                <h4 className="text-lg font-bold mb-6 text-[#556b5a] font-serif uppercase tracking-widest text-[10px]">{item.org}</h4>
                <div className="text-4xl font-bold text-[#5b7b62] mb-2">{item.stat}</div>
                <div className="text-sm font-bold text-[#2c3e2e] uppercase tracking-widest mb-6 text-[10px]">{item.label}</div>
                <p className="text-[#556b5a] text-xs italic font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#2c3e2e] p-16 md:p-24 text-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <Leaf className="w-64 h-64 rotate-45 text-white/10" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-serif text-white tracking-tighter mb-6 relative z-10">{t('ngo.ready')}</h2>
            <p className="text-[#a3b18a] text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 relative z-10">
              {t('ngo.ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button 
                onClick={onStart}
                className="px-12 py-5 bg-white text-[#2c3e2e] rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-2xl flex items-center gap-3"
              >
                {t('ngo.apply')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onBack}
                className="px-12 py-5 bg-[#5b7b62]/20 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition"
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

export default NGOLandingPage;
