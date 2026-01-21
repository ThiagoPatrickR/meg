import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import sequelize from './database';
import { User, GiftCategory } from './models';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT || 3333;

// Create HTTP server and Socket.io instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔌 Cliente WebSocket conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔌 Cliente WebSocket desconectado:', socket.id);
    });
});

async function bootstrap() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Sync models (create tables if not exist)
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');

        // Create default admin user if not exists
        const adminExists = await User.findOne({ where: { email: 'admin@casamento.com' } });
        if (!adminExists) {
            await User.create({
                email: 'admin@casamento.com',
                password: '123456',
                name: 'Administrador',
            });
            console.log('✅ Default admin user created (admin@casamento.com / 123456)');
        }

        // Create default categories if not exist
        const categoriesCount = await GiftCategory.count();
        if (categoriesCount === 0) {
            await GiftCategory.bulkCreate([
                { name: 'Cozinha', icon: '🍳', order: 1 },
                { name: 'Lavanderia', icon: '🧺', order: 2 },
                { name: 'Banheiro', icon: '🛁', order: 3 },
                { name: 'Casa no Geral', icon: '🏠', order: 4 },
            ]);
            console.log('✅ Default categories created');
        }

        // Start server with Socket.io
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 API: http://localhost:${PORT}/api`);
            console.log(`🔌 WebSocket: http://localhost:${PORT}`);
            console.log(`❤️  Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

bootstrap();

// Export io for use in controllers
export { io };
