import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { FaQrcode, FaCreditCard, FaShippingFast } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient' // 1. IMPORTA EL CLIENTE DE SUPABASE

// Asumiendo que tu imagen está en /public/qr_yape.jpeg
const YAPE_QR_URL = "/qr_yape.jpeg" 

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth() // Obtenemos el usuario logueado
  const navigate = useNavigate()
  
  const [paymentMethod, setPaymentMethod] = useState('tarjeta')
  const [loading, setLoading] = useState(false) // 2. Añade estado de 'cargando'
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    department: '',
    phone: ''
  })

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingAddress(prev => ({ ...prev, [name]: value }))
  }

  // --- 3. FUNCIÓN DE PAGO ACTUALIZADA ---
  const handlePayment = async (e) => {
    e.preventDefault()
    
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      alert("Por favor, completa todos los campos de envío.");
      return;
    }
    
    setLoading(true);

    try {
      // --- INICIO DE LA LÓGICA DE SUPABASE ---
      
      // 1. Inserta en la tabla 'orders'
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id, // ID del usuario logueado
          total: cartTotal,
          status: 'Pendiente',
          shipping_address: shippingAddress.address,
          shipping_city: shippingAddress.city,
          shipping_department: shippingAddress.department,
          shipping_phone: shippingAddress.phone,
        })
        .select()   // Pide que Supabase devuelva la fila que acaba de crear
        .single();  // Sabemos que es solo una

      if (orderError) throw orderError; // Si falla, salta al 'catch'
      
      const newOrderId = orderData.id; // El ID del pedido que acabamos de crear

      // 2. Prepara los items del carrito para la tabla 'order_items'
      const itemsToInsert = cartItems.map(item => ({
        order_id: newOrderId,      // Vincula este item al pedido
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,         // Guarda el precio de ese momento
      }));

      // 3. Inserta todos los items en 'order_items'
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError; // Si falla, salta al 'catch'

      // --- FIN DE LA LÓGICA DE SUPABASE ---

      // 4. Si todo salió bien:
      setLoading(false);
      alert("¡Compra realizada con éxito!\n" +
            `Tu pedido #${newOrderId} ha sido registrado.`
      );
      
      clearCart();
      navigate('/'); // Redirige al home

    } catch (error) {
      // 5. Si algo falló
      setLoading(false);
      console.error('Error al procesar el pedido:', error)
      alert(`Error al procesar tu pedido: ${error.message}`);
    }
  }

  return (
    <div className="page-content checkout-page-container">
      <Link to="/cart" className="back-to-cart-link">
        &larr; Volver al carrito
      </Link>
      <h2>Finalizar compra</h2>
      
      <div className="checkout-content">
        {/* Columna Izquierda: Envío y Pago */}
        <div className="checkout-forms">
          {/* Formulario de Envío (sin cambios) */}
          <div className="shipping-form">
            <h3><FaShippingFast /> Datos de Envío</h3>
            <form id="shipping-form" className="card-payment-form">
              {/* ... (campos de dirección, ciudad, etc. sin cambios) ... */}
              <div className="form-group">
                <label>Dirección</label>
                <input type="text" name="address" placeholder="Av. Siempre Viva 123" required onChange={handleShippingChange} />
              </div>
              <div className="form-group-row">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input type="text" name="city" placeholder="Springfield" required onChange={handleShippingChange} />
                </div>
                <div className="form-group">
                  <label>Departamento</label>
                  <input type="text" name="department" placeholder="Lima" onChange={handleShippingChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Teléfono de Contacto</label>
                <input type="tel" name="phone" placeholder="987654321" required onChange={handleShippingChange} />
              </div>
            </form>
          </div>
          
          {/* Formulario de Pago (con botones deshabilitados si 'loading') */}
          <div className="payment-methods">
            <h3>Método de pago</h3>
            
            <div className="payment-options">
              {/* ... (opciones Yape/Tarjeta sin cambios) ... */}
              <div 
                className={`payment-option ${paymentMethod === 'yape' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('yape')}
              >
                <FaQrcode /> Yape
              </div>
              <div 
                className={`payment-option ${paymentMethod === 'tarjeta' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('tarjeta')}
              >
                <FaCreditCard /> Tarjeta de crédito/débito
              </div>
            </div>

            <div className="payment-details">
              {paymentMethod === 'yape' ? (
                <div className="yape-payment-box">
                  <img src={YAPE_QR_URL} alt="Código QR de Yape" className="yape-qr" />
                  <p>Escanea este código QR con tu app Yape</p>
                  <p className="yape-total">Total: S/ {cartTotal.toFixed(2)}</p>
                  <button 
                    className="auth-button" 
                    onClick={handlePayment} 
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : "Confirmar pago con Yape"}
                  </button>
                </div>
              ) : (
                <form className="card-payment-form" onSubmit={handlePayment}>
                  {/* ... (campos de tarjeta sin cambios) ... */}
                  <div className="form-group">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="form-group">
                    <label>Nombre en la tarjeta</label>
                    <input type="text" placeholder="NOMBRE APELLIDO" required />
                  </div>
                  <div className="form-group-row">
                    <div className="form-group">
                      <label>Fecha de vencimiento</label>
                      <input type="text" placeholder="MM/AA" required />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="123" required />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="auth-button" 
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : `Pagar S/ ${cartTotal.toFixed(2)}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen del Pedido (sin cambios) */}
        <div className="cart-summary">
          {/* ... (contenido del resumen sin cambios) ... */}
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
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage