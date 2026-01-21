import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import api from '../../services/api';
import './Payments.css';

const Payments = ({ onMenuClick }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await api.get('/admin/payments');
            setPayments(response.data);
        } catch (error) {
            console.error('Erro ao carregar pagamentos:', error);
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

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-warning', label: 'Pendente' },
            approved: { class: 'badge-success', label: 'Aprovado' },
            rejected: { class: 'badge-danger', label: 'Rejeitado' },
            cancelled: { class: 'badge-danger', label: 'Cancelado' },
        };
        const badge = badges[status] || badges.pending;
        return <span className={`badge ${badge.class}`}>{badge.label}</span>;
    };

    const totalApproved = payments
        .filter(p => p.status === 'approved')
        .reduce((acc, p) => acc + Number(p.amount), 0);

    return (
        <>
            <Header title="Pagamentos" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>{payments.length}</h3>
                            <p>Total de Pagamentos</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>{payments.filter(p => p.status === 'approved').length}</h3>
                            <p>Pagamentos Aprovados</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>{formatCurrency(totalApproved)}</h3>
                            <p>Total Arrecadado</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2>Histórico de Pagamentos</h2>
                    </div>

                    {loading ? (
                        <p>Carregando...</p>
                    ) : payments.length === 0 ? (
                        <p className="empty-state">Nenhum pagamento registrado.</p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Presente</th>
                                        <th>Pagador</th>
                                        <th>Valor</th>
                                        <th>Método</th>
                                        <th>Status</th>
                                        <th>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(payment => (
                                        <tr key={payment.id}>
                                            <td>#{payment.id}</td>
                                            <td>{payment.gift?.title || 'N/A'}</td>
                                            <td>
                                                <div>
                                                    <strong>{payment.payerName || 'Anônimo'}</strong>
                                                    {payment.payerEmail && (
                                                        <small className="payer-email">{payment.payerEmail}</small>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{formatCurrency(payment.amount)}</td>
                                            <td>
                                                <div className="payment-method-cell">
                                                    <span className="method-badge">
                                                        {payment.paymentMethod === 'pix' ? '📱 Pix' :
                                                            payment.paymentMethod === 'card' ? '💳 Cartão' :
                                                                '📦 Externo'}
                                                    </span>
                                                    {payment.receiptUrl && (
                                                        <a
                                                            href={payment.receiptUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="receipt-link"
                                                            title="Ver Recibo"
                                                        >
                                                            📄 Recibo
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{getStatusBadge(payment.status)}</td>
                                            <td>{new Date(payment.createdAt).toLocaleDateString('pt-BR')}</td>
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

export default Payments;
