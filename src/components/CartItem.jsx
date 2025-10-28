import React from 'react'
import { useCart } from '../context/CartContext'
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa'

const CartItem = ({ item }) => {
  const { addToCart, removeFromCart, deleteFromCart } = useCart()

  return (
    <div className="cart-item">
      <img 
        src={item.image_url} 
        alt={item.name} 
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p>{item.description.substring(0, 100)}...</p>
        <span className="cart-item-price">S/ {parseFloat(item.price).toFixed(2)}</span>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-control">
          {/* Botón de restar */}
          <button 
            className="quantity-btn" 
            onClick={() => removeFromCart(item.id)}
          >
            <FaMinus />
          </button>

          <span className="quantity-display">{item.quantity}</span>

          {/* Botón de sumar */}
          <button 
            className="quantity-btn" 
            onClick={() => addToCart(item)}
          >
            <FaPlus />
          </button>
        </div>

        <span className="cart-item-subtotal">
          S/ {(parseFloat(item.price) * item.quantity).toFixed(2)}
        </span>

        {/* Botón de eliminar */}
        <button 
          className="delete-btn" 
          title="Eliminar producto"
          onClick={() => deleteFromCart(item.id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default CartItem