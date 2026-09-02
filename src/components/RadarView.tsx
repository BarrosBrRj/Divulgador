import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryId, Advertisement } from '../types';
import {
  Compass,
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Flame,
  MessageCircle,
  Navigation,
  Crosshair,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RadarView: React.FC = () => {
  const {
    ads,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    openAdDetail,
    userLocation,
    requestLocation,
  } = useApp();

  const [selectedAdPin, setSelectedAdPin] = useState<Advertisement | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(5.0); // km
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [onlyPromos, setOnlyPromos] = useState<boolean>(false);

  const activeAds = ads.filter((ad) => {
    if (ad.status !== 'ativo') return false;
    const matchCategory = selectedCategory === 'todos' || ad.category === selectedCategory;
    const matchPromo = !onlyPromos || Boolean(ad.promoTag);
    const matchDistance = ad.distanceKm <= maxDistance;
    const matchSearch =
      !searchQuery ||
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPromo && matchDistance && matchSearch;
  });

  return (
    <div className="space-y-4 pb-16 max-w-4xl mx-auto">
      {/* 1. Header & Title (Matching Screen 3: Radar da Cidade) */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            📍 Radar da Cidade
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Encontre ofertas e serviços ao seu redor por proximidade
          </p>
        </div>

        <button
          onClick={requestLocation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition-colors shadow-2xs"
        >
          <Crosshair className="w-4 h-4 text-purple-600" />
          <span>{userLocation.permissionGranted ? 'Localização Ativa' : 'Minha Localização'}</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar (Matching Screen 3) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar no radar (ex: Pizza, Barbearia, Pet)..."
            className="w-full pl-9.5 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilterModal((prev) => !prev)}
          className={`p-2.5 rounded-2xl border transition-colors ${
            showFilterModal || onlyPromos || maxDistance < 5
              ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
          title="Filtros de Distância"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Drawer / Accordion */}
      {showFilterModal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Raio de Distância Máximo:</span>
            <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg">
              Até {maxDistance.toFixed(1)} km
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15.0"
            step="0.5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={onlyPromos}
                onChange={(e) => setOnlyPromos(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
              />
              <span>Mostrar apenas anúncios com Promoção / Desconto</span>
            </label>
            <button
              onClick={() => {
                setMaxDistance(10);
                setOnlyPromos(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Resetar
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. Category Filter Chips (Matching Screen 3: Todos, Restaurantes, Lojas, Serviços, etc.) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('todos')}
          className={`py-1.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'todos'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'todos' : cat.id)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Interactive Radar Map Visualizer (Matching Screen 3 Map with custom pins) */}
      <div className="relative w-full h-72 sm:h-84 rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
        {/* Map Background Canvas (Styled vector road map aesthetic) */}
        <div className="absolute inset-0 bg-[#E8ECEF] overflow-hidden">
          {/* Stylized road network lines */}
          <svg className="w-full h-full opacity-60" viewBox="0 0 800 500" preserveAspectRatio="none">
            {/* City blocks & parks */}
            <rect x="50" y="40" width="180" height="120" rx="8" fill="#D8E8D8" />
            <rect x="280" y="50" width="220" height="150" rx="8" fill="#E2E8F0" />
            <rect x="540" y="30" width="220" height="130" rx="8" fill="#D8E8D8" />
            <rect x="60" y="220" width="200" height="230" rx="8" fill="#E2E8F0" />
            <rect x="300" y="250" width="190" height="200" rx="8" fill="#D8E8D8" />
            <rect x="530" y="210" width="230" height="240" rx="8" fill="#E2E8F0" />

            {/* Main Avenues */}
            <path d="M 0,200 Q 400,210 800,190" stroke="#CBD5E1" strokeWidth="24" fill="none" />
            <path d="M 0,200 Q 400,210 800,190" stroke="#FFFFFF" strokeWidth="16" fill="none" />

            <path d="M 260,0 L 280,500" stroke="#CBD5E1" strokeWidth="20" fill="none" />
            <path d="M 260,0 L 280,500" stroke="#FFFFFF" strokeWidth="12" fill="none" />

            <path d="M 510,0 L 520,500" stroke="#CBD5E1" strokeWidth="20" fill="none" />
            <path d="M 510,0 L 520,500" stroke="#FFFFFF" strokeWidth="12" fill="none" />

            {/* Diagonal Express lane */}
            <path d="M 0,450 L 800,50" stroke="#FED7AA" strokeWidth="14" fill="none" />
            <path d="M 0,450 L 800,50" stroke="#FFF" strokeWidth="8" fill="none" />
          </svg>
        </div>

        {/* User Location Radar Pulse Center */}
        <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-purple-600 opacity-40" />
            <span className="relative inline-flex rounded-full h-7 w-7 bg-purple-700 border-3 border-white shadow-lg items-center justify-center">
              <Navigation className="w-3.5 h-3.5 text-white fill-white transform -rotate-45" />
            </span>
          </div>
          <span className="mt-1 text-[9px] font-extrabold bg-slate-900/90 text-white px-2 py-0.5 rounded-full shadow-xs">
            Você está aqui
          </span>
        </div>

        {/* Interactive Map Pins (Rendered proportionally on the map) */}
        {activeAds.map((ad, idx) => {
          // Deterministic visually distributed coordinates for the map viewport
          const positions = [
            { top: '32%', left: '28%' },
            { top: '24%', left: '72%' },
            { top: '74%', left: '22%' },
            { top: '68%', left: '78%' },
            { top: '42%', left: '38%' },
            { top: '35%', left: '58%' },
            { top: '80%', left: '52%' },
            { top: '18%', left: '44%' },
          ];
          const pos = positions[idx % positions.length];
          const isSelected = selectedAdPin?.id === ad.id;

          const pinColor =
            ad.category === 'restaurantes'
              ? 'bg-red-600'
              : ad.category === 'beleza'
              ? 'bg-pink-600'
              : ad.category === 'pet'
              ? 'bg-amber-600'
              : ad.category === 'servicos'
              ? 'bg-purple-600'
              : 'bg-blue-600';

          return (
            <div
              key={ad.id}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => setSelectedAdPin(ad)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center justify-center p-1.5 rounded-full shadow-lg border-2 border-white transition-transform ${
                  ad.isFeatured
                    ? 'bg-amber-500 ring-4 ring-amber-400/40 text-slate-950'
                    : `${pinColor} text-white`
                } ${isSelected ? 'scale-125 ring-4 ring-purple-600/50' : ''}`}
              >
                {ad.isFeatured ? (
                  <Flame className="w-4 h-4 fill-slate-950" />
                ) : (
                  <MapPin className="w-4 h-4 fill-white" />
                )}

                {/* Micro tooltip label */}
                <div className="absolute -top-7 whitespace-nowrap bg-slate-900/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {ad.businessName} • {ad.price || ad.promoTag || 'Ver'}
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* Selected Pin Mini Popup Card */}
        <AnimatePresence>
          {selectedAdPin && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="absolute bottom-3 left-3 right-3 z-30 bg-white rounded-2xl p-3 shadow-xl border border-slate-200 flex items-center gap-3"
            >
              <img
                src={selectedAdPin.imageUrl}
                alt={selectedAdPin.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">
                    {selectedAdPin.categoryName} • {selectedAdPin.distanceKm}km
                  </span>
                  <span className="text-xs font-extrabold text-amber-500 flex items-center gap-0.5">
                    ★ {selectedAdPin.rating.toFixed(1)}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 truncate">
                  {selectedAdPin.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">{selectedAdPin.businessName}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openAdDetail(selectedAdPin)}
                  className="px-3 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors shadow-xs"
                >
                  Ver
                </button>
                <button
                  onClick={() => setSelectedAdPin(null)}
                  className="w-6 h-6 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Layer Legend / Count */}
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>{activeAds.length} anúncios no radar</span>
        </div>
      </div>

      {/* 5. List of Nearby Businesses (Matching Screen 3 Cards) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center justify-between">
          <span>Negócios Mais Próximos de Você</span>
          <span className="text-xs text-slate-400 font-semibold">
            Ordenado por proximidade
          </span>
        </h2>

        <div className="space-y-2.5">
          {activeAds.map((ad) => (
            <motion.div
              key={ad.id}
              whileHover={{ y: -1 }}
              onClick={() => openAdDetail(ad)}
              className="cursor-pointer bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 group"
            >
              {/* Photo Thumbnail */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {ad.promoTag && (
                  <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase shadow-xs">
                    {ad.promoTag}
                  </span>
                )}
              </div>

              {/* Info Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-extrabold text-sm text-slate-900 truncate">
                    {ad.businessName}
                  </h3>
                  <span className="flex items-center gap-0.5 text-xs font-extrabold text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {ad.rating.toFixed(1)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-semibold truncate mt-0.5">
                  {ad.title}
                </p>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-0.5 text-purple-700 font-bold">
                    <MapPin className="w-3 h-3 text-purple-600" />
                    {ad.neighborhood} • {ad.distanceKm}km
                  </span>
                  {ad.price && (
                    <span className="font-extrabold text-slate-900 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md text-[10px]">
                      {ad.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Chevron / Button */}
              <div className="shrink-0">
                <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-purple-50 group-hover:text-purple-700 text-slate-400 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
