import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard' // Importamos la tarjeta
import { FaSearch } from 'react-icons/fa'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 1. Cargar productos y categorías al inicio
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      // Cargar productos
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*') // Traer todos los productos

      // Cargar categorías
      const { data: categoryData, error: categoryError } = await supabase
        .from('product_categories')
        .select('*')

      if (productError || categoryError) {
        setError(productError?.message || categoryError?.message)
      } else {
        setProducts(productData)
        setCategories(categoryData)
      }
      setLoading(false)
    }
    fetchData()
  }, []) // Se ejecuta solo una vez al cargar

  // 2. Lógica para filtrar los productos
  const filteredProducts = products
    .filter(product => 
      // Filtro por categoría
      selectedCategory === 'all' || product.category_id.toString() === selectedCategory
    )
    .filter(product => 
      // Filtro por búsqueda (nombre)
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // 3. Renderizado
  if (loading) return <div className="page-content"><h2>Cargando productos...</h2></div>
  if (error) return <div className="page-content"><h2>Error: {error}</h2></div>

  return (
    <div className="page-content">
      {/* Banner de Bienvenida (como solicitaste) */}
      <div 
        className="home-banner" 
        style={{ backgroundImage: 'url(https://peruretail.sfo3.cdn.digitaloceanspaces.com/wp-content/uploads/Customer-Loyalty-Store-Education-scaled-1.jpg)' }}
      >
        <div className="banner-content">
          <h1>Tienda de Artículos para Mascotas</h1>
          <p>Encuentra todo lo que tu mascota necesita</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="filters-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cuadrícula de Productos */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
      )}

    </div>
  )
}

export default HomePage