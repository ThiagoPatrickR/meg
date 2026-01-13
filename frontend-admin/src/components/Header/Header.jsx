import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaBars } from 'react-icons/fa';
import './Header.css';

const Header = ({ title, onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="admin-header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onMenuClick}>
                    <FaBars />
                </button>
                <h1>{title}</h1>
            </div>
            <div className="header-user">
                <FaUser />
                <span>{user?.name || 'Admin'}</span>
            </div>
        </header>
    );
};

export default Header;
