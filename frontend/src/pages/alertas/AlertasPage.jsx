import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axiosClient from '../../api/axios';
import styles from './AlertasPage.module.css';

const AlertasPage = () => {
  const [alertas, setAlertas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [alertasRes, resumenRes] = await Promise.all([
          axiosClient.get('/alertas'),
          axiosClient.get('/alertas/resumen')
        ]);
        setAlertas(alertasRes.data);
        setResumen(resumenRes.data);
      } catch (err) {
        console.error('Error cargando alertas:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  if (loading) return <Layout><div className={styles.loading}>Cargando...</div></Layout>;

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Alertas de Inventario</h1>
          <p className={styles.subtitle}>Productos con stock bajo o agotado</p>
        </div>

        <div className={styles.resumenCards}>
          <div className={styles.card}>
            <span className={styles.cardIcon}>📦</span>
            <div>
              <div className={styles.cardValue}>{resumen?.totalProductos ?? 0}</div>
              <div className={styles.cardLabel}>Total Productos</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardWarning}`}>
            <span className={styles.cardIcon}>⚠️</span>
            <div>
              <div className={styles.cardValue}>{resumen?.productosStockBajo ?? 0}</div>
              <div className={styles.cardLabel}>Stock Bajo</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardDanger}`}>
            <span className={styles.cardIcon}>🚫</span>
            <div>
              <div className={styles.cardValue}>{resumen?.productosAgotados ?? 0}</div>
              <div className={styles.cardLabel}>Agotados</div>
            </div>
          </div>
        </div>

        {alertas.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>✅</span>
            <p className={styles.emptyText}>¡Todo en orden! No hay productos con stock bajo.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Unidades Faltantes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alertas.map(a => (
                  <tr key={a.productoId}>
                    <td className={styles.productoNombre}>{a.productoNombre}</td>
                    <td>{a.categoriaNombre}</td>
                    <td className={a.stockActual === 0 ? styles.stockCero : styles.stockBajo}>
                      {a.stockActual}
                    </td>
                    <td>{a.stockMinimo}</td>
                    <td className={styles.faltantes}>{a.unidadesFaltantes}</td>
                    <td>
                      {a.stockActual === 0 ? (
                        <span className={styles.badgeDanger}>Agotado</span>
                      ) : (
                        <span className={styles.badgeWarning}>Stock Bajo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AlertasPage;