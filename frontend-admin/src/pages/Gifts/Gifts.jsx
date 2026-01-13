import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaUpload, FaShoppingCart } from 'react-icons/fa';
import api from '../../services/api';
import './Gifts.css';

const Gifts = ({ onMenuClick }) => {
    const [gifts, setGifts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [editingGift, setEditingGift] = useState(null);
    const [selectedGiftForPurchase, setSelectedGiftForPurchase] = useState(null);
    const [formData, setFormData] = useState({
        categoryId: '',
        title: '',
        price: '',
        purchaseLink: '',
        pixKey: '',
    });
    const [purchaseData, setPurchaseData] = useState({
        purchasedBy: '',
        purchasedByEmail: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [giftsRes, categoriesRes] = await Promise.all([
                api.get('/gifts?showPurchased=true'),
                api.get('/categories')
            ]);
            setGifts(giftsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (gift = null) => {
        if (gift) {
            setEditingGift(gift);
            setFormData({
                categoryId: gift.categoryId,
                title: gift.title,
                price: gift.price,
                purchaseLink: gift.purchaseLink || '',
            });
            setImagePreview(gift.image ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${gift.image}` : null);
        } else {
            setEditingGift(null);
            setFormData({
                categoryId: categories[0]?.id || '',
                title: '',
                price: '',
                purchaseLink: '',
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingGift(null);
        setImageFile(null);
        setImagePreview(null);
    };

    const openPurchaseModal = (gift) => {
        setSelectedGiftForPurchase(gift);
        setPurchaseData({ purchasedBy: '', purchasedByEmail: '' });
        setPurchaseModalOpen(true);
    };

    const closePurchaseModal = () => {
        setPurchaseModalOpen(false);
        setSelectedGiftForPurchase(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('categoryId', formData.categoryId);
        data.append('title', formData.title);
        data.append('price', formData.price);
        data.append('purchaseLink', formData.purchaseLink);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editingGift) {
                await api.put(`/admin/gifts/${editingGift.id}`, data);
            } else {
                await api.post('/admin/gifts', data);
            }
            closeModal();
            fetchData();
        } catch (error) {
            console.error('Erro ao salvar presente:', error);
            alert('Erro ao salvar presente');
        }
    };

    const handlePurchaseSubmit = async (e) => {
        e.preventDefault();
        if (!purchaseData.purchasedBy.trim()) {
            alert('Por favor, informe o nome do comprador');
            return;
        }

        try {
            await api.put(`/admin/gifts/${selectedGiftForPurchase.id}/purchase`, {
                purchasedBy: purchaseData.purchasedBy,
                purchasedByEmail: purchaseData.purchasedByEmail || null,
            });
            closePurchaseModal();
            fetchData();
        } catch (error) {
            console.error('Erro ao confirmar compra:', error);
            alert('Erro ao confirmar compra');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este presente?')) return;

        try {
            await api.delete(`/admin/gifts/${id}`);
            fetchData();
        } catch (error) {
            console.error('Erro ao excluir presente:', error);
            alert('Erro ao excluir presente');
        }
    };

    const handleUnpurchase = async (gift) => {
        try {
            await api.put(`/admin/gifts/${gift.id}/unpurchase`);
            fetchData();
        } catch (error) {
            console.error('Erro ao desmarcar compra:', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <>
            <Header title="Presentes" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="card">
                    <div className="card-header">
                        <h2>Lista de Presentes ({gifts.length})</h2>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            <FaPlus /> <span className="btn-text">Novo Presente</span>
                        </button>
                    </div>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="table-container desktop-only">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Imagem</th>
                                            <th>Título</th>
                                            <th>Categoria</th>
                                            <th>Preço</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gifts.map(gift => (
                                            <tr key={gift.id}>
                                                <td>
                                                    {gift.image ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${gift.image}`}
                                                            alt={gift.title}
                                                            className="gift-thumb"
                                                        />
                                                    ) : (
                                                        <div className="gift-thumb-placeholder">
                                                            {gift.category?.icon || '🎁'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>{gift.title}</td>
                                                <td>
                                                    <span className="category-badge">
                                                        {gift.category?.icon} {gift.category?.name}
                                                    </span>
                                                </td>
                                                <td>{formatCurrency(gift.price)}</td>
                                                <td>
                                                    <span className={`badge ${gift.purchased ? 'badge-success' : 'badge-info'}`}>
                                                        {gift.purchased ? 'Comprado' : 'Disponível'}
                                                    </span>
                                                    {gift.purchasedBy && (
                                                        <small className="purchased-by">por {gift.purchasedBy}</small>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {gift.purchased ? (
                                                            <button
                                                                className="btn-icon"
                                                                onClick={() => handleUnpurchase(gift)}
                                                                title="Desmarcar como comprado"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="btn-icon success"
                                                                onClick={() => openPurchaseModal(gift)}
                                                                title="Confirmar compra"
                                                            >
                                                                <FaShoppingCart />
                                                            </button>
                                                        )}
                                                        <button className="btn-icon" onClick={() => openModal(gift)}>
                                                            <FaEdit />
                                                        </button>
                                                        <button className="btn-icon danger" onClick={() => handleDelete(gift.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="gift-cards mobile-only">
                                {gifts.map(gift => (
                                    <div key={gift.id} className="gift-card-item">
                                        <div className="gift-card-image">
                                            {gift.image ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${gift.image}`}
                                                    alt={gift.title}
                                                />
                                            ) : (
                                                <div className="gift-thumb-placeholder">
                                                    {gift.category?.icon || '🎁'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="gift-card-info">
                                            <h4>{gift.title}</h4>
                                            <p className="gift-card-price">{formatCurrency(gift.price)}</p>
                                            <span className={`badge ${gift.purchased ? 'badge-success' : 'badge-info'}`}>
                                                {gift.purchased ? 'Comprado' : 'Disponível'}
                                            </span>
                                            {gift.purchasedBy && (
                                                <small className="purchased-by">por {gift.purchasedBy}</small>
                                            )}
                                        </div>
                                        <div className="gift-card-actions">
                                            {gift.purchased ? (
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => handleUnpurchase(gift)}
                                                    title="Desmarcar"
                                                >
                                                    <FaTimes />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn-icon success"
                                                    onClick={() => openPurchaseModal(gift)}
                                                    title="Confirmar compra"
                                                >
                                                    <FaShoppingCart />
                                                </button>
                                            )}
                                            <button className="btn-icon" onClick={() => openModal(gift)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn-icon danger" onClick={() => handleDelete(gift.id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Modal Edição/Criação */}
                {modalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingGift ? 'Editar Presente' : 'Novo Presente'}</h3>
                                <button className="btn-icon" onClick={closeModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Imagem</label>
                                        <div className="image-upload">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="image-preview" />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <FaUpload />
                                                    <span>Selecionar imagem</span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Categoria *</label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                            required
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.icon} {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Título *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Ex: Jogo de Panelas"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Preço (R$) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="Ex: 199.90"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Link para Compra</label>
                                        <input
                                            type="url"
                                            value={formData.purchaseLink}
                                            onChange={e => setFormData({ ...formData, purchaseLink: e.target.value })}
                                            placeholder="https://loja.com/produto"
                                        />
                                    </div>

                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={closeModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Confirmação de Compra */}
                {purchaseModalOpen && selectedGiftForPurchase && (
                    <div className="modal-overlay" onClick={closePurchaseModal}>
                        <div className="modal-content modal-sm" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Confirmar Compra</h3>
                                <button className="btn-icon" onClick={closePurchaseModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handlePurchaseSubmit}>
                                <div className="modal-body">
                                    <p className="purchase-gift-info">
                                        <strong>{selectedGiftForPurchase.title}</strong>
                                        <span>{formatCurrency(selectedGiftForPurchase.price)}</span>
                                    </p>

                                    <div className="form-group">
                                        <label>Nome do Comprador *</label>
                                        <input
                                            type="text"
                                            value={purchaseData.purchasedBy}
                                            onChange={e => setPurchaseData({ ...purchaseData, purchasedBy: e.target.value })}
                                            placeholder="Ex: João Silva"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email do Comprador (opcional)</label>
                                        <input
                                            type="email"
                                            value={purchaseData.purchasedByEmail}
                                            onChange={e => setPurchaseData({ ...purchaseData, purchasedByEmail: e.target.value })}
                                            placeholder="Ex: joao@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={closePurchaseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <FaCheck /> Confirmar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Gifts;
