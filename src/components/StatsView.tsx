import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Eye,
  MousePointer,
  MessageCircle,
  Compass,
  Heart,
  Share2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { motion } from 'motion/react';

const WEEKLY_STATS = [
  { day: 'Seg', views: 140, clicks: 35, whatsapp: 8 },
  { day: 'Ter', views: 190, clicks: 48, whatsapp: 12 },
  { day: 'Qua', views: 210, clicks: 54, whatsapp: 15 },
  { day: 'Qui', views: 240, clicks: 62, whatsapp: 18 },
  { day: 'Sex', views: 320, clicks: 85, whatsapp: 28 },
  { day: 'Sáb', views: 410, clicks: 110, whatsapp: 39 },
  { day: 'Dom', views: 380, clicks: 95, whatsapp: 32 },
];

export const StatsView: React.FC = () => {
  const { user, ads, openBoostModal, setCurrentTab } = useApp();

  const userAds = ads.filter((ad) => ad.userId === user.id || ad.businessId === 'biz-01');
  const totalViews = userAds.reduce((acc, a) => acc + a.views, 0) || 1245;
  const totalClicks = userAds.reduce((acc, a) => acc + a.clicks, 0) || 320;
  const totalWhatsapp = userAds.reduce((acc, a) => acc + a.whatsappClicks, 0) || 89;
  const totalRadar = userAds.reduce((acc, a) => acc + a.radarViews, 0) || 840;
  const totalFavs = userAds.reduce((acc, a) => acc + a.favorites, 0) || 34;

  const maxViews = Math.max(...WEEKLY_STATS.map((s) => s.views));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 1. Header with Main Weekly Impact Headline */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-purple-700/20 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            DESEMPENHO SEMANAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Seu negócio teve {totalViews.toLocaleString('pt-BR')} visualizações esta semana!
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            Um aumento de <span className="text-amber-300 font-bold">+28%</span> em relação à semana anterior.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <Eye className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +18%
            </span>
          </div>
          <p className="text-xl font-black text-slate-900">{totalViews.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] font-semibold text-slate-500">Visualizações</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <MousePointer className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +24%
            </span>
          </div>
          <p className="text-xl font-black text-slate-900">{totalClicks.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] font-semibold text-slate-500">Cliques no Card</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +35%
            </span>
          </div>
          <p className="text-xl font-black text-slate-900">{totalWhatsapp.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] font-semibold text-slate-500">Contatos WhatsApp</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +12%
            </span>
          </div>
          <p className="text-xl font-black text-slate-900">{totalRadar.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] font-semibold text-slate-500">No Radar Próximo</p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-pink-700 mb-2">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +40%
            </span>
          </div>
          <p className="text-xl font-black text-slate-900">{totalFavs.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] font-semibold text-slate-500">Salvo em Favoritos</p>
        </div>
      </div>

      {/* 3. Visual Interactive Chart (Visual Bar Breakdown) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Fluxo de Visualizações nos Últimos 7 Dias
            </h3>
            <p className="text-xs text-slate-500">
              Pico de acessos observado nas sextas e sábados
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl">
            Semana Atual
          </span>
        </div>

        {/* Bar Visualizer */}
        <div className="pt-6 pb-2 grid grid-cols-7 gap-2 sm:gap-4 items-end h-52">
          {WEEKLY_STATS.map((item, idx) => {
            const heightPercent = Math.round((item.views / maxViews) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.views}
                </span>
                <div className="w-full bg-slate-100 rounded-2xl overflow-hidden h-36 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className={`w-full rounded-2xl transition-colors ${
                      item.day === 'Sáb' || item.day === 'Sex'
                        ? 'bg-gradient-to-t from-purple-700 to-indigo-600'
                        : 'bg-purple-300 group-hover:bg-purple-400'
                    }`}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Conversion Tip Card */}
      <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200/80 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 fill-slate-950" />
        </div>
        <div className="flex-1">
          <h4 className="font-extrabold text-sm text-slate-900">
            Dica do Divulgador para Vender Mais
          </h4>
          <p className="text-xs text-slate-700 mt-1 leading-relaxed">
            Anúncios com <strong>preço promocional explícito</strong> e fotos nítidas geram até <strong>3.4x mais conversões no WhatsApp</strong>. Experimente usar nosso Gerador de Arte para atualizar o banner da sua promoção!
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('art-generator')}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              Criar nova arte agora <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (userAds[0]) openBoostModal(userAds[0]);
              }}
              className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5" />
              Destacar no topo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
