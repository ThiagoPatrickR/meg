import { Request, Response } from 'express';
import { GiftCategory } from '../models';

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await GiftCategory.findAll({
            order: [['order', 'ASC'], ['name', 'ASC']],
        });
        res.json(categories);
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await GiftCategory.findByPk(id);

        if (!category) {
            res.status(404).json({ error: 'Categoria não encontrada' });
            return;
        }

        res.json(category);
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const store = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, icon, order } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Nome é obrigatório' });
            return;
        }

        const category = await GiftCategory.create({
            name,
            icon: icon || '🎁',
            order: order || 0,
        });

        res.status(201).json(category);
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, icon, order } = req.body;

        const category = await GiftCategory.findByPk(id);

        if (!category) {
            res.status(404).json({ error: 'Categoria não encontrada' });
            return;
        }

        await category.update({
            name: name || category.name,
            icon: icon || category.icon,
            order: order !== undefined ? order : category.order,
        });

        res.json(category);
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await GiftCategory.findByPk(id);

        if (!category) {
            res.status(404).json({ error: 'Categoria não encontrada' });
            return;
        }

        await category.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover categoria:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    index,
    show,
    store,
    update,
    destroy,
};
