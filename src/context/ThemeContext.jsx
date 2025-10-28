import React, { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // 1. Lee el tema guardado en localStorage, o usa 'light' por defecto
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )

  // 2. Cada vez que 'theme' cambie, guárdalo en localStorage
  //    y actualiza el atributo en el <html> (o <body>)
  useEffect(() => {
    localStorage.setItem('theme', theme)
    // Aplicamos el tema al elemento raíz del documento
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // 3. Función para cambiar el tema
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const value = {
    theme,
    toggleTheme,
    isDarkMode: theme === 'dark',
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// 4. Hook para usar el contexto
export const useTheme = () => {
  return useContext(ThemeContext)
}