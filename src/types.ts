export type CategoryId =
  | 'restaurantes'
  | 'lojas'
  | 'servicos'
  | 'beleza'
  | 'pet'
  | 'imoveis'
  | 'eventos'
  | 'profissionais'
  | 'outros';

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  iconName: string;
  color: string;
  bgLight: string;
  gradient: string;
  count: number;
}

export type AdStatus = 'ativo' | 'pausado' | 'encerrado';

export interface AIGeneratedContent {
  title: string;
  adText: string;
  instagramCaption: string;
  reelsScript: string;
  whatsappMessage: string;
  hashtags: string[];
  callToAction: string;
  badgeText: string;
  headlineSlogan: string;
}

export interface Advertisement {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  businessPhone: string;
  businessWhatsapp: string;
  businessInstagram?: string;
  businessWebsite?: string;
  category: CategoryId;
  categoryName: string;
  title: string;
  description: string;
  promoTag?: string; // e.g. "PROMOÇÃO", "DESCONTO", "NOVIDADE"
  price?: string; // e.g. "R$ 39,90"
  oldPrice?: string; // e.g. "R$ 55,00"
  imageUrl: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  status: AdStatus;
  isFeatured: boolean;
  featuredBadge?: string;
  views: number;
  clicks: number;
  whatsappClicks: number;
  radarViews: number;
  favorites: number;
  shares: number;
  createdAt: string;
  expiresAt: string;
  openingHours?: string;
  aiContent?: AIGeneratedContent;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  city: string;
  neighborhood: string;
  role: 'user' | 'admin';
  plan: 'gratis' | 'basico' | 'profissional' | 'destaque' | 'premium';
  planExpiresAt?: string;
  referralCode: string;
  referredBy?: string;
  referralCredits: number;
  referralCount: number;
  createdAt: string;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  logo: string;
  coverImage: string;
  category: CategoryId;
  description: string;
  phone: string;
  whatsapp: string;
  instagram?: string;
  website?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  openingHours: string;
}

export interface Plan {
  id: 'gratis' | 'basico' | 'profissional' | 'destaque' | 'premium';
  name: string;
  price: number;
  priceFormatted: string;
  period: string;
  description: string;
  adsLimit: string;
  features: string[];
  isPopular?: boolean;
  badge?: string;
  accentColor: string;
}

export interface BoostOption {
  id: string;
  title: string;
  price: number;
  priceFormatted: string;
  durationDays: number;
  description: string;
  benefits: string[];
  badge: string;
  icon: string;
  popular?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'view' | 'click' | 'lead' | 'favorite' | 'system' | 'referral' | 'boost';
  read: boolean;
  createdAt: string;
  linkTab?: string;
  adId?: string;
}

export interface ReportItem {
  id: string;
  adId: string;
  adTitle: string;
  businessName: string;
  reporterName: string;
  reporterEmail: string;
  reason:
    | 'fraude'
    | 'conteudo_improprio'
    | 'informacao_falsa'
    | 'informacoes_falsas'
    | 'preco_incorreto'
    | 'empresa_inexistente'
    | 'enganoso'
    | 'spam'
    | 'inadequado'
    | 'falso'
    | 'outro';
  reasonLabel: string;
  details: string;
  status: 'pendente' | 'resolvido' | 'descartado';
  createdAt: string;
}

export interface InAppLeadMessage {
  id: string;
  adId: string;
  adTitle: string;
  businessId: string;
  senderName: string;
  senderPhone: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  replied?: boolean;
}

export type ArtFormat = '1:1' | '4:5' | '9:16' | '16:9';

export interface ArtTemplateConfig {
  format: ArtFormat;
  themeStyle: 'purple_vibrant' | 'gold_luxury' | 'neon_night' | 'minimal_clean' | 'red_promo' | 'emerald_fresh';
  backgroundImage: string;
  logoText: string;
  badgeText: string;
  mainTitle: string;
  priceTag: string;
  oldPriceTag?: string;
  subTitle: string;
  ctaText: string;
  phoneText: string;
  locationText: string;
}

export type NavigationTab =
  | 'home'
  | 'radar'
  | 'ai-creator'
  | 'art-generator'
  | 'my-ads'
  | 'stats'
  | 'plans'
  | 'messages'
  | 'profile'
  | 'business'
  | 'favorites'
  | 'referral'
  | 'admin';
