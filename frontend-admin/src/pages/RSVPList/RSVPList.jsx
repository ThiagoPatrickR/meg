import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaTrash, FaDownload } from 'react-icons/fa';
import api from '../../services/api';
import './RSVPList.css';

const RSVPList = ({ onMenuClick }) => {
    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRSVPs();
    }, []);

    const fetchRSVPs = async () => {
        try {
            const response = await api.get('/admin/rsvp');
            setRsvps(response.data);
        } catch (error) {
            console.error('Erro ao carregar confirmações:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta confirmação?')) return;

        try {
            await api.delete(`/admin/rsvp/${id}`);
            fetchRSVPs();
        } catch (error) {
            console.error('Erro ao excluir:', error);
        }
    };

    const exportCSV = () => {
        const headers = ['Nome', 'Telefone', 'Email', 'Acompanhantes', 'Data'];
        const rows = rsvps.map(r => [
            r.name,
            r.phone || '',
            r.email || '',
            r.guests,
            new Date(r.createdAt).toLocaleDateString('pt-BR')
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'confirmacoes.csv';
        link.click();
    };

    const totalGuests = rsvps.reduce((acc, r) => acc + r.guests, 0);

    return (
        <>
            <Header title="Confirmações de Presença" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>{rsvps.length}</h3>
                            <p>Confirmações</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>{totalGuests}</h3>
                            <p>Total de Convidados</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2>Lista de Confirmações</h2>
                        <button className="btn btn-secondary" onClick={exportCSV}>
                            <FaDownload /> Exportar CSV
                        </button>
                    </div>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : rsvps.length === 0 ? (
                        <p className="empty-state">Nenhuma confirmação ainda.</p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Telefone</th>
                                        <th>Email</th>
                                        <th>Acompanhantes</th>
                                        <th>Data</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rsvps.map(rsvp => (
                                        <tr key={rsvp.id}>
                                            <td><strong>{rsvp.name}</strong></td>
                                            <td>{rsvp.phone || '-'}</td>
                                            <td>{rsvp.email || '-'}</td>
                                            <td>
                                                <span className="badge badge-info">{rsvp.guests}</span>
                                            </td>
                                            <td>{new Date(rsvp.createdAt).toLocaleDateString('pt-BR')}</td>
                                            <td>
                                                <button className="btn-icon danger" onClick={() => handleDelete(rsvp.id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default RSVPList;
