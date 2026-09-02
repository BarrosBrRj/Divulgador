import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  Megaphone,
  Crown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flame,
  Activity,
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminView: React.FC = () => {
  const { user, updateUser, reports, resolveReport, ads, openAdDetail } = useApp();

  const totalAds = ads.length;
  const pendingReports = reports.filter((r) => r.status === 'pendente');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-700" />
            Painel Administrativo & Moderação
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Gerenciamento global da plataforma, denúncias e métricas do sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              updateUser({ role: user.role === 'admin' ? 'user' : 'admin' })
            }
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Modo: <strong className="text-purple-700">{user.role.toUpperCase()}</strong> (Alternar)
          </button>
        </div>
      </div>

      {/* Global Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <Megaphone className="w-5 h-5" />
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-xl font-black text-slate-900">{totalAds}</p>
          <p className="text-[11px] font-semibold text-slate-500">Anúncios no Ar</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xl font-black text-slate-900">4.820</p>
          <p className="text-[11px] font-semibold text-slate-500">Usuários Cadastrados</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <Crown className="w-5 h-5" />
          </div>
          <p className="text-xl font-black text-slate-900">312</p>
          <p className="text-[11px] font-semibold text-slate-500">Assinantes VIP</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-red-600 mb-2">
            <AlertTriangle className="w-5 h-5" />
            {pendingReports.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <p className="text-xl font-black text-slate-900">{pendingReports.length}</p>
          <p className="text-[11px] font-semibold text-slate-500">Denúncias Pendentes</p>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Fila de Moderação de Conteúdo
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            {reports.length} registros
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhuma denúncia pendente. A plataforma está segura!
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      {report.reasonLabel}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                      Divulgação: {report.adTitle} ({report.businessName})
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {report.createdAt}
                  </span>
                </div>

                {report.details && (
                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    "{report.details}"
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-slate-500">
                    Denunciado por: <strong>{report.reporterName}</strong> ({report.reporterEmail})
                  </span>

                  {report.status === 'pendente' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveReport(report.id, 'dismiss')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white font-bold transition-colors"
                      >
                        Descartar
                      </button>
                      <button
                        onClick={() => resolveReport(report.id, 'ban_ad')}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-xs"
                      >
                        Banir e Remover Anúncio
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                        report.status === 'resolvido'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      Status: {report.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
