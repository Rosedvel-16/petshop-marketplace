import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import PetCard from '../components/PetCard' // Importamos la tarjeta de mascota
import { FaSearch } from 'react-icons/fa'

const AdopcionPage = () => {
  const [pets, setPets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 1. Cargar mascotas y categorías
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const { data: petData, error: petError } = await supabase
        .from('pets') // Leemos de la tabla 'pets'
        .select('*') 

      const { data: categoryData, error: categoryError } = await supabase
        .from('pet_categories') // Leemos de 'pet_categories'
        .select('*')

      if (petError || categoryError) {
        setError(petError?.message || categoryError?.message)
      } else {
        setPets(petData)
        setCategories(categoryData)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // 2. Lógica para filtrar las mascotas
  const filteredPets = pets
    .filter(pet => 
      selectedCategory === 'all' || pet.category_id.toString() === selectedCategory
    )
    .filter(pet => 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()))
    )

  // 3. Renderizado
  if (loading) return <div className="page-content"><h2>Cargando perritos y gatitos...</h2></div>
  if (error) return <div className="page-content"><h2>Error: {error}</h2></div>

  return (
    <div className="page-content">
      {/* Banner de Adopción */}
      <div className="adoption-info-box">
        <h2>Adopción de Perritos y Gatitos</h2>
        <p>Dale un hogar a estos adorables amigos que buscan una familia. Todos nuestros animalitos están vacunados y desparasitados. El proceso de adopción incluye una visita domiciliaria y seguimiento post-adopción.</p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="filters-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o raza..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-filter">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Perros y Gatos</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cuadrícula de Mascotas */}
      {filteredPets.length > 0 ? (
        <div className="product-grid"> {/* Reutilizamos la clase .product-grid */}
          {filteredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <p>No se encontraron mascotas que coincidan con tu búsqueda.</p>
      )}

    </div>
  )
}

export default AdopcionPage