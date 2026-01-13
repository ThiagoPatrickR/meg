import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaGift, FaUsers, FaEnvelope, FaCreditCard } from 'react-icons/fa';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = ({ onMenuClick }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard');
            setStats(response.data);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (loading) {
        return (
            <>
                <Header title="Dashboard" onMenuClick={onMenuClick} />
                <div className="admin-content">
                    <p>Carregando...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Dashboard" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon green">
                            <FaGift />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.gifts?.purchased || 0} / {stats?.gifts?.total || 0}</h3>
                            <p>Presentes Comprados</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon pink">
                            <FaUsers />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.rsvps?.totalGuests || 0}</h3>
                            <p>Convidados Confirmados</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <FaEnvelope />
                        </div>
                        <div className="stat-info">
                            <h3>{stats?.messages?.pending || 0}</h3>
                            <p>Recados Pendentes</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon yellow">
                            <FaCreditCard />
                        </div>
                        <div className="stat-info">
                            <h3>{formatCurrency(stats?.payments?.totalRevenue || 0)}</h3>
                            <p>Total em Pagamentos</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="card">
                        <div className="card-header">
                            <h2>Resumo de Presentes</h2>
                        </div>
                        <div className="summary-list">
                            <div className="summary-item">
                                <span>Total de Presentes</span>
                                <strong>{stats?.gifts?.total || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Presentes Disponíveis</span>
                                <strong>{stats?.gifts?.available || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Presentes Comprados</span>
                                <strong>{stats?.gifts?.purchased || 0}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2>Confirmações de Presença</h2>
                        </div>
                        <div className="summary-list">
                            <div className="summary-item">
                                <span>Total de Confirmações</span>
                                <strong>{stats?.rsvps?.total || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Confirmados</span>
                                <strong>{stats?.rsvps?.confirmed || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Total de Convidados</span>
                                <strong>{stats?.rsvps?.totalGuests || 0}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2>Recados</h2>
                        </div>
                        <div className="summary-list">
                            <div className="summary-item">
                                <span>Total de Recados</span>
                                <strong>{stats?.messages?.total || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Pendentes de Aprovação</span>
                                <strong className="pending">{stats?.messages?.pending || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Aprovados</span>
                                <strong>{stats?.messages?.approved || 0}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2>Pagamentos</h2>
                        </div>
                        <div className="summary-list">
                            <div className="summary-item">
                                <span>Total de Pagamentos</span>
                                <strong>{stats?.payments?.total || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Pagamentos Aprovados</span>
                                <strong>{stats?.payments?.approved || 0}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Valor Total Arrecadado</span>
                                <strong className="success">{formatCurrency(stats?.payments?.totalRevenue || 0)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
