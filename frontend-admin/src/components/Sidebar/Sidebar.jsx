import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    FaHome, FaGift, FaTags, FaUsers, FaEnvelope,
    FaCreditCard, FaSignOutAlt, FaHeart, FaCog, FaTimes, FaImage
} from 'react-icons/fa';
import './Sidebar.css';

const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/gifts', icon: <FaGift />, label: 'Presentes' },
    { path: '/categories', icon: <FaTags />, label: 'Categorias' },
    { path: '/rsvp', icon: <FaUsers />, label: 'Confirmações' },
    { path: '/messages', icon: <FaEnvelope />, label: 'Recados' },
    { path: '/photos', icon: <FaImage />, label: 'Fotos' },
    { path: '/payments', icon: <FaCreditCard />, label: 'Pagamentos' },
    { path: '/settings', icon: <FaCog />, label: 'Configurações' },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavClick = () => {
        // Fechar sidebar em mobile ao clicar em um item
        if (window.innerWidth <= 768 && onClose) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={onClose} />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <FaHeart />
                    <span>M & G Admin</span>
                    {/* Botão fechar para mobile */}
                    <button className="sidebar-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={handleNavClick}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <button className="sidebar-logout" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Sair</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
