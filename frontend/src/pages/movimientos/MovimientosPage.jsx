import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axiosClient from '../../api/axios';
import styles from './MovimientosPage.module.css';

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tipoModal, setTipoModal] = useState('ENTRADA');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ productoId: '', cantidad: '' });

  const cargarDatos = async () => {
    try {
      const [movRes, prodRes] = await Promise.all([
        axiosClient.get('/movimientos'),
        axiosClient.get('/productos')
      ]);
      setMovimientos(movRes.data);
      setProductos(prodRes.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const abrirModal = (tipo) => {
    setTipoModal(tipo);
    setForm({ productoId: '', cantidad: '' });
    setError('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setError('');
  };

  const registrar = async () => {
    if (!form.productoId || !form.cantidad) {
      setError('Producto y cantidad son obligatorios');
      return;
    }
    if (parseInt(form.cantidad) <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }
    try {
      await axiosClient.post('/movimientos', {
        tipo: tipoModal,
        cantidad: parseInt(form.cantidad),
        productoId: parseInt(form.productoId)
      });
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar movimiento');
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Movimientos</h1>
            <p className={styles.subtitle}>Registro de entradas y salidas de inventario</p>
          </div>
          <div className={styles.headerButtons}>
            <button className={styles.btnEntrada} onClick={() => abrirModal('ENTRADA')}>
              ➕ Registrar Entrada
            </button>
            <button className={styles.btnSalida} onClick={() => abrirModal('SALIDA')}>
              ➖ Registrar Salida
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : movimientos.length === 0 ? (
          <div className={styles.empty}>
            <p>No hay movimientos registrados aún.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Stock Resultante</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span className={m.tipo === 'ENTRADA' ? styles.badgeEntrada : styles.badgeSalida}>
                        {m.tipo === 'ENTRADA' ? '⬆ Entrada' : '⬇ Salida'}
                      </span>
                    </td>
                    <td>{m.productoNombre}</td>
                    <td className={m.tipo === 'ENTRADA' ? styles.cantidadEntrada : styles.cantidadSalida}>
                      {m.tipo === 'ENTRADA' ? '+' : '-'}{m.cantidad}
                    </td>
                    <td>{m.stockActual} unidades</td>
                    <td>{formatFecha(m.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <div className={`${styles.modalHeader} ${tipoModal === 'ENTRADA' ? styles.headerEntrada : styles.headerSalida}`}>
                <h2 className={styles.modalTitle}>
                  {tipoModal === 'ENTRADA' ? '➕ Registrar Entrada' : '➖ Registrar Salida'}
                </h2>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label className={styles.label}>Producto *</label>
                  <select
                    className={styles.input}
                    value={form.productoId}
                    onChange={e => setForm({ ...form, productoId: e.target.value })}
                  >
                    <option value="">Seleccionar producto...</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} — Stock actual: {p.stock}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Cantidad *</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    value={form.cantidad}
                    onChange={e => setForm({ ...form, cantidad: e.target.value })}
                    placeholder="0"
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.modalActions}>
                  <button className={styles.btnSecondary} onClick={cerrarModal}>Cancelar</button>
                  <button
                    className={tipoModal === 'ENTRADA' ? styles.btnEntrada : styles.btnSalida}
                    onClick={registrar}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MovimientosPage;