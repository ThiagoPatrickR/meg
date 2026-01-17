import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import './Gallery.css';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section className="gallery" id="fotos">
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Álbum de Fotos</h2>
                    <p>Momentos especiais da nossa jornada juntos</p>
                </motion.div>

                {loading ? (
                    <div className="gallery-loading">
                        <p>Carregando fotos...</p>
                    </div>
                ) : photos.length > 0 ? (
                    <div className="gallery-grid">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                className={`gallery-item ${index === 0 ? 'large' : ''}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/${photo.image}`}
                                    alt={photo.title || 'Foto do casal'}
                                />
                                {photo.title && (
                                    <div className="gallery-caption">
                                        <p>{photo.title}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="gallery-empty"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <p>Em breve, fotos especiais da nossa história serão compartilhadas aqui! 📷</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Gallery;
