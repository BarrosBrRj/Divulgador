import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Star, MapPin, ChevronRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const FavoritesView: React.FC = () => {
  const { ads, favorites, toggleFavorite, openAdDetail, setCurrentTab } = useApp();

  const favoriteAds = ads.filter((ad) => favorites.includes(ad.id));

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            ❤️ Meus Favoritos
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Ofertas e estabelecimentos que você guardou para conferir depois
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500">
          {favoriteAds.length} salvos
        </span>
      </div>

      {favoriteAds.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            Você ainda não favoritou nenhuma divulgação
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Ao navegar pelo radar ou pela tela inicial, clique no coração para guardar suas ofertas preferidas.
          </p>
          <button
            onClick={() => setCurrentTab('radar')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 mx-auto"
          >
            <Compass className="w-4 h-4" />
            <span>Explorar no Radar</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteAds.map((ad) => (
            <motion.div
              key={ad.id}
              whileHover={{ y: -2 }}
              onClick={() => openAdDetail(ad)}
              className="cursor-pointer bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex gap-3.5 items-center relative group"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">
                    {ad.categoryName}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(ad.id);
                    }}
                    className="text-red-500 hover:text-slate-400 p-1"
                    title="Remover dos favoritos"
                  >
                    <Heart className="w-4 h-4 fill-red-500" />
                  </button>
                </div>

                <h3 className="font-black text-sm text-slate-900 truncate mt-0.5">
                  {ad.title}
                </h3>
                <p className="text-xs text-slate-500 truncate">{ad.businessName}</p>

                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="font-extrabold text-purple-700">{ad.price || 'Consulte'}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {ad.distanceKm}km
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
