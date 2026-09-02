import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryId } from '../types';
import { HeroBanner } from './HeroBanner';
import {
  Sparkles,
  Search,
  ChevronRight,
  Star,
  MapPin,
  Flame,
  MessageCircle,
  Share2,
  Heart,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Compass,
  Zap,
  CheckCircle,
  Megaphone,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const {
    user,
    ads,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setCurrentTab,
    openAdDetail,
    openShareModal,
    toggleFavorite,
    isFavorite,
  } = useApp();

  const filteredAds = ads.filter((ad) => {
    if (ad.status !== 'ativo') return false;
    const matchCategory = selectedCategory === 'todos' || ad.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredAds = ads.filter((ad) => ad.status === 'ativo' && ad.isFeatured);

  return (
    <div className="space-y-6 pb-12">
      {/* 0. Top Hero Graphic Banner (Placed at the very top for maximum visibility) */}
      <HeroBanner />

      {/* 1. Header Greeting (Olá, Alex! 👋 O que você deseja fazer hoje?) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Olá, {user.name.split(' ')[0]}! <span className="animate-wave inline-block">👋</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            O que você deseja fazer hoje?
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por pizza, corte, pet..."
            className="w-full pl-9.5 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. Giant CTA Card: 🔥 DIVULGAR AGORA (Matching Screen 1) */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setCurrentTab('ai-creator')}
        className="cursor-pointer rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 text-white shadow-xl shadow-purple-700/20 relative overflow-hidden group border border-purple-500/30"
      >
        {/* Glow & subtle decorative circles */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-amber-400/20 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-xs group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors">
          <ChevronRight className="w-6 h-6 stroke-[3px]" />
        </div>

        <div className="relative z-10 max-w-[85%] sm:max-w-[80%]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-wider mb-2 shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-slate-900" />
            DIVULGAR AGORA
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight text-white">
            Clique aqui e crie sua divulgação em poucos segundos com IA!
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-1.5 font-medium flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            Gere textos persuasivos, legendas de Instagram, roteiros e arte gráfica.
          </p>
        </div>
      </motion.div>

      {/* 3. Categories Grid (Matching Screenshot: 8 icons) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Categorias
          </h2>
          {selectedCategory !== 'todos' && (
            <button
              onClick={() => setSelectedCategory('todos')}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3">
          {categories.slice(0, 8).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'todos' : cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 text-center ${
                  isSelected
                    ? 'bg-purple-700 text-white border-purple-700 shadow-md ring-2 ring-purple-400/30'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-100 shadow-2xs hover:border-slate-200'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-1.5 transition-transform ${
                    isSelected ? 'bg-white/20' : 'bg-slate-50'
                  }`}
                >
                  {cat.emoji}
                </div>
                <span className="text-[11px] sm:text-xs font-bold truncate w-full">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Section: 🔥 Destaques da sua cidade (Matching Screenshot cards) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Destaques da sua cidade
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('radar')}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-0.5"
          >
            Ver todos <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scroll on mobile / Grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x">
          {featuredAds.slice(0, 6).map((ad) => (
            <motion.div
              key={ad.id}
              whileHover={{ y: -3 }}
              className="min-w-[260px] sm:min-w-0 w-[270px] sm:w-auto shrink-0 bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden flex flex-col snap-start group relative"
            >
              {/* Image & Badges */}
              <div className="relative h-36 w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => openAdDetail(ad)}>
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Promo Badge */}
                {ad.promoTag && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    {ad.promoTag}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(ad.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs text-slate-700 hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(ad.id) ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>

                {/* Overlay Title & Price */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <p className="font-extrabold text-sm sm:text-base leading-tight drop-shadow-sm truncate">
                    {ad.title}
                  </p>
                  {ad.price && (
                    <p className="text-amber-300 font-extrabold text-sm drop-shadow-sm">
                      {ad.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">
                      {ad.businessName}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {ad.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{ad.neighborhood} • {ad.distanceKm}km</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => openAdDetail(ad)}
                    className="flex-1 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs text-center transition-colors"
                  >
                    Ver divulgação
                  </button>
                  <button
                    onClick={() => openShareModal(ad)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. Todos os Anúncios & Promoções Locais */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Mais Divulgações Próximas
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {filteredAds.length} encontradas
          </span>
        </div>

        {filteredAds.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
            <p className="text-sm font-semibold text-slate-600">Nenhum anúncio encontrado para esses filtros.</p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => openAdDetail(ad)}
                className="cursor-pointer bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex gap-3.5 items-center group"
              >
                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {ad.promoTag && (
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      {ad.promoTag}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                      {ad.categoryName}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {ad.rating.toFixed(1)}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 truncate mt-0.5">
                    {ad.title}
                  </h3>

                  <p className="text-xs font-semibold text-slate-500 truncate">
                    {ad.businessName}
                  </p>

                  <div className="flex items-center justify-between mt-1 text-xs">
                    {ad.price ? (
                      <span className="font-extrabold text-purple-700">{ad.price}</span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Consulte</span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {ad.distanceKm}km
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Commercial Value Blocks from Screenshot ("O app que conecta seu negócio com muito mais pessoas!") */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid sm:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              CONECTANDO VOCÊ AOS CLIENTES
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Seu negócio precisa ser visto.
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Divulgue para milhares de moradores e pessoas próximas da sua região. Conquiste novos clientes todos os dias com a ferramenta de IA mais rápida do mercado.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                  <Megaphone className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span>Divulgue seu negócio em poucos segundos</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span>Apareça no Radar Geográfico de quem está por perto</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span>Alcance mais clientes qualificados</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span>Aumente suas vendas de forma consistente</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setCurrentTab('ai-creator')}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
              >
                <Flame className="w-4 h-4 fill-slate-900" />
                DIVULGAR AGORA
              </button>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              💡 Para quem é o DIVULGADOR?
            </p>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              "Não importa se você tem uma loja, trabalha por conta própria ou está começando do zero. O DIVULGADOR foi feito sob medida para pequenos negócios, comércios locais e profissionais autônomos."
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span>Sem contratos complicados</span>
              <span className="text-emerald-400 font-bold">✓ 100% Mobile & Web</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Bottom Feature Highlights (Matching exact 5 bottom blocks in uploaded image) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">IA que cria para você</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Gere textos, artes, roteiros e hashtags em segundos.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">Apareça mais</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Seja visto no radar, categorias, destaques e muito mais.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">Mais clientes</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Conecte-se com pessoas que realmente precisam de você.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">Venda mais</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Divulgue, conquiste e aumente suas vendas todos os dias.
            </p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900">Tudo em um só lugar</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Gestão fácil, rápida e completa do seu negócio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
