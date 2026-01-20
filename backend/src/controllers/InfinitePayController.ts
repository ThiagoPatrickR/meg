import { Request, Response } from 'express';
import { Gift } from '../models';
import InfinitePayService from '../services/InfinitePayService';

/**
 * Creates a checkout link for a gift and returns it
 */
export const createCheckout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { giftId } = req.body;

        if (!giftId) {
            res.status(400).json({ error: 'ID do presente é obrigatório' });
            return;
        }

        // Find the gift
        const gift = await Gift.findByPk(giftId);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        if (gift.purchased) {
            res.status(400).json({ error: 'Este presente já foi comprado' });
            return;
        }

        // Generate unique order NSU
        const orderNsu = `gift-${gift.id}-${Date.now()}`;

        // Get base URL from environment or request
        const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;

        // Configure URLs
        const redirectUrl = `${baseUrl}?pagamento=sucesso&gift=${gift.id}`;

        // API_URL já inclui /api, então não precisamos adicionar novamente
        const apiBaseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}/api`;
        const webhookUrl = `${apiBaseUrl}/infinitepay/webhook`;

        // Convert price to cents (InfinitePay expects price in cents)
        const priceInCents = Math.round(Number(gift.price) * 100);

        // Create checkout link
        const checkoutUrl = await InfinitePayService.createCheckoutLink({
            items: [
                {
                    description: gift.title,
                    price: priceInCents,
                    quantity: 1,
                },
            ],
            orderNsu,
            redirectUrl,
            webhookUrl,
        });

        res.json({
            checkoutUrl,
            orderNsu,
            gift: {
                id: gift.id,
                title: gift.title,
                price: gift.price,
            },
        });
    } catch (error) {
        console.error('Erro ao criar checkout InfinitePay:', error);
        res.status(500).json({
            error: 'Erro ao gerar link de pagamento',
            details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

/**
 * Webhook handler for InfinitePay payment notifications
 */
export const webhook = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('[InfinitePay Webhook] Received:', JSON.stringify(req.body, null, 2));

        const payload = InfinitePayService.parseWebhookPayload(req.body);

        if (!payload) {
            console.error('[InfinitePay Webhook] Invalid payload');
            res.status(400).json({ error: 'Invalid payload' });
            return;
        }

        // Extract gift ID from order_nsu
        const giftId = InfinitePayService.extractGiftIdFromOrderNsu(payload.order_nsu);

        if (!giftId) {
            console.error('[InfinitePay Webhook] Could not extract gift ID from order_nsu:', payload.order_nsu);
            res.status(400).json({ error: 'Invalid order_nsu format' });
            return;
        }

        // Find and update the gift
        const gift = await Gift.findByPk(giftId);

        if (!gift) {
            console.error('[InfinitePay Webhook] Gift not found:', giftId);
            res.status(404).json({ error: 'Gift not found' });
            return;
        }

        if (gift.purchased) {
            console.log('[InfinitePay Webhook] Gift already purchased:', giftId);
            res.status(200).json({ message: 'Gift already marked as purchased' });
            return;
        }

        // Mark as purchased
        await gift.update({
            purchased: true,
            purchasedBy: 'Pagamento via InfinitePay',
            purchasedByEmail: null,
            purchasedAt: new Date(),
            paymentMethod: payload.capture_method === 'pix' ? 'pix' : 'card',
        });

        console.log('[InfinitePay Webhook] Gift marked as purchased:', giftId);

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            giftId,
        });
    } catch (error) {
        console.error('[InfinitePay Webhook] Error:', error);
        // Return 200 to prevent InfinitePay from retrying, but log the error
        res.status(200).json({
            success: false,
            error: 'Error processing webhook',
        });
    }
};

/**
 * Verify payment status (called after redirect from InfinitePay)
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { giftId } = req.params;

        const gift = await Gift.findByPk(giftId);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        res.json({
            purchased: gift.purchased,
            purchasedAt: gift.purchasedAt,
            paymentMethod: gift.paymentMethod,
        });
    } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
        res.status(500).json({ error: 'Erro ao verificar status do pagamento' });
    }
};

export default {
    createCheckout,
    webhook,
    verifyPayment,
};
