import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axios';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      login(response.data.token, response.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div className={styles.logo}>📦</div>
          <h1 className={styles.title}>Cloud Inventory Pro</h1>
          <p className={styles.subtitle}>Sistema de Gestión de Inventario</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.field}>
            <label className={styles.label}>Usuario</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default LoginPage;