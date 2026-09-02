import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  MessageCircle,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

export const MessagesView: React.FC = () => {
  const { leads, markLeadRead, showToast } = useApp();

  const handleReplyWhatsApp = (phone: string, senderName: string, adTitle: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${senderName}! Recebi sua mensagem pelo aplicativo DIVULGADOR sobre "${adTitle}". Como posso te ajudar?`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            💬 Mensagens e Contatos
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Clientes que entraram em contato através das suas divulgações
          </p>
        </div>
        <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
          {leads.length} contatos recebidos
        </span>
      </div>

      {leads.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            Nenhuma mensagem recebida ainda
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Assim que clientes enviarem dúvidas pelas suas divulgações, elas aparecerão listadas aqui para resposta rápida.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <motion.div
              key={lead.id}
              whileHover={{ y: -1 }}
              className={`rounded-3xl p-4 sm:p-5 border transition-all ${
                lead.isRead
                  ? 'bg-white border-slate-100 shadow-2xs'
                  : 'bg-white border-purple-300 shadow-md ring-1 ring-purple-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                    {lead.senderName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900">{lead.senderName}</h4>
                      {!lead.isRead && (
                        <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                          NOVO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Interessado em: <strong className="text-slate-800">{lead.adTitle}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lead.createdAt}</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="py-3">
                <p className="text-xs sm:text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  "{lead.message}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs text-slate-500 font-semibold">
                  Telefone: <strong>{lead.senderPhone}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {!lead.isRead && (
                    <button
                      onClick={() => markLeadRead(lead.id)}
                      className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors"
                    >
                      Marcar como lido
                    </button>
                  )}

                  <button
                    onClick={() => handleCall(lead.senderPhone)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    title="Ligar"
                  >
                    <Phone className="w-4 h-4 text-purple-600" />
                  </button>

                  <button
                    onClick={() => {
                      markLeadRead(lead.id);
                      handleReplyWhatsApp(lead.senderPhone, lead.senderName, lead.adTitle);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Responder no WhatsApp</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
