import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaMoneyBillWave, FaMapMarkerAlt, FaTimes, FaCheck, FaCopy, FaLightbulb, FaInfoCircle } from 'react-icons/fa';
import api from '../../services/api';
import './GiftList.css';

const GiftList = () => {
    const [gifts, setGifts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [modalType, setModalType] = useState(null); // 'payment' | 'address' | 'pix' | 'success'
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [siteSettings, setSiteSettings] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showInfoBanner, setShowInfoBanner] = useState(true);
    const [sendingValue, setSendingValue] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [giftsRes, categoriesRes, settingsRes] = await Promise.all([
                api.get('/gifts'),
                api.get('/categories'),
                api.get('/settings')
            ]);
            setGifts(giftsRes.data);
            setCategories(categoriesRes.data);
            setSiteSettings(settingsRes.data);
        } catch (error) {
            console.error('Erro ao carregar presentes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGifts = selectedCategory
        ? gifts.filter(g => g.categoryId === selectedCategory)
        : gifts;

    const handleCategoryChange = (categoryId) => {
        if (categoryId === selectedCategory) return;
        setCategoryLoading(true);
        // Pequeno delay para mostrar o loading e dar feedback visual
        setTimeout(() => {
            setSelectedCategory(categoryId);
            setCategoryLoading(false);
        }, 150);
    };

    const openPaymentModal = (gift) => {
        setSelectedGift(gift);
        setModalType('payment');
        setFormData({ name: '', phone: '' });
    };

    const openPixModal = (gift) => {
        setSelectedGift(gift);
        setModalType('pix');
        setCopied(false);
    };

    const handleSendValue = async (gift) => {
        try {
            setSendingValue(true);
            const response = await api.post('/infinitepay/checkout', {
                giftId: gift.id
            });
            // Redireciona para o checkout da InfinitePay
            window.location.href = response.data.checkoutUrl;
        } catch (error) {
            console.error('Erro ao gerar checkout:', error);
            // Se falhar, abre o modal de PIX manual como fallback
            alert('Erro ao gerar link de pagamento. Usando método alternativo.');
            openPixModal(gift);
        } finally {
            setSendingValue(false);
        }
    };

    const openAddressModal = (gift) => {
        setSelectedGift(gift);
        setModalType('address');
    };

    const closeModal = () => {
        setSelectedGift(null);
        setModalType(null);
        setFormData({ name: '', phone: '' });
        setCopied(false);
    };

    const copyPixKey = () => {
        if (siteSettings?.pixKey) {
            navigator.clipboard.writeText(siteSettings.pixKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const handleMarkAsPurchased = async () => {
        if (!formData.name) {
            alert('Por favor, informe seu nome');
            return;
        }

        try {
            await api.post(`/gifts/${selectedGift.id}/purchase`, {
                purchasedBy: formData.name,
                purchasedByPhone: formData.phone,
                paymentMethod: 'external'
            });

            setModalType('success');
            fetchData();
        } catch (error) {
            console.error('Erro ao marcar como comprado:', error);
            alert('Erro ao registrar compra. Tente novamente.');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const getPixKeyTypeLabel = (type) => {
        const types = {
            cpf: 'CPF',
            cnpj: 'CNPJ',
            email: 'E-mail',
            telefone: 'Telefone',
            aleatoria: 'Chave Aleatória'
        };
        return types[type] || 'Chave Pix';
    };

    if (loading) {
        return (
            <section className="gift-list" id="presentes">
                <div className="container">
                    <div className="loading-spinner">Carregando presentes...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="gift-list" id="presentes">
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Lista de Presentes</h2>
                    <p>Escolha algo especial para presentear os noivos</p>
                </motion.div>

                {/* Info Banner */}
                <AnimatePresence>
                    {showInfoBanner && (
                        <motion.div
                            className="gift-info-banner"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="info-banner-header">
                                <FaLightbulb className="info-icon" />
                                <h3>Como presentear os noivos?</h3>
                                <button
                                    className="info-banner-close"
                                    onClick={() => setShowInfoBanner(false)}
                                    aria-label="Fechar"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="info-banner-content">
                                <div className="info-item">
                                    <FaMoneyBillWave className="info-item-icon send-value" />
                                    <div>
                                        <strong>Enviar Valor</strong>
                                        <p>Transfira o valor diretamente aos noivos</p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaShoppingCart className="info-item-icon buy" />
                                    <div>
                                        <strong>Comprar</strong>
                                        <p>Compre o item diretamente na loja online através do link</p>
                                    </div>
                                </div>
                                <div className="info-item address-info">
                                    <FaMapMarkerAlt className="info-item-icon address" />
                                    <div>
                                        <strong>Endereço para Entrega</strong>
                                        <p className="address-text">
                                            {siteSettings?.street || 'A confirmar'}
                                            {siteSettings?.neighborhood && ` - ${siteSettings.neighborhood}`}
                                            {siteSettings?.city && `, ${siteSettings.city}`}
                                            {siteSettings?.state && `/${siteSettings.state}`}
                                            {siteSettings?.zipCode && ` - CEP: ${siteSettings.zipCode}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <FaCheck className="info-item-icon confirm" />
                                    <div>
                                        <strong>Já Comprei</strong>
                                        <p>Registre que você já adquiriu este presente</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category Filter */}
                <div className="category-filter">
                    <button
                        className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(null)}
                        disabled={categoryLoading}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat.id)}
                            disabled={categoryLoading}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>

                {/* Gifts Grid */}
                <div className="gifts-grid">
                    {categoryLoading ? (
                        <div className="category-loading">
                            <div className="loading-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {filteredGifts.map((gift, index) => (
                                <motion.div
                                    key={gift.id}
                                    className="gift-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    layout
                                >
                                    <div className="gift-image">
                                        {gift.image ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${gift.image}`}
                                                alt={gift.title}
                                            />
                                        ) : (
                                            <div className="gift-placeholder">
                                                {gift.category?.icon || '🎁'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="gift-info">
                                        <h3 className="gift-title">{gift.title}</h3>
                                        <p className="gift-price">{formatPrice(gift.price)}</p>
                                    </div>

                                    <div className="gift-actions">
                                        <button
                                            className="gift-btn send-value"
                                            onClick={() => handleSendValue(gift)}
                                            title="Enviar valor aos noivos"
                                            disabled={sendingValue}
                                        >
                                            <FaMoneyBillWave />
                                            <span>{sendingValue ? 'Aguarde...' : 'Enviar Valor'}</span>
                                        </button>

                                        {gift.purchaseLink && (
                                            <a
                                                href={gift.purchaseLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="gift-btn buy"
                                                title="Comprar direto na loja"
                                            >
                                                <FaShoppingCart />
                                                <span>Comprar</span>
                                            </a>
                                        )}

                                        <button
                                            className="gift-btn address"
                                            onClick={() => openAddressModal(gift)}
                                            title="Endereço de entrega"
                                        >
                                            <FaMapMarkerAlt />
                                            <span>Endereço</span>
                                        </button>
                                    </div>

                                    <button
                                        className="gift-btn-confirm"
                                        onClick={() => openPaymentModal(gift)}
                                        title="Registre que você já adquiriu este presente"
                                    >
                                        <FaCheck /> Já comprei este presente
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {!categoryLoading && filteredGifts.length === 0 && (
                    <div className="no-gifts">
                        <p>Nenhum presente disponível nesta categoria.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {modalType && selectedGift && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={closeModal}>
                                <FaTimes />
                            </button>

                            {/* Modal Sucesso */}
                            {modalType === 'success' && (
                                <div className="modal-success">
                                    <div className="success-icon">
                                        <FaCheck />
                                    </div>
                                    <h3>Obrigado!</h3>
                                    <p>Seu presente foi registrado com sucesso. Marcelo e Gabriela agradecem de coração! 💕</p>
                                    <button className="btn btn-primary" onClick={closeModal}>
                                        Fechar
                                    </button>
                                </div>
                            )}

                            {/* Modal Endereço */}
                            {modalType === 'address' && (
                                <div className="modal-address">
                                    <h3>Endereço para Entrega</h3>
                                    <div className="address-box">
                                        <p><strong>Destinatário:</strong> {siteSettings?.recipientName || 'Marcelo e Gabriela'}</p>
                                        <p><strong>Endereço:</strong> {siteSettings?.street || 'A confirmar'}{siteSettings?.complement ? `, ${siteSettings.complement}` : ''}</p>
                                        <p><strong>Bairro:</strong> {siteSettings?.neighborhood || 'A confirmar'}</p>
                                        <p><strong>Cidade/Estado:</strong> {siteSettings?.city || 'A confirmar'}/{siteSettings?.state || 'GO'}</p>
                                        <p><strong>CEP:</strong> {siteSettings?.zipCode || 'A confirmar'}</p>
                                    </div>
                                    <p className="address-note">
                                        {siteSettings?.deliveryNote || 'Após a compra, por favor nos avise para registrarmos o presente!'}
                                    </p>
                                    <div className="modal-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setModalType('payment');
                                            }}
                                        >
                                            Já comprei, registrar presente
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Modal Pix - Simplificado com apenas chave para copiar */}
                            {modalType === 'pix' && (
                                <div className="modal-pix">
                                    <h3>Chave Pix</h3>
                                    <p className="pix-description">
                                        Copie a chave abaixo e faça a transferência do valor de <strong>{formatPrice(selectedGift.price)}</strong>
                                    </p>

                                    <div className="pix-key-box">
                                        <span className="pix-key-type">{getPixKeyTypeLabel(siteSettings?.pixKeyType)}</span>
                                        <div className="pix-key-value">
                                            <code>{siteSettings?.pixKey || 'Chave Pix não configurada'}</code>
                                        </div>
                                        <button
                                            className={`btn btn-copy ${copied ? 'copied' : ''}`}
                                            onClick={copyPixKey}
                                            disabled={!siteSettings?.pixKey}
                                        >
                                            <FaCopy /> {copied ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>

                                    <p className="pix-note">
                                        Após fazer o Pix, clique no botão abaixo para registrar seu presente.
                                    </p>

                                    <div className="modal-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setModalType('payment')}
                                        >
                                            <FaCheck /> Já fiz o Pix, registrar presente
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Modal Registro de Presente */}
                            {modalType === 'payment' && (
                                <div className="modal-payment">
                                    <h3>Registrar Presente</h3>
                                    <p className="payment-subtitle">Preencha seus dados para registrar o presente:</p>
                                    <p className="payment-gift-name">{selectedGift.title} - {formatPrice(selectedGift.price)}</p>

                                    <div className="form-group">
                                        <label>Seu nome *</label>
                                        <input
                                            type="text"
                                            placeholder="Digite seu nome"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Seu telefone</label>
                                        <input
                                            type="tel"
                                            placeholder="(62) 99999-9999"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleMarkAsPurchased}
                                        >
                                            <FaCheck /> Registrar Presente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GiftList;
