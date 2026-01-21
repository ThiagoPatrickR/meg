import { Request, Response } from 'express';
import SiteConfig from '../models/SiteConfig';

// Retorna configurações públicas (endereço e chave Pix)
export const getPublicSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        let config = await SiteConfig.findOne();

        if (!config) {
            // Retorna valores padrão se não houver configuração
            res.json({
                recipientName: 'Marcelo e Gabriella',
                street: 'Av. Federal, nº 300 - Monte Hermon Residence, Apto 901-A',
                complement: 'Apto 901-A',
                neighborhood: 'Maracananzinho',
                city: 'Anápolis',
                state: 'GO',
                zipCode: '75080-045',
                deliveryNote: 'Após a compra, por favor nos avise para registrarmos o presente!',
                pixKey: null,
                pixKeyType: null,
            });
            return;
        }

        res.json({
            recipientName: config.recipientName,
            street: config.street,
            complement: config.complement,
            neighborhood: config.neighborhood,
            city: config.city,
            state: config.state,
            zipCode: config.zipCode,
            deliveryNote: config.deliveryNote,
            pixKey: config.pixKey,
            pixKeyType: config.pixKeyType,
        });
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Retorna todas as configurações (admin)
export const getSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        let config = await SiteConfig.findOne();

        if (!config) {
            // Cria configuração padrão
            config = await SiteConfig.create({
                recipientName: 'Marcelo e Gabriella',
                street: 'Av. Federal, nº 300 - Monte Hermon Residence, Apto 901-A',
                neighborhood: 'Maracananzinho',
                city: 'Anápolis',
                state: 'GO',
                zipCode: '75080-045',
            });
        }

        res.json(config);
    } catch (error) {
        console.error('Erro ao buscar configurações:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Atualiza configurações (admin)
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            recipientName,
            street,
            complement,
            neighborhood,
            city,
            state,
            zipCode,
            deliveryNote,
            pixKey,
            pixKeyType,
        } = req.body;

        let config = await SiteConfig.findOne();

        if (!config) {
            config = await SiteConfig.create({
                recipientName: recipientName || 'Marcelo e Gabriella',
                street: street || '',
                complement: complement || null,
                neighborhood: neighborhood || '',
                city: city || '',
                state: state || 'GO',
                zipCode: zipCode || '',
                deliveryNote: deliveryNote || null,
                pixKey: pixKey || null,
                pixKeyType: pixKeyType || null,
            });
        } else {
            await config.update({
                recipientName: recipientName !== undefined ? recipientName : config.recipientName,
                street: street !== undefined ? street : config.street,
                complement: complement !== undefined ? complement : config.complement,
                neighborhood: neighborhood !== undefined ? neighborhood : config.neighborhood,
                city: city !== undefined ? city : config.city,
                state: state !== undefined ? state : config.state,
                zipCode: zipCode !== undefined ? zipCode : config.zipCode,
                deliveryNote: deliveryNote !== undefined ? deliveryNote : config.deliveryNote,
                pixKey: pixKey !== undefined ? pixKey : config.pixKey,
                pixKeyType: pixKeyType !== undefined ? pixKeyType : config.pixKeyType,
            });
        }

        res.json({ message: 'Configurações atualizadas com sucesso', config });
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    getPublicSettings,
    getSettings,
    updateSettings,
};
