import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdStatus, Advertisement } from '../types';
import {
  Plus,
  Flame,
  Eye,
  MousePointer,
  MessageCircle,
  TrendingUp,
  MoreVertical,
  Edit,
  PauseCircle,
  PlayCircle,
  Trash2,
  BarChart3,
  Calendar,
  Share2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MyAdsView: React.FC = () => {
  const {
    user,
    business,
    ads,
    toggleAdStatus,
    deleteAd,
    openCreateAdModal,
    openBoostModal,
    openShareModal,
    openAdDetail,
    setCurrentTab,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<AdStatus>('ativo');
  const [adToDelete, setAdToDelete] = useState<Advertisement | null>(null);

  // Filter ads owned by user
  const userAds = ads.filter(
    (ad) => ad.userId === user.id || ad.businessId === business.id || ad.businessId === 'biz-01'
  );
  const filteredAds = userAds.filter((ad) => ad.status === activeFilter);

  const activeCount = userAds.filter((a) => a.status === 'ativo').length;
  const pausedCount = userAds.filter((a) => a.status === 'pausado').length;
  const endedCount = userAds.filter((a) => a.status === 'encerrado').length;

  const totalViews = userAds.reduce((acc, a) => acc + a.views, 0);
  const totalClicks = userAds.reduce((acc, a) => acc + a.clicks, 0);
  const totalWhatsapp = userAds.reduce((acc, a) => acc + a.whatsappClicks, 0);

  const handleConfirmDelete = () => {
    if (adToDelete) {
      deleteAd(adToDelete.id);
      setAdToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      {/* 1. Header with Title & Stats Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            📢 Meus Anúncios
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Gerencie suas publicações ativas, métricas e destaques
          </p>
        </div>

        <button
          onClick={() => openCreateAdModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs shadow-md shadow-purple-700/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-300 stroke-[3px]" />
          <span>CRIAR NOVO ANÚNCIO</span>
        </button>
      </div>

      {/* Mini Performance Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base sm:text-xl font-black text-slate-900">
              {totalViews.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold">Visualizações</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <MousePointer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base sm:text-xl font-black text-slate-900">
              {totalClicks.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold">Cliques no Card</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-base sm:text-xl font-black text-slate-900">
              {totalWhatsapp.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold">Contatos WhatsApp</p>
          </div>
        </div>
      </div>

      {/* 2. Status Filter Tabs (Matching Screen 4: Ativos, Pausados, Encerrados) */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveFilter('ativo')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'ativo'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Ativos</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-extrabold">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('pausado')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'pausado'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Pausados</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-extrabold">
            {pausedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('encerrado')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeFilter === 'encerrado'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Encerrados</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-extrabold">
            {endedCount}
          </span>
        </button>
      </div>

      {/* 3. Ads List matching Screen 4 Cards */}
      <div className="space-y-3.5">
        {filteredAds.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Nenhum anúncio nesta categoria
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Crie uma divulgação em segundos com ajuda da nossa inteligência artificial e aumente sua clientela!
            </p>
            <button
              onClick={() => openCreateAdModal()}
              className="mt-2 px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs"
            >
              Criar Primeiro Anúncio
            </button>
          </div>
        ) : (
          filteredAds.map((ad) => (
            <motion.div
              key={ad.id}
              whileHover={{ y: -1 }}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Left: Thumbnail & Main Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    {ad.isFeatured && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">
                        Destaque
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    {/* Status Badge (Matching Screen 4: Ativo / Pausado) */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ad.status === 'ativo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ad.status === 'pausado'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        ● {ad.status === 'ativo' ? 'Ativo' : ad.status === 'pausado' ? 'Pausado' : 'Encerrado'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Publicado em {ad.createdAt}
                      </span>
                    </div>

                    <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">
                      {ad.title}
                    </h3>

                    {/* Metrics Row (Matching Screen 4: Visualizações: 1.245 | Cliques: 320) */}
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-purple-600" />
                        Visualizações: {ad.views.toLocaleString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                        Cliques: {ad.clicks.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Destacar CTA */}
                {!ad.isFeatured && ad.status === 'ativo' && (
                  <button
                    onClick={() => openBoostModal(ad)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <Flame className="w-4 h-4 fill-slate-950" />
                    <span>DESTACAR ANÚNCIO</span>
                  </button>
                )}
              </div>

              {/* Action Buttons Toolbar (Matching Screen 4) */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {/* Toggle Pause / Activate */}
                  <button
                    onClick={() => toggleAdStatus(ad.id, ad.status === 'ativo' ? 'pausado' : 'ativo')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors"
                  >
                    {ad.status === 'ativo' ? (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pausar</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ativar</span>
                      </>
                    )}
                  </button>

                  {/* View Stats Details */}
                  <button
                    onClick={() => setCurrentTab('stats')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Métricas</span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => openShareModal(ad)}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-purple-700 hover:bg-slate-50 transition-colors"
                    title="Compartilhar"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAdDetail(ad)}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold transition-colors"
                  >
                    Ver como cliente
                  </button>
                  <button
                    onClick={() => setAdToDelete(ad)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir Anúncio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 4. Giant Bottom Button: CRIAR NOVO ANÚNCIO (Matching Screen 4) */}
      <div className="pt-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => openCreateAdModal()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-purple-700/30 hover:from-purple-700 hover:to-indigo-600 transition-all"
        >
          <Plus className="w-5 h-5 text-amber-300 stroke-[3px]" />
          <span>CRIAR NOVO ANÚNCIO</span>
        </motion.button>
      </div>

      {/* Confirmation Modal for Deleting Ad */}
      <AnimatePresence>
        {adToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Trash2 className="w-6 h-6" />
                </div>
                <button
                  onClick={() => setAdToDelete(null)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  Excluir Divulgação?
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                  Tem certeza que deseja excluir esta divulgação? Ela deixará de aparecer nas buscas e no radar imediatamente.
                </p>
              </div>

              {/* Preview Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <img
                  src={adToDelete.imageUrl}
                  alt={adToDelete.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-900 truncate">
                    {adToDelete.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    {adToDelete.categoryName} • {adToDelete.price || 'Sem preço'}
                  </p>
                  <span className="text-[10px] font-bold text-red-600">
                    Ação irreversível
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => setAdToDelete(null)}
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 transition-all active:scale-95"
                >
                  Sim, Excluir Anúncio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
