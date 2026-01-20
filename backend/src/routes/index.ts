import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import CategoryController from '../controllers/CategoryController';
import GiftController from '../controllers/GiftController';
import RSVPController from '../controllers/RSVPController';
import MessageController from '../controllers/MessageController';
import PaymentController from '../controllers/PaymentController';
import ChatController from '../controllers/ChatController';
import DashboardController from '../controllers/DashboardController';
import SiteConfigController from '../controllers/SiteConfigController';
import PhotoController from '../controllers/PhotoController';
import InfinitePayController from '../controllers/InfinitePayController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// ====== PUBLIC ROUTES ======

// Auth
router.post('/auth/login', AuthController.login);

// Site Settings (public - delivery address)
router.get('/settings', SiteConfigController.getPublicSettings);

// Categories (public read)
router.get('/categories', CategoryController.index);

// Gifts (public read - only available ones)
router.get('/gifts', GiftController.index);
router.get('/gifts/:id', GiftController.show);
router.post('/gifts/:id/purchase', GiftController.markAsPurchased);

// RSVP (public create)
router.post('/rsvp', RSVPController.store);

// Messages (public)
router.get('/messages/public', MessageController.publicIndex);
router.post('/messages', MessageController.store);

// Payments (public)
router.post('/payments/pix', PaymentController.createPixPayment);
router.post('/payments/card', PaymentController.createCardPayment);
router.post('/payments/webhook', PaymentController.webhook);
router.get('/payments/:id/status', PaymentController.checkStatus);

// Photos (public read)
router.get('/photos', PhotoController.index);

// Chat (public)
router.post('/chat', ChatController.chat);

// InfinitePay (public checkout)
router.post('/infinitepay/checkout', InfinitePayController.createCheckout);
router.post('/infinitepay/webhook', InfinitePayController.webhook);
router.get('/infinitepay/verify/:giftId', InfinitePayController.verifyPayment);

// ====== ADMIN ROUTES (Protected) ======

// Auth
router.get('/auth/me', authMiddleware, AuthController.me);

// Dashboard
router.get('/admin/dashboard', authMiddleware, DashboardController.stats);

// Categories (admin CRUD)
router.post('/admin/categories', authMiddleware, CategoryController.store);
router.put('/admin/categories/:id', authMiddleware, CategoryController.update);
router.delete('/admin/categories/:id', authMiddleware, CategoryController.destroy);

// Gifts (admin CRUD)
router.post('/admin/gifts', authMiddleware, upload.single('image'), GiftController.store);
router.put('/admin/gifts/:id', authMiddleware, upload.single('image'), GiftController.update);
router.delete('/admin/gifts/:id', authMiddleware, GiftController.destroy);
router.put('/admin/gifts/:id/purchase', authMiddleware, GiftController.markAsPurchased);
router.put('/admin/gifts/:id/unpurchase', authMiddleware, GiftController.unmarkAsPurchased);

// RSVP (admin read/delete)
router.get('/admin/rsvp', authMiddleware, RSVPController.index);
router.get('/admin/rsvp/stats', authMiddleware, RSVPController.stats);
router.get('/admin/rsvp/:id', authMiddleware, RSVPController.show);
router.delete('/admin/rsvp/:id', authMiddleware, RSVPController.destroy);

// Messages (admin management)
router.get('/admin/messages', authMiddleware, MessageController.index);
router.put('/admin/messages/:id/approve', authMiddleware, MessageController.approve);
router.put('/admin/messages/:id/reject', authMiddleware, MessageController.reject);
router.delete('/admin/messages/:id', authMiddleware, MessageController.destroy);

// Payments (admin read)
router.get('/admin/payments', authMiddleware, PaymentController.index);

// Chat config (admin)
router.get('/admin/chat/config', authMiddleware, ChatController.getConfig);
router.put('/admin/chat/config', authMiddleware, ChatController.updateConfig);

// Site Settings (admin)
router.get('/admin/settings', authMiddleware, SiteConfigController.getSettings);
router.put('/admin/settings', authMiddleware, SiteConfigController.updateSettings);

// Photos (admin CRUD)
router.post('/admin/photos', authMiddleware, upload.single('image'), PhotoController.store);
router.put('/admin/photos/:id', authMiddleware, upload.single('image'), PhotoController.update);
router.delete('/admin/photos/:id', authMiddleware, PhotoController.destroy);
router.put('/admin/photos/reorder', authMiddleware, PhotoController.reorder);
router.put('/admin/photos/:id/move-up', authMiddleware, PhotoController.moveUp);
router.put('/admin/photos/:id/move-down', authMiddleware, PhotoController.moveDown);

export default router;

