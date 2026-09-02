import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'floating' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone PWA, do not show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        title="Instalar DIVULGADOR no seu dispositivo"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 transition-all active:scale-95 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          title="Como instalar no iPhone/iPad"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold text-xs transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-purple-700" />
          <span className="hidden sm:inline">Instalar no iPhone</span>
          <span className="sm:hidden">App iOS</span>
        </button>

        <AnimatePresence>
          {showIOSGuide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      📱
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">Instalar no iPhone / iPad</h3>
                  </div>
                  <button
                    onClick={() => setShowIOSGuide(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold">1</div>
                    <p className="pt-0.5">
                      Toque no botão de <strong>Compartilhar</strong> <Share2 className="inline w-3.5 h-3.5 text-purple-700 mx-0.5" /> na barra inferior do Safari.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold">2</div>
                    <p className="pt-0.5">
                      Role para baixo e selecione <strong>Adicionar à Tela de Início</strong> <PlusSquare className="inline w-3.5 h-3.5 text-purple-700 mx-0.5" />.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 font-bold">3</div>
                    <p className="pt-0.5">
                      Toque em <strong>Adicionar</strong> no canto superior direito para ter o ícone do DIVULGADOR no seu celular!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-5 w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 font-extrabold text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95"
                >
                  Entendi
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
};
