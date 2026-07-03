import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CategoriasPage from './pages/categorias/CategoriasPage';
import ProductosPage from './pages/productos/ProductosPage';
import MovimientosPage from './pages/movimientos/MovimientosPage';
import AlertasPage from './pages/alertas/AlertasPage';
import ReportesPage from './pages/reportes/ReportesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/categorias" element={<PrivateRoute><CategoriasPage /></PrivateRoute>} />
          <Route path="/productos" element={<PrivateRoute><ProductosPage /></PrivateRoute>} />
          <Route path="/movimientos" element={<PrivateRoute><MovimientosPage /></PrivateRoute>} />
          <Route path="/alertas" element={<PrivateRoute><AlertasPage /></PrivateRoute>} />
          <Route path="/reportes" element={<PrivateRoute><ReportesPage /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;