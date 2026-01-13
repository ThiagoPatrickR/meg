import { Request, Response } from 'express';
import { RSVP } from '../models';

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const rsvps = await RSVP.findAll({
            order: [['createdAt', 'DESC']],
        });
        res.json(rsvps);
    } catch (error) {
        console.error('Erro ao listar confirmações:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const store = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, email, guests, message } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Nome é obrigatório' });
            return;
        }

        const rsvp = await RSVP.create({
            name,
            phone: phone || null,
            email: email || null,
            confirmed: true,
            guests: guests || 1,
            message: message || null,
        });

        res.status(201).json({
            message: 'Presença confirmada com sucesso!',
            rsvp,
        });
    } catch (error) {
        console.error('Erro ao confirmar presença:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const rsvp = await RSVP.findByPk(id);

        if (!rsvp) {
            res.status(404).json({ error: 'Confirmação não encontrada' });
            return;
        }

        res.json(rsvp);
    } catch (error) {
        console.error('Erro ao buscar confirmação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const rsvp = await RSVP.findByPk(id);

        if (!rsvp) {
            res.status(404).json({ error: 'Confirmação não encontrada' });
            return;
        }

        await rsvp.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover confirmação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const stats = async (req: Request, res: Response): Promise<void> => {
    try {
        const total = await RSVP.count();
        const confirmed = await RSVP.count({ where: { confirmed: true } });
        const totalGuests = await RSVP.sum('guests') || 0;

        res.json({
            total,
            confirmed,
            totalGuests,
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    index,
    store,
    show,
    destroy,
    stats,
};
