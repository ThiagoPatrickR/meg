import { Request, Response } from 'express';
import { Message } from '../models';

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const { approved } = req.query;

        const where: any = {};
        if (approved !== undefined) {
            where.approved = approved === 'true';
        }

        const messages = await Message.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });

        res.json(messages);
    } catch (error) {
        console.error('Erro ao listar recados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const publicIndex = async (req: Request, res: Response): Promise<void> => {
    try {
        const messages = await Message.findAll({
            where: { approved: true },
            order: [['createdAt', 'DESC']],
        });

        res.json(messages);
    } catch (error) {
        console.error('Erro ao listar recados públicos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const store = async (req: Request, res: Response): Promise<void> => {
    try {
        const { authorName, authorType, content } = req.body;

        if (!authorName || !content) {
            res.status(400).json({ error: 'Nome e mensagem são obrigatórios' });
            return;
        }

        const validTypes = ['friend', 'family', 'godparent'];
        const type = validTypes.includes(authorType) ? authorType : 'friend';

        const message = await Message.create({
            authorName,
            authorType: type,
            content,
            approved: false, // Aguarda aprovação do admin
        });

        res.status(201).json({
            message: 'Recado enviado com sucesso! Aguardando aprovação.',
            data: message,
        });
    } catch (error) {
        console.error('Erro ao criar recado:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const approve = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const message = await Message.findByPk(id);

        if (!message) {
            res.status(404).json({ error: 'Recado não encontrado' });
            return;
        }

        await message.update({ approved: true });
        res.json({ message: 'Recado aprovado', data: message });
    } catch (error) {
        console.error('Erro ao aprovar recado:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const reject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const message = await Message.findByPk(id);

        if (!message) {
            res.status(404).json({ error: 'Recado não encontrado' });
            return;
        }

        await message.update({ approved: false });
        res.json({ message: 'Recado rejeitado', data: message });
    } catch (error) {
        console.error('Erro ao rejeitar recado:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const message = await Message.findByPk(id);

        if (!message) {
            res.status(404).json({ error: 'Recado não encontrado' });
            return;
        }

        await message.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover recado:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    index,
    publicIndex,
    store,
    approve,
    reject,
    destroy,
};
