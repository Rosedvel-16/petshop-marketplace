import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext' // 1. Importa el hook del carrito
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const { user } = useAuth()
  const { addToCart } = useCart() // 2. Obtén la función addToCart
  const navigate = useNavigate()

  const handleAddToCart = () => {
    if (!user) {
      // Si no está logueado, lo mandamos al login
      navigate('/login')
      return
    }
    
    // 3. Llama a la función real del contexto
    addToCart(product)
  }

  return (
    <div className="card product-card">
      <img 
        src={product.image_url || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
        alt={product.name} 
        className="card-image"
      />
      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <div className="card-footer">
          <span className="card-price">S/ {parseFloat(product.price).toFixed(2)}</span>
          <span className="card-stock">Stock: {product.stock}</span>
        </div>
        <button 
          className="add-to-cart-button" 
          onClick={handleAddToCart}
          // 4. (Bonus) Deshabilitar si no hay stock
          disabled={product.stock === 0}
        >
          {product.stock === 0 
            ? "Agotado"
            : (user ? "Añadir al carrito" : "Iniciar sesión para comprar")
          }
        </button>
      </div>
    </div>
  )
}

export default ProductCard