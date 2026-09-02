import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArtFormat } from '../types';
import {
  Palette,
  Download,
  Share2,
  Copy,
  Image as ImageIcon,
  Sparkles,
  ArrowLeft,
  Check,
  RefreshCw,
  Upload,
  Type,
  Maximize2,
} from 'lucide-react';
import { motion } from 'motion/react';

const PRESET_BACKGROUNDS = [
  { label: '🍕 Pizza / Gastronomia', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop&q=80' },
  { label: '🍔 Hambúrguer Artesanal', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&auto=format&fit=crop&q=80' },
  { label: '💇 Salão de Beleza / Cabelo', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&auto=format&fit=crop&q=80' },
  { label: '🐶 Pet Shop / Banho & Tosa', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1000&auto=format&fit=crop&q=80' },
  { label: '🔧 Oficina Mecânica / Auto', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1000&auto=format&fit=crop&q=80' },
  { label: '🧁 Doces & Bolos Gourmet', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=80' },
  { label: '🦷 Odontologia & Saúde', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&auto=format&fit=crop&q=80' },
  { label: '🛍️ Moda & Roupas', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80' },
];

export const ArtGeneratorView: React.FC = () => {
  const { business, setCurrentTab, showToast, triggerCelebration } = useApp();

  const [format, setFormat] = useState<ArtFormat>('1:1');
  const [themeStyle, setThemeStyle] = useState<'purple' | 'gold' | 'neon' | 'red' | 'dark'>('purple');
  const [bgImage, setBgImage] = useState<string>(PRESET_BACKGROUNDS[0].url);
  const [badgeText, setBadgeText] = useState<string>('PROMOÇÃO');
  const [mainTitle, setMainTitle] = useState<string>('PIZZA GRANDE');
  const [priceTag, setPriceTag] = useState<string>('R$ 39,90');
  const [oldPriceTag, setOldPriceTag] = useState<string>('R$ 59,90');
  const [subTitle, setSubTitle] = useState<string>('SABOR QUE VOCÊ AMA PREÇO QUE CABE NO BOLSO!');
  const [ctaText, setCtaText] = useState<string>('Peça agora pelo WhatsApp!');
  const [logoName, setLogoName] = useState<string>(business.name || 'SeuLogo');
  const [phoneText, setPhoneText] = useState<string>(business.phone || '(11) 98765-4321');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Redraw canvas whenever parameters change
  useEffect(() => {
    drawCanvas();
  }, [format, themeStyle, bgImage, badgeText, mainTitle, priceTag, oldPriceTag, subTitle, ctaText, logoName, phoneText]);

  const getCanvasDimensions = () => {
    switch (format) {
      case '1:1':
        return { width: 1080, height: 1080 };
      case '4:5':
        return { width: 1080, height: 1350 };
      case '9:16':
        return { width: 1080, height: 1920 };
      case '16:9':
        return { width: 1920, height: 1080 };
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getCanvasDimensions();
    canvas.width = width;
    canvas.height = height;

    setIsRendering(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = bgImage;

    img.onload = () => {
      // Draw background image scaled nicely
      const scale = Math.max(width / img.width, height / img.height);
      const x = (width / 2) - (img.width / 2) * scale;
      const y = (height / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Dark Overlay Gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (themeStyle === 'purple') {
        gradient.addColorStop(0, 'rgba(30, 10, 60, 0.85)');
        gradient.addColorStop(0.6, 'rgba(76, 29, 149, 0.7)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
      } else if (themeStyle === 'gold') {
        gradient.addColorStop(0, 'rgba(40, 25, 5, 0.9)');
        gradient.addColorStop(0.5, 'rgba(120, 80, 10, 0.6)');
        gradient.addColorStop(1, 'rgba(20, 15, 5, 0.95)');
      } else if (themeStyle === 'red') {
        gradient.addColorStop(0, 'rgba(153, 27, 27, 0.85)');
        gradient.addColorStop(0.6, 'rgba(80, 10, 10, 0.7)');
        gradient.addColorStop(1, 'rgba(20, 5, 5, 0.95)');
      } else if (themeStyle === 'neon') {
        gradient.addColorStop(0, 'rgba(10, 10, 20, 0.9)');
        gradient.addColorStop(0.5, 'rgba(88, 28, 135, 0.6)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      } else {
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.9)');
        gradient.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Accent Top Bar
      ctx.fillStyle = themeStyle === 'gold' ? '#F59E0B' : '#7C3AED';
      ctx.fillRect(0, 0, width, 16);

      // Header Brand Logo pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      roundRect(ctx, 60, 60, 360, 80, 40);
      ctx.fill();

      // Glowing dot inside logo pill
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(100, 100, 12, 0, Math.PI * 2);
      ctx.fill();

      // Logo Name Text
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(logoName, 130, 112);

      // Badge (e.g. PROMOÇÃO / OFERTA)
      ctx.fillStyle = themeStyle === 'red' ? '#DC2626' : '#F59E0B';
      roundRect(ctx, 60, 200, 300, 64, 32);
      ctx.fill();

      ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(badgeText.toUpperCase(), 90, 244);

      // Main Title
      ctx.font = '900 84px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(mainTitle.toUpperCase(), 60, 360);

      // Old Price strike (if present)
      if (oldPriceTag) {
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`DE ${oldPriceTag}`, 60, 430);
      }

      // Price Tag Box
      ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('POR APENAS', 60, oldPriceTag ? 480 : 430);

      ctx.font = '900 120px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = themeStyle === 'gold' ? '#FBBF24' : '#F59E0B';
      ctx.fillText(priceTag, 60, oldPriceTag ? 600 : 540);

      // Subtitle / Slogan
      ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      wrapText(ctx, subTitle, 60, oldPriceTag ? 680 : 620, width - 120, 50);

      // Bottom CTA Banner Box
      const bottomY = height - 180;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 60, bottomY, width - 120, 110, 30);
      ctx.fill();

      // CTA Text
      ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#6D28D9';
      ctx.fillText(`🔥 ${ctaText}`, 100, bottomY + 70);

      // Phone / Location Tag
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(`📲 ${phoneText}`, width - 420, bottomY + 70);

      // Watermark Divulgador
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('⚡ DIVULGADOR.APP — Divulgue. Apareça. Venda mais.', 60, height - 30);

      setIsRendering(false);
    };

    img.onerror = () => {
      setIsRendering(false);
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `divulgacao-${mainTitle.toLowerCase().replace(/\s+/g, '-')}-${format}.png`;
    link.href = dataUrl;
    link.click();
    showToast('📥 Arte baixada!', 'Sua imagem promocional em alta resolução foi salva.');
    triggerCelebration();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgImage(event.target.result as string);
          showToast('📸 Foto personalizada carregada!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('ai-creator')}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              🎨 Gerador de Arte Promocional
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Crie banners e posts profissionais em alta resolução
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold text-xs shadow-md hover:from-purple-800 hover:to-indigo-800 transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Baixar Imagem PNG</span>
        </button>
      </div>

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Customizer Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-100 shadow-md space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            Configurações da Arte
          </h2>

          {/* Formats Selector (Matching requirements: 1:1, 4:5, 9:16, 16:9) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Formato / Rede Social
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['1:1', '4:5', '9:16', '16:9'] as ArtFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    format === fmt
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {format === '1:1' && 'Quadrado — Instagram & WhatsApp'}
              {format === '4:5' && 'Retrato — Feed Instagram'}
              {format === '9:16' && 'Vertical — Stories & Reels / TikTok'}
              {format === '16:9' && 'Horizontal — Banner & Facebook'}
            </span>
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Estilo Visual / Tema
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'purple', label: 'Roxo', bg: 'bg-purple-600' },
                { id: 'gold', label: 'Ouro', bg: 'bg-amber-500' },
                { id: 'red', label: 'Vermelho', bg: 'bg-red-600' },
                { id: 'neon', label: 'Neon', bg: 'bg-indigo-600' },
                { id: 'dark', label: 'Preto', bg: 'bg-slate-900' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setThemeStyle(th.id as any)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-white flex items-center justify-center gap-1 ${
                    th.bg
                  } ${
                    themeStyle === th.id ? 'ring-2 ring-purple-600 ring-offset-1 scale-105' : 'opacity-80'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Photos Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Foto de Fundo</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Upload Foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {PRESET_BACKGROUNDS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => setBgImage(preset.url)}
                  className={`cursor-pointer h-12 rounded-xl overflow-hidden relative border-2 transition-all ${
                    bgImage === preset.url ? 'border-purple-600 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Text Customizations */}
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Selo / Badge</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Logo / Empresa</label>
                <input
                  type="text"
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Título Principal</label>
              <input
                type="text"
                value={mainTitle}
                onChange={(e) => setMainTitle(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Preço Promocional</label>
                <input
                  type="text"
                  value={priceTag}
                  onChange={(e) => setPriceTag(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold text-purple-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Preço Anterior (De)</label>
                <input
                  type="text"
                  value={oldPriceTag}
                  onChange={(e) => setOldPriceTag(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Slogan / Frase de Impacto</label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Chamada CTA</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phoneText}
                  onChange={(e) => setPhoneText(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Canvas Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-xl relative">
          <div className="flex items-center justify-between w-full mb-3 text-slate-300 text-xs">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Prévia em Tempo Real ({format})
            </span>
            <span className="text-[10px] text-slate-400">100% Renderizado em Alta Resolução</span>
          </div>

          {/* Canvas Element with Aspect Ratio Container */}
          <div
            className={`w-full max-w-md overflow-hidden rounded-2xl shadow-2xl border border-slate-700 bg-black flex items-center justify-center relative ${
              format === '1:1'
                ? 'aspect-square'
                : format === '4:5'
                ? 'aspect-[4/5]'
                : format === '9:16'
                ? 'aspect-[9/16] max-w-[320px]'
                : 'aspect-[16/9]'
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>

          {/* Canvas Actions */}
          <div className="mt-5 w-full flex flex-wrap gap-2 justify-center">
            <button
              onClick={handleDownload}
              className="flex-1 min-w-[160px] py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 fill-slate-900" />
              BAIXAR ARTE (PNG)
            </button>
            <button
              onClick={() => {
                showToast('✨ Arte aplicada ao rascunho de anúncio!');
                setCurrentTab('ai-creator');
              }}
              className="py-3 px-5 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              Usar no Criador IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Canvas Helper for Rounded Rectangles
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Canvas Helper for Text Wrapping
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
