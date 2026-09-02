import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Rocket, MapPin, Eye, TrendingUp, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import heroBannerImg from '../assets/images/divulgador_hero_banner_1788291192816.jpg';

export const HeroBanner: React.FC = () => {
  const { setCurrentTab } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/30 border border-purple-500/30 bg-slate-950 text-white mb-2"
    >
      {/* Visual Image Banner with Gradient Overlay */}
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] min-h-[200px] sm:min-h-[240px] max-h-[380px] overflow-hidden">
        <img
          src={heroBannerImg || '/assets/images/divulgador_hero_banner.jpg'}
          alt="DIVULGADOR - Divulgue. Apareça. Venda Mais."
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 select-none"
        />

        {/* Ambient atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Content Overlays & Interactive CTA Overlay */}
        <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between z-10">
          {/* Top Pill Badges */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/80 border border-purple-400/40 text-purple-200 text-[11px] sm:text-xs font-bold backdrop-blur-md shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>O App de Divulgação Local nº 1</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/90 text-slate-950 text-xs font-extrabold shadow-md uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>Milhares de pessoas conectadas</span>
            </div>
          </div>

          {/* Bottom Call to Action and Core Slogan */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-auto pt-2">
            <div className="max-w-md">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                DIVULGADOR
              </h2>
              <p className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide uppercase drop-shadow">
                DIVULGUE. APAREÇA. VENDA MAIS.
              </p>
              <p className="hidden md:block text-xs text-purple-100/90 font-medium mt-1">
                Conecte seu negócio com clientes locais em tempo real com anúncios criados por IA.
              </p>
            </div>

            {/* Clickable CTA Button */}
            <div className="flex items-center gap-2 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentTab('ai-creator')}
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 border border-amber-200 transition-all uppercase tracking-wider cursor-pointer"
              >
                <Rocket className="w-4 h-4 fill-slate-950 animate-bounce" />
                <span>DIVULGAR AGORA!</span>
                <ChevronRight className="w-4 h-4 stroke-[3px]" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Highlights Strip matching the banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-purple-900/40 bg-slate-950/90 border-t border-purple-800/30 p-2 sm:p-3 text-xs">
        <button
          onClick={() => setCurrentTab('radar')}
          className="p-2.5 flex items-center gap-2.5 hover:bg-purple-950/40 rounded-xl transition-colors text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-[11px] sm:text-xs text-white uppercase tracking-wider">Mais Visibilidade</p>
            <p className="text-[10px] text-purple-200/70 line-clamp-1">Apareça para clientes perto</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('ai-creator')}
          className="p-2.5 flex items-center gap-2.5 hover:bg-purple-950/40 rounded-xl transition-colors text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-[11px] sm:text-xs text-white uppercase tracking-wider">Divulgação com IA</p>
            <p className="text-[10px] text-purple-200/70 line-clamp-1">Anúncios criados em segundos</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('plans')}
          className="p-2.5 flex items-center gap-2.5 hover:bg-purple-950/40 rounded-xl transition-colors text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-[11px] sm:text-xs text-white uppercase tracking-wider">Venda Mais</p>
            <p className="text-[10px] text-purple-200/70 line-clamp-1">Conquiste e conecte clientes</p>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('radar')}
          className="p-2.5 flex items-center gap-2.5 hover:bg-purple-950/40 rounded-xl transition-colors text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-[11px] sm:text-xs text-white uppercase tracking-wider">Radar da Cidade</p>
            <p className="text-[10px] text-purple-200/70 line-clamp-1">Seu negócio no mapa local</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
};
