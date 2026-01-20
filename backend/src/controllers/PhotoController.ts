import { Request, Response } from 'express';
import { Photo } from '../models';
import { Op } from 'sequelize';

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const photos = await Photo.findAll({
            order: [['order', 'ASC'], ['createdAt', 'ASC']],
        });

        res.json(photos);
    } catch (error) {
        console.error('Erro ao listar fotos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const photo = await Photo.findByPk(id);

        if (!photo) {
            res.status(404).json({ error: 'Foto não encontrada' });
            return;
        }

        res.json(photo);
    } catch (error) {
        console.error('Erro ao buscar foto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const store = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title } = req.body;
        const image = req.file?.filename;

        if (!image) {
            res.status(400).json({ error: 'Imagem é obrigatória' });
            return;
        }

        // Get the current max order and add 1
        const maxOrderPhoto = await Photo.findOne({
            order: [['order', 'DESC']],
        });

        const newOrder = maxOrderPhoto ? maxOrderPhoto.order + 1 : 1;

        const photo = await Photo.create({
            title: title || null,
            image,
            order: newOrder,
        });

        res.status(201).json(photo);
    } catch (error) {
        console.error('Erro ao criar foto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, order } = req.body;
        const image = req.file?.filename;

        const photo = await Photo.findByPk(id);

        if (!photo) {
            res.status(404).json({ error: 'Foto não encontrada' });
            return;
        }

        await photo.update({
            title: title !== undefined ? title : photo.title,
            image: image || photo.image,
            order: order !== undefined ? order : photo.order,
        });

        res.json(photo);
    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const photo = await Photo.findByPk(id);

        if (!photo) {
            res.status(404).json({ error: 'Foto não encontrada' });
            return;
        }

        await photo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover foto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const reorder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { photos } = req.body; // Array of { id, order }

        if (!Array.isArray(photos)) {
            res.status(400).json({ error: 'É necessário enviar um array de fotos' });
            return;
        }

        // Update each photo's order
        await Promise.all(
            photos.map(async (item: { id: number; order: number }) => {
                await Photo.update(
                    { order: item.order },
                    { where: { id: item.id } }
                );
            })
        );

        const updatedPhotos = await Photo.findAll({
            order: [['order', 'ASC']],
        });

        res.json(updatedPhotos);
    } catch (error) {
        console.error('Erro ao reordenar fotos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const moveUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const photo = await Photo.findByPk(id);

        if (!photo) {
            res.status(404).json({ error: 'Foto não encontrada' });
            return;
        }

        // Find the photo that's immediately before this one (highest order less than current)
        const previousPhoto = await Photo.findOne({
            where: {
                order: {
                    [Op.lt]: photo.order,
                },
            },
            order: [['order', 'DESC']],
        });

        if (previousPhoto) {
            // Swap orders
            const tempOrder = photo.order;
            await photo.update({ order: previousPhoto.order });
            await previousPhoto.update({ order: tempOrder });
        }

        const updatedPhotos = await Photo.findAll({
            order: [['order', 'ASC']],
        });

        res.json(updatedPhotos);
    } catch (error) {
        console.error('Erro ao mover foto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const moveDown = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const photo = await Photo.findByPk(id);

        if (!photo) {
            res.status(404).json({ error: 'Foto não encontrada' });
            return;
        }

        // Find the photo that's immediately after this one (lowest order greater than current)
        const nextPhoto = await Photo.findOne({
            where: {
                order: {
                    [Op.gt]: photo.order,
                },
            },
            order: [['order', 'ASC']],
        });

        if (nextPhoto) {
            // Swap orders
            const tempOrder = photo.order;
            await photo.update({ order: nextPhoto.order });
            await nextPhoto.update({ order: tempOrder });
        }

        const updatedPhotos = await Photo.findAll({
            order: [['order', 'ASC']],
        });

        res.json(updatedPhotos);
    } catch (error) {
        console.error('Erro ao mover foto:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    index,
    show,
    store,
    update,
    destroy,
    reorder,
    moveUp,
    moveDown,
};
