import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaSave, FaMapMarkerAlt, FaQrcode } from 'react-icons/fa';
import api from '../../services/api';
import './Settings.css';

const Settings = ({ onMenuClick }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        recipientName: '',
        street: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        deliveryNote: '',
        pixKey: '',
        pixKeyType: 'cpf',
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            const data = response.data;
            setFormData({
                recipientName: data.recipientName || '',
                street: data.street || '',
                complement: data.complement || '',
                neighborhood: data.neighborhood || '',
                city: data.city || '',
                state: data.state || '',
                zipCode: data.zipCode || '',
                deliveryNote: data.deliveryNote || '',
                pixKey: data.pixKey || '',
                pixKeyType: data.pixKeyType || 'cpf',
            });
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put('/admin/settings', formData);
            alert('Configurações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar configurações:', error);
            alert('Erro ao salvar configurações');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <>
                <Header title="Configurações" onMenuClick={onMenuClick} />
                <div className="admin-content">
                    <div className="card">
                        <p>Carregando...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Configurações" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <form onSubmit={handleSubmit}>
                    {/* Seção Endereço */}
                    <div className="card">
                        <div className="card-header">
                            <h2><FaMapMarkerAlt /> Endereço de Entrega</h2>
                        </div>
                        <p className="settings-description">
                            Configure o endereço de entrega que será exibido para os convidados
                            quando eles clicarem em "Endereço" nos presentes da lista.
                        </p>

                        <div className="settings-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Destinatário</label>
                                    <input
                                        type="text"
                                        name="recipientName"
                                        value={formData.recipientName}
                                        onChange={handleChange}
                                        placeholder="Ex: Marcelo e Gabriella"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group flex-2">
                                    <label>Rua e Número *</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="Ex: Rua das Flores, 123"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Complemento</label>
                                    <input
                                        type="text"
                                        name="complement"
                                        value={formData.complement}
                                        onChange={handleChange}
                                        placeholder="Ex: Apto 101"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Bairro *</label>
                                    <input
                                        type="text"
                                        name="neighborhood"
                                        value={formData.neighborhood}
                                        onChange={handleChange}
                                        placeholder="Ex: Centro"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cidade *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Ex: Anápolis"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Estado *</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecione</option>
                                        <option value="AC">AC</option>
                                        <option value="AL">AL</option>
                                        <option value="AP">AP</option>
                                        <option value="AM">AM</option>
                                        <option value="BA">BA</option>
                                        <option value="CE">CE</option>
                                        <option value="DF">DF</option>
                                        <option value="ES">ES</option>
                                        <option value="GO">GO</option>
                                        <option value="MA">MA</option>
                                        <option value="MT">MT</option>
                                        <option value="MS">MS</option>
                                        <option value="MG">MG</option>
                                        <option value="PA">PA</option>
                                        <option value="PB">PB</option>
                                        <option value="PR">PR</option>
                                        <option value="PE">PE</option>
                                        <option value="PI">PI</option>
                                        <option value="RJ">RJ</option>
                                        <option value="RN">RN</option>
                                        <option value="RS">RS</option>
                                        <option value="RO">RO</option>
                                        <option value="RR">RR</option>
                                        <option value="SC">SC</option>
                                        <option value="SP">SP</option>
                                        <option value="SE">SE</option>
                                        <option value="TO">TO</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>CEP *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        placeholder="Ex: 75000-000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Observação para Entrega</label>
                                <textarea
                                    name="deliveryNote"
                                    value={formData.deliveryNote}
                                    onChange={handleChange}
                                    placeholder="Ex: Após a compra, por favor nos avise para registrarmos o presente!"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção Pix */}
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-header">
                            <h2><FaQrcode /> Chave Pix</h2>
                        </div>
                        <p className="settings-description">
                            Configure a chave Pix que será exibida quando os convidados
                            clicarem em "Enviar Valor" para contribuir com um presente.
                        </p>

                        <div className="settings-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tipo da Chave</label>
                                    <select
                                        name="pixKeyType"
                                        value={formData.pixKeyType}
                                        onChange={handleChange}
                                    >
                                        <option value="cpf">CPF</option>
                                        <option value="cnpj">CNPJ</option>
                                        <option value="email">E-mail</option>
                                        <option value="telefone">Telefone</option>
                                        <option value="aleatoria">Chave Aleatória</option>
                                    </select>
                                </div>
                                <div className="form-group flex-2">
                                    <label>Chave Pix</label>
                                    <input
                                        type="text"
                                        name="pixKey"
                                        value={formData.pixKey}
                                        onChange={handleChange}
                                        placeholder="Ex: 123.456.789-00 ou email@exemplo.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions" style={{ marginTop: '20px' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            <FaSave /> {saving ? 'Salvando...' : 'Salvar Configurações'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Settings;
