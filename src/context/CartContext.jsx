import React, { createContext, useState, useContext } from 'react'

// 1. Crear el Contexto
const CartContext = createContext()

// 2. Crear el Proveedor (Provider)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Añadir producto (o incrementar cantidad si ya existe)
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)

      if (existingItem) {
        // Si ya existe, incrementa la cantidad
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Si es nuevo, añádelo con cantidad 1
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  // Quitar un producto (o decrementar cantidad)
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId)

      if (existingItem.quantity === 1) {
        // Si solo queda 1, elimínalo del array
        return prevItems.filter(item => item.id !== productId)
      } else {
        // Si hay más de 1, reduce la cantidad
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }
    })
  }

  // Eliminar un producto completamente (para el ícono de basura)
  const deleteFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.id !== productId)
    )
  }
  const clearCart = () => {
    setCartItems([])
  }  

  // Calcular el total
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  )

  // Contar el número total de ítems (para el badge del header)
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  )

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// 3. Crear un "hook" para usar el contexto fácilmente
export const useCart = () => {
  return useContext(CartContext)
}