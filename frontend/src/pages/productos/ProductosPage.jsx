import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axiosClient from '../../api/axios';
import styles from './ProductosPage.module.css';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '',
    stock: '', stockMinimo: '', categoriaId: ''
  });

  const cargarDatos = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/productos'),
        axiosClient.get('/categorias')
      ]);
      setProductos(prodRes.data);
      setCategorias(catRes.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const abrirModal = (producto = null) => {
    setEditando(producto);
    setForm(producto ? {
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      categoriaId: producto.categoriaId
    } : { nombre: '', descripcion: '', precio: '', stock: '', stockMinimo: '5', categoriaId: '' });
    setError('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setError('');
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async () => {
    if (!form.nombre || !form.precio || !form.categoriaId) {
      setError('Nombre, precio y categoría son obligatorios');
      return;
    }
    try {
      const payload = {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        stockMinimo: parseInt(form.stockMinimo),
        categoriaId: parseInt(form.categoriaId)
      };
      if (editando) {
        await axiosClient.put(`/productos/${editando.id}`, payload);
      } else {
        await axiosClient.post('/productos', payload);
      }
      cerrarModal();
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await axiosClient.delete(`/productos/${id}`);
      cargarDatos();
    } catch (err) {
      alert('No se puede eliminar un producto con movimientos asociados');
    }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Productos</h1>
            <p className={styles.subtitle}>Gestión del catálogo de productos</p>
          </div>
          <button className={styles.btnPrimary} onClick={() => abrirModal()}>
            + Nuevo Producto
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Stock Mín.</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productName}>{p.nombre}</div>
                      {p.descripcion && <div className={styles.productDesc}>{p.descripcion}</div>}
                    </td>
                    <td>{p.categoriaNombre}</td>
                    <td>${Number(p.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td>{p.stock}</td>
                    <td>{p.stockMinimo}</td>
                    <td>
                      {p.stock === 0 ? (
                        <span className={styles.badgeDanger}>Agotado</span>
                      ) : p.stockBajo ? (
                        <span className={styles.badgeWarning}>Stock Bajo</span>
                      ) : (
                        <span className={styles.badgeOk}>OK</span>
                      )}
                    </td>
                    <td>
                      <button className={styles.btnEdit} onClick={() => abrirModal(p)}>Editar</button>
                      <button className={styles.btnDelete} onClick={() => eliminar(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>
                {editando ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <div className={styles.grid}>
                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Nombre *</label>
                  <input className={styles.input} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" />
                </div>
                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.label}>Descripción</label>
                  <input className={styles.input} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción opcional" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Precio *</label>
                  <input className={styles.input} name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="0.00" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Categoría *</label>
                  <select className={styles.input} name="categoriaId" value={form.categoriaId} onChange={handleChange}>
                    <option value="">Seleccionar...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Stock inicial</label>
                  <input className={styles.input} name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Stock mínimo</label>
                  <input className={styles.input} name="stockMinimo" type="number" value={form.stockMinimo} onChange={handleChange} placeholder="5" />
                </div>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <div className={styles.modalActions}>
                <button className={styles.btnSecondary} onClick={cerrarModal}>Cancelar</button>
                <button className={styles.btnPrimary} onClick={guardar}>Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductosPage;