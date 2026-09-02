import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAddressByCep } from '../services/api';
import { CategoryId } from '../types';
import {
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Globe,
  Clock,
  Save,
  Crown,
  Search,
  Gift,
  Share2,
  CheckCircle,
  Copy,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'motion/react';

export const BusinessProfileView: React.FC = () => {
  const {
    business,
    updateBusiness,
    user,
    updateUser,
    categories,
    setCurrentTab,
    showToast,
  } = useApp();

  const [name, setName] = useState(business.name);
  const [description, setDescription] = useState(business.description);
  const [category, setCategory] = useState<CategoryId>(business.category);
  const [phone, setPhone] = useState(business.phone);
  const [whatsapp, setWhatsapp] = useState(business.whatsapp);
  const [instagram, setInstagram] = useState(business.instagram || '');
  const [website, setWebsite] = useState(business.website || '');
  const [openingHours, setOpeningHours] = useState(business.openingHours || 'Seg a Sáb: 18h às 23h30');

  // Address
  const [cep, setCep] = useState(business.cep);
  const [street, setStreet] = useState(business.street);
  const [number, setNumber] = useState(business.number);
  const [neighborhood, setNeighborhood] = useState(business.neighborhood);
  const [city, setCity] = useState(business.city);
  const [state, setState] = useState(business.state);
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);

  const handleCepLookup = async () => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      showToast('⚠️ Digite um CEP válido (8 dígitos)', undefined, 'warning');
      return;
    }

    setIsSearchingCep(true);
    try {
      const res = await fetchAddressByCep(cep);
      if (res) {
        setStreet(res.street);
        setNeighborhood(res.neighborhood);
        setCity(res.city);
        setState(res.state);
        showToast('📍 Endereço preenchido com sucesso!');
      } else {
        showToast('CEP não encontrado', 'Preencha os campos manualmente.', 'warning');
      }
    } catch {
      showToast('Falha na busca do CEP', undefined, 'error');
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness({
      name,
      description,
      category,
      phone,
      whatsapp,
      instagram,
      website,
      openingHours,
      cep,
      street,
      number,
      neighborhood,
      city,
      state,
    });
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://divulgador.app/convite/${user.referralCode || 'ALEX50'}`);
    setCopiedLink(true);
    showToast('🎁 Link copiado!', 'Envie para amigos e ganhe créditos quando eles anunciarem.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 1. Header Profile Cover & Info */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 relative">
          <img
            src={business.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="p-5 sm:p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-3.5">
              <img
                src={business.logo}
                alt={business.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white shadow-lg bg-white"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {business.name}
                </h1>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  {business.neighborhood}, {business.city} - {business.state}
                </p>
              </div>
            </div>

            {/* Plan Badge & Upgrade Action */}
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-black uppercase flex items-center gap-1.5 shadow-2xs">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>Plano {user.plan.toUpperCase()}</span>
              </div>
              <button
                onClick={() => setCurrentTab('plans')}
                className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Mudar Plano
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Indique e Ganhe Referral Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-5 sm:p-6 border border-purple-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              Indique outros comércios e ganhe R$ 20 em créditos!
            </h3>
            <p className="text-xs text-purple-200">
              Seu código exclusivo: <strong className="text-amber-300 font-mono font-black">{user.referralCode || 'ALEX50'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyReferral}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-md"
        >
          {copiedLink ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Link Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Convite</span>
            </>
          )}
        </button>
      </div>

      {/* 3. Main Business Profile Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-md space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            Dados do Seu Negócio
          </h2>
          <span className="text-xs text-slate-400">Informações visíveis aos clientes</span>
        </div>

        {/* Business Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nome Fantasia da Empresa *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Ramo de Atividade / Categoria *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryId)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio Description */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Breve Descrição do Negócio
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium resize-none leading-relaxed"
          />
        </div>

        {/* Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Telefone Fixo / Celular
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              WhatsApp para Vendas
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold text-emerald-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Instagram (@)
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@seu_negocio"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold text-purple-700"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Horário de Atendimento
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              placeholder="Ex: Seg a Sex 08h às 18h"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-semibold"
            />
          </div>
        </div>

        {/* Address Section with ViaCEP Auto-fill */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            Endereço e Geolocalização
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                CEP (com busca automática)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="01001-000"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-bold"
                />
                <button
                  type="button"
                  onClick={handleCepLookup}
                  disabled={isSearchingCep}
                  className="px-3 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition-colors shrink-0 disabled:opacity-50"
                >
                  {isSearchingCep ? '...' : <Search className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Rua / Logradouro
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Número</label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Bairro</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Cidade / UF</label>
              <input
                type="text"
                value={`${city} - ${state}`}
                readOnly
                className="w-full p-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-purple-700/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>SALVAR ALTERAÇÕES</span>
          </button>
        </div>
      </form>
    </div>
  );
};
