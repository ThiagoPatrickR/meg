import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUpload, FaArrowUp, FaArrowDown, FaImage } from 'react-icons/fa';
import api from '../../services/api';
import './Photos.css';

const Photos = ({ onMenuClick }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await api.get('/photos');
            setPhotos(response.data);
        } catch (error) {
            console.error('Erro ao carregar fotos:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (photo = null) => {
        if (photo) {
            setEditingPhoto(photo);
            setFormData({
                title: photo.title || '',
            });
            setImagePreview(photo.image ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${photo.image}` : null);
        } else {
            setEditingPhoto(null);
            setFormData({
                title: '',
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingPhoto(null);
        setImageFile(null);
        setImagePreview(null);
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

        if (!editingPhoto && !imageFile) {
            alert('Por favor, selecione uma imagem');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            if (editingPhoto) {
                await api.put(`/admin/photos/${editingPhoto.id}`, data);
            } else {
                await api.post('/admin/photos', data);
            }
            closeModal();
            fetchPhotos();
        } catch (error) {
            console.error('Erro ao salvar foto:', error);
            alert('Erro ao salvar foto');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta foto?')) return;

        try {
            await api.delete(`/admin/photos/${id}`);
            fetchPhotos();
        } catch (error) {
            console.error('Erro ao excluir foto:', error);
            alert('Erro ao excluir foto');
        }
    };

    const handleMoveUp = async (photo) => {
        if (photo.order === 1) return; // Já está no topo

        try {
            await api.put(`/admin/photos/${photo.id}/move-up`);
            fetchPhotos();
        } catch (error) {
            console.error('Erro ao mover foto:', error);
        }
    };

    const handleMoveDown = async (photo) => {
        const maxOrder = Math.max(...photos.map(p => p.order));
        if (photo.order === maxOrder) return; // Já está no final

        try {
            await api.put(`/admin/photos/${photo.id}/move-down`);
            fetchPhotos();
        } catch (error) {
            console.error('Erro ao mover foto:', error);
        }
    };

    return (
        <>
            <Header title="Fotos" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="card">
                    <div className="card-header">
                        <h2>Álbum de Fotos ({photos.length})</h2>
                        <button className="btn btn-primary" onClick={() => openModal()}>
                            <FaPlus /> <span className="btn-text">Nova Foto</span>
                        </button>
                    </div>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : (
                        <>
                            {/* Desktop Grid */}
                            <div className="photos-grid desktop-only">
                                {photos.map(photo => (
                                    <div key={photo.id} className="photo-card">
                                        <div className="photo-image">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${photo.image}`}
                                                alt={photo.title || 'Foto'}
                                            />
                                        </div>
                                        <div className="photo-info">
                                            <span className="photo-order">#{photo.order}</span>
                                            {photo.title && <p className="photo-title">{photo.title}</p>}
                                        </div>
                                        <div className="photo-actions">
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleMoveUp(photo)}
                                                title="Mover para cima"
                                                disabled={photo.order === 1}
                                            >
                                                <FaArrowUp />
                                            </button>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleMoveDown(photo)}
                                                title="Mover para baixo"
                                                disabled={photo.order === Math.max(...photos.map(p => p.order))}
                                            >
                                                <FaArrowDown />
                                            </button>
                                            <button className="btn-icon" onClick={() => openModal(photo)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn-icon danger" onClick={() => handleDelete(photo.id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Cards */}
                            <div className="photo-cards mobile-only">
                                {photos.map(photo => (
                                    <div key={photo.id} className="photo-card-mobile">
                                        <div className="photo-card-image">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${photo.image}`}
                                                alt={photo.title || 'Foto'}
                                            />
                                            <span className="photo-badge">#{photo.order}</span>
                                        </div>
                                        <div className="photo-card-info">
                                            {photo.title && <h4>{photo.title}</h4>}
                                        </div>
                                        <div className="photo-card-actions">
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleMoveUp(photo)}
                                                disabled={photo.order === 1}
                                            >
                                                <FaArrowUp />
                                            </button>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleMoveDown(photo)}
                                                disabled={photo.order === Math.max(...photos.map(p => p.order))}
                                            >
                                                <FaArrowDown />
                                            </button>
                                            <button className="btn-icon" onClick={() => openModal(photo)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn-icon danger" onClick={() => handleDelete(photo.id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {photos.length === 0 && (
                                <div className="no-photos">
                                    <FaImage />
                                    <p>Nenhuma foto cadastrada ainda.</p>
                                    <p>Clique em "Nova Foto" para adicionar a primeira foto do álbum.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Modal Edição/Criação */}
                {modalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingPhoto ? 'Editar Foto' : 'Nova Foto'}</h3>
                                <button className="btn-icon" onClick={closeModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Imagem {!editingPhoto && '*'}</label>
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
                                        <label>Título/Legenda (opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Ex: Ensaio Pré-Wedding"
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

export default Photos;
