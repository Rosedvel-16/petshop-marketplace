import React from 'react'
import { FaHeart } from 'react-icons/fa' // Usaremos un corazón para "solicitar"

// 'pet' será un objeto con { name, breed, age, image_url, ... }
const PetCard = ({ pet }) => {

  const handleRequestAdoption = () => {
    // TODO: Lógica para solicitar adopción (Paso futuro)
    // Por ahora, solo una alerta
    alert(`Has solicitado adoptar a ${pet.name}. ¡Nos pondremos en contacto contigo! (simulación)`)
  }

  return (
    <div className="card pet-card">
      <img 
        src={pet.image_url || 'https://via.placeholder.com/300x300?text=Sin+Foto'} 
        alt={pet.name} 
        className="card-image"
      />
      <div className="card-content">
        <div className="pet-card-header">
          <h3 className="card-title">{pet.name}</h3>
          <span className="pet-size-tag">{pet.size || 'Mediano'}</span>
        </div>
        <p className="pet-details">
          {pet.breed || 'Mestizo'} • {pet.age || '?'} años • {pet.gender || 'N/A'}
        </p>
        <p className="card-description">{pet.description}</p>

        <button 
          className="request-adoption-button" 
          onClick={handleRequestAdoption}
        >
          <FaHeart style={{ marginRight: '0.5rem' }} />
          Solicitar adopción
        </button>
      </div>
    </div>
  )
}

export default PetCard