import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI with recommended server-side configuration
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    hasMercadoPagoToken: Boolean(process.env.MP_ACCESS_TOKEN),
    timestamp: new Date().toISOString(),
  });
});

// Memory store for Mercado Pago payment sessions and status
interface PaymentRecord {
  id: string;
  adId: string;
  boostOptionId: string;
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | string;
  initPoint?: string;
  createdAt: string;
  approvedAt?: string;
  activated: boolean;
}

const paymentsStore = new Map<string, PaymentRecord>();

// Mercado Pago: Criar Preferência de Pagamento (Checkout Pro)
app.post('/api/pagamento/criar-preferencia', async (req: Request, res: Response) => {
  try {
    const { adId, boostOptionId, price, title, adTitle } = req.body;

    if (!adId || !boostOptionId || typeof price !== 'number') {
      return res.status(400).json({ error: 'Dados incompletos para criar preferência de pagamento.' });
    }

    const mpToken = process.env.MP_ACCESS_TOKEN;
    if (!mpToken) {
      return res.status(500).json({
        error: 'MP_ACCESS_TOKEN não configurado no ambiente. Configure nas variáveis/segredos do projeto.',
      });
    }

    // Determine return base URL
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    const preferenceData = {
      items: [
        {
          id: String(boostOptionId),
          title: `Destaque: ${adTitle || 'Divulgação'} - Pacote ${title || 'Impulsionamento'}`,
          description: `Impulsionamento de anúncio no Divulgador - Anúncio ID: ${adId}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(price),
        },
      ],
      back_urls: {
        success: `${baseUrl}/?payment_status=approved&adId=${encodeURIComponent(adId)}&boostId=${encodeURIComponent(boostOptionId)}`,
        pending: `${baseUrl}/?payment_status=pending&adId=${encodeURIComponent(adId)}&boostId=${encodeURIComponent(boostOptionId)}`,
        failure: `${baseUrl}/?payment_status=failure&adId=${encodeURIComponent(adId)}&boostId=${encodeURIComponent(boostOptionId)}`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/pagamento/webhook`,
      external_reference: JSON.stringify({
        adId,
        boostOptionId,
        price,
        createdAt: new Date().toISOString(),
      }),
      statement_descriptor: 'DIVULGADOR',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpResponse.ok) {
      const errData = await mpResponse.json().catch(() => ({}));
      console.error('Mercado Pago preference error:', errData);
      return res.status(mpResponse.status).json({
        error: errData.message || 'Falha ao gerar preferência no Mercado Pago.',
        details: errData,
      });
    }

    const data = await mpResponse.json();

    // Store preference in memory
    paymentsStore.set(data.id, {
      id: data.id,
      adId,
      boostOptionId,
      price,
      status: 'pending',
      initPoint: data.init_point || data.sandbox_init_point,
      createdAt: new Date().toISOString(),
      activated: false,
    });

    res.json({
      success: true,
      preferenceId: data.id,
      init_point: data.init_point || data.sandbox_init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (error: any) {
    console.error('Error creating Mercado Pago preference:', error);
    res.status(500).json({ error: error.message || 'Erro interno ao processar pagamento.' });
  }
});

// Mercado Pago: Webhook para receber notificações de pagamento
app.post('/api/pagamento/webhook', async (req: Request, res: Response) => {
  try {
    const mpToken = process.env.MP_ACCESS_TOKEN;
    const body = req.body || {};
    const query = req.query || {};

    const type = body.type || body.topic || query.type || query.topic;
    const paymentId = body.data?.id || body.id || query['data.id'] || query.id;

    console.log(`[MercadoPago Webhook] Received notification: type=${type}, id=${paymentId}`);

    if (mpToken && paymentId && (type === 'payment' || !type)) {
      // Query Mercado Pago API for payment details
      const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${mpToken}`,
        },
      });

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        console.log(`[MercadoPago Webhook] Payment ${paymentId} status: ${paymentData.status}`);

        let externalRef: any = null;
        try {
          if (paymentData.external_reference) {
            externalRef = JSON.parse(paymentData.external_reference);
          }
        } catch {
          externalRef = { adId: paymentData.external_reference };
        }

        const adId = externalRef?.adId;
        const boostOptionId = externalRef?.boostOptionId || 'boost-01';

        if (adId) {
          const isApproved = paymentData.status === 'approved';
          const record: PaymentRecord = {
            id: String(paymentId),
            adId,
            boostOptionId,
            price: paymentData.transaction_amount || 0,
            status: isApproved ? 'approved' : paymentData.status,
            createdAt: paymentData.date_created || new Date().toISOString(),
            approvedAt: isApproved ? paymentData.date_approved || new Date().toISOString() : undefined,
            activated: false,
          };

          paymentsStore.set(String(paymentId), record);
          if (isApproved) {
            paymentsStore.set(`approved_ad_${adId}`, record);
          }
        }
      }
    }

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).send('OK');
  } catch (error) {
    console.error('[MercadoPago Webhook] Error processing webhook:', error);
    res.status(200).send('OK');
  }
});

// Mercado Pago: Consultar status de pagamento de um anúncio
app.get('/api/pagamento/status/:adId', async (req: Request, res: Response) => {
  try {
    const { adId } = req.params;
    const paymentId = req.query.payment_id as string | undefined;
    const mpToken = process.env.MP_ACCESS_TOKEN;

    // If payment_id is provided, verify directly with Mercado Pago API
    if (paymentId && mpToken) {
      try {
        const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          if (paymentData.status === 'approved') {
            let ref: any = {};
            try {
              ref = JSON.parse(paymentData.external_reference || '{}');
            } catch {
              ref = {};
            }
            const boostOptionId = ref.boostOptionId || (req.query.boostId as string) || 'boost-01';
            const record: PaymentRecord = {
              id: String(paymentId),
              adId: ref.adId || adId,
              boostOptionId,
              price: paymentData.transaction_amount || 0,
              status: 'approved',
              approvedAt: paymentData.date_approved || new Date().toISOString(),
              createdAt: paymentData.date_created || new Date().toISOString(),
              activated: false,
            };
            paymentsStore.set(String(paymentId), record);
            paymentsStore.set(`approved_ad_${adId}`, record);

            return res.json({
              approved: true,
              payment: record,
              boostOptionId,
            });
          }
        }
      } catch (e) {
        console.error('Error verifying payment_id directly:', e);
      }
    }

    // Check in-memory store
    const stored = paymentsStore.get(`approved_ad_${adId}`);
    if (stored && stored.status === 'approved' && !stored.activated) {
      return res.json({
        approved: true,
        payment: stored,
        boostOptionId: stored.boostOptionId,
      });
    }

    res.json({
      approved: false,
      status: stored?.status || 'pending',
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar status do pagamento.' });
  }
});

// Consumir ativação (após boostAd ser chamado no frontend)
app.post('/api/pagamento/consumir-ativacao', (req: Request, res: Response) => {
  const { adId, paymentId } = req.body;
  if (adId) {
    const stored = paymentsStore.get(`approved_ad_${adId}`);
    if (stored) {
      stored.activated = true;
    }
  }
  if (paymentId) {
    const stored = paymentsStore.get(String(paymentId));
    if (stored) {
      stored.activated = true;
    }
  }
  res.json({ success: true });
});

// Memory store for Mercado Pago recurring subscriptions (Preapproval)
interface SubscriptionRecord {
  id: string; // preapproval_id or plan subscription id
  userId: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  status: 'pending' | 'authorized' | 'paused' | 'cancelled' | 'rejected' | string;
  initPoint?: string;
  createdAt: string;
  approvedAt?: string;
  activated: boolean;
  payerEmail?: string;
}

const subscriptionsStore = new Map<string, SubscriptionRecord>();

// Mercado Pago: Criar Assinatura Recorrente (Preapproval / Subscriptions)
app.post('/api/assinatura/criar', async (req: Request, res: Response) => {
  try {
    const { userId = 'usr-alex-01', userEmail = 'usuario@divulgador.com', planId, billingCycle = 'monthly', price, planName } = req.body;

    if (!planId || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Dados do plano e preço são obrigatórios para criar assinatura.' });
    }

    const mpToken = process.env.MP_ACCESS_TOKEN;
    if (!mpToken) {
      return res.status(500).json({
        error: 'MP_ACCESS_TOKEN não configurado no ambiente. Configure nas variáveis/segredos do projeto.',
      });
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    const isYearly = billingCycle === 'yearly';
    const frequency = isYearly ? 12 : 1;
    const frequencyType = 'months';
    const transactionAmount = Number(price);

    // Prepare Preapproval Subscription payload
    const preapprovalData = {
      reason: `Assinatura ${planName || 'Plano'} (${isYearly ? 'Anual' : 'Mensal'}) - DIVULGADOR`,
      auto_recurring: {
        frequency,
        frequency_type: frequencyType,
        transaction_amount: transactionAmount,
        currency_id: 'BRL',
      },
      back_url: `${baseUrl}/?subscription_status=approved&planId=${encodeURIComponent(planId)}&userId=${encodeURIComponent(userId)}&billingCycle=${encodeURIComponent(billingCycle)}`,
      payer_email: userEmail && userEmail.includes('@') ? userEmail : 'cliente@divulgador.com.br',
      external_reference: JSON.stringify({
        userId,
        planId,
        billingCycle,
        price: transactionAmount,
        createdAt: new Date().toISOString(),
      }),
      status: 'pending',
    };

    let mpResponse = await fetch('https://api.mercadopago.com/preapproval_plan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preapprovalData),
    });

    let data: any = null;

    if (mpResponse.ok) {
      data = await mpResponse.json();
    } else {
      // Try standard /preapproval endpoint (direct subscription request)
      const directPreapprovalData = {
        reason: `Assinatura ${planName || 'Plano'} (${isYearly ? 'Anual' : 'Mensal'}) - DIVULGADOR`,
        auto_recurring: {
          frequency,
          frequency_type: frequencyType,
          transaction_amount: transactionAmount,
          currency_id: 'BRL',
        },
        back_url: `${baseUrl}/?subscription_status=approved&planId=${encodeURIComponent(planId)}&userId=${encodeURIComponent(userId)}&billingCycle=${encodeURIComponent(billingCycle)}`,
        payer_email: userEmail && userEmail.includes('@') ? userEmail : 'cliente@divulgador.com.br',
        external_reference: JSON.stringify({
          userId,
          planId,
          billingCycle,
          price: transactionAmount,
          createdAt: new Date().toISOString(),
        }),
      };

      const fallbackMpRes = await fetch('https://api.mercadopago.com/preapproval', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mpToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(directPreapprovalData),
      });

      if (fallbackMpRes.ok) {
        data = await fallbackMpRes.json();
      } else {
        // If preapproval requires specific seller setup, create a recurring checkout preference with subscription item
        const preferenceData = {
          items: [
            {
              id: `plan-${planId}`,
              title: `Assinatura ${planName || 'Plano'} (${isYearly ? 'Anual' : 'Mensal'}) - DIVULGADOR`,
              description: `Acesso completo ao plano ${planName} na plataforma DIVULGADOR`,
              quantity: 1,
              currency_id: 'BRL',
              unit_price: transactionAmount,
            },
          ],
          back_urls: {
            success: `${baseUrl}/?subscription_status=approved&planId=${encodeURIComponent(planId)}&userId=${encodeURIComponent(userId)}&billingCycle=${encodeURIComponent(billingCycle)}`,
            pending: `${baseUrl}/?subscription_status=pending&planId=${encodeURIComponent(planId)}&userId=${encodeURIComponent(userId)}&billingCycle=${encodeURIComponent(billingCycle)}`,
            failure: `${baseUrl}/?subscription_status=failure&planId=${encodeURIComponent(planId)}&userId=${encodeURIComponent(userId)}&billingCycle=${encodeURIComponent(billingCycle)}`,
          },
          auto_return: 'approved',
          notification_url: `${baseUrl}/api/assinatura/webhook`,
          external_reference: JSON.stringify({
            userId,
            planId,
            billingCycle,
            price: transactionAmount,
            type: 'subscription',
            createdAt: new Date().toISOString(),
          }),
          statement_descriptor: 'DIVULGADOR',
        };

        const checkoutRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mpToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferenceData),
        });

        if (!checkoutRes.ok) {
          const errData = await checkoutRes.json().catch(() => ({}));
          console.error('Mercado Pago subscription preference error:', errData);
          return res.status(checkoutRes.status).json({
            error: errData.message || 'Falha ao criar link de assinatura no Mercado Pago.',
            details: errData,
          });
        }

        data = await checkoutRes.json();
      }
    }

    const initPoint = data.init_point || data.sandbox_init_point || data.point_init;
    const subscriptionId = data.id || `sub-${Date.now()}`;

    const subRecord: SubscriptionRecord = {
      id: subscriptionId,
      userId,
      planId,
      billingCycle,
      price: transactionAmount,
      status: 'pending',
      initPoint,
      createdAt: new Date().toISOString(),
      activated: false,
      payerEmail: userEmail,
    };

    subscriptionsStore.set(subscriptionId, subRecord);
    subscriptionsStore.set(`user_sub_${userId}`, subRecord);

    res.json({
      success: true,
      subscriptionId,
      init_point: initPoint,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (error: any) {
    console.error('Error creating Mercado Pago subscription:', error);
    res.status(500).json({ error: error.message || 'Erro interno ao gerar assinatura.' });
  }
});

// Mercado Pago: Webhook para Assinaturas (Preapproval & Payments)
app.post('/api/assinatura/webhook', async (req: Request, res: Response) => {
  try {
    const mpToken = process.env.MP_ACCESS_TOKEN;
    const body = req.body || {};
    const query = req.query || {};

    const type = body.type || body.topic || query.type || query.topic;
    const id = body.data?.id || body.id || query['data.id'] || query.id;

    console.log(`[MercadoPago Subscription Webhook] type=${type}, id=${id}`);

    if (mpToken && id) {
      if (type === 'subscription_preapproval' || type === 'preapproval') {
        // Fetch preapproval status
        const subRes = await fetch(`https://api.mercadopago.com/preapproval/${id}`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });

        if (subRes.ok) {
          const subData = await subRes.json();
          console.log(`[MercadoPago Subscription Webhook] Subscription ${id} status: ${subData.status}`);

          let ref: any = {};
          try {
            ref = JSON.parse(subData.external_reference || '{}');
          } catch {
            ref = {};
          }

          const userId = ref.userId || 'usr-alex-01';
          const planId = ref.planId || 'profissional';
          const isAuthorized = subData.status === 'authorized' || subData.status === 'approved';

          const record: SubscriptionRecord = {
            id: String(id),
            userId,
            planId,
            billingCycle: ref.billingCycle || 'monthly',
            price: subData.auto_recurring?.transaction_amount || 0,
            status: isAuthorized ? 'authorized' : subData.status,
            createdAt: subData.date_created || new Date().toISOString(),
            approvedAt: isAuthorized ? new Date().toISOString() : undefined,
            activated: false,
            payerEmail: subData.payer_email,
          };

          subscriptionsStore.set(String(id), record);
          if (isAuthorized) {
            subscriptionsStore.set(`approved_user_sub_${userId}`, record);
          } else if (subData.status === 'cancelled') {
            subscriptionsStore.delete(`approved_user_sub_${userId}`);
          }
        }
      } else if (type === 'payment' || !type) {
        // Check payment for subscription item
        const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });

        if (payRes.ok) {
          const payData = await payRes.json();
          let ref: any = {};
          try {
            ref = JSON.parse(payData.external_reference || '{}');
          } catch {
            ref = {};
          }

          if (ref.userId && ref.planId) {
            const isApproved = payData.status === 'approved';
            const record: SubscriptionRecord = {
              id: String(id),
              userId: ref.userId,
              planId: ref.planId,
              billingCycle: ref.billingCycle || 'monthly',
              price: payData.transaction_amount || 0,
              status: isApproved ? 'authorized' : payData.status,
              createdAt: payData.date_created || new Date().toISOString(),
              approvedAt: isApproved ? payData.date_approved || new Date().toISOString() : undefined,
              activated: false,
              payerEmail: payData.payer?.email,
            };

            subscriptionsStore.set(String(id), record);
            if (isApproved) {
              subscriptionsStore.set(`approved_user_sub_${ref.userId}`, record);
            }
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('[MercadoPago Subscription Webhook] Error:', error);
    res.status(200).send('OK');
  }
});

// Mercado Pago: Consultar status de assinatura do usuário
app.get('/api/assinatura/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const paymentId = req.query.payment_id as string | undefined;
    const preapprovalId = req.query.preapproval_id as string | undefined;
    const mpToken = process.env.MP_ACCESS_TOKEN;

    // Check payment_id or preapproval_id directly with Mercado Pago API if provided
    if (mpToken && (paymentId || preapprovalId)) {
      try {
        if (preapprovalId) {
          const resPre = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
            headers: { Authorization: `Bearer ${mpToken}` },
          });
          if (resPre.ok) {
            const dataPre = await resPre.json();
            if (dataPre.status === 'authorized' || dataPre.status === 'approved') {
              let ref: any = {};
              try {
                ref = JSON.parse(dataPre.external_reference || '{}');
              } catch {
                ref = {};
              }
              const planId = ref.planId || req.query.planId || 'profissional';
              const record: SubscriptionRecord = {
                id: preapprovalId,
                userId: ref.userId || userId,
                planId: String(planId),
                billingCycle: ref.billingCycle || (req.query.billingCycle as any) || 'monthly',
                price: dataPre.auto_recurring?.transaction_amount || 0,
                status: 'authorized',
                approvedAt: new Date().toISOString(),
                createdAt: dataPre.date_created || new Date().toISOString(),
                activated: false,
              };
              subscriptionsStore.set(preapprovalId, record);
              subscriptionsStore.set(`approved_user_sub_${userId}`, record);
              return res.json({
                active: true,
                planId: record.planId,
                subscription: record,
              });
            }
          }
        }

        if (paymentId) {
          const resPay = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${mpToken}` },
          });
          if (resPay.ok) {
            const dataPay = await resPay.json();
            if (dataPay.status === 'approved') {
              let ref: any = {};
              try {
                ref = JSON.parse(dataPay.external_reference || '{}');
              } catch {
                ref = {};
              }
              const planId = ref.planId || req.query.planId || 'profissional';
              const record: SubscriptionRecord = {
                id: paymentId,
                userId: ref.userId || userId,
                planId: String(planId),
                billingCycle: ref.billingCycle || (req.query.billingCycle as any) || 'monthly',
                price: dataPay.transaction_amount || 0,
                status: 'authorized',
                approvedAt: dataPay.date_approved || new Date().toISOString(),
                createdAt: dataPay.date_created || new Date().toISOString(),
                activated: false,
              };
              subscriptionsStore.set(paymentId, record);
              subscriptionsStore.set(`approved_user_sub_${userId}`, record);
              return res.json({
                active: true,
                planId: record.planId,
                subscription: record,
              });
            }
          }
        }
      } catch (e) {
        console.error('Error verifying subscription ID directly:', e);
      }
    }

    // Check in-memory store
    const stored = subscriptionsStore.get(`approved_user_sub_${userId}`);
    if (stored && (stored.status === 'authorized' || stored.status === 'approved') && !stored.activated) {
      return res.json({
        active: true,
        planId: stored.planId,
        subscription: stored,
      });
    }

    res.json({
      active: false,
      status: stored?.status || 'none',
      planId: stored?.planId || null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar assinatura.' });
  }
});

// Consumir ativação de assinatura
app.post('/api/assinatura/consumir-ativacao', (req: Request, res: Response) => {
  const { userId, subscriptionId } = req.body;
  if (userId) {
    const stored = subscriptionsStore.get(`approved_user_sub_${userId}`);
    if (stored) {
      stored.activated = true;
    }
  }
  if (subscriptionId) {
    const stored = subscriptionsStore.get(String(subscriptionId));
    if (stored) {
      stored.activated = true;
    }
  }
  res.json({ success: true });
});

// ViaCEP Proxy endpoint for Brazilian postal code lookup
app.get('/api/cep/:cep', async (req: Request, res: Response) => {
  try {
    const rawCep = req.params.cep.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      return res.status(400).json({ error: 'CEP deve conter 8 dígitos numéricos.' });
    }

    const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
    if (!response.ok) {
      return res.status(502).json({ error: 'Falha ao consultar serviço de CEP.' });
    }

    const data = await response.json();
    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado.' });
    }

    res.json({
      cep: data.cep,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      complement: data.complemento || '',
    });
  } catch (error) {
    console.error('Error fetching CEP:', error);
    res.status(500).json({ error: 'Erro interno ao consultar CEP.' });
  }
});

// AI Ad Generation endpoint using Gemini 3.7 Flash
app.post('/api/gemini/generate-ad', async (req: Request, res: Response) => {
  try {
    const {
      description,
      businessName = 'Meu Negócio',
      category = 'Comércio / Serviço',
      city = 'Minha Cidade',
      price = '',
      promoType = 'Promoção',
      tone = 'Persuasivo e Atraente',
    } = req.body;

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Descrição da divulgação é obrigatória.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // High-quality deterministic fallback when API key is not configured
      return res.json(generateFallbackAd({
        description,
        businessName,
        category,
        city,
        price,
        promoType,
      }));
    }

    const prompt = `
Você é o motor de IA do DIVULGADOR, uma plataforma profissional de marketing e divulgação local para pequenas empresas, lojas e profissionais autônomos.
Crie um pacote completo de divulgação publicitária com base ESTRITAMENTE nas informações fornecidas pelo usuário:

- Nome do Negócio: "${businessName}"
- Categoria: "${category}"
- Cidade/Localização: "${city}"
- Preço/Condição: "${price || 'Consulte condições'}"
- Tipo de Oferta: "${promoType}"
- Tom de voz: "${tone}"
- Descrição da Oferta/Serviço: "${description.trim()}"

DIRETRIZES FUNDAMENTAIS:
1. Respeite rigorosamente os fatos fornecidos. NÃO invente preços, prazos ou promoções não citadas.
2. Seja extremamente atraente, moderno, vendedor e focado em converter moradores e clientes próximos.
3. Gere os campos no formato JSON estruturado.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um especialista sênior em copywriting de alta conversão para comércio e serviços locais no Brasil. Responda em português brasileiro.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Título curto e chamativo para o anúncio' },
            adText: { type: Type.STRING, description: 'Texto persuasivo principal do anúncio' },
            instagramCaption: { type: Type.STRING, description: 'Legenda completa pronta para publicação no Instagram com emojis e CTA' },
            reelsScript: { type: Type.STRING, description: 'Roteiro curto de 15-30s para Reels/TikTok dividido em Gancho, Desenvolvimento e Chamada para Ação' },
            whatsappMessage: { type: Type.STRING, description: 'Mensagem pronta para WhatsApp com formatação (*negrito*) e apelo imediato' },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de 6 a 10 hashtags relevantes para o negócio e a região',
            },
            callToAction: { type: Type.STRING, description: 'Frase curta e impactante de chamada para ação (ex: Peça agora pelo WhatsApp!)' },
            badgeText: { type: Type.STRING, description: 'Selo promocional sugerido (ex: 20% OFF, OFERTA HOJE, EXCLUSIVO)' },
            headlineSlogan: { type: Type.STRING, description: 'Frase de impacto curta para a arte gráfica' },
          },
          required: ['title', 'adText', 'instagramCaption', 'reelsScript', 'whatsappMessage', 'hashtags', 'callToAction', 'badgeText', 'headlineSlogan'],
        },
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Sem resposta da IA.');
    }

    const parsed = JSON.parse(outputText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    // Fallback gracefully on any API error
    const { description, businessName, category, city, price, promoType } = req.body;
    res.json(generateFallbackAd({
      description: description || 'Oferta especial',
      businessName: businessName || 'Nosso Negócio',
      category: category || 'Geral',
      city: city || 'Local',
      price: price || '',
      promoType: promoType || 'Promoção',
    }));
  }
});

// AI Polish / Text Enhancement endpoint
app.post('/api/gemini/enhance-text', async (req: Request, res: Response) => {
  try {
    const { text, goal = 'vender mais' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Texto é obrigatório.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ enhancedText: `🔥 ${text} ✨ Aproveite hoje mesmo!` });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Melhore este texto promocional com foco em "${goal}". Mantenha curto, persuasivo e sem inventar dados:\n\n"${text}"`,
    });

    res.json({ enhancedText: response.text?.trim() || text });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao melhorar texto com IA.' });
  }
});

// Robust fallback generator
function generateFallbackAd(data: {
  description: string;
  businessName: string;
  category: string;
  city: string;
  price: string;
  promoType: string;
}) {
  const { description, businessName, category, city, price, promoType } = data;
  const cleanPrice = price ? ` por apenas ${price}` : '';

  return {
    title: `${promoType.toUpperCase()}: ${description.slice(0, 45)}${description.length > 45 ? '...' : ''}`,
    adText: `Atenção ${city}! ${businessName} traz para você uma oportunidade imperdível: ${description}${cleanPrice}. Qualidade garantida e atendimento especializado para você!`,
    instagramCaption: `🔥 ATENÇÃO ${city.toUpperCase()}!\n\n✨ Olha essa super novidade no ${businessName}:\n👉 ${description}${cleanPrice}!\n\nNão deixe para depois! Garanta agora mesmo enquanto durarem as vagas/estoque.\n\n📲 Chame no link da bio ou envie uma mensagem no WhatsApp!\n\n#${category.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')} #Divulgador #OfertaLocal #CompreNoBairro`,
    reelsScript: `🎬 [GANCHO - 0 a 3s]: Você de ${city}, para tudo e olha essa novidade incrível do ${businessName}!\n\n📦 [CONTEÚDO - 4 a 15s]: Se você estava procurando por ${description}, essa é a sua chance${cleanPrice}.\n\n🚀 [CTA - 16 a 20s]: Já clica no link do perfil ou manda uma mensagem agora mesmo no WhatsApp para aproveitar!`,
    whatsappMessage: `👋 Olá! Passando para te avisar da nossa *super oportunidade* no *${businessName}*:\n\n🔥 *${description}*${cleanPrice ? `\n💰 *Valor especial:* ${cleanPrice}` : ''}\n\n📍 Atendendo em *${city}* e região.\n\nFicou interessado(a)? Responda aqui para garantir!`,
    hashtags: [
      `#${category.replace(/\s+/g, '')}`,
      `#${city.replace(/\s+/g, '')}`,
      '#Divulgador',
      '#Promoção',
      '#ComércioLocal',
      '#Negócios',
      '#OfertaDoDia',
      '#Qualidade',
    ],
    callToAction: 'Peça agora pelo WhatsApp!',
    badgeText: promoType.toUpperCase(),
    headlineSlogan: 'SABOR & QUALIDADE QUE CABEM NO SEU BOLSO!',
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DIVULGADOR server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
