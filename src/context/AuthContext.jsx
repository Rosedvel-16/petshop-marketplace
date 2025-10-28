import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabaseClient'

// 1. Crear el Contexto
const AuthContext = createContext()

// 2. Crear el Proveedor (Provider)
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null) // Este 'user' guardará los datos combinados
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Cargar sesión y perfil al inicio
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        // Si hay sesión, busca el perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        // COMBINAMOS los datos del perfil (nombre, rol) con los de auth (email)
        setUser({ 
          ...profile, 
          email: session.user.email 
        })
      }
      setLoading(false)
    }
    
    fetchSessionAndProfile()

    // 2. Escuchar cambios de autenticación (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        
        if (session) {
          // El usuario acaba de iniciar sesión
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser({ 
            ...profile, 
            email: session.user.email 
          })
        } else {
          // El usuario acaba de cerrar sesión
          setUser(null)
        }
      }
    )

    // Limpieza
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // --- Funciones de Auth (COMPLETAS) ---

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const register = async (fullName, email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  
  const sendPasswordResetEmail = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://petshop-marketplace.vercel.app/reset-password', // A dónde redirigir
    })
    if (error) throw error
  }

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    })
    if (error) throw error
  }

  const updateProfile = async (fullName) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id) // user.id es el UUID
      .select()
      .single()
    
    if (error) throw error

    // Actualiza el estado local del usuario (manteniendo el email)
    setUser(prevUser => ({
      ...prevUser, // Mantiene email, id, rol
      full_name: data.full_name // Actualiza el nombre
    }))
  }

  // 3. Valor que provee el contexto
  const value = {
    session,
    user, // 'user' ahora tiene: id, full_name, role, email
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 3. Hook para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext)
}