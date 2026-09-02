import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Megaphone,
  Smartphone,
  Monitor,
  ShieldAlert,
  Sparkles,
  Heart,
  Crown,
  Search,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setCurrentTab,
    currentTab,
    isMobileDeviceFrame,
    setIsMobileDeviceFrame,
    openAuthModal,
    openCreateAdModal,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-600/25 ring-2 ring-purple-400/20">
            <Megaphone className="w-5 h-5 text-amber-300 transform -rotate-12 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                DIVULGADOR
              </span>
              <span className="bg-amber-400/20 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                IA
              </span>
            </div>
            <p className="text-[10px] font-semibold text-purple-700 uppercase tracking-widest hidden sm:block">
              Divulgue. Apareça. Venda mais.
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-purple-50 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setCurrentTab('radar')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'radar'
                ? 'bg-purple-50 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📍 Radar
          </button>
          <button
            onClick={() => setCurrentTab('ai-creator')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'ai-creator'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Criador IA
          </button>
          <button
            onClick={() => setCurrentTab('art-generator')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'art-generator'
                ? 'bg-purple-50 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            🎨 Gerador de Arte
          </button>
          <button
            onClick={() => setCurrentTab('my-ads')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'my-ads'
                ? 'bg-purple-50 text-purple-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Meus Anúncios
          </button>
          <button
            onClick={() => setCurrentTab('plans')}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 ${
              currentTab === 'plans'
                ? 'bg-amber-50 text-amber-700 font-bold border border-amber-200'
                : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50/50'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            Planos
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Publish Ad Button (Desktop) */}
          <button
            onClick={() => openCreateAdModal()}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold text-sm shadow-md hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95"
          >
            <span>🔥</span> Divulgar Agora
          </button>

          {/* View Mockup Frame Toggle */}
          <button
            onClick={() => setIsMobileDeviceFrame((prev) => !prev)}
            title={isMobileDeviceFrame ? 'Modo Tela Cheia' : 'Modo Simulador Celular'}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isMobileDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-purple-600" />
                <span>Modo Expandido</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                <span>Ver Celular</span>
              </>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={() => setCurrentTab('favorites')}
            className="p-2 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Meus Favoritos"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Admin Switcher Badge */}
          <button
            onClick={() => setCurrentTab('admin')}
            title="Painel Administrativo"
            className={`p-2 rounded-xl transition-colors ${
              currentTab === 'admin'
                ? 'bg-purple-900 text-amber-300'
                : 'text-slate-500 hover:text-purple-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:ring-2 hover:ring-purple-400 transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-600/30"
            />
            <span className="text-xs font-bold text-slate-800 hidden sm:block max-w-[90px] truncate">
              {user.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
