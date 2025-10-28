import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setAuthError(null)
      await login(data.email, data.password)
      navigate('/') // Redirige al Home después del login
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <div className="auth-tabs">
          <Link to="/login" className="auth-tab active">Iniciar sesión</Link>
          <Link to="/register" className="auth-tab">Registrarse</Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <h2>Iniciar sesión</h2>
          <p>Ingresa a tu cuenta para realizar compras</p>
          
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email", { required: "El correo es obligatorio" })}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password"
              placeholder="********"
              {...register("password", { required: "La contraseña es obligatoria" })}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
            
            <Link to="/forgot-password" className="forgot-password-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          {authError && <span className="error-message">{authError}</span>}
          
          {/* Aquí podrías añadir un Link a "/olvide-contraseña" */}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage