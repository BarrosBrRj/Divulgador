import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Plus, MessageSquare, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, openCreateAdModal, leads } = useApp();

  const unreadLeadsCount = leads.filter((l) => !l.isRead).length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
        {/* Início */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
            currentTab === 'home' ? 'text-purple-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 font-medium">Início</span>
        </button>

        {/* Radar */}
        <button
          onClick={() => setCurrentTab('radar')}
          className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
            currentTab === 'radar' ? 'text-purple-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${currentTab === 'radar' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 font-medium">Radar</span>
        </button>

        {/* Big Elevated Center Button: + Divulgar */}
        <div className="relative -top-5">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentTab('ai-creator')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 ring-4 ring-white border border-purple-400/30"
          >
            <Plus className="w-7 h-7 text-amber-300 stroke-[3px]" />
          </motion.button>
        </div>

        {/* Mensagens / Leads */}
        <button
          onClick={() => setCurrentTab('messages')}
          className={`flex flex-col items-center justify-center w-12 py-1 relative transition-all ${
            currentTab === 'messages' ? 'text-purple-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${currentTab === 'messages' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {unreadLeadsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 text-slate-900 font-extrabold text-[9px] rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadLeadsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Mensagens</span>
        </button>

        {/* Perfil */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center w-12 py-1 transition-all ${
            currentTab === 'profile' ? 'text-purple-700 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
};
