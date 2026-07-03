import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import axiosClient from '../../api/axios';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [resumen, setResumen] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumenRes, reporteRes] = await Promise.all([
          axiosClient.get('/alertas/resumen'),
          axiosClient.get('/reportes/inventario'),
        ]);
        setResumen(resumenRes.data);
        setReporte(reporteRes.data);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout><div className={styles.loading}>Cargando...</div></Layout>;

  return (
    <Layout>
      <div className={styles.page}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Resumen general del inventario</p>

        <div className={styles.cards}>
          <div className={styles.card} onClick={() => navigate('/productos')}>
            <div className={styles.cardIcon}>💻</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValue}>{reporte?.totalProductos ?? 0}</span>
              <span className={styles.cardLabel}>Total Productos</span>
            </div>
          </div>

          <div className={styles.card} onClick={() => navigate('/categorias')}>
            <div className={styles.cardIcon}>🏷️</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValue}>{reporte?.totalCategorias ?? 0}</span>
              <span className={styles.cardLabel}>Categorías</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.warning}`} onClick={() => navigate('/alertas')}>
            <div className={styles.cardIcon}>⚠️</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValue}>{resumen?.productosStockBajo ?? 0}</span>
              <span className={styles.cardLabel}>Stock Bajo</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.danger}`} onClick={() => navigate('/alertas')}>
            <div className={styles.cardIcon}>🚫</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValue}>{resumen?.productosAgotados ?? 0}</span>
              <span className={styles.cardLabel}>Agotados</span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>💰</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardValue}>
                ${Number(reporte?.valorTotalInventario ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className={styles.cardLabel}>Valor del Inventario</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <h2 className={styles.actionsTitle}>Acciones rápidas</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn} onClick={() => navigate('/movimientos')}>
              ➕ Registrar Entrada
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/movimientos')}>
              ➖ Registrar Salida
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/productos')}>
              📦 Nuevo Producto
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/reportes')}>
              📈 Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;