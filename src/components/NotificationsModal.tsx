import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  Flame,
  MessageSquare,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab,
    openAdDetail,
    ads,
  } = useApp();

  if (!isNotificationsOpen) return null;

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    setIsNotificationsOpen(false);
    if (notif.adId) {
      const target = ads.find((a) => a.id === notif.adId);
      if (target) openAdDetail(target);
    }
    if (notif.linkTab) {
      setCurrentTab(notif.linkTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-700" />
            <h3 className="font-extrabold text-base text-slate-900">Notificações</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhuma notificação no momento.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3.5 rounded-2xl border transition-colors cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-white border-slate-100 text-slate-600'
                    : 'bg-purple-50/70 border-purple-200 text-slate-900 shadow-2xs'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'boost'
                      ? 'bg-amber-100 text-amber-800'
                      : n.type === 'lead'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {n.type === 'boost' && <Flame className="w-4 h-4" />}
                  {n.type === 'lead' && <MessageSquare className="w-4 h-4" />}
                  {n.type === 'system' && <Sparkles className="w-4 h-4" />}
                  {n.type === 'review' && <Info className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-extrabold text-xs text-slate-900 truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
