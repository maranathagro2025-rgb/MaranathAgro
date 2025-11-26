# 🌿 Home Finca Maranatha - Guía de Uso

## 🎯 Resumen

El componente **House.vue** ha sido completamente renovado para representar la **Finca Maranatha** como un mostrario agropecuario profesional y elegante, manteniendo la funcionalidad de comercio electrónico pero con una identidad visual campestre de alta calidad.

---

## 📂 Ubicación del Archivo

```
frontFinca/
└── src/
    └── pages/
        └── House.vue  ← Componente principal del Home
```

---

## 🚀 Cómo Usar el Componente

### 1. Configurar el Backend

Asegúrate de que tu backend tenga los siguientes endpoints funcionando:

**Finca Store:**
- `GET /api/finca/basica` → Información básica de la finca
- `GET /api/finca/contacto` → Datos de contacto
- `GET /api/finca/galeria` → Imágenes de la finca

**Categorías:**
- `GET /api/categoria/listarCategorias` → Todas las categorías

**Productos:**
- `GET /api/producto/listarProductos` → Todos los productos

### 2. Variables de Entorno (Opcional)

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
# Información de contacto (opcional, se usan los del backend)
VITE_ADMIN_WHATSAPP=573001234567
VITE_FACEBOOK_PAGE=https://facebook.com/tu-finca
VITE_INSTAGRAM_PAGE=https://instagram.com/tu-finca
```

### 3. Estructura de Datos Esperada

#### Información de Finca

```javascript
// fincaStore.infoBasica
{
  nombre: "Finca Maranatha",
  descripcion: "Descripción de la finca...",
  mision: "Nuestra misión es...",
  ubicacion: "Vereda X, Municipio Y"
}

// fincaStore.contacto
{
  whatsapp: "573001234567",
  email: "info@fincamaranatha.com",
  direccion: "Vereda X, Km 5",
  facebook: "https://facebook.com/finca",
  instagram: "https://instagram.com/finca"
}

// fincaStore.galeria
{
  imagenesFinca: [
    "http://localhost:1598/uploads/finca1.jpg",
    "http://localhost:1598/uploads/finca2.jpg"
  ]
}
```

#### Categorías

```javascript
{
  _id: "abc123",
  nombre: "Frutas",
  descripcion: "Frutas frescas de temporada",
  estado: 1  // 1 = activo
}
```

#### Productos

```javascript
{
  _id: "xyz789",
  nombre: "Aguacate Hass",
  descripcion: "Aguacate premium de exportación",
  precio: 5000,
  imagenes: ["http://localhost:1598/uploads/aguacate.jpg"],
  categoria_id: { _id: "abc123", nombre: "Frutas" },
  estado: 1,  // 1 = activo
  destacado: true
}
```

---

## 🎨 Personalización Visual

### Cambiar Colores

Edita las variables CSS en `House.vue` (líneas ~306-312):

```css
:root {
  --color-green-primary: #2d5016;  /* Verde oscuro */
  --color-green-light: #4a7c23;    /* Verde medio */
  --color-green-accent: #6b9b37;   /* Verde claro */
  --color-earth: #8b6f47;          /* Tierra */
  --color-beige: #f5f1e8;          /* Beige */
}
```

### Cambiar Imágenes de Fondo

**Hero Banner** (línea ~338):
```css
.hero-banner {
  background: linear-gradient(...),
              url('TU_IMAGEN_AQUI') center/cover no-repeat;
}
```

**Sección de Contacto** (línea ~490):
```css
.contact-section {
  background: linear-gradient(...),
              url('TU_IMAGEN_AQUI') center/cover no-repeat;
}
```

**Recomendación:** Usa imágenes de alta resolución (mínimo 1200px de ancho) de Unsplash, Pexels o tu propia galería.

---

## 🔧 Funciones Principales

### Filtrar Productos

```javascript
// Por categoría (desde las cards de categorías)
filtrarPorCategoria(categoria)

// Por búsqueda de texto
busqueda.value = "aguacate"

// Limpiar todos los filtros
limpiarFiltros()
```

### Scroll Suave

```javascript
// Ir a la sección de productos
scrollToProductos()

