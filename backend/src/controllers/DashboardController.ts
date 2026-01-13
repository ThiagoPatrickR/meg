import { Request, Response } from 'express';
import { Gift, GiftCategory, RSVP, Message, Payment } from '../models';

export const stats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalGifts = await Gift.count();
        const purchasedGifts = await Gift.count({ where: { purchased: true } });
        const availableGifts = await Gift.count({ where: { purchased: false } });

        const totalRSVPs = await RSVP.count();
        const confirmedRSVPs = await RSVP.count({ where: { confirmed: true } });
        const totalGuests = await RSVP.sum('guests') || 0;

        const totalMessages = await Message.count();
        const pendingMessages = await Message.count({ where: { approved: false } });
        const approvedMessages = await Message.count({ where: { approved: true } });

        const totalPayments = await Payment.count();
        const approvedPayments = await Payment.count({ where: { status: 'approved' } });
        const totalRevenue = await Payment.sum('amount', { where: { status: 'approved' } }) || 0;

        res.json({
            gifts: {
                total: totalGifts,
                purchased: purchasedGifts,
                available: availableGifts,
            },
            rsvps: {
                total: totalRSVPs,
                confirmed: confirmedRSVPs,
                totalGuests,
            },
            messages: {
                total: totalMessages,
                pending: pendingMessages,
                approved: approvedMessages,
            },
            payments: {
                total: totalPayments,
                approved: approvedPayments,
                totalRevenue: Number(totalRevenue),
            },
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    stats,
};
