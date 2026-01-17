import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaParking, FaTshirt, FaGift } from 'react-icons/fa';
import './EventInfo.css';

const EventInfo = () => {
    return (
        <section className="event-info" id="evento">
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Informações do Evento</h2>
                    <p>Tudo que você precisa saber para celebrar conosco</p>
                </motion.div>

                <div className="events-grid">


                    {/* Chá de Panela */}
                    <motion.div
                        className="event-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="event-card-header">
                            <div className="event-icon">🫖</div>
                            <h3>Chá de Panela</h3>
                        </div>

                        <div className="event-details">
                            <div className="event-detail-item">
                                <FaClock />
                                <div>
                                    <strong>Data e Horário</strong>
                                    <span>18 de Abril de 2026 - 13:00</span>
                                </div>
                            </div>

                            <div className="event-detail-item">
                                <FaMapMarkerAlt />
                                <div>
                                    <strong>Local</strong>
                                    <span>E&P Eventos</span>
                                </div>
                            </div>

                            <div className="event-detail-item">
                                <FaParking />
                                <div>
                                    <strong>Estacionamento</strong>
                                    <span>Estacionamento no local</span>
                                </div>
                            </div>

                            <div className="event-detail-item">
                                <FaGift />
                                <div>
                                    <strong>Dinâmica</strong>
                                    <span>Show, brincadeiras, solteiros e muita comida e cachaça</span>
                                </div>
                            </div>
                        </div>

                        <div className="event-map">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3829.257163119377!2d-48.918731724859164!3d-16.309799184405094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDE4JzM1LjMiUyA0OMKwNTQnNTguMiJX!5e0!3m2!1spt-BR!2sbr!4v1768261643646!5m2!1spt-BR!2sbr"
                                width="100%"
                                height="200"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização E&P Eventos"
                            ></iframe>
                            <a
                                href="https://maps.app.goo.gl/CL3dxh2wVjFFmg1VA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="map-link"
                            >
                                <FaMapMarkerAlt /> Abrir no Google Maps
                            </a>
                        </div>

                        <div className="event-note highlight">
                            <strong>🎁 Dica</strong>
                            <p>Confira nossa lista de presentes.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default EventInfo;
