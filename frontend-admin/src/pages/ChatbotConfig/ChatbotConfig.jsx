import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import { FaSave, FaRobot } from 'react-icons/fa';
import api from '../../services/api';
import './ChatbotConfig.css';

const ChatbotConfig = ({ onMenuClick }) => {
    const [config, setConfig] = useState({
        systemPrompt: '',
        weddingInfo: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await api.get('/admin/chat/config');
            setConfig({
                systemPrompt: response.data.systemPrompt || '',
                weddingInfo: response.data.weddingInfo || ''
            });
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/chat/config', config);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar configuração');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Configuração do Chatbot" onMenuClick={onMenuClick} />
                <div className="admin-content">
                    <p>Carregando...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Configuração do Chatbot" onMenuClick={onMenuClick} />
            <div className="admin-content">
                <div className="card">
                    <div className="card-header">
                        <h2><FaRobot /> Chatbot com IA</h2>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <FaSave /> {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>

                    {saved && (
                        <div className="success-alert">
                            Configuração salva com sucesso!
                        </div>
                    )}

                    <div className="config-form">
                        <div className="form-group">
                            <label>Prompt do Sistema</label>
                            <p className="form-help">
                                Instrução de como o chatbot deve se comportar. Defina a personalidade e tom de voz.
                            </p>
                            <textarea
                                value={config.systemPrompt}
                                onChange={e => setConfig({ ...config, systemPrompt: e.target.value })}
                                rows={6}
                                placeholder="Você é um assistente virtual do casamento..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Informações do Casamento</label>
                            <p className="form-help">
                                Informações que o chatbot pode usar para responder perguntas dos convidados.
                            </p>
                            <textarea
                                value={config.weddingInfo}
                                onChange={e => setConfig({ ...config, weddingInfo: e.target.value })}
                                rows={10}
                                placeholder="Data: 18 de Abril de 2026&#10;Local: ...&#10;Horário: ...&#10;Dress code: ..."
                            />
                        </div>
                    </div>

                    <div className="config-tips">
                        <h3>💡 Dicas</h3>
                        <ul>
                            <li>Inclua data, local e horário do casamento</li>
                            <li>Adicione informações sobre dress code</li>
                            <li>Mencione detalhes sobre estacionamento</li>
                            <li>Inclua informações sobre a cerimônia e recepção</li>
                            <li>Adicione contato para dúvidas mais específicas</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatbotConfig;
