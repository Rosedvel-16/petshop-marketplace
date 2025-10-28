import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabaseClient'

// Un componente separado para el formulario de productos
const ProductForm = ({ categories, onFormSubmit, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    await onFormSubmit(data, 'products', reset)
  }

  return (
    <div className="admin-form-container">
      <h3>Añadir Nuevo Producto</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
        {/* ... (campos de producto, sin cambios) ... */}
        <div className="form-group">
          <label>Nombre del Producto</label>
          <input {...register('name', { required: 'El nombre es obligatorio' })} />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea {...register('description')} />
        </div>
        <div className="form-group">
          <label>URL de la Imagen</label>
          <input type="text" placeholder="https://ejemplo.com/imagen.jpg" {...register('image_url', { required: 'La URL de la imagen es obligatoria' })} />
          {errors.image_url && <span className="error-message">{errors.image_url.message}</span>}
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <label>Precio (S/)</label>
            <input type="number" step="0.01" {...register('price', { required: 'El precio es obligatorio', valueAsNumber: true })} />
            {errors.price && <span className="error-message">{errors.price.message}</span>}
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" {...register('stock', { required: 'El stock es obligatorio', valueAsNumber: true, min: 0 })} />
            {errors.stock && <span className="error-message">{errors.stock.message}</span>}
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select {...register('category_id', { required: 'La categoría es obligatoria', valueAsNumber: true })}>
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <span className="error-message">{errors.category_id.message}</span>}
          </div>
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Añadiendo...' : 'Añadir Producto'}
        </button>
      </form>
    </div>
  )
}

// NUEVO: Componente para el formulario de mascotas
const PetForm = ({ categories, onFormSubmit, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    // Convierte 'age' a número
    const formData = { ...data, age: parseInt(data.age, 10) }
    await onFormSubmit(formData, 'pets', reset)
  }

  return (
    <div className="admin-form-container">
      <h3>Añadir Mascota en Adopción</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
        <div className="form-group">
          <label>Nombre de la Mascota</label>
          <input {...register('name', { required: 'El nombre es obligatorio' })} />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label>URL de la Imagen</label>
          <input type="text" placeholder="https://ejemplo.com/imagen.jpg" {...register('image_url', { required: 'La URL es obligatoria' })} />
          {errors.image_url && <span className="error-message">{errors.image_url.message}</span>}
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea {...register('description')} />
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <label>Raza</label>
            <input {...register('breed')} />
          </div>
          <div className="form-group">
            <label>Edad (años)</label>
            <input type="number" min="0" {...register('age')} />
          </div>
          <div className="form-group">
            <label>Género</label>
            <select {...register('gender')}>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <label>Tamaño</label>
            <select {...register('size')}>
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select {...register('category_id', { required: 'La categoría es obligatoria', valueAsNumber: true })}>
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <span className="error-message">{errors.category_id.message}</span>}
          </div>
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Añadiendo...' : 'Añadir Mascota'}
        </button>
      </form>
    </div>
  )
}

// --- Componente Principal de la Página de Admin ---
const AdminPage = () => {
  const [productCategories, setProductCategories] = useState([])
  const [petCategories, setPetCategories] = useState([]) // NUEVO
  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState({ type: '', text: '' })

  // Cargar AMBOS tipos de categorías
  useEffect(() => {
    const fetchCategories = async () => {
      // Cargar categorías de productos
      const { data: productCats } = await supabase
        .from('product_categories')
        .select('id, name')
      if (productCats) setProductCategories(productCats)
      
      // Cargar categorías de mascotas
      const { data: petCats } = await supabase
        .from('pet_categories')
        .select('id, name')
      if (petCats) setPetCategories(petCats)
    }
    fetchCategories()
  }, [])

  // Función genérica para manejar el envío de CUALQUIER formulario
  const handleFormSubmit = async (data, tableName, resetForm) => {
    try {
      setLoading(true)
      setFormMessage({ type: '', text: '' })

      const { error } = await supabase.from(tableName).insert(data)
      
      if (error) throw error

      setFormMessage({ type: 'success', text: `¡${tableName === 'products' ? 'Producto' : 'Mascota'} añadido exitosamente!` })
      resetForm() // Limpia el formulario específico
    } catch (error) {
      setFormMessage({ type: 'error', text: `Error: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <h2>Panel de Administración</h2>
      
      {/* Mensaje de éxito/error (ahora es compartido) */}
      {formMessage.text && (
        <div className={`form-message ${formMessage.type}`}>
          {formMessage.text}
        </div>
      )}
      
      {/* Formulario de Productos */}
      <ProductForm 
        categories={productCategories} 
        onFormSubmit={handleFormSubmit}
        loading={loading}
      />
      
      {/* Formulario de Mascotas */}
      <PetForm 
        categories={petCategories}
        onFormSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
  )
}

export default AdminPage