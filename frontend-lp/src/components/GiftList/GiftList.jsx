import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaMoneyBillWave, FaMapMarkerAlt, FaTimes, FaCheck, FaCopy, FaLightbulb, FaInfoCircle, FaSortAmountDown, FaSortAmountUp, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { io } from 'socket.io-client';
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
    const [sortOrder, setSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'
    const [searchTerm, setSearchTerm] = useState('');
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [customItemsPerPage, setCustomItemsPerPage] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    // WebSocket connection for real-time updates
    useEffect(() => {
        // Connect to WebSocket server
        const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3333';
        const socket = io(socketUrl, {
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('🔌 WebSocket conectado:', socket.id);
        });

        socket.on('giftPurchased', ({ giftId }) => {
            console.log('🎁 Presente comprado via WebSocket:', giftId);
            // Remove the purchased gift from the list with animation
            setGifts(prevGifts => prevGifts.filter(g => g.id !== giftId));
        });

        socket.on('disconnect', () => {
            console.log('🔌 WebSocket desconectado');
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
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

    // Função para normalizar texto (remove acentos, cedilhas, etc.)
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
            .replace(/ç/g, 'c') // Substitui cedilha
            .replace(/[^a-z0-9\s]/g, ''); // Remove caracteres especiais
    };

    const filteredGifts = useMemo(() => {
        let result = selectedCategory
            ? gifts.filter(g => g.categoryId === selectedCategory)
            : gifts;

        // Aplicar busca por nome (normalizada - ignora acentos)
        if (searchTerm.trim()) {
            const normalizedTerm = normalizeText(searchTerm.trim());
            result = result.filter(g => normalizeText(g.title).includes(normalizedTerm));
        }

        // Aplicar ordenação
        if (sortOrder === 'asc') {
            // Ordenação por menor preço
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            // Ordenação por maior preço
            result = [...result].sort((a, b) => b.price - a.price);
        } else {
            // Ordenação padrão: "Lua de Mel" por último
            result = [...result].sort((a, b) => {
                const aIsHoneymoon = a.category?.name?.toLowerCase().includes('lua de mel') ||
                    a.category?.name?.toLowerCase().includes('lua-de-mel') ||
                    a.category?.name?.toLowerCase().includes('honeymoon');
                const bIsHoneymoon = b.category?.name?.toLowerCase().includes('lua de mel') ||
                    b.category?.name?.toLowerCase().includes('lua-de-mel') ||
                    b.category?.name?.toLowerCase().includes('honeymoon');

                if (aIsHoneymoon && !bIsHoneymoon) return 1;
                if (!aIsHoneymoon && bIsHoneymoon) return -1;
                return 0;
            });
        }

        return result;
    }, [gifts, selectedCategory, sortOrder, searchTerm]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredGifts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedGifts = filteredGifts.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, sortOrder, searchTerm, itemsPerPage]);

    const handleItemsPerPageChange = (value) => {
        if (value === 'custom') {
            setShowCustomInput(true);
        } else {
            setShowCustomInput(false);
            setItemsPerPage(Number(value));
        }
    };

    const handleCustomItemsSubmit = () => {
        const customValue = parseInt(customItemsPerPage, 10);
        if (customValue && customValue > 0 && customValue <= 100) {
            setItemsPerPage(customValue);
            setShowCustomInput(false);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

                {/* Info Banner removido - mantido apenas checkout InfinitePay */}

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

                {/* Search and Sort Filters */}
                <div className="filters-row">
                    {/* Search Field */}
                    <div className="search-filter">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar presente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="search-clear"
                                onClick={() => setSearchTerm('')}
                                aria-label="Limpar busca"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {/* Price Sort Filter */}
                    <div className="sort-filter">
                        <label className="sort-label">
                            <FaSortAmountDown className="sort-icon" />
                            Ordenar:
                        </label>
                        <select
                            className="sort-select"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="none">Padrão</option>
                            <option value="asc">Menor preço</option>
                            <option value="desc">Maior preço</option>
                        </select>
                    </div>
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
                        <AnimatePresence mode="popLayout">
                            {paginatedGifts.map((gift, index) => (
                                <motion.div
                                    key={gift.id}
                                    className="gift-card"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
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
                                            className="gift-btn send-value presentear-btn"
                                            onClick={() => handleSendValue(gift)}
                                            title="Presentear os noivos"
                                            disabled={sendingValue}
                                        >
                                            <FaMoneyBillWave />
                                            <span>{sendingValue ? 'Aguarde...' : 'Presentear'}</span>
                                        </button>
                                    </div>
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

                {/* Pagination Controls */}
                {!categoryLoading && filteredGifts.length > 0 && (
                    <div className="pagination-container">
                        <div className="pagination-info">
                            <span>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredGifts.length)} de {filteredGifts.length} presentes</span>
                        </div>

                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Página anterior"
                            >
                                <FaChevronLeft />
                            </button>

                            <div className="pagination-pages">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // Show first, last, current, and adjacent pages
                                        if (page === 1 || page === totalPages) return true;
                                        if (Math.abs(page - currentPage) <= 1) return true;
                                        return false;
                                    })
                                    .map((page, index, arr) => {
                                        const prevPage = arr[index - 1];
                                        const showEllipsis = prevPage && page - prevPage > 1;
                                        return (
                                            <span key={page}>
                                                {showEllipsis && <span className="pagination-ellipsis">...</span>}
                                                <button
                                                    className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => goToPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            </span>
                                        );
                                    })}
                            </div>

                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Próxima página"
                            >
                                <FaChevronRight />
                            </button>
                        </div>

                        <div className="items-per-page">
                            <label>Por página:</label>
                            <select
                                value={showCustomInput ? 'custom' : itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                            >
                                <option value="6">6</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="custom">Personalizado</option>
                            </select>
                            {showCustomInput && (
                                <div className="custom-items-input">
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        placeholder="Ex: 15"
                                        value={customItemsPerPage}
                                        onChange={(e) => setCustomItemsPerPage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCustomItemsSubmit()}
                                    />
                                    <button onClick={handleCustomItemsSubmit} className="custom-confirm-btn">
                                        <FaCheck />
                                    </button>
                                </div>
                            )}
                        </div>
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
                                    <p>Seu presente foi registrado com sucesso. Marcelo e Gabriella agradecem de coração! 💕</p>
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
                                        <p><strong>Destinatário:</strong> {siteSettings?.recipientName || 'Marcelo e Gabriella'}</p>
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
