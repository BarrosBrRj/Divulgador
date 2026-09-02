import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryId } from '../types';
import { enhanceTextWithAI } from '../services/api';
import {
  X,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Flame,
  Check,
  MapPin,
  Phone,
  DollarSign,
  Layers,
  Wand2,
} from 'lucide-react';
import { motion } from 'motion/react';

export const CreateAdModal: React.FC = () => {
  const {
    isCreateAdModalOpen,
    closeCreateAdModal,
    prefilledAdData,
    createAd,
    business,
    categories,
    setCurrentTab,
    showToast,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId>('restaurantes');
  const [promoTag, setPromoTag] = useState('PROMOÇÃO');
  const [price, setPrice] = useState('R$ 39,90');
  const [oldPrice, setOldPrice] = useState('R$ 59,90');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
  );
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (prefilledAdData) {
      if (prefilledAdData.title) setTitle(prefilledAdData.title);
      if (prefilledAdData.description) setDescription(prefilledAdData.description);
      if (prefilledAdData.category) setCategory(prefilledAdData.category);
      if (prefilledAdData.promoTag) setPromoTag(prefilledAdData.promoTag);
      if (prefilledAdData.price) setPrice(prefilledAdData.price);
      if (prefilledAdData.oldPrice) setOldPrice(prefilledAdData.oldPrice);
      if (prefilledAdData.imageUrl) setImageUrl(prefilledAdData.imageUrl);
    } else {
      setTitle('Super Promoção no ' + business.name);
      setDescription('Confira nossa oferta imperdível e garanta produtos e serviços de alta qualidade.');
      setCategory(business.category || 'restaurantes');
    }
  }, [prefilledAdData, business, isCreateAdModalOpen]);

  if (!isCreateAdModalOpen) return null;

  const handleEnhanceDescription = async () => {
    if (!description.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceTextWithAI(description, 'vender mais');
      setDescription(enhanced);
      showToast('✨ Texto aprimorado com IA!');
    } catch {
      showToast('Falha ao aprimorar texto', undefined, 'error');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('⚠️ Preencha os campos obrigatórios', undefined, 'warning');
      return;
    }

    createAd({
      title,
      description,
      category,
      promoTag,
      price,
      oldPrice,
      imageUrl,
    });

    closeCreateAdModal();
    setCurrentTab('my-ads');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-auto max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Publicar Nova Divulgação
              </h2>
              <p className="text-xs text-slate-500">
                Seu anúncio ficará visível no radar e na busca imediatamente
              </p>
            </div>
          </div>

          <button
            onClick={closeCreateAdModal}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Título do Anúncio *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: PROMOÇÃO: Pizza Grande R$39,90"
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
            />
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Selo Promocional
              </label>
              <input
                type="text"
                value={promoTag}
                onChange={(e) => setPromoTag(e.target.value)}
                placeholder="Ex: PROMOÇÃO / 20% OFF"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold uppercase text-red-600"
              />
            </div>
          </div>

          {/* Price & Old Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preço Promocional
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: R$ 39,90"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-black text-purple-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preço Original (Opcional)
              </label>
              <input
                type="text"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="Ex: R$ 59,90"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
              />
            </div>
          </div>

          {/* Description with AI Enhance Button */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Descrição do Anúncio *
              </label>
              <button
                type="button"
                onClick={handleEnhanceDescription}
                disabled={isEnhancing || !description}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                {isEnhancing ? (
                  <span>Melhorando...</span>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3 text-amber-500" />
                    <span>Aprimorar com IA</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhes da oferta, horários, condições e diferenciais..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Image URL / Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              URL da Imagem da Divulgação
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
            />

            {/* Micro Image Preview */}
            <div className="mt-2 h-24 rounded-xl overflow-hidden bg-slate-100 relative border">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                Prévia da Imagem
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-purple-700/25 transition-all active:scale-98"
            >
              <span>PUBLICAR DIVULGAÇÃO AGORA</span>
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
