import { AIGeneratedContent } from '../types';

export interface GenerateAdParams {
  description: string;
  businessName?: string;
  category?: string;
  city?: string;
  price?: string;
  promoType?: string;
  tone?: string;
}

export interface CepResult {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

export async function generateAdWithAI(params: GenerateAdParams): Promise<AIGeneratedContent> {
  try {
    const response = await fetch('/api/gemini/generate-ad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao gerar anúncio com IA.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API error, using local fallback generator:', error);
    return getLocalAdFallback(params);
  }
}

export async function enhanceTextWithAI(text: string, goal: string = 'vender mais'): Promise<string> {
  try {
    const response = await fetch('/api/gemini/enhance-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, goal }),
    });

    if (!response.ok) {
      throw new Error('Falha ao melhorar texto.');
    }

    const data = await response.json();
    return data.enhancedText || text;
  } catch (error) {
    return `🔥 ${text} ✨ Aproveite hoje mesmo!`;
  }
}

export async function fetchAddressByCep(cep: string): Promise<CepResult | null> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    // Try server-side proxy first
    const response = await fetch(`/api/cep/${cleanCep}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Server CEP proxy failed, trying direct ViaCEP fallback...', e);
  }

  // Fallback direct call to ViaCEP if proxy is unavailable
  try {
    const directRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (directRes.ok) {
      const data = await directRes.json();
      if (!data.erro) {
        return {
          cep: data.cep,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
          complement: data.complemento || '',
        };
      }
    }
  } catch (e) {
    console.error('Direct ViaCEP error:', e);
  }

  return null;
}

function getLocalAdFallback(params: GenerateAdParams): AIGeneratedContent {
  const {
    description,
    businessName = 'Nosso Negócio',
    category = 'Geral',
    city = 'São Paulo',
    price = '',
    promoType = 'Promoção',
  } = params;

  const cleanPrice = price ? ` por apenas ${price}` : '';

  return {
    title: `${promoType.toUpperCase()}: ${description.slice(0, 40)}${description.length > 40 ? '...' : ''}`,
    adText: `Atenção moradores de ${city}! ${businessName} preparou uma oferta imperdível: ${description}${cleanPrice}. Qualidade, rapidez e atendimento de primeira!`,
    instagramCaption: `🔥 ATENÇÃO ${city.toUpperCase()}!\n\n✨ Olha essa super novidade no ${businessName}:\n👉 ${description}${cleanPrice}!\n\nNão deixe para depois! Garanta agora mesmo enquanto durarem as vagas/estoque.\n\n📲 Chame no link da bio ou envie uma mensagem no WhatsApp!\n\n#${category.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')} #Divulgador #OfertaLocal #CompreNoBairro`,
    reelsScript: `🎬 [GANCHO - 0 a 3s]: Você de ${city}, para tudo e olha essa novidade incrível do ${businessName}!\n\n📦 [CONTEÚDO - 4 a 15s]: Se você estava procurando por ${description}, essa é a sua chance${cleanPrice}.\n\n🚀 [CTA - 16 a 20s]: Já clica no link do perfil ou manda uma mensagem agora mesmo no WhatsApp para aproveitar!`,
    whatsappMessage: `👋 Olá! Passando para te avisar da nossa *super oportunidade* no *${businessName}*:\n\n🔥 *${description}*${cleanPrice ? `\n💰 *Valor especial:* ${cleanPrice}` : ''}\n\n📍 Atendendo em *${city}* e região.\n\nFicou interessado(a)? Responda aqui para garantir!`,
    hashtags: [
      `#${category.replace(/\s+/g, '')}`,
      `#${city.replace(/\s+/g, '')}`,
      '#Divulgador',
      '#Promoção',
      '#ComércioLocal',
      '#OfertaDoDia',
      '#DescontoEspecial',
    ],
    callToAction: 'Peça agora pelo WhatsApp!',
    badgeText: promoType.toUpperCase(),
    headlineSlogan: 'SABOR & QUALIDADE QUE CABEM NO SEU BOLSO!',
  };
}
