import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuth()
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Formulario para Datos del Perfil
  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: errorsProfile } } = useForm({
    defaultValues: {
      // Gracias a la mejora del context, 'user' tiene toda la info
      fullName: user?.full_name || '',
      email: user?.email || '',
    }
  })

  // Formulario para Cambiar Contraseña
  const { register: registerPassword, handleSubmit: handleSubmitPassword, watch: watchPassword, reset: resetPassword, formState: { errors: errorsPassword } } = useForm()
  
  const newPassword = watchPassword('newPassword') // Para comparar contraseñas

  // Handler para actualizar el perfil (nombre)
  const onUpdateProfile = async (data) => {
    try {
      setLoadingProfile(true)
      setMessage({ type: '', text: '' })
      await updateProfile(data.fullName)
      setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' })
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
    } finally {
      setLoadingProfile(false)
    }
  }

  // Handler para actualizar la contraseña
  const onUpdatePassword = async (data) => {
    try {
      setLoadingPassword(true)
      setMessage({ type: '', text: '' })
      await updatePassword(data.newPassword)
      setMessage({ type: 'success', text: '¡Contraseña actualizada con éxito!' })
      resetPassword() // Limpia los campos de contraseña
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="page-content profile-page-container">
      <h2>Mi Perfil</h2>
      <p>Administra tu información personal y tu contraseña.</p>

      {/* Caja de Mensajes de Éxito/Error */}
      {message.text && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Grid de dos columnas para los formularios */}
      <div className="profile-forms-grid">
        {/* --- Formulario de Datos Personales --- */}
        <div className="admin-form-container">
          <h3>Datos Personales</h3>
          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="admin-form">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input 
                {...registerProfile('fullName', { required: 'El nombre es obligatorio' })} 
              />
              {errorsProfile.fullName && <span className="error-message">{errorsProfile.fullName.message}</span>}
            </div>
            
            <div className="form-group">
              <label>Correo Electrónico (no se puede cambiar)</label>
              <input 
                type="email"
                {...registerProfile('email')} 
                disabled 
                style={{ backgroundColor: '#eee', cursor: 'not-allowed' }}
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loadingProfile}>
              {loadingProfile ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* --- Formulario de Contraseña --- */}
        <div className="admin-form-container">
          <h3>Cambiar Contraseña</h3>
          <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="admin-form">
            <div className="form-group">
              <label>Nueva Contraseña</label>
              <input 
                type="password"
                {...registerPassword('newPassword', { 
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' }
                })} 
              />
              {errorsPassword.newPassword && <span className="error-message">{errorsPassword.newPassword.message}</span>}
            </div>

            <div className="form-group">
              <label>Confirmar Nueva Contraseña</label>
              <input 
                type="password"
                {...registerPassword('confirmPassword', { 
                  required: 'Confirma tu contraseña',
                  validate: value => value === newPassword || "Las contraseñas no coinciden"
                })} 
              />
              {errorsPassword.confirmPassword && <span className="error-message">{errorsPassword.confirmPassword.message}</span>}
            </div>
            
            <button type="submit" className="auth-button" disabled={loadingPassword}>
              {loadingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage