import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Instagram,
  Facebook,
  Send,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, closeShareModal, selectedAdForShare, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !selectedAdForShare) return null;
  const ad = selectedAdForShare;
  const shareUrl = `https://divulgador.app/a/${ad.id}`;
  const shareText = `🔥 Olha essa novidade no DIVULGADOR: ${ad.title} no ${ad.businessName}!\n👉 Confira em: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('📋 Link copiado com sucesso!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: `Confira ${ad.title} no ${ad.businessName}!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-700" />
            <h3 className="font-extrabold text-base text-slate-900">Compartilhar</h3>
          </div>
          <button
            onClick={closeShareModal}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ad Info Snippet */}
        <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
          <img src={ad.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs text-slate-900 truncate">{ad.title}</h4>
            <p className="text-[11px] text-slate-500 truncate">{ad.businessName}</p>
          </div>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageCircle className="w-6 h-6 fill-emerald-600 text-emerald-100" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">WhatsApp</span>
          </button>

          <button
            onClick={handleTelegram}
            className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-sky-50 text-sky-500 transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Telegram</span>
          </button>

          <button
            onClick={handleFacebook}
            className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-blue-50 text-blue-600 transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Facebook className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Facebook</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1 p-2.5 rounded-2xl hover:bg-purple-50 text-purple-700 transition-colors group"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Share2 className="w-5 h-5 text-purple-700" />
            </div>
            <span className="text-[10px] font-bold text-slate-700">Mais</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-2.5 text-xs text-slate-700 font-mono outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
