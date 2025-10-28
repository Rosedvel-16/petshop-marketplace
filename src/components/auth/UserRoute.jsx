import React from 'react'
import { useAuth } from '../../context/AuthContext' // Esta ruta es correcta
import { Navigate, Outlet } from 'react-router-dom'

const UserRoute = () => {
  const { user, loading } = useAuth()

  // 1. Esperamos a que termine de cargar
  if (loading) {
    return <div className='page-content'><h2>Cargando...</h2></div>
  }

  // 2. Si NO está cargando y SÍ hay un usuario,
  //    le permitimos ver el contenido (Carrito, Checkout)
  if (!loading && user) {
    return <Outlet />
  }

  // 3. Si no hay usuario, lo redirigimos al Login.
  return <Navigate to="/login" replace />
}

export default UserRoute