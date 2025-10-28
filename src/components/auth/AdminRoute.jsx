import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const { user, loading } = useAuth()

  // 1. Esperamos a que termine de cargar la info del usuario
  if (loading) {
    return <div className='page-content'><h2>Cargando...</h2></div>
  }

  // 2. Si no está cargando Y el rol es 'admin',
  //    le permitimos ver el contenido (usando <Outlet />)
  if (!loading && user?.role === 'admin') {
    return <Outlet />
  }

  // 3. Si no es admin, lo redirigimos al Home.
  return <Navigate to="/" replace />
}

export default AdminRoute