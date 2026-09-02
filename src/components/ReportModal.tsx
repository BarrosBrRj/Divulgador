import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportItem } from '../types';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, closeReportModal, selectedAdForReport, submitReport, showToast } = useApp();

  const [reason, setReason] = useState<ReportItem['reason']>('fraude');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');

  if (!isReportModalOpen || !selectedAdForReport) return null;
  const ad = selectedAdForReport;

  const reasons = [
    { id: 'fraude', label: 'Golpe, Fraude ou Cobrança Indevida' },
    { id: 'conteudo_improprio', label: 'Conteúdo Ofensivo ou Impróprio' },
    { id: 'informacao_falsa', label: 'Informações Falsas ou Enganosas' },
    { id: 'preco_incorreto', label: 'Preço Diferente do Cobrado no Local' },
    { id: 'empresa_inexistente', label: 'Estabelecimento Não Existe / Falso' },
    { id: 'outro', label: 'Outro Motivo' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonObj = reasons.find((r) => r.id === reason);
    submitReport(
      ad.id,
      reason,
      reasonObj?.label || 'Denúncia',
      details,
      reporterName,
      reporterEmail
    );
    closeReportModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-5 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-900">Denunciar Divulgação</h3>
          </div>
          <button
            onClick={closeReportModal}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-800 leading-relaxed">
            Nossa equipe de moderação audita denúncias com rigor para manter o DIVULGADOR um ambiente seguro.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Motivo Principal *
            </label>
            <div className="space-y-1.5">
              {reasons.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    reason === r.id
                      ? 'border-red-500 bg-red-50/50 text-red-950 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reason === r.id}
                    onChange={() => setReason(r.id as any)}
                    className="accent-red-600"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Detalhes adicionais (opcional)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explique o que há de errado..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 resize-none font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase shadow-md transition-colors active:scale-98"
          >
            ENVIAR DENÚNCIA
          </button>
        </form>
      </motion.div>
    </div>
  );
};
