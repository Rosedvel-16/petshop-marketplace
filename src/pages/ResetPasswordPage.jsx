import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ResetPasswordPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [tokenVerified, setTokenVerified] = useState(false)

  const password = watch('password')

  // Supabase maneja el token en la URL por nosotros.
  // Si estamos en esta página, es porque el token ya fue verificado
  // por el AuthContext cuando la app cargó.
  useEffect(() => {
    // El AuthContext maneja el evento 'PASSWORD_RECOVERY'
    // y establece la sesión. Si hay usuario, el token es válido.
    const session = supabase.auth.getSession()
    if (session) {
      setTokenVerified(true)
    } else {
      setError("Token inválido o expirado. Por favor, solicita un nuevo enlace.")
    }
  }, [])

  const onSubmit = async (data) => {
    if (!tokenVerified) {
      setError("No se puede reestablecer la contraseña. Token inválido.")
      return
    }

    try {
      setLoading(true)
      setError('')
      setMessage('')
      await updatePassword(data.password)
      setMessage('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.')

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login')
      }, 3000)

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
          <h2>Reestablecer contraseña</h2>
          <p>Ingresa tu nueva contraseña. Asegúrate de que sea segura.</p>

          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña</label>
            <input 
              id="password"
              type="password"
              {...register("password", { 
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
              })}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", { 
                required: "Confirma tu contraseña",
                validate: value => value === password || "Las contraseñas no coinciden"
              })}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          {message && <div className="form-message success">{message}</div>}
          {error && <div className="form-message error">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading || !tokenVerified}>
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage