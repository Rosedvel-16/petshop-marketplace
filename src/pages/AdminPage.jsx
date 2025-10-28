import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabaseClient'

// --- ProductForm (Sin cambios, tu código estaba bien) ---
const ProductForm = ({ categories, onFormSubmit, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const onSubmit = async (data) => {
    await onFormSubmit(data, 'products', reset)
  }
  return (
    <div className="admin-form-container">
      <h3>Añadir Nuevo Producto</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
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

// --- PetForm (Con 1 corrección importante) ---
const PetForm = ({ categories, onFormSubmit, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    // CORRECCIÓN: Si la edad está vacía, envía 'null' a la DB, no NaN.
    const age = data.age === '' || data.age === null ? null : parseInt(data.age, 10)
    const formData = { ...data, age: age }
    await onFormSubmit(formData, 'pets', reset)
  }

  return (
    <div className="admin-form-container">
      <h3>Añadir Mascota en Adopción</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
        {/* ... (resto del formulario de PetForm sin cambios) ... */}
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
            {/* El 'valueAsNumber' aquí causaba el problema de NaN, lo quitamos y lo manejamos en onSubmit */}
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

// --- Componente Principal (Con 1 corrección importante) ---
const AdminPage = () => {
  const [productCategories, setProductCategories] = useState([])
  const [petCategories, setPetCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [formMessage, setFormMessage] = useState({ type: '', text: '' })

  // Cargar categorías (Sin cambios)
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: productCats } = await supabase
        .from('product_categories')
        .select('id, name')
      if (productCats) setProductCategories(productCats)
      
      const { data: petCats } = await supabase
        .from('pet_categories')
        .select('id, name')
      if (petCats) setPetCategories(petCats)
    }
    fetchCategories()
  }, [])

  // --- CORRECCIÓN: 'handleFormSubmit' con captura de errores mejorada ---
  const handleFormSubmit = async (data, tableName, resetForm) => {
    try {
      setLoading(true)
      setFormMessage({ type: '', text: '' })

      // 'data' es el objeto del formulario (ej. { name: 'Rascador', price: 12, ... })
      const { error } = await supabase.from(tableName).insert(data)
      
      if (error) {
        // Si Supabase devuelve un error, lo lanzamos para que el CATCH lo atrape
        throw error
      }

      setFormMessage({ type: 'success', text: `¡${tableName === 'products' ? 'Producto' : 'Mascota'} añadido exitosamente!` })
      resetForm() // Limpia el formulario
      
    } catch (error) { // El 'catch' ahora SÍ atrapará el error
      console.error("Error al insertar en Supabase:", error)
      // Mostramos el mensaje de error real de la base de datos
      setFormMessage({ type: 'error', text: `Error: ${error.message}` })
      
    } finally {
      // El 'finally' se ejecutará SIEMPRE, liberando el botón
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <h2>Panel de Administración</h2>
      
      {/* ¡AHORA DEBERÍA MOSTRARSE EL ERROR AQUÍ! */}
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