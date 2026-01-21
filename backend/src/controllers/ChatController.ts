import { Request, Response } from 'express';
import GeminiService from '../services/GeminiService';
import { ChatConfig } from '../models';

export const chat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, history } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Mensagem é obrigatória' });
            return;
        }

        const result = await GeminiService.chat(message, history || []);

        res.json({
            response: result.response,
            error: result.error,
        });
    } catch (error) {
        console.error('Erro no chat:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const getConfig = async (req: Request, res: Response): Promise<void> => {
    try {
        let config = await ChatConfig.findOne({ where: { active: true } });

        if (!config) {
            // Create default config
            config = await ChatConfig.create({
                systemPrompt: `Você é um assistente virtual do casamento de Marcelo e Gabriella. 
Seja simpático, acolhedor e ajude os convidados com informações sobre o casamento.
Responda em português brasileiro de forma amigável e concisa.
Se não souber a resposta, sugira que o convidado entre em contato diretamente com os noivos.`,
                weddingInfo: `Casamento: Marcelo & Gabriella
Data: 18 de Abril de 2026
Local da Cerimônia: A confirmar
Horário: A confirmar

Informações importantes:
- Confirme sua presença pelo site
- Veja nossa lista de presentes
- Dress code: A confirmar`,
                active: true,
            });
        }

        res.json(config);
    } catch (error) {
        console.error('Erro ao buscar configuração:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const updateConfig = async (req: Request, res: Response): Promise<void> => {
    try {
        const { systemPrompt, weddingInfo } = req.body;

        let config = await ChatConfig.findOne({ where: { active: true } });

        if (config) {
            await config.update({
                systemPrompt: systemPrompt || config.systemPrompt,
                weddingInfo: weddingInfo || config.weddingInfo,
            });
        } else {
            config = await ChatConfig.create({
                systemPrompt: systemPrompt || '',
                weddingInfo: weddingInfo || '',
                active: true,
            });
        }

        res.json(config);
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    chat,
    getConfig,
    updateConfig,
};
