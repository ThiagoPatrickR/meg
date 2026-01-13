import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email e senha são obrigatórios' });
            return;
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        const isValidPassword = await user.checkPassword(password);

        if (!isValidPassword) {
            res.status(401).json({ error: 'Credenciais inválidas' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export const me = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'name'],
        });

        if (!user) {
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

export default {
    login,
    me,
};
