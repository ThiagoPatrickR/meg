import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaHeart, FaPaperPlane, FaUsers, FaHome, FaRing } from 'react-icons/fa';
import api from '../../services/api';
import './Messages.css';

const authorTypeLabels = {
    friend: { label: 'Amigo(a)', icon: <FaUsers /> },
    family: { label: 'Familiar', icon: <FaHome /> },
    godparent: { label: 'Padrinho/Madrinha', icon: <FaRing /> }
};

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        authorName: '',
        authorType: 'friend',
        content: ''
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/messages/public');
            setMessages(response.data);
        } catch (error) {
            console.error('Erro ao carregar recados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.authorName || !formData.content) {
            alert('Por favor, preencha seu nome e mensagem');
            return;
        }

        setSending(true);
        try {
            await api.post('/messages', formData);
            setSent(true);
            setFormData({ authorName: '', authorType: 'friend', content: '' });
            setTimeout(() => setSent(false), 5000);
        } catch (error) {
            console.error('Erro ao enviar recado:', error);
            alert('Erro ao enviar recado. Tente novamente.');
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="messages" id="recados">
            <div className="container">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Recados para os Noivos</h2>
                    <p>Deixe uma mensagem especial para Marcelo e Gabriella</p>
                </motion.div>

                <div className="messages-container">
                    {/* Message Form */}
                    <motion.div
                        className="message-form-container"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3><FaHeart /> Deixe seu Recado</h3>

                        {sent ? (
                            <div className="sent-success">
                                <FaHeart />
                                <p>Recado enviado com sucesso! Aguarde aprovação dos noivos.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="message-form">
                                <div className="form-group">
                                    <label><FaUser /> Seu Nome</label>
                                    <input
                                        type="text"
                                        placeholder="Digite seu nome"
                                        value={formData.authorName}
                                        onChange={e => setFormData({ ...formData, authorName: e.target.value })}
                                        required
                                    />
                                </div>



                                <div className="form-group">
                                    <label>Sua Mensagem</label>
                                    <textarea
                                        placeholder="Escreva sua mensagem de carinho para os noivos..."
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={sending}>
                                    <FaPaperPlane /> {sending ? 'Enviando...' : 'Enviar Recado'}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Messages Display */}
                    <motion.div
                        className="messages-display"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3><FaHeart /> Mural de Recados</h3>

                        {loading ? (
                            <p className="loading">Carregando recados...</p>
                        ) : messages.length === 0 ? (
                            <p className="no-messages">Seja o primeiro a deixar um recado!</p>
                        ) : (
                            <div className="messages-list">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg.id}
                                        className="message-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="message-header">
                                            <span className="message-author">{msg.authorName}</span>

                                        </div>
                                        <p className="message-content">"{msg.content}"</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Messages;
