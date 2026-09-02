import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  ShieldAlert,
  Flame,
  Instagram,
  Globe,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdDetailModal: React.FC = () => {
  const {
    selectedAdForDetail,
    closeAdDetail,
    openShareModal,
    openReportModal,
    toggleFavorite,
    isFavorite,
    recordAdClick,
    sendLeadMessage,
    showToast,
  } = useApp();

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMsg, setLeadMsg] = useState('Olá! Vi sua divulgação no DIVULGADOR e gostaria de mais informações.');
  const [leadSent, setLeadSent] = useState(false);

  if (!selectedAdForDetail) return null;
  const ad = selectedAdForDetail;

  const handleWhatsApp = () => {
    recordAdClick(ad.id, 'whatsapp');
    const cleanPhone = (ad.businessWhatsapp || ad.businessPhone).replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${ad.businessName}! Vi a sua divulgação "${ad.title}" no aplicativo DIVULGADOR e gostaria de mais informações!`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    recordAdClick(ad.id, 'click');
    window.location.href = `tel:${ad.businessPhone.replace(/\D/g, '')}`;
  };

  const handleMaps = () => {
    const query = encodeURIComponent(`${ad.businessName}, ${ad.address}, ${ad.city} - ${ad.state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleSendLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      showToast('⚠️ Preencha seu nome e telefone', undefined, 'warning');
      return;
    }
    sendLeadMessage(ad.id, leadName, leadPhone, leadMsg);
    setLeadSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-auto max-h-[92vh] flex flex-col relative"
      >
        {/* Top Floating Control Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(ad.id);
            }}
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 hover:text-red-500 flex items-center justify-center shadow-md transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite(ad.id) ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => openShareModal(ad)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 hover:text-purple-700 flex items-center justify-center shadow-md transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={closeAdDetail}
              className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-xs text-white hover:bg-black flex items-center justify-center shadow-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto scrollbar-thin">
          {/* Header Image */}
          <div className="relative aspect-video sm:aspect-[16/10] w-full bg-slate-900">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Promo Badge */}
            {ad.promoTag && (
              <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-white" />
                {ad.promoTag}
              </div>
            )}

            {ad.isFeatured && (
              <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                ★ SUPER DESTAQUE
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                <span>{ad.categoryName}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {ad.rating.toFixed(1)} ({ad.reviewsCount} avaliações)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {ad.title}
              </h2>

              {ad.price && (
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-purple-700">
                    {ad.price}
                  </span>
                  {ad.oldPrice && (
                    <span className="text-sm font-bold text-slate-400 line-through">
                      {ad.oldPrice}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Business Card Info */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3.5">
              <img
                src={ad.businessLogo}
                alt={ad.businessName}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-100"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-sm text-slate-900 truncate">
                  {ad.businessName}
                </h3>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {ad.address}, {ad.neighborhood} ({ad.distanceKm}km)
                </p>
                {ad.openingHours && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {ad.openingHours}
                  </p>
                )}
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Sobre esta divulgação
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {ad.description}
              </p>
            </div>

            {/* Primary Action Buttons (WhatsApp + Call + Maps) */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>CHAMAR NO WHATSAPP</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCall}
                  className="py-3 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4 text-purple-600" />
                  <span>Ligar Agora</span>
                </button>

                <button
                  onClick={handleMaps}
                  className="py-3 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span>Como Chegar</span>
                </button>
              </div>

              {ad.businessInstagram && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 text-purple-900 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-purple-700" />
                    <span>Instagram Oficial: <strong>{ad.businessInstagram}</strong></span>
                  </div>
                  <a
                    href={`https://instagram.com/${ad.businessInstagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 font-bold hover:underline text-[11px]"
                  >
                    Visitar Perfil →
                  </a>
                </div>
              )}
            </div>

            {/* Fast In-App Lead Message Form */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-purple-600" />
                Ou envie uma mensagem direta ao anunciante
              </h4>

              {leadSent ? (
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mensagem enviada com sucesso! O anunciante entrará em contato.</span>
                </div>
              ) : (
                <form onSubmit={handleSendLead} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="p-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                    <input
                      type="tel"
                      placeholder="Seu WhatsApp"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="p-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Sua dúvida ou pedido..."
                    value={leadMsg}
                    onChange={(e) => setLeadMsg(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none font-medium text-slate-700"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-colors"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              )}
            </div>

            {/* Footer Report Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Publicado no DIVULGADOR</span>
              <button
                onClick={() => {
                  closeAdDetail();
                  openReportModal(ad);
                }}
                className="hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Denunciar anúncio
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
