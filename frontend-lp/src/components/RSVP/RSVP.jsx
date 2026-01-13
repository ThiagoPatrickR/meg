import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaUser, FaPhone, FaEnvelope, FaUsers, FaCheck } from 'react-icons/fa';
import api from '../../services/api';
import './RSVP.css';

const RSVP = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        guests: 1,
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            setError('Por favor, informe seu nome');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/rsvp', formData);
            setSubmitted(true);
        } catch (err) {
            console.error('Erro ao confirmar presença:', err);
            setError('Ocorreu um erro. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rsvp" id="confirmar">
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Confirme sua Presença</h2>
                    <p>Ficaremos muito felizes em ter você conosco neste dia especial</p>
                </motion.div>

                <motion.div
                    className="rsvp-container"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {submitted ? (
                        <div className="rsvp-success">
                            <div className="success-icon">
                                <FaCheck />
                            </div>
                            <h3>Presença Confirmada!</h3>
                            <p>Obrigado, {formData.name}! Estamos muito felizes em saber que você estará conosco.</p>
                            <p className="success-heart">💕</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="rsvp-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label><FaUser /> Nome Completo *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Seu nome"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row two-cols">
                                <div className="form-group">
                                    <label><FaPhone /> Telefone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><FaEnvelope /> Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="seu@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label><FaUsers /> Número de Acompanhantes</label>
                                <select
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                >
                                    <option value={1}>Apenas eu</option>
                                    <option value={2}>Eu + 1 acompanhante</option>
                                    <option value={3}>Eu + 2 acompanhantes</option>
                                    <option value={4}>Eu + 3 acompanhantes</option>
                                    <option value={5}>Eu + 4 acompanhantes</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label><FaHeart /> Deixe uma mensagem (opcional)</label>
                                <textarea
                                    name="message"
                                    placeholder="Uma mensagem para os noivos..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <button
                                type="submit"
                                className="btn btn-primary rsvp-btn"
                                disabled={loading}
                            >
                                {loading ? 'Confirmando...' : (
                                    <>
                                        <FaHeart /> Confirmar Presença
                                    </>
                                )}
                            </button>

                            <p className="rsvp-deadline">
                                Por favor, confirme até <strong>1º de Abril de 2026</strong>
                            </p>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default RSVP;
