import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReCAPTCHA from 'react-google-recaptcha'

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const { register: signup } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const captchaRef = useRef(null)
  const [captchaToken, setCaptchaToken] = useState(null)

  // Para validar que las contraseñas coincidan
  const password = watch('password') 

  const onSubmit = async (data) => {
    if (!captchaToken) {
      setAuthError("Por favor, verifica que no eres un robot.")
      return
    }
    
    try {
      setLoading(true)
      setAuthError(null)
      await signup(data.fullName, data.email, data.password)
      setIsSubmitted(true) // Muestra el mensaje de éxito
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Si Supabase pide confirmación, mostramos este mensaje
  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-form-box">
          <h2>¡Revisa tu correo!</h2>
          <p>Te hemos enviado un enlace de confirmación a tu correo electrónico para activar tu cuenta.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-form-box">
        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">Iniciar sesión</Link>
          <Link to="/register" className="auth-tab active">Registrarse</Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <h2>Crear cuenta</h2>
          <p>Regístrate para comenzar a comprar</p>
          
          <div className="form-group">
            <label htmlFor="fullName">Nombre completo</label>
            <input 
              id="fullName"
              placeholder="Juan Pérez"
              {...register("fullName", { required: "El nombre es obligatorio" })}
            />
            {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
          </div>

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
              {...register("password", { 
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
              })}
            />
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input 
              id="confirmPassword"
              type="password"
              placeholder="********"
              {...register("confirmPassword", { 
                required: "Confirma tu contraseña",
                validate: value => value === password || "Las contraseñas no coinciden"
              })}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          <ReCAPTCHA
            ref={captchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
          />
          
          {authError && <span className="error-message">{authError}</span>}
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage