import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Importamos todos los iconos que usaremos
import { 
  FaHeart, FaShoppingCart, FaUser, FaSun, FaMoon, FaSignOutAlt 
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext' // Hook de Autenticación
import { useCart } from '../context/CartContext' // 1. Importamos el hook del Carrito
import { useTheme } from '../context/ThemeContext'

const Header = () => {
  // Usamos los hooks para obtener el estado real
  const { user, logout } = useAuth() 
  const { cartItemCount } = useCart() // 2. Obtenemos la cantidad real del carrito
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  // 3. (IMPORTANTE) Ya NO hay un cartItemCount = 0 de relleno
  
  const handleLogout = async () => {
    // Lógica para cerrar sesión
    try {
      await logout()
      navigate('/') // Redirigimos al home después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="logo">
          <FaHeart size={28} style={{ color: '#E91E63' }} /> 
          <span>PetShop</span>
        </Link>
        <nav className="main-nav">
          <Link to="/tienda">Tienda</Link>
          <Link to="/adopcion">Adopción</Link>
          
          {/* Mostrar enlace a 'Admin' si el rol es admin */}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="admin-link">
              Panel Admin
            </Link>
          )}
        </nav>
        <div className="header-actions">
          <button 
            onClick={toggleTheme} // <-- Se añade el onClick
            className="icon-button" 
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} // El título ahora es dinámico
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          
          {user ? (
            // --- SI ESTÁ LOGUEADO ---
            <>
              <Link to="/cart" className="icon-button cart-button" title="Carrito">
                <FaShoppingCart />
                
                {/* 4. Esta lógica ahora funciona con el estado real */}
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
              <Link to="/profile" className="icon-button" title="Mi Perfil">
                <FaUser />
              </Link>

              {/* Botón de Cerrar Sesión */}
              <button onClick={handleLogout} className="icon-button" title="Cerrar sesión">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            // --- SI NO ESTÁ LOGUEADO ---
            <Link to="/login" className="login-button">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header