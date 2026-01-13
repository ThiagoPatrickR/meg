import { Request, Response } from 'express';
import { Gift, GiftCategory } from '../models';
import { Op } from 'sequelize';

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, showPurchased } = req.query;

        const where: any = {};

        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Por padrão, não mostra presentes já comprados para visitantes
        if (showPurchased !== 'true') {
            where.purchased = false;
        }

        const gifts = await Gift.findAll({
            where,
            include: [
                {
                    model: GiftCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'icon'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(gifts);
    } catch (error) {
        console.error('Erro ao listar presentes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const gift = await Gift.findByPk(id, {
            include: [
                {
                    model: GiftCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'icon'],
                },
            ],
        });

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        res.json(gift);
    } catch (error) {
        console.error('Erro ao buscar presente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const store = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId, title, price, purchaseLink, pixKey } = req.body;
        const image = req.file?.filename;

        if (!categoryId || !title || !price) {
            res.status(400).json({ error: 'Categoria, título e preço são obrigatórios' });
            return;
        }

        const gift = await Gift.create({
            categoryId,
            title,
            image: image || null,
            price,
            purchaseLink: purchaseLink || null,
            pixKey: pixKey || null,
        });

        const giftWithCategory = await Gift.findByPk(gift.id, {
            include: [
                {
                    model: GiftCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'icon'],
                },
            ],
        });

        res.status(201).json(giftWithCategory);
    } catch (error) {
        console.error('Erro ao criar presente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { categoryId, title, price, purchaseLink, pixKey } = req.body;
        const image = req.file?.filename;

        const gift = await Gift.findByPk(id);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        await gift.update({
            categoryId: categoryId || gift.categoryId,
            title: title || gift.title,
            image: image || gift.image,
            price: price || gift.price,
            purchaseLink: purchaseLink !== undefined ? purchaseLink : gift.purchaseLink,
            pixKey: pixKey !== undefined ? pixKey : gift.pixKey,
        });

        const updatedGift = await Gift.findByPk(id, {
            include: [
                {
                    model: GiftCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'icon'],
                },
            ],
        });

        res.json(updatedGift);
    } catch (error) {
        console.error('Erro ao atualizar presente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const gift = await Gift.findByPk(id);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        await gift.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover presente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const markAsPurchased = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { purchasedBy, purchasedByEmail, paymentMethod } = req.body;

        const gift = await Gift.findByPk(id);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        if (gift.purchased) {
            res.status(400).json({ error: 'Este presente já foi comprado' });
            return;
        }

        await gift.update({
            purchased: true,
            purchasedBy: purchasedBy || 'Anônimo',
            purchasedByEmail: purchasedByEmail || null,
            purchasedAt: new Date(),
            paymentMethod: paymentMethod || 'external',
        });

        res.json({ message: 'Presente marcado como comprado', gift });
    } catch (error) {
        console.error('Erro ao marcar presente como comprado:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const unmarkAsPurchased = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const gift = await Gift.findByPk(id);

        if (!gift) {
            res.status(404).json({ error: 'Presente não encontrado' });
            return;
        }

        await gift.update({
            purchased: false,
            purchasedBy: null,
            purchasedByEmail: null,
            purchasedAt: null,
            paymentMethod: null,
        });

        res.json({ message: 'Marcação de compra removida', gift });
    } catch (error) {
        console.error('Erro ao desmarcar presente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    index,
    show,
    store,
    update,
    destroy,
    markAsPurchased,
    unmarkAsPurchased,
};