// Volver al inicio
goTop()
```

### Notificaciones

```javascript
// Mostrar mensaje al agregar al carrito
mostrarNotificacionCarrito(producto)
```

---

## 📱 Responsive Breakpoints

El diseño se adapta automáticamente a diferentes tamaños de pantalla:

| Dispositivo | Breakpoint | Cambios |
|-------------|------------|---------|
| Desktop     | > 768px    | Layout completo, 3 columnas |
| Tablet      | 600-768px  | 2 columnas, espaciado reducido |
| Mobile      | < 600px    | 1 columna, botones apilados |

---

## 🎯 Secciones del Home

### 1. Hero Banner
- Imagen de fondo con overlay verde
- Título y eslogan de la finca
- Botón CTA para ver productos

### 2. Sobre Nosotros
- Texto descriptivo (dinámico desde backend)
- Carousel de imágenes de la finca
- Chips de valores (Calidad, Sostenibilidad, Tradición)

### 3. Categorías Destacadas
- Muestra hasta 6 categorías activas
- Cards con iconos y descripción
- Click para filtrar productos

### 4. Productos
- Buscador por texto
- Filtro por categoría
- Ordenamiento (A-Z, Precio, etc.)
- Muestra hasta 9 productos

### 5. Contacto
- Botones de WhatsApp, Email, Ubicación
- Enlaces a redes sociales
- Imagen de fondo con overlay

### 6. Footer
- Logo de la finca
- Copyright dinámico

---

## 🐛 Solución de Problemas

### Las imágenes no se cargan

1. Verifica que el backend esté corriendo en `http://localhost:1598`
2. Revisa que las rutas de las imágenes sean correctas
3. Comprueba CORS en el backend

### Los productos no aparecen

1. Verifica que `productoStore.listarProductos()` retorne datos
2. Asegúrate de que los productos tengan `estado: 1`
3. Revisa la consola del navegador para errores

### El carousel no funciona

1. Verifica que `galeriaFinca` tenga imágenes
2. Asegúrate de que Quasar esté correctamente instalado
3. Importa QCarousel en `quasar.config.js` si es necesario

### Errores de TypeScript

El error de "global types file" es solo de configuración y no afecta la funcionalidad. Para solucionarlo:

```bash
# Reinstalar dependencias
npm install

# Reiniciar el servidor de desarrollo
npm run dev
```

---

## 🎁 Características Adicionales

### Estado de Carga

El componente muestra **skeleton screens** mientras carga los datos, mejorando la experiencia del usuario.

### Estado Vacío

Si no hay productos o la búsqueda no arroja resultados, se muestra un mensaje amigable con un icono grande.

### Animaciones

- **Float animation** en el icono del hero
- **Hover effects** en todas las cards
- **Smooth transitions** en colores y transformaciones

### Accesibilidad

- Atributos `aria-label` en botones
- Tooltips descriptivos
- Colores con buen contraste

---

## 📊 Rendimiento

### Optimizaciones Implementadas

1. **Carga paralela** de datos con `Promise.all()`
2. **Computed properties** para filtros (no re-renderiza innecesariamente)
3. **Lazy loading** de componentes modales (Login)
4. **Debounce** en búsqueda de texto (300ms)
5. **Scroll listener** con `{ passive: true }`

---

## 🚀 Mejoras Futuras Sugeridas

1. **Lazy loading de imágenes** con `loading="lazy"`
2. **Infinite scroll** en productos
3. **Filtros avanzados** (precio, disponibilidad)
4. **Wishlist** o favoritos
5. **Mapa interactivo** de la finca
6. **Testimonios** de clientes
7. **Blog** de noticias de la finca
8. **Galería fullscreen** con zoom

---

## 📞 Soporte

Si tienes dudas o problemas con el componente:

1. Revisa la documentación en `FINCA_MARANATHA_HOME.md`
2. Verifica la consola del navegador para errores
3. Asegúrate de que el backend esté funcionando
4. Revisa los stores Pinia (`producto.js`, `categoria.js`, `finca.js`)

---

## 📝 Notas Importantes

- Este componente reemplaza la funcionalidad original de "Casa Celular M&A"
- Mantiene la estructura de autenticación (botón login)
- Es compatible con la estructura existente del proyecto
- No modifica rutas ni layouts existentes
- Usa los stores Pinia ya configurados

---

**¡Disfruta de tu nuevo Home profesional para la Finca Maranatha! 🌿**
