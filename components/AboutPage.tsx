import React from 'react';
import { motion } from 'motion/react';
import { Heart, Target, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext.tsx';

interface Props {
  onBack: () => void;
}

const AboutPage: React.FC<Props> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#f8f9f5] text-[#2c3e2e] min-h-screen py-24 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#5b7b62]/5 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5b7b62]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-24"
        >
          {/* Main Visual Message */}
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-[#5b7b62]/10 rounded-2xl flex items-center justify-center text-[#5b7b62] shadow-soft">
                <Globe className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter leading-[1.1] mb-8 text-[#2c3e2e]">
              {t('about.hero.part1')}<span className="text-[#5b7b62]">{t('about.hero.part2')}</span>
            </h1>
          </div>

          {/* Mission Statement */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-[#2c3e2e]/5 shadow-soft relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#5b7b62]"></div>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-20 h-20 bg-[#5b7b62] rounded-3xl flex items-center justify-center text-white flex-shrink-0 shadow-xl shadow-[#5b7b62]/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Target className="w-10 h-10" />
              </div>
              <div className="space-y-6">
                <h2 className="text-xl font-bold uppercase tracking-widest text-[#5b7b62]">{t('about.mission.title')}</h2>
                <p className="text-2xl md:text-3xl font-bold font-sans text-[#2c3e2e] leading-relaxed tracking-tight">
                  {t('about.mission.desc1')}<span className="text-[#5b7b62] font-serif italic">{t('about.mission.desc2')}</span>{t('about.mission.desc3')}
                </p>
              </div>
            </div>
          </div>

          {/* Final Emotional Hook */}
          <div className="text-center space-y-12 pb-12">
            <div className="flex justify-center">
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-[#5b7b62] to-transparent"></div>
            </div>
            <div className="space-y-6">
              <Heart className="w-12 h-12 text-[#5b7b62] mx-auto animate-pulse" />
              <p className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-[#2c3e2e]">
                {t('about.final.part1')}<span className="italic">{t('about.final.part2')}</span>{t('about.final.part3')}
              </p>
            </div>
            <button 
              onClick={onBack}
              className="px-12 py-5 bg-[#2c3e2e] hover:opacity-90 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-[#2c3e2e]/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('about.cta')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
