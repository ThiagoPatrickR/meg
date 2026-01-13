import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatConfig } from '../models';

let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
    if (!genAI && process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

const defaultSystemPrompt = `Você é um assistente virtual do casamento de Marcelo e Gabriela. 
Seja simpático, acolhedor e ajude os convidados com informações sobre o casamento.
Responda em português brasileiro de forma amigável e concisa.
Se não souber a resposta, sugira que o convidado entre em contato diretamente com os noivos.`;

const defaultWeddingInfo = `
Casamento: Marcelo & Gabriela
Data: 18 de Abril de 2026
Local da Cerimônia: A confirmar
Horário: A confirmar

Informações importantes:
- Confirme sua presença pelo site
- Veja nossa lista de presentes
- Dress code: A confirmar
`;

export const chat = async (message: string, conversationHistory: Array<{ role: string; content: string }> = []) => {
    const ai = getGenAI();

    if (!ai) {
        return {
            response: 'Desculpe, o chat está temporariamente indisponível. Por favor, entre em contato diretamente com os noivos.',
            error: 'GEMINI_API_KEY not configured',
        };
    }

    try {
        // Get config from database or use defaults
        let systemPrompt = defaultSystemPrompt;
        let weddingInfo = defaultWeddingInfo;

        try {
            const config = await ChatConfig.findOne({ where: { active: true } });
            if (config) {
                systemPrompt = config.systemPrompt;
                weddingInfo = config.weddingInfo;
            }
        } catch (dbError) {
            console.log('Using default chat config');
        }

        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const fullContext = `${systemPrompt}\n\nInformações do casamento:\n${weddingInfo}`;

        // Build chat history
        const history = conversationHistory.map((msg) => ({
            role: msg.role as 'user' | 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: 'Contexto do sistema: ' + fullContext }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Entendido! Estou pronto para ajudar os convidados com informações sobre o casamento de Marcelo e Gabriela. Como posso ajudar?' }],
                },
                ...history,
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        return {
            response,
            error: null,
        };
    } catch (error) {
        console.error('Erro no chat Gemini:', error);
        return {
            response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
            error: String(error),
        };
    }
};

export default {
    chat,
};
