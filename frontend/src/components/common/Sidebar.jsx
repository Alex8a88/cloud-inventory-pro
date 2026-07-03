import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/productos', label: 'Productos', icon: '💻' },
  { path: '/categorias', label: 'Categorías', icon: '🏷️' },
  { path: '/movimientos', label: 'Movimientos', icon: '🔄' },
  { path: '/alertas', label: 'Alertas', icon: '⚠️' },
  { path: '/reportes', label: 'Reportes', icon: '📈' },
];

const Sidebar = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>📦</span>
        <span className={styles.brandName}>Cloud Inventory</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          <span className={styles.userIcon}>👤</span>
          <span className={styles.username}>{username}</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;