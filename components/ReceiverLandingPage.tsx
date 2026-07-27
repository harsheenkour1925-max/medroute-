import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext.tsx';
import { 
  User, 
  Users, 
  HeartHandshake, 
  ClipboardList, 
  Search, 
  Handshake, 
  PackageCheck, 
  Stethoscope, 
  Pill, 
  Activity, 
  ShieldCheck, 
  FileText, 
  Fingerprint, 
  HelpCircle, 
  ChevronDown,
  ArrowRight,
  Leaf
} from 'lucide-react';

interface Props {
  onStart: () => void;
  onBack: () => void;
}

const ReceiverLandingPage: React.FC<Props> = ({ onStart, onBack }) => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: t('receiver.faq.q1'),
      a: t('receiver.faq.a1')
    },
    {
      q: t('receiver.faq.q2'),
      a: t('receiver.faq.a2')
    },
    {
      q: t('receiver.faq.q3'),
      a: t('receiver.faq.a3')
    },
    {
      q: t('receiver.faq.q4'),
      a: t('receiver.faq.a4')
    }
  ];

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
            className="flex items-center justify-center gap-4 mb-12"
          >
            <button 
              onClick={onBack}
              className="px-6 py-2 bg-white hover:bg-gray-50 text-[#2c3e2e] rounded-full border border-[#2c3e2e]/10 transition-all font-bold text-xs uppercase tracking-widest shadow-sm"
            >
              {t('auth.back')}
            </button>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#5b7b62]/10 border border-[#5b7b62]/20 text-[#5b7b62] text-xs font-bold uppercase tracking-widest">
              {t('receiver.forCitizens')}
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-serif leading-[1.1] tracking-tighter mb-8 text-[#2c3e2e]"
          >
            {t('receiver.hero.title1')} <br />
            {t('receiver.hero.title2')}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#556b5a] text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed"
          >
            {t('receiver.hero.desc')}
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
              <Pill className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {t('receiver.requestMeds')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Who Can Request Section */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('receiver.whoRequest')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('receiver.servesEveryone')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('receiver.who.individual'),
                icon: <User className="w-8 h-8 text-[#5b7b62]" />,
                desc: t('receiver.who.individualDesc')
              },
              {
                title: t('receiver.who.families'),
                icon: <Users className="w-8 h-8 text-[#7b9a82]" />,
                desc: t('receiver.who.familiesDesc')
              },
              {
                title: t('receiver.who.caregivers'),
                icon: <HeartHandshake className="w-8 h-8 text-[#a3b18a]" />,
                desc: t('receiver.who.caregiversDesc')
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

      {/* How to Request Section */}
      <section className="py-24 px-6 bg-[#f0f2eb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('receiver.howToRequest')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('receiver.how.steps.desc')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: t('receiver.how.steps.register'), desc: t('receiver.how.steps.registerDesc'), icon: <ClipboardList className="w-6 h-6" /> },
              { step: "2", title: t('receiver.how.steps.submit'), desc: t('receiver.how.steps.submitDesc'), icon: <Search className="w-6 h-6" /> },
              { step: "3", title: t('receiver.how.steps.match'), desc: t('receiver.how.steps.matchDesc'), icon: <Handshake className="w-6 h-6" /> },
              { step: "4", title: t('receiver.how.steps.receive'), desc: t('receiver.how.steps.receiveDesc'), icon: <PackageCheck className="w-6 h-6" /> }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-8 inline-block">
                  <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-[#5b7b62] group-hover:bg-[#5b7b62] group-hover:text-white transition-all duration-500 shadow-soft">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#2c3e2e] text-white text-xs font-bold flex items-center justify-center border-4 border-[#f0f2eb]">
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

      {/* Commonly Available Medicines */}
      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('receiver.commonMeds')}</h2>
            <p className="text-[#556b5a] font-medium text-lg">{t('receiver.hero.desc')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: t('receiver.available.chronic'), desc: t('receiver.available.chronicDesc'), icon: <Activity className="text-[#5b7b62]" /> },
              { title: t('receiver.available.antibiotics'), desc: t('receiver.available.antibioticsDesc'), icon: <Pill className="text-[#7b9a82]" /> },
              { title: t('receiver.available.pain'), desc: t('receiver.available.painDesc'), icon: <Stethoscope className="text-[#a3b18a]" /> },
              { title: t('receiver.available.general'), desc: t('receiver.available.generalDesc'), icon: <ClipboardList className="text-[#2c3e2e]" /> }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-soft border border-[#2c3e2e]/5 text-center">
                <div className="w-12 h-12 bg-[#f8f9f5] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold mb-2 text-[#2c3e2e]">{item.title}</h4>
                <p className="text-[#556b5a] text-xs font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Requirements */}
      <section className="py-24 px-6 bg-[#f0f2eb]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('receiver.reqRequirements')}</h2>
          </div>

          <div className="space-y-4">
            {[
              { title: t('receiver.req.prescription'), desc: t('receiver.req.prescriptionDesc'), icon: <FileText className="text-[#5b7b62]" /> },
              { title: t('receiver.req.identity'), desc: t('receiver.req.identityDesc'), icon: <Fingerprint className="text-[#7b9a82]" /> },
              { title: t('receiver.req.need'), desc: t('receiver.req.needDesc'), icon: <ShieldCheck className="text-[#a3b18a]" /> }
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

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[#f8f9f5]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4 text-[#2c3e2e]">{t('receiver.faq')}</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#2c3e2e]/5 overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-[#2c3e2e]">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#556b5a] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="p-6 pt-0 text-[#556b5a] text-sm font-medium leading-relaxed border-t border-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden bg-[#2c3e2e] p-16 md:p-24 text-center shadow-soft">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <Leaf className="w-64 h-64 rotate-45 text-white/10" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold font-serif text-white tracking-tighter mb-6 relative z-10">{t('receiver.needHelp')}</h2>
            <p className="text-[#a3b18a] text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 relative z-10">
              {t('receiver.cta.desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button 
                onClick={onStart}
                className="px-12 py-5 bg-white text-[#2c3e2e] rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-2xl flex items-center gap-3"
              >
                {t('receiver.submitRequest')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onBack}
                className="px-12 py-5 bg-[#5b7b62]/20 border border-white/10 text-white rounded-xl font-bold text-lg transition"
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

export default ReceiverLandingPage;
