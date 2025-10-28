import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const { register, handleSubmit } = useForm()
  const { sendPasswordResetEmail } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      setMessage('')
      await sendPasswordResetEmail(data.email)
      setMessage('¡Revisa tu correo! Te hemos enviado un enlace para reestablecer tu contraseña.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <h2>¿Olvidaste tu contraseña?</h2>
          <p>No te preocupes. Ingresa tu correo y te enviaremos un enlace de recuperación.</p>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register("email", { required: "El correo es obligatorio" })}
            />
          </div>

          {message && <div className="form-message success">{message}</div>}
          {error && <div className="form-message error">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

          <Link to="/login" className="back-to-cart-link" style={{marginTop: '1rem'}}>
            &larr; Volver a Iniciar sesión
          </Link>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage