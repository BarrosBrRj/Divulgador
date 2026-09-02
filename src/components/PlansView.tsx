import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plan } from '../types';
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  QrCode,
  Flame,
  Star,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

export const PlansView: React.FC = () => {
  const { user, plans, upgradePlan, showToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.id === user.plan) {
      showToast('ℹ️ Este já é o seu plano atual.', undefined, 'info');
      return;
    }

    // Free tier doesn't require payment
    if (plan.price === 0) {
      upgradePlan(plan.id as any);
      return;
    }

    const finalPrice = billingCycle === 'yearly' ? plan.price * 0.8 * 12 : plan.price;
    const monthlyRate = billingCycle === 'yearly' ? plan.price * 0.8 : plan.price;

    setLoadingPlanId(plan.id);

    try {
      showToast('🔄 Gerando Assinatura no Mercado Pago...', 'Você será redirecionado para o checkout seguro.', 'info');

      const response = await fetch('/api/assinatura/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          planId: plan.id,
          planName: plan.name,
          billingCycle,
          price: Number(monthlyRate.toFixed(2)),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.init_point) {
        throw new Error(data.error || 'Não foi possível iniciar a assinatura.');
      }

      // Redirect user to Mercado Pago Checkout
      window.location.href = data.init_point;
    } catch (error: any) {
      console.error('Erro ao assinar plano:', error);
      showToast('Erro ao processar assinatura', error.message || 'Tente novamente em instantes.', 'error');
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* 1. Header matching Screen 5 */}
      <div className="text-center max-w-xl mx-auto space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs tracking-wide">
          <Crown className="w-3.5 h-3.5 text-amber-600" />
          TURBINE SEU NEGÓCIO
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Planos e Preços
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Escolha o melhor plano para aumentar sua visibilidade, atrair mais clientes e multiplicar suas vendas com cobrança segura via Mercado Pago.
        </p>

        {/* Monthly / Yearly Toggle with discount badge */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-2xl mt-3">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Anual</span>
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-md">
              -20% OFF
            </span>
          </button>
        </div>
      </div>

      {/* 2. Plans Cards Grid matching Screen 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch pt-2">
        {plans.map((plan) => {
          const isCurrent = user.plan === plan.id;
          const isPopular = plan.isPopular;
          const isLoading = loadingPlanId === plan.id;

          const displayPrice =
            billingCycle === 'yearly' && plan.price > 0
              ? (plan.price * 0.8).toFixed(2).replace('.', ',')
              : plan.price.toFixed(2).replace('.', ',');

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative transition-all ${
                isPopular
                  ? 'bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white shadow-xl shadow-purple-900/25 border-2 border-amber-400'
                  : 'bg-white text-slate-900 border border-slate-100 shadow-md hover:border-purple-200'
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-slate-950" />
                  MAIS ESCOLHIDO
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-black text-lg ${isPopular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  {plan.price === 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Inicial
                    </span>
                  )}
                </div>

                <p className={`text-xs ${isPopular ? 'text-purple-200' : 'text-slate-500'} mb-4`}>
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold">R$</span>
                    <span className="text-3xl sm:text-4xl font-black tracking-tight">
                      {displayPrice}
                    </span>
                    <span className={`text-xs font-semibold ${isPopular ? 'text-purple-200' : 'text-slate-400'}`}>
                      {plan.price === 0 ? '' : '/mês'}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-200/20">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPopular ? 'bg-amber-400 text-slate-900' : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3px]" />
                      </div>
                      <span
                        className={`font-medium ${
                          isPopular ? 'text-slate-100' : 'text-slate-700'
                        }`}
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: ASSINAR AGORA */}
              <div className="mt-6 pt-4">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent || isLoading}
                  className={`w-full py-3 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200 shadow-none'
                      : isPopular
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/30'
                      : 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/20'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>PROCESSANDO...</span>
                    </>
                  ) : isCurrent ? (
                    <span>PLANO ATUAL</span>
                  ) : (
                    <>
                      <span>ASSINAR AGORA</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Security & Guarantee Callout */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-xs text-slate-900">Sem Fidelidade</p>
            <p className="text-[11px] text-slate-500">Cancele ou mude de plano a qualquer momento pelo Mercado Pago</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-xs text-slate-900">Mercado Pago Recorrente</p>
            <p className="text-[11px] text-slate-500">Cartão de Crédito e débito com segurança criptografada</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-xs text-slate-900">Suporte Dedicado</p>
            <p className="text-[11px] text-slate-500">Equipe pronta para ajudar a alavancar seu negócio</p>
          </div>
        </div>
      </div>
    </div>
  );
};
