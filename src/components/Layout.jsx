import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* Outlet renderizará el componente de la ruta actual */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout