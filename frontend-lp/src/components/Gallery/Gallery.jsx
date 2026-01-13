import { motion } from 'framer-motion';
import './Gallery.css';

// Placeholder images for the gallery
const galleryImages = [
    { id: 1, placeholder: true, caption: 'Foto 1 - Placeholder' },
    { id: 2, placeholder: true, caption: 'Foto 2 - Placeholder' },
    { id: 3, placeholder: true, caption: 'Foto 3 - Placeholder' },
    { id: 4, placeholder: true, caption: 'Foto 4 - Placeholder' },
    { id: 5, placeholder: true, caption: 'Foto 5 - Placeholder' },
    { id: 6, placeholder: true, caption: 'Foto 6 - Placeholder' },
];

const Gallery = () => {
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

                <div className="gallery-grid">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            className={`gallery-item ${index === 0 ? 'large' : ''}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="gallery-placeholder">
                                <span className="placeholder-icon">📷</span>
                                <span className="placeholder-text">Ensaio Pré-Wedding</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="gallery-note"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <p>✨ Em breve, mais fotos da nossa história serão adicionadas aqui!</p>
                </motion.div>
            </div>
        </section>
    );
};

export default Gallery;
