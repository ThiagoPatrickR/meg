import { Request, Response } from 'express';
import { Gift, Payment } from '../models';
import MercadoPagoService from '../services/MercadoPagoService';

export const createPixPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { giftId, payerEmail, payerName } = req.body;

        if (!giftId || !payerEmail || !payerName) {
            res.status(400).json({ error: 'ID do presente, email e nome são obrigatórios' });
            return;
        }

        const gift = await Gift.findByPk(giftId);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        if (gift.purchased) {
            res.status(400).json({ error: 'Este presente já foi comprado' });
            return;
        }

        // Create payment in Mercado Pago
        const mpPayment = await MercadoPagoService.createPixPayment({
            amount: Number(gift.price),
            description: `Presente de casamento: ${gift.title}`,
            payerEmail,
            payerName,
        });

        // Save payment record
        const payment = await Payment.create({
            giftId: gift.id,
            mpPaymentId: String(mpPayment.id),
            payerEmail,
            payerName,
            amount: Number(gift.price),
            status: 'pending',
            paymentMethod: 'pix',
            pixQrCode: mpPayment.qrCode || null,
            pixQrCodeBase64: mpPayment.qrCodeBase64 || null,
        });

        res.status(201).json({
            payment,
            pixCode: mpPayment.qrCode,
            pixQrCodeBase64: mpPayment.qrCodeBase64,
        });
    } catch (error) {
        console.error('Erro ao criar pagamento Pix:', error);
        res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
};

export const createCardPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { giftId, payerEmail, token, installments, paymentMethodId } = req.body;

        if (!giftId || !payerEmail || !token) {
            res.status(400).json({ error: 'Dados de pagamento incompletos' });
            return;
        }

        const gift = await Gift.findByPk(giftId);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        if (gift.purchased) {
            res.status(400).json({ error: 'Este presente já foi comprado' });
            return;
        }

        // Create payment in Mercado Pago
        const mpPayment = await MercadoPagoService.createCardPayment({
            amount: Number(gift.price),
            description: `Presente de casamento: ${gift.title}`,
            payerEmail,
            token,
            installments: installments || 1,
            paymentMethodId: paymentMethodId || 'visa',
        });

        // Determine status
        let status: 'pending' | 'approved' | 'rejected' = 'pending';
        if (mpPayment.status === 'approved') {
            status = 'approved';
            // Mark gift as purchased
            await gift.update({
                purchased: true,
                purchasedBy: payerEmail,
                purchasedByEmail: payerEmail,
                purchasedAt: new Date(),
                paymentMethod: 'card',
            });
        } else if (mpPayment.status === 'rejected') {
            status = 'rejected';
        }

        // Save payment record
        const payment = await Payment.create({
            giftId: gift.id,
            mpPaymentId: String(mpPayment.id),
            payerEmail,
            payerName: null,
            amount: Number(gift.price),
            status,
            paymentMethod: 'card',
        });

        res.status(201).json({
            payment,
            status: mpPayment.status,
            statusDetail: mpPayment.statusDetail,
        });
    } catch (error) {
        console.error('Erro ao criar pagamento com cartão:', error);
        res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
};

export const webhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;

            // Get payment status from Mercado Pago
            const mpStatus = await MercadoPagoService.getPaymentStatus(String(paymentId));

            // Find payment in database
            const payment = await Payment.findOne({
                where: { mpPaymentId: String(paymentId) },
            });

            if (payment) {
                let status: 'pending' | 'approved' | 'rejected' | 'cancelled' = 'pending';

                if (mpStatus.status === 'approved') {
                    status = 'approved';
                } else if (mpStatus.status === 'rejected') {
                    status = 'rejected';
                } else if (mpStatus.status === 'cancelled') {
                    status = 'cancelled';
                }

                await payment.update({ status });

                // If approved, mark gift as purchased
                if (status === 'approved') {
                    const gift = await Gift.findByPk(payment.giftId);
                    if (gift && !gift.purchased) {
                        await gift.update({
                            purchased: true,
                            purchasedBy: payment.payerName || payment.payerEmail || 'Via Pagamento',
                            purchasedByEmail: payment.payerEmail,
                            purchasedAt: new Date(),
                            paymentMethod: payment.paymentMethod,
                        });
                    }
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).json({ error: 'Erro ao processar webhook' });
    }
};

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const payments = await Payment.findAll({
            include: [
                {
                    model: Gift,
                    as: 'gift',
                    attributes: ['id', 'title', 'price'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(payments);
    } catch (error) {
        console.error('Erro ao listar pagamentos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const checkStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);

        if (!payment) {
            res.status(404).json({ error: 'Pagamento não encontrado' });
            return;
        }

        // If has MP payment ID, check status
        if (payment.mpPaymentId) {
            const mpStatus = await MercadoPagoService.getPaymentStatus(payment.mpPaymentId);

            let status: 'pending' | 'approved' | 'rejected' | 'cancelled' = payment.status;

            if (mpStatus.status === 'approved') {
                status = 'approved';
            } else if (mpStatus.status === 'rejected') {
                status = 'rejected';
            }

            if (status !== payment.status) {
                await payment.update({ status });

                // If approved, mark gift as purchased
                if (status === 'approved') {
                    const gift = await Gift.findByPk(payment.giftId);
                    if (gift && !gift.purchased) {
                        await gift.update({
                            purchased: true,
                            purchasedBy: payment.payerName || payment.payerEmail || 'Via Pagamento',
                            purchasedByEmail: payment.payerEmail,
                            purchasedAt: new Date(),
                            paymentMethod: payment.paymentMethod,
                        });
                    }
                }
            }
        }

        res.json(payment);
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    createPixPayment,
    createCardPayment,
    webhook,
    index,
    checkStatus,
};
