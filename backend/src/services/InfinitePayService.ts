/**
 * InfinitePay Checkout Integration Service
 * 
 * API Documentation: https://www.infinitepay.io/checkout
 * 
 * This service handles communication with InfinitePay's public checkout API
 * to generate payment links for the gift list.
 */

interface CheckoutItem {
    description: string;
    price: number; // em centavos (R$ 100,00 = 10000)
    quantity: number;
}

interface CreateCheckoutParams {
    items: CheckoutItem[];
    orderNsu: string;
    redirectUrl: string;
    webhookUrl?: string;
}

interface CheckoutResponse {
    checkout_url: string;
}

interface WebhookPayload {
    invoice_slug: string;
    amount: number;
    paid_amount: number;
    installments: number;
    capture_method: 'credit_card' | 'pix';
    transaction_nsu: string;
    order_nsu: string;
    receipt_url: string;
    items: Array<{
        description: string;
        price: number;
        quantity: number;
    }>;
}

const INFINITEPAY_API_URL = 'https://api.infinitepay.io/invoices/public/checkout/links';

/**
 * Creates a checkout link for InfinitePay payment
 * 
 * @param params - Checkout parameters including items, order ID, and URLs
 * @returns The checkout URL to redirect the customer
 */
export async function createCheckoutLink(params: CreateCheckoutParams): Promise<string> {
    const handle = process.env.INFINITEPAY_HANDLE;

    if (!handle) {
        throw new Error('INFINITEPAY_HANDLE não configurada no ambiente');
    }

    const payload: any = {
        handle,
        items: params.items.map(item => ({
            description: item.description,
            price: item.price,
            quantity: item.quantity,
        })),
        order_nsu: params.orderNsu,
        redirect_url: params.redirectUrl,
    };

    // Webhook é opcional
    if (params.webhookUrl) {
        payload.webhook_url = params.webhookUrl;
    }

    console.log('[InfinitePay] Creating checkout link:', JSON.stringify(payload, null, 2));

    const response = await fetch(INFINITEPAY_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[InfinitePay] API Error:', response.status, errorText);
        throw new Error(`Erro na API InfinitePay: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as Record<string, any>;
    console.log('[InfinitePay] Full API response:', JSON.stringify(data, null, 2));

    // A API pode retornar o URL em diferentes campos
    const checkoutUrl = data.checkout_url || data.checkoutUrl || data.url || data.link || data.payment_url;
    console.log('[InfinitePay] Checkout link created:', checkoutUrl);

    if (!checkoutUrl) {
        console.error('[InfinitePay] No checkout URL found in response');
        throw new Error('Resposta da API InfinitePay não contém URL de checkout');
    }

    return checkoutUrl;
}

/**
 * Parses and validates the webhook payload from InfinitePay
 * 
 * @param body - The raw webhook body
 * @returns Parsed webhook payload or null if invalid
 */
export function parseWebhookPayload(body: any): WebhookPayload | null {
    try {
        // Validate required fields
        if (!body.order_nsu || body.amount === undefined) {
            console.error('[InfinitePay] Invalid webhook payload: missing required fields');
            return null;
        }

        return body as WebhookPayload;
    } catch (error) {
        console.error('[InfinitePay] Error parsing webhook:', error);
        return null;
    }
}

/**
 * Extracts gift ID from order_nsu
 * 
 * The order_nsu format is: gift-{giftId}-{timestamp}
 * 
 * @param orderNsu - The order NSU string
 * @returns The gift ID or null if invalid format
 */
export function extractGiftIdFromOrderNsu(orderNsu: string): number | null {
    try {
        // Format: gift-123-1705766400000
        const match = orderNsu.match(/^gift-(\d+)-\d+$/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
        return null;
    } catch {
        return null;
    }
}

export default {
    createCheckoutLink,
    parseWebhookPayload,
    extractGiftIdFromOrderNsu,
};
