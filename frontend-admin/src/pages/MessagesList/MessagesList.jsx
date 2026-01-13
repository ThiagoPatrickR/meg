import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import './MessagesList.css';

const authorTypeLabels = {
    friend: 'Amigo(a)',
    family: 'Familiar',
    godparent: 'Padrinho/Madrinha'
};

const MessagesList = ({ onMenuClick }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/admin/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Erro ao carregar recados:', error);
        } finally {
            setLoading(false);
        }
    };

    const approve = async (id) => {
        try {
            await api.put(`/admin/messages/${id}/approve`);
            fetchMessages();
        } catch (error) {
            console.error('Erro ao aprovar:', error);
        }
    };

    const reject = async (id) => {
        try {
            await api.put(`/admin/messages/${id}/reject`);
            fetchMessages();
        } catch (error) {
            console.error('Erro ao rejeitar:', error);
        }
    };

    const remove = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este recado?')) return;

        try {
            await api.delete(`/admin/messages/${id}`);
            fetchMessages();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    const filteredMessages = filter === 'all'
        ? messages
        : filter === 'pending'
            ? messages.filter(m => !m.approved)
            : messages.filter(m => m.approved);

    const pendingCount = messages.filter(m => !m.approved).length;

    return (
        <>
            <Header title="Recados" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="card">
                    <div className="card-header">
                        <h2>
                            Recados ({messages.length})
                            {pendingCount > 0 && (
                                <span className="pending-badge">{pendingCount} pendente(s)</span>
                            )}
                        </h2>
                        <div className="filter-buttons">
                            <button
                                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setFilter('all')}
                            >
                                Todos
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setFilter('pending')}
                            >
                                Pendentes
                            </button>
                            <button
                                className={`btn btn-sm ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setFilter('approved')}
                            >
                                Aprovados
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : filteredMessages.length === 0 ? (
                        <p className="empty-state">Nenhum recado encontrado.</p>
                    ) : (
                        <div className="messages-list">
                            {filteredMessages.map(msg => (
                                <div key={msg.id} className={`message-item ${msg.approved ? 'approved' : 'pending'}`}>
                                    <div className="message-header">
                                        <div>
                                            <strong>{msg.authorName}</strong>
                                            <span className="author-type">{authorTypeLabels[msg.authorType]}</span>
                                        </div>
                                        <span className={`badge ${msg.approved ? 'badge-success' : 'badge-warning'}`}>
                                            {msg.approved ? 'Aprovado' : 'Pendente'}
                                        </span>
                                    </div>
                                    <p className="message-content">"{msg.content}"</p>
                                    <div className="message-footer">
                                        <span className="message-date">
                                            {new Date(msg.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                        <div className="message-actions">
                                            {!msg.approved && (
                                                <button className="btn btn-sm btn-primary" onClick={() => approve(msg.id)}>
                                                    <FaCheck /> Aprovar
                                                </button>
                                            )}
                                            {msg.approved && (
                                                <button className="btn btn-sm btn-outline" onClick={() => reject(msg.id)}>
                                                    <FaTimes /> Rejeitar
                                                </button>
                                            )}
                                            <button className="btn-icon danger" onClick={() => remove(msg.id)}>
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MessagesList;
