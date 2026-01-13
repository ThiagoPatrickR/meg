import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import './Categories.css';

const Categories = ({ onMenuClick }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', icon: '🎁', order: 0 });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, icon: category.icon, order: category.order });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', icon: '🎁', order: categories.length });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/admin/categories/${editingCategory.id}`, formData);
            } else {
                await api.post('/admin/categories', formData);
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            alert('Erro ao salvar categoria');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

        try {
            await api.delete(`/admin/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            alert('Erro ao excluir categoria. Verifique se não há presentes associados.');
        }
    };

    const emojis = ['🍳', '🧺', '🛁', '🏠', '🎁', '🛏️', '🧹', '🍽️', '☕', '🌸', '💝', '🎀'];

    return (
        <>
            <Header title="Categorias" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="card">
                    <div className="card-header">
                        <h2>Categorias de Presentes ({categories.length})</h2>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            <FaPlus /> Nova Categoria
                        </button>
                    </div>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <div className="categories-grid">
                            {categories.map(category => (
                                <div key={category.id} className="category-card">
                                    <div className="category-icon">{category.icon}</div>
                                    <div className="category-info">
                                        <h3>{category.name}</h3>
                                        <span>Ordem: {category.order}</span>
                                    </div>
                                    <div className="category-actions">
                                        <button className="btn-icon" onClick={() => openModal(category)}>
                                            <FaEdit />
                                        </button>
                                        <button className="btn-icon danger" onClick={() => handleDelete(category.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal */}
                {modalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content small" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
                                <button className="btn-icon" onClick={closeModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Ícone</label>
                                        <div className="emoji-picker">
                                            {emojis.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    className={`emoji-btn ${formData.icon === emoji ? 'active' : ''}`}
                                                    onClick={() => setFormData({ ...formData, icon: emoji })}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Nome *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Ex: Cozinha"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Ordem</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
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
            </div>
        </>
    );
};

export default Categories;
