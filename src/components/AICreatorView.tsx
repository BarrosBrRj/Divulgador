import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAdWithAI } from '../services/api';
import { AIGeneratedContent } from '../types';
import {
  Sparkles,
  ArrowLeft,
  Copy,
  Download,
  Share2,
  Check,
  Wand2,
  Flame,
  Palette,
  Send,
  MessageCircle,
  Instagram,
  Video,
  FileText,
  Hash,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SubTab = 'texto' | 'instagram' | 'reels' | 'whatsapp' | 'hashtags';

export const AICreatorView: React.FC = () => {
  const {
    business,
    user,
    setCurrentTab,
    openCreateAdModal,
    openShareModal,
    showToast,
    triggerCelebration,
  } = useApp();

  const [prompt, setPrompt] = useState<string>(
    'Promoção de pizza grande de calabresa por R$39,90 somente hoje com refrigerante 2L por R$5 adicionais.'
  );
  const [promoType, setPromoType] = useState<string>('Promoção');
  const [priceInput, setPriceInput] = useState<string>('R$ 39,90');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('instagram');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Initial generated content matching screenshot
  const [generatedResult, setGeneratedResult] = useState<AIGeneratedContent>({
    title: 'PROMOÇÃO: Pizza Grande R$39,90',
    adText: `Atenção ${business.city}! Na ${business.name}, você aproveita hoje a deliciosa Pizza Grande por apenas R$39,90! Massa artesanal de fermentação lenta e muito recheio para sua família. Peça agora pelo WhatsApp antes que acabe!`,
    instagramCaption: `🔥 PROMOÇÃO PIZZA GRANDE POR APENAS R$39,90! 🍕\n\nSabor que você ama com preço que cabe no seu bolso!\n\n✨ Pizza artesanal de calabresa ou marguerita com muito recheio.\n🥤 Adicione Refri 2L por apenas R$5!\n\n👉 Peça agora pelo link da bio ou chame no WhatsApp!\n\n#Pizzaria #${business.city.replace(/\s+/g, '')} #Promoção #ComidaBoa #Divulgador #OfertaDoDia`,
    reelsScript: `🎬 [0-3s GANCHO]: Você de ${business.city}, olha essa pizza grande saindo do forno agora por R$39,90!\n\n🍕 [4-12s CONTEÚDO]: Feita com massa fresca e ingredientes selecionados. E o melhor: você pode pedir sem sair de casa.\n\n🚀 [13-18s CTA]: Clica no link do perfil ou envia mensagem agora no nosso WhatsApp para garantir a sua!`,
    whatsappMessage: `👋 Olá! Passando para te avisar da nossa *PROMOÇÃO EXCLUSIVA* hoje na *${business.name}*:\n\n🍕 *Pizza Grande por apenas R$39,90!*\n🥤 *Refrigerante 2L por +R$5,00*\n\n📍 Entrega rápida em *${business.city}* e região.\n\n👉 Para pedir, basta responder esta mensagem com o seu sabor favorito!`,
    hashtags: [
      `#${business.category}`,
      `#${business.city.replace(/\s+/g, '')}`,
      '#Divulgador',
      '#Promoção',
      '#PizzaGrande',
      '#OfertaEspecial',
      '#ComércioLocal',
      '#PeçaAgora',
    ],
    callToAction: 'Peça agora pelo WhatsApp!',
    badgeText: 'PROMOÇÃO',
    headlineSlogan: 'SABOR QUE VOCÊ AMA, PREÇO QUE CABE NO BOLSO!',
  });

  const promptSuggestions = [
    'Pizza grande de calabresa por R$39,90 somente hoje.',
    'Corte + Escova com 20% de desconto nesta terça.',
    'Banho e tosa para cães com hidratação inclusa.',
    'Revisão automotiva preventiva com troca de óleo grátis.',
    'Kit festa 50 docinhos gourmet por R$65 entregue.',
    'Limpeza e clareamento dental com avaliação gratuita.',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('⚠️ Digite uma descrição', 'Conte o que você deseja divulgar.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateAdWithAI({
        description: prompt,
        businessName: business.name,
        category: business.category,
        city: business.city,
        price: priceInput,
        promoType,
      });

      setGeneratedResult(result);
      showToast('✨ Divulgação gerada com IA!', 'Todos os formatos foram criados com sucesso.');
      triggerCelebration();
    } catch (error) {
      console.error(error);
      showToast('Erro ao gerar', 'Verifique sua conexão.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast('📋 Copiado!', 'Texto copiado para a área de transferência.');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUseContent = () => {
    openCreateAdModal({
      title: generatedResult.title,
      description: generatedResult.adText,
      price: priceInput || generatedResult.badgeText,
      promoTag: promoType,
      aiContent: generatedResult,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('home')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Criar Divulgação com IA
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Copywriting de alta conversão para redes sociais e WhatsApp
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('art-generator')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs border border-purple-200 transition-colors"
        >
          <Palette className="w-4 h-4" />
          Criar Arte Gráfica
        </button>
      </div>

      {/* Input Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-md space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-extrabold text-slate-900">
              Descreva sua promoção ou serviço
            </label>
            <span className="text-xs font-semibold text-slate-400">
              {prompt.length}/300
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 300))}
            rows={3}
            placeholder="Exemplo: Promoção de pizza grande de calabresa por R$39,90 somente hoje."
            className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400 font-medium leading-relaxed"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            💡 Sugestões rápidas:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {promptSuggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(sug)}
                className="text-xs bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-slate-600 px-3 py-1 rounded-full border border-slate-200/80 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Giant Generate Button: GERAR DIVULGAÇÃO ✨ (Matching Screen 2) */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-purple-700/30 hover:from-purple-700 hover:to-indigo-600 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Gerando com IA...</span>
            </div>
          ) : (
            <>
              <span>GERAR DIVULGAÇÃO</span>
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            </>
          )}
        </motion.button>
      </div>

      {/* Output Section with Multi-Format Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-md space-y-5">
        {/* Format Selector Pills (Matching Screen 2: Texto, Instagram, Reels, WhatsApp, Hashtags) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('texto')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeSubTab === 'texto'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Texto
          </button>
          <button
            onClick={() => setActiveSubTab('instagram')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeSubTab === 'instagram'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </button>
          <button
            onClick={() => setActiveSubTab('reels')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeSubTab === 'reels'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Reels
          </button>
          <button
            onClick={() => setActiveSubTab('whatsapp')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeSubTab === 'whatsapp'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button
            onClick={() => setActiveSubTab('hashtags')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeSubTab === 'hashtags'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            Hashtags
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 relative">
          <div className="min-h-[140px] text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
            {activeSubTab === 'texto' && generatedResult.adText}
            {activeSubTab === 'instagram' && generatedResult.instagramCaption}
            {activeSubTab === 'reels' && generatedResult.reelsScript}
            {activeSubTab === 'whatsapp' && generatedResult.whatsappMessage}
            {activeSubTab === 'hashtags' && (
              <div className="flex flex-wrap gap-2 pt-1">
                {generatedResult.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 font-bold text-xs shadow-2xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visual Promotional Mockup Card (Matching Screen 2 Preview) */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-white relative shadow-lg">
          <div className="relative aspect-video sm:aspect-[16/9] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
              alt="Promoção"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Brand Logo Watermark */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{business.name}</span>
            </div>

            {/* Promo Art Typography (Matching Screen 2) */}
            <div className="absolute top-1/2 -translate-y-1/2 right-4 text-right max-w-[55%]">
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                {generatedResult.badgeText || 'PROMOÇÃO'}
              </span>
              <h3 className="text-base sm:text-xl font-black uppercase tracking-tight text-white leading-tight mt-0.5">
                PIZZA GRANDE
              </h3>
              <p className="text-[10px] text-slate-300 uppercase font-bold">POR APENAS</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 leading-none my-1">
                R$ 39,90
              </p>
              <p className="text-[10px] font-extrabold text-slate-200 uppercase leading-snug">
                {generatedResult.headlineSlogan || 'SABOR QUE VOCÊ AMA PREÇO QUE CABE NO BOLSO!'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: USAR ESTE CONTEÚDO ✨ (Matching Screen 2) */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleUseContent}
          className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-purple-700/20 transition-all"
        >
          <span>USAR ESTE CONTEÚDO</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </motion.button>

        {/* 3 Secondary Action Buttons (Matching Screen 2: Copiar texto, Baixar imagem, Compartilhar) */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => {
              const textToCopy =
                activeSubTab === 'texto'
                  ? generatedResult.adText
                  : activeSubTab === 'instagram'
                  ? generatedResult.instagramCaption
                  : activeSubTab === 'reels'
                  ? generatedResult.reelsScript
                  : activeSubTab === 'whatsapp'
                  ? generatedResult.whatsappMessage
                  : generatedResult.hashtags.join(' ');
              copyToClipboard(textToCopy, activeSubTab);
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            {copiedField ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copiar texto</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('art-generator')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            <Palette className="w-4 h-4 text-purple-600" />
            <span>Editar Arte</span>
          </button>

          <button
            onClick={() =>
              openShareModal({
                id: 'preview-ad',
                userId: user.id,
                businessId: business.id,
                businessName: business.name,
                businessLogo: business.logo,
                businessPhone: business.phone,
                businessWhatsapp: business.whatsapp,
                category: business.category,
                categoryName: 'Restaurantes',
                title: generatedResult.title,
                description: generatedResult.adText,
                imageUrl:
                  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
                address: `${business.street}, ${business.number}`,
                neighborhood: business.neighborhood,
                city: business.city,
                state: business.state,
                distanceKm: 0.8,
                rating: 5.0,
                reviewsCount: 1,
                status: 'ativo',
                isFeatured: true,
                views: 0,
                clicks: 0,
                whatsappClicks: 0,
                radarViews: 0,
                favorites: 0,
                shares: 0,
                createdAt: 'Hoje',
                expiresAt: '30 dias',
                lat: business.lat,
                lng: business.lng,
              })
            }
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
