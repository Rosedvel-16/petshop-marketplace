import React from 'react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'

const CartPage = () => {
  const { cartItems, cartTotal } = useCart()

  return (
    <div className="page-content cart-page-container">
      <h2>Carrito de Compras</h2>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Tu carrito de compras está vacío.</p>
          <Link to="/tienda" className="auth-button">
            Volver a la tienda
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          {/* Columna Izquierda: Lista de Items */}
          <div className="cart-items-list">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Columna Derecha: Resumen de Compra */}
          <div className="cart-summary">
            <h3>Resumen del pedido</h3>

            <div className="summary-list">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <strong>Total</strong>
              <strong>S/ {cartTotal.toFixed(2)}</strong>
            </div>

            <Link to="/checkout" className="auth-button proceed-checkout-btn">
              Proceder al pago
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage