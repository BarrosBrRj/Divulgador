import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, user, updateUser, showToast } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    closeAuthModal();
  };

  const switchAccount = (demoName: string, demoEmail: string, avatarUrl: string) => {
    updateUser({ name: demoName, email: demoEmail, avatar: avatarUrl });
    closeAuthModal();
    showToast(`👤 Conectado como ${demoName}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-purple-700">
            <Lock className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900">Minha Conta</h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow-md"
          >
            Salvar Dados
          </button>
        </form>

        {/* Demo profiles quick switch */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            💡 Alternar Perfis de Demonstração:
          </p>
          <div className="space-y-1.5">
            <button
              onClick={() =>
                switchAccount(
                  'Alex Silva',
                  'alex@pizzariasaborosa.com.br',
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                )
              }
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-purple-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <span>🍕 Alex Silva (Pizzaria)</span>
              <span className="text-[10px] text-purple-700 font-normal">Conectar →</span>
            </button>

            <button
              onClick={() =>
                switchAccount(
                  'Mariana Costa',
                  'mariana@studiobeleza.com.br',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                )
              }
              className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-purple-50 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors"
            >
              <span>💇 Mariana Costa (Salão Beleza)</span>
              <span className="text-[10px] text-purple-700 font-normal">Conectar →</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
