import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axiosClient from '../../api/axios';
import styles from './ReportesPage.module.css';

const ReportesPage = () => {
  const [inventario, setInventario] = useState(null);
  const [movimientos, setMovimientos] = useState(null);
  const [masMovidos, setMasMovidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [invRes, movRes, masRes] = await Promise.all([
          axiosClient.get('/reportes/inventario'),
          axiosClient.get('/reportes/movimientos'),
          axiosClient.get('/reportes/productos-mas-movidos')
        ]);
        setInventario(invRes.data);
        setMovimientos(movRes.data);
        setMasMovidos(masRes.data);
      } catch (err) {
        console.error('Error cargando reportes:', err);
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
          <h1 className={styles.title}>Reportes</h1>
          <p className={styles.subtitle}>Indicadores y estadísticas del inventario</p>
        </div>

        {/* Reporte de Inventario */}
        <h2 className={styles.sectionTitle}>📦 Inventario General</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>💻</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{inventario?.totalProductos ?? 0}</div>
              <div className={styles.cardLabel}>Total Productos</div>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🏷️</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{inventario?.totalCategorias ?? 0}</div>
              <div className={styles.cardLabel}>Categorías</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardWarning}`}>
            <div className={styles.cardIcon}>⚠️</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{inventario?.productosStockBajo ?? 0}</div>
              <div className={styles.cardLabel}>Stock Bajo</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardDanger}`}>
            <div className={styles.cardIcon}>🚫</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{inventario?.productosAgotados ?? 0}</div>
              <div className={styles.cardLabel}>Agotados</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardGreen}`}>
            <div className={styles.cardIcon}>💰</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>
                ${Number(inventario?.valorTotalInventario ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </div>
              <div className={styles.cardLabel}>Valor Total</div>
            </div>
          </div>
        </div>

        {/* Reporte de Movimientos */}
        <h2 className={styles.sectionTitle}>🔄 Movimientos</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📋</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{movimientos?.totalMovimientos ?? 0}</div>
              <div className={styles.cardLabel}>Total Movimientos</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardGreen}`}>
            <div className={styles.cardIcon}>⬆️</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{movimientos?.totalEntradas ?? 0}</div>
              <div className={styles.cardLabel}>Entradas</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardDanger}`}>
            <div className={styles.cardIcon}>⬇️</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{movimientos?.totalSalidas ?? 0}</div>
              <div className={styles.cardLabel}>Salidas</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardGreen}`}>
            <div className={styles.cardIcon}>📥</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{movimientos?.unidadesIngresadas ?? 0}</div>
              <div className={styles.cardLabel}>Unidades Ingresadas</div>
            </div>
          </div>
          <div className={`${styles.card} ${styles.cardDanger}`}>
            <div className={styles.cardIcon}>📤</div>
            <div className={styles.cardInfo}>
              <div className={styles.cardValue}>{movimientos?.unidadesEgresadas ?? 0}</div>
              <div className={styles.cardLabel}>Unidades Egresadas</div>
            </div>
          </div>
        </div>

        {/* Productos más movidos */}
        <h2 className={styles.sectionTitle}>📈 Productos más movidos</h2>
        {masMovidos.length === 0 ? (
          <div className={styles.empty}>No hay movimientos registrados aún.</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Total Movimientos</th>
                </tr>
              </thead>
              <tbody>
                {masMovidos.map((p, index) => (
                  <tr key={p.productoId}>
                    <td className={styles.rank}>#{index + 1}</td>
                    <td className={styles.productoNombre}>{p.productoNombre}</td>
                    <td>{p.categoriaNombre}</td>
                    <td className={styles.totalMov}>{p.totalMovimientos}</td>
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

export default ReportesPage;