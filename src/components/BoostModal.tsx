import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Flame,
  Check,
  Zap,
  QrCode,
  CreditCard,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

export const BoostModal: React.FC = () => {
  const {
    isBoostModalOpen,
    closeBoostModal,
    selectedAdForBoost,
    boostOptions,
    showToast,
  } = useApp();

  const [selectedOptionId, setSelectedOptionId] = useState<string>(boostOptions[0]?.id || 'boost-01');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isBoostModalOpen || !selectedAdForBoost) return null;
  const ad = selectedAdForBoost;
  const selectedOption = boostOptions.find((o) => o.id === selectedOptionId) || boostOptions[0];

  const handleConfirmBoost = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/pagamento/criar-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adId: ad.id,
          boostOptionId: selectedOption.id,
          price: selectedOption.price,
          title: selectedOption.title,
          adTitle: ad.title,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.init_point) {
        throw new Error(data.error || 'Não foi possível gerar a cobrança no Mercado Pago.');
      }

      showToast(
        'Redirecionando...',
        'Você será levado com segurança ao Checkout Pro do Mercado Pago para concluir o pagamento.',
        'info'
      );

      // Redirect user to Mercado Pago Checkout Pro
      window.location.href = data.init_point;
    } catch (err: any) {
      console.error('Erro ao iniciar pagamento Mercado Pago:', err);
      const msg = err.message || 'Erro ao conectar ao Mercado Pago. Verifique sua conexão.';
      setErrorMessage(msg);
      showToast('Erro no Pagamento', msg, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-auto max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Flame className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black leading-tight">
                Destacar Divulgação
              </h2>
              <p className="text-xs text-purple-200">
                Mercado Pago Checkout Pro • PIX ou Cartão
              </p>
            </div>
          </div>

          <button
            onClick={closeBoostModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Target Ad Info */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-slate-900 truncate">{ad.title}</h4>
              <p className="text-[11px] text-slate-500 truncate">{ad.businessName}</p>
            </div>
          </div>

          {/* Boost Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-extrabold text-slate-800 block uppercase tracking-wider">
              Escolha o Pacote de Impulsionamento
            </label>
            <div className="space-y-2">
              {boostOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {opt.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                          {opt.durationDays} dias
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-base text-purple-700">
                        R$ {opt.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block uppercase tracking-wider">
              Forma de Pagamento (Mercado Pago)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Cartão de Crédito</span>
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Guarantee */}
          <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pagamento 100% seguro via Mercado Pago. O destaque é ativado assim que o pagamento for aprovado.</span>
          </div>

          {/* Submit Action */}
          <button
            onClick={handleConfirmBoost}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 transition-all active:scale-98 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Conectando ao Mercado Pago...</span>
              </div>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>PAGAR NO MERCADO PAGO (R$ {selectedOption.price.toFixed(2).replace('.', ',')})</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

