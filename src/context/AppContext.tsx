import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Business,
  Advertisement,
  Category,
  Plan,
  BoostOption,
  NotificationItem,
  ReportItem,
  InAppLeadMessage,
  NavigationTab,
  CategoryId,
  AdStatus,
  AIGeneratedContent,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_USER,
  INITIAL_BUSINESS,
  INITIAL_ADS,
  PLANS,
  BOOST_OPTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LEADS,
  INITIAL_REPORTS,
} from '../data/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation & View
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedCategory: CategoryId | 'todos';
  setSelectedCategory: (cat: CategoryId | 'todos') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Data Collections
  user: User;
  business: Business;
  ads: Advertisement[];
  categories: Category[];
  plans: Plan[];
  boostOptions: BoostOption[];
  notifications: NotificationItem[];
  leads: InAppLeadMessage[];
  reports: ReportItem[];
  favorites: string[]; // ad ids

  // Actions - Ads
  createAd: (adData: Partial<Advertisement>) => Advertisement;
  updateAd: (id: string, updates: Partial<Advertisement>) => void;
  toggleAdStatus: (id: string, newStatus: AdStatus) => void;
  deleteAd: (id: string) => void;
  boostAd: (adId: string, boostOptionId: string) => void;
  recordAdView: (adId: string) => void;
  recordAdClick: (adId: string, type?: 'click' | 'whatsapp' | 'radar' | 'share') => void;

  // Actions - User & Business
  updateUser: (updates: Partial<User>) => void;
  updateBusiness: (updates: Partial<Business>) => void;
  upgradePlan: (planId: User['plan']) => void;
  toggleFavorite: (adId: string) => void;
  isFavorite: (adId: string) => boolean;

  // Actions - Notifications & Leads
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  sendLeadMessage: (adId: string, senderName: string, senderPhone: string, message: string) => void;
  markLeadRead: (id: string) => void;

  // Actions - Moderation
  submitReport: (adId: string, reason: ReportItem['reason'], reasonLabel: string, details: string, reporterName: string, reporterEmail: string) => void;
  resolveReport: (reportId: string, action: 'ban_ad' | 'dismiss') => void;

  // Actions - Modals & Overlays
  selectedAdForDetail: Advertisement | null;
  openAdDetail: (ad: Advertisement) => void;
  closeAdDetail: () => void;

  isCreateAdModalOpen: boolean;
  openCreateAdModal: (prefill?: Partial<Advertisement>) => void;
  closeCreateAdModal: () => void;
  prefilledAdData: Partial<Advertisement> | null;

  isBoostModalOpen: boolean;
  selectedAdForBoost: Advertisement | null;
  openBoostModal: (ad: Advertisement) => void;
  closeBoostModal: () => void;

  isReportModalOpen: boolean;
  selectedAdForReport: Advertisement | null;
  openReportModal: (ad: Advertisement) => void;
  closeReportModal: () => void;

  isShareModalOpen: boolean;
  selectedAdForShare: Advertisement | null;
  openShareModal: (ad: Advertisement) => void;
  closeShareModal: () => void;

  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (val: boolean) => void;

  // Geolocation
  userLocation: { lat: number; lng: number; city: string; permissionGranted: boolean };
  requestLocation: () => Promise<void>;

  // Toast / Alerts
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'divulgador_user_v2',
  BUSINESS: 'divulgador_biz_v2',
  ADS: 'divulgador_ads_v2',
  FAVORITES: 'divulgador_favs_v2',
  NOTIFICATIONS: 'divulgador_notifs_v2',
  LEADS: 'divulgador_leads_v2',
  REPORTS: 'divulgador_reports_v2',
  LOCATION: 'divulgador_location_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Filters
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);

  // Core Data with localStorage hydration
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [business, setBusiness] = useState<Business>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESS;
    } catch {
      return INITIAL_BUSINESS;
    }
  });

  const [ads, setAds] = useState<Advertisement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADS);
      return saved ? JSON.parse(saved) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['ad-01', 'ad-02'];
    } catch {
      return ['ad-01', 'ad-02'];
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [leads, setLeads] = useState<InAppLeadMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return saved ? JSON.parse(saved) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  });

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    city: string;
    permissionGranted: boolean;
  }>({
    lat: -23.55052,
    lng: -46.633308,
    city: 'São Paulo',
    permissionGranted: false,
  });

  // Modal States
  const [selectedAdForDetail, setSelectedAdForDetail] = useState<Advertisement | null>(null);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState<boolean>(false);
  const [prefilledAdData, setPrefilledAdData] = useState<Partial<Advertisement> | null>(null);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState<boolean>(false);
  const [selectedAdForBoost, setSelectedAdForBoost] = useState<Advertisement | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [selectedAdForReport, setSelectedAdForReport] = useState<Advertisement | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedAdForShare, setSelectedAdForShare] = useState<Advertisement | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Toast System
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  const showToast = (title: string, message?: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#F59E0B', '#10B981', '#EC4899'],
      });
    } catch {
      // safe ignore if canvas-confetti is not mounted
    }
  };

  // Actions
  const createAd = (adData: Partial<Advertisement>): Advertisement => {
    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      userId: user.id,
      businessId: business.id,
      businessName: business.name,
      businessLogo: business.logo,
      businessPhone: business.phone,
      businessWhatsapp: business.whatsapp,
      businessInstagram: business.instagram,
      businessWebsite: business.website,
      category: adData.category || business.category || 'outros',
      categoryName:
        INITIAL_CATEGORIES.find((c) => c.id === (adData.category || business.category))?.name || 'Geral',
      title: adData.title || 'Super Divulgação',
      description: adData.description || 'Confira nossa nova oferta!',
      promoTag: adData.promoTag || 'PROMOÇÃO',
      price: adData.price,
      oldPrice: adData.oldPrice,
      imageUrl:
        adData.imageUrl ||
        business.coverImage ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      address: `${business.street}, ${business.number}`,
      neighborhood: business.neighborhood,
      city: business.city,
      state: business.state,
      distanceKm: 0.5,
      rating: business.rating || 5.0,
      reviewsCount: business.reviewsCount || 1,
      status: 'ativo',
      isFeatured: false,
      views: 0,
      clicks: 0,
      whatsappClicks: 0,
      radarViews: 0,
      favorites: 0,
      shares: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      openingHours: business.openingHours,
      lat: business.lat || -23.55052,
      lng: business.lng || -46.633308,
      aiContent: adData.aiContent,
      ...adData,
    };

    setAds((prev) => [newAd, ...prev]);
    showToast('🎉 Anúncio publicado com sucesso!', 'Sua divulgação já está visível para milhares de clientes próximos.');
    triggerCelebration();
    return newAd;
  };

  const updateAd = (id: string, updates: Partial<Advertisement>) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, ...updates } : ad))
    );
    showToast('✅ Anúncio atualizado com sucesso!');
  };

  const toggleAdStatus = (id: string, newStatus: AdStatus) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, status: newStatus } : ad))
    );
    const label = newStatus === 'ativo' ? 'ativado' : newStatus === 'pausado' ? 'pausado' : 'encerrado';
    showToast(`Anúncio ${label}`, `O status da divulgação foi alterado para "${newStatus}".`, 'info');
  };

  const deleteAd = (id: string) => {
    setAds((prev) => prev.filter((ad) => ad.id !== id));
    showToast('🗑️ Anúncio excluído', 'A divulgação foi removida com sucesso.', 'info');
  };

  const boostAd = (adId: string, boostOptionId: string) => {
    const boost = BOOST_OPTIONS.find((b) => b.id === boostOptionId);
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          return {
            ...ad,
            isFeatured: true,
            featuredBadge: boost?.title || 'Super Destaque',
          };
        }
        return ad;
      })
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-boost-${Date.now()}`,
      userId: user.id,
      title: '🚀 Anúncio Turbinado!',
      message: `Seu anúncio foi destacado com "${boost?.title}". Agora você terá máxima visibilidade no radar e no topo.`,
      type: 'boost',
      read: false,
      createdAt: 'Agora mesmo',
      linkTab: 'my-ads',
      adId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    triggerCelebration();
    showToast('🔥 Anúncio destacado com sucesso!', `Impulsionamento ativado por ${boost?.durationDays || 7} dias.`);
  };

  // Process return redirect from Mercado Pago Checkout Pro & Subscriptions
  useEffect(() => {
    const handleMercadoPagoReturn = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment_status') || urlParams.get('collection_status') || urlParams.get('status');
        const subscriptionStatus = urlParams.get('subscription_status') || urlParams.get('preapproval_status');
        const adId = urlParams.get('adId') || urlParams.get('external_reference');
        const boostId = urlParams.get('boostId') || urlParams.get('boost_id') || 'boost-01';
        const paymentId = urlParams.get('payment_id') || urlParams.get('collection_id');
        const preapprovalId = urlParams.get('preapproval_id') || urlParams.get('id');
        const planId = urlParams.get('planId') || urlParams.get('plan_id');

        // Handle subscription return
        if (subscriptionStatus || (planId && (paymentStatus || preapprovalId))) {
          if (subscriptionStatus === 'approved' || subscriptionStatus === 'authorized' || paymentStatus === 'approved' || paymentStatus === 'success') {
            const checkUrl = `/api/assinatura/status/${encodeURIComponent(user.id)}?payment_id=${encodeURIComponent(paymentId || '')}&preapproval_id=${encodeURIComponent(preapprovalId || '')}&planId=${encodeURIComponent(planId || '')}`;
            const res = await fetch(checkUrl);
            const data = await res.json();

            if (data.active || subscriptionStatus === 'approved' || paymentStatus === 'approved') {
              const targetPlan = (data.planId || planId || 'profissional') as any;
              upgradePlan(targetPlan);

              await fetch('/api/assinatura/consumir-ativacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, subscriptionId: preapprovalId || paymentId }),
              }).catch(() => {});

              showToast('🎉 Assinatura Aprovada no Mercado Pago!', 'Seu novo plano já está ativo com todos os benefícios.', 'success');
            }
          } else if (subscriptionStatus === 'pending' || paymentStatus === 'pending') {
            showToast('⏳ Assinatura em Processamento', 'Assim que o Mercado Pago confirmar o pagamento, seu plano será liberado.', 'info');
          } else if (subscriptionStatus === 'failure' || paymentStatus === 'failure' || paymentStatus === 'rejected') {
            showToast('Assinatura Não Concluída', 'A transação da assinatura foi cancelada ou não autorizada.', 'warning');
          }
        }

        // Handle ad boost return
        if (!subscriptionStatus && (paymentStatus || (adId && paymentId))) {
          if (paymentStatus === 'approved' || paymentStatus === 'success') {
            if (adId) {
              // Verify payment on server with Mercado Pago
              const statusUrl = `/api/pagamento/status/${encodeURIComponent(adId)}?payment_id=${encodeURIComponent(paymentId || '')}&boostId=${encodeURIComponent(boostId)}`;
              const res = await fetch(statusUrl);
              const data = await res.json();

              if (data.approved || paymentStatus === 'approved') {
                const actualBoostId = data.boostOptionId || boostId;
                boostAd(adId, actualBoostId);

                // Mark payment as activated so it isn't duplicated
                await fetch('/api/pagamento/consumir-ativacao', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ adId, paymentId }),
                }).catch(() => {});

                showToast('🎉 Pagamento Aprovado no Mercado Pago!', 'Seu anúncio foi destacado com sucesso.', 'success');
              }
            }
          } else if (paymentStatus === 'pending') {
            showToast('⏳ Pagamento Pendente', 'Assim que o Mercado Pago aprovar a transação, o destaque será ativado.', 'info');
          } else if (paymentStatus === 'failure' || paymentStatus === 'rejected') {
            showToast('Pagamento Não Concluído', 'A transação no Mercado Pago foi cancelada ou recusada.', 'warning');
          }
        }

        // Clean query parameters from URL without reloading
        if (paymentStatus || subscriptionStatus || paymentId || preapprovalId) {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (err) {
        console.error('Erro ao processar retorno do Mercado Pago:', err);
      }
    };

    handleMercadoPagoReturn();
  }, [user.id]);

  // Periodic and on-focus polling for background payments and subscription activations
  useEffect(() => {
    const checkPendingPayments = async () => {
      // 1. Check subscriptions
      try {
        const subRes = await fetch(`/api/assinatura/status/${encodeURIComponent(user.id)}`);
        if (subRes.ok) {
          const subData = await subRes.json();
          if (subData.active && subData.planId && subData.planId !== user.plan) {
            upgradePlan(subData.planId);
            await fetch('/api/assinatura/consumir-ativacao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id }),
            }).catch(() => {});
          }
        }
      } catch {
        // Ignore subscription polling errors
      }

      // 2. Check ad boosts
      const userAds = ads.filter((a) => (a.userId === user.id || a.businessId === business.id) && !a.isFeatured);
      for (const targetAd of userAds) {
        try {
          const res = await fetch(`/api/pagamento/status/${encodeURIComponent(targetAd.id)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.approved) {
              boostAd(targetAd.id, data.boostOptionId || 'boost-01');
              await fetch('/api/pagamento/consumir-ativacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adId: targetAd.id }),
              }).catch(() => {});
            }
          }
        } catch {
          // Ignore polling errors quietly
        }
      }
    };

    window.addEventListener('focus', checkPendingPayments);
    const interval = setInterval(checkPendingPayments, 20000);
    return () => {
      window.removeEventListener('focus', checkPendingPayments);
      clearInterval(interval);
    };
  }, [ads, user.id, user.plan, business.id]);

  const recordAdView = (adId: string) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, views: ad.views + 1, radarViews: ad.radarViews + 1 } : ad))
    );
  };

  const recordAdClick = (adId: string, type: 'click' | 'whatsapp' | 'radar' | 'share' = 'click') => {
    setAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          return {
            ...ad,
            clicks: ad.clicks + 1,
            whatsappClicks: type === 'whatsapp' ? ad.whatsappClicks + 1 : ad.whatsappClicks,
            shares: type === 'share' ? ad.shares + 1 : ad.shares,
          };
        }
        return ad;
      })
    );
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('👤 Perfil atualizado!', 'Suas alterações foram salvas com sucesso.');
  };

  const updateBusiness = (updates: Partial<Business>) => {
    setBusiness((prev) => {
      const updated = { ...prev, ...updates };
      // Also sync user's business ads
      setAds((currAds) =>
        currAds.map((ad) => {
          if (ad.userId === user.id) {
            return {
              ...ad,
              businessName: updated.name,
              businessLogo: updated.logo,
              businessPhone: updated.phone,
              businessWhatsapp: updated.whatsapp,
              businessInstagram: updated.instagram,
              businessWebsite: updated.website,
              address: `${updated.street}, ${updated.number}`,
              neighborhood: updated.neighborhood,
              city: updated.city,
              state: updated.state,
            };
          }
          return ad;
        })
      );
      return updated;
    });
    showToast('🏢 Negócio atualizado!', 'As informações da sua empresa estão atualizadas.');
  };

  const upgradePlan = (planId: User['plan']) => {
    const plan = PLANS.find((p) => p.id === planId);
    setUser((prev) => ({
      ...prev,
      plan: planId,
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
    triggerCelebration();
    showToast(`🎉 Plano ${plan?.name} ativado!`, 'Seu novo limite e recursos já estão liberados.');
  };

  const toggleFavorite = (adId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(adId);
      if (isFav) {
        showToast('❤️ Removido dos favoritos', undefined, 'info');
        return prev.filter((id) => id !== adId);
      } else {
        // Increment ad favorite count
        setAds((currentAds) =>
          currentAds.map((a) => (a.id === adId ? { ...a, favorites: a.favorites + 1 } : a))
        );
        showToast('❤️ Salvo nos seus favoritos!', 'Você pode acessar na aba de Favoritos a qualquer momento.');
        return [...prev, adId];
      }
    });
  };

  const isFavorite = (adId: string) => favorites.includes(adId);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notificações limpas', 'Todas marcadas como lidas.', 'info');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const sendLeadMessage = (adId: string, senderName: string, senderPhone: string, message: string) => {
    const targetAd = ads.find((a) => a.id === adId);
    const newLead: InAppLeadMessage = {
      id: `lead-${Date.now()}`,
      adId,
      adTitle: targetAd?.title || 'Divulgação',
      businessId: targetAd?.businessId || business.id,
      senderName,
      senderPhone,
      message,
      createdAt: 'Agora mesmo',
      isRead: false,
    };
    setLeads((prev) => [newLead, ...prev]);

    // Send notification to owner
    const newNotif: NotificationItem = {
      id: `notif-lead-${Date.now()}`,
      userId: targetAd?.userId || user.id,
      title: '💬 Novo contato interessado!',
      message: `${senderName} enviou uma mensagem sobre "${targetAd?.title}".`,
      type: 'lead',
      read: false,
      createdAt: 'Agora mesmo',
      linkTab: 'messages',
      adId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('✉️ Mensagem enviada!', 'O anunciante foi notificado e responderá em breve.');
  };

  const markLeadRead = (id: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, isRead: true } : l)));
  };

  const submitReport = (
    adId: string,
    reason: ReportItem['reason'],
    reasonLabel: string,
    details: string,
    reporterName: string,
    reporterEmail: string
  ) => {
    const targetAd = ads.find((a) => a.id === adId);
    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      adId,
      adTitle: targetAd?.title || 'Anúncio',
      businessName: targetAd?.businessName || 'Empresa',
      reporterName: reporterName || user.name,
      reporterEmail: reporterEmail || user.email,
      reason,
      reasonLabel,
      details,
      status: 'pendente',
      createdAt: new Date().toLocaleString('pt-BR'),
    };
    setReports((prev) => [newReport, ...prev]);
    showToast('🛡️ Denúncia enviada', 'Nossa equipe de moderação irá analisar o anúncio com prioridade.', 'info');
  };

  const resolveReport = (reportId: string, action: 'ban_ad' | 'dismiss') => {
    const report = reports.find((r) => r.id === reportId);
    if (action === 'ban_ad' && report) {
      setAds((prev) => prev.filter((a) => a.id !== report.adId));
      showToast('🚫 Anúncio removido por infração', undefined, 'warning');
    } else {
      showToast('✅ Denúncia descartada', undefined, 'info');
    }
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action === 'ban_ad' ? 'resolvido' : 'descartado' } : r))
    );
  };

  // Modal Openers
  const openAdDetail = (ad: Advertisement) => {
    setSelectedAdForDetail(ad);
    recordAdView(ad.id);
  };

  const closeAdDetail = () => {
    setSelectedAdForDetail(null);
  };

  const openCreateAdModal = (prefill?: Partial<Advertisement>) => {
    setPrefilledAdData(prefill || null);
    setIsCreateAdModalOpen(true);
  };

  const closeCreateAdModal = () => {
    setIsCreateAdModalOpen(false);
    setPrefilledAdData(null);
  };

  const openBoostModal = (ad: Advertisement) => {
    setSelectedAdForBoost(ad);
    setIsBoostModalOpen(true);
  };

  const closeBoostModal = () => {
    setSelectedAdForBoost(null);
    setIsBoostModalOpen(false);
  };

  const openReportModal = (ad: Advertisement) => {
    setSelectedAdForReport(ad);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setSelectedAdForReport(null);
    setIsReportModalOpen(false);
  };

  const openShareModal = (ad: Advertisement) => {
    setSelectedAdForShare(ad);
    setIsShareModalOpen(true);
    recordAdClick(ad.id, 'share');
  };

  const closeShareModal = () => {
    setSelectedAdForShare(null);
    setIsShareModalOpen(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      showToast('⚠️ Geolocalização não suportada', 'Usando localização padrão do Centro de São Paulo.', 'warning');
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            city: user.city || 'São Paulo',
            permissionGranted: true,
          });
          showToast('📍 Localização atualizada!', 'Radar calibrado para seu endereço atual.');
        },
        (err) => {
          console.warn('Geolocation error:', err);
          showToast('📍 Localização mantida no Centro', 'Você pode navegar pelo mapa livremente.', 'info');
        }
      );
    } catch {
      // Fallback
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isMobileDeviceFrame,
        setIsMobileDeviceFrame,
        user,
        business,
        ads,
        categories: INITIAL_CATEGORIES,
        plans: PLANS,
        boostOptions: BOOST_OPTIONS,
        notifications,
        leads,
        reports,
        favorites,
        createAd,
        updateAd,
        toggleAdStatus,
        deleteAd,
        boostAd,
        recordAdView,
        recordAdClick,
        updateUser,
        updateBusiness,
        upgradePlan,
        toggleFavorite,
        isFavorite,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        sendLeadMessage,
        markLeadRead,
        submitReport,
        resolveReport,
        selectedAdForDetail,
        openAdDetail,
        closeAdDetail,
        isCreateAdModalOpen,
        openCreateAdModal,
        closeCreateAdModal,
        prefilledAdData,
        isBoostModalOpen,
        selectedAdForBoost,
        openBoostModal,
        closeBoostModal,
        isReportModalOpen,
        selectedAdForReport,
        openReportModal,
        closeReportModal,
        isShareModalOpen,
        selectedAdForShare,
        openShareModal,
        closeShareModal,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isNotificationsOpen,
        setIsNotificationsOpen,
        userLocation,
        requestLocation,
        toasts,
        showToast,
        removeToast,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
