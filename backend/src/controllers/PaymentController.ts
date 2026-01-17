import { Request, Response } from 'express';
import { Gift, Payment } from '../models';

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

        // Generate a unique ID for the manual payment
        const manualPaymentId = `MANUAL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Save payment record
        const payment = await Payment.create({
            giftId: gift.id,
            mpPaymentId: manualPaymentId,
            payerEmail,
            payerName,
            amount: Number(gift.price),
            status: 'pending',
            paymentMethod: 'pix',
            pixQrCode: null,
            pixQrCodeBase64: null,
        });

        res.status(201).json({
            payment,
            pixCode: null,
            pixQrCodeBase64: null,
            message: 'Aguardando confirmação manual do pagamento via Pix.'
        });
    } catch (error) {
        console.error('Erro ao criar pagamento Pix:', error);
        res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
};

export const createCardPayment = async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({ error: 'Pagamento com cartão desabilitado temporariamente' });
};

export const webhook = async (req: Request, res: Response): Promise<void> => {
    // Webhook disabled as we are not using Mercado Pago
    console.log('Webhook received but ignored (Manual Payment Mode):', req.body);
    res.status(200).send('OK');
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

        // Return current status from DB (manual update required)
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
