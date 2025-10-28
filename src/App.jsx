import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// --- Páginas Públicas ---
import HomePage from './pages/HomePage'
import AdopcionPage from './pages/AdopcionPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// --- Páginas Protegidas (Usuario) ---
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage' 

// --- Páginas Protegidas (Admin) ---
import AdminPage from './pages/AdminPage'

// --- Componentes de Rutas Protegidas ---
// (Asegurándonos de usar la ruta correcta a tu carpeta 'auth')
import AdminRoute from './components/auth/AdminRoute' 
import UserRoute from './components/auth/UserRoute'


function App() {
  return (
    <Routes>
      {/* Todas las rutas usan el Layout (Header y Footer) */}
      <Route path="/" element={<Layout />}>

        {/* --- Rutas Públicas --- */}
        <Route index element={<HomePage />} />
        <Route path="tienda" element={<HomePage />} />
        <Route path="adopcion" element={<AdopcionPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route element={<UserRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* --- Ruta Protegida para Administradores --- */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminPage />} />
        </Route>

      </Route>
    </Routes>
  )
}

export default App