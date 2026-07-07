import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import axiosClient from '../../api/axios';
import styles from './CategoriasPage.module.css';

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const cargarCategorias = async () => {
    try {
      const res = await axiosClient.get('/categorias');
      setCategorias(res.data);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarCategorias(); }, []);

  const abrirModal = (categoria = null) => {
    setEditando(categoria);
    setNombre(categoria ? categoria.nombre : '');
    setError('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setNombre('');
    setError('');
  };

  const guardar = async () => {
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    try {
      if (editando) {
        await axiosClient.put(`/categorias/${editando.id}`, { nombre });
      } else {
        await axiosClient.post('/categorias', { nombre });
      }
      cerrarModal();
      cargarCategorias();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await axiosClient.delete(`/categorias/${id}`);
      cargarCategorias();
    } catch (err) {
      alert('No se puede eliminar una categoría con productos asociados');
    }
  };

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Categorías</h1>
            <p className={styles.subtitle}>Gestión de categorías de productos</p>
          </div>
          <button className={styles.btnPrimary} onClick={() => abrirModal()}>
            + Nueva Categoría
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(cat => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.nombre}</td>
                    <td>
                      <button className={styles.btnEdit} onClick={() => abrirModal(cat)}>Editar</button>
                      <button className={styles.btnDelete} onClick={() => eliminar(cat.id)}>Eliminar</button>
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
                {editando ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <div className={styles.field}>
                <label className={styles.label}>Nombre</label>
                <input
                  className={styles.input}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre de la categoría"
                />
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

export default CategoriasPage;