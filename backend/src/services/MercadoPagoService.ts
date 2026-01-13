import { MercadoPagoConfig, Payment as MPPayment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

const payment = new MPPayment(client);

interface PixPaymentData {
    amount: number;
    description: string;
    payerEmail: string;
    payerName: string;
}

interface CardPaymentData {
    amount: number;
    description: string;
    payerEmail: string;
    token: string;
    installments: number;
    paymentMethodId: string;
}

export const createPixPayment = async (data: PixPaymentData) => {
    try {
        const response = await payment.create({
            body: {
                transaction_amount: data.amount,
                description: data.description,
                payment_method_id: 'pix',
                payer: {
                    email: data.payerEmail,
                    first_name: data.payerName.split(' ')[0],
                    last_name: data.payerName.split(' ').slice(1).join(' ') || '',
                },
            },
        });

        return {
            id: response.id,
            status: response.status,
            qrCode: response.point_of_interaction?.transaction_data?.qr_code,
            qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
            ticketUrl: response.point_of_interaction?.transaction_data?.ticket_url,
        };
    } catch (error) {
        console.error('Erro ao criar pagamento Pix:', error);
        throw error;
    }
};

export const createCardPayment = async (data: CardPaymentData) => {
    try {
        const response = await payment.create({
            body: {
                transaction_amount: data.amount,
                description: data.description,
                payment_method_id: data.paymentMethodId,
                token: data.token,
                installments: data.installments,
                payer: {
                    email: data.payerEmail,
                },
            },
        });

        return {
            id: response.id,
            status: response.status,
            statusDetail: response.status_detail,
        };
    } catch (error) {
        console.error('Erro ao criar pagamento com cartão:', error);
        throw error;
    }
};

export const getPaymentStatus = async (paymentId: string) => {
    try {
        const response = await payment.get({ id: paymentId });
        return {
            id: response.id,
            status: response.status,
            statusDetail: response.status_detail,
        };
    } catch (error) {
        console.error('Erro ao buscar status do pagamento:', error);
        throw error;
    }
};

export default {
    createPixPayment,
    createCardPayment,
    getPaymentStatus,
};
