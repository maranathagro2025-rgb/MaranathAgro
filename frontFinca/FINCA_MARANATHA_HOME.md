# Componente Home.vue - Finca Maranatha

## 📋 Descripción General

El componente **House.vue** ha sido transformado de una tienda de celulares a un **mostrario agropecuario profesional** para la **Finca Maranatha**, manteniendo la estructura de Vue 3 + Quasar Framework y adaptando todo el diseño a una identidad visual elegante y campestre.

## 🎨 Características Principales

### 1. **Hero Banner Profesional**
- Banner principal con overlay de imagen de fondo (paisaje rural)
- Logo icónico de la finca (icono `spa`)
- Título: "Finca Maranatha"
- Subtítulo: "Calidad y tradición agropecuaria"
- Botón CTA: "Ver nuestros productos" con scroll suave
- Animación flotante en el icono principal
- Degradados verde esmeralda con sombras profesionales

### 2. **Sección "Sobre Nosotros"**
- Descripción dinámica de la finca desde el backend
- Galería de imágenes con carousel (QCarousel de Quasar)
- Misión de la finca (si está disponible)
- Chips destacados: Calidad Garantizada, Producción Sostenible, Tradición Familiar
- Layout responsive en dos columnas (texto + galería)

### 3. **Categorías Destacadas**
- Muestra hasta 6 categorías activas
- Cards con iconos grandes y descripción
- Botón "Ver más" en cada categoría
- Efecto hover con elevación y cambio de borde
- Al hacer clic, filtra productos por esa categoría

### 4. **Productos Recientes/Destacados**
- Filtros de búsqueda: texto, categoría y ordenamiento
- Muestra hasta 9 productos ordenados
- Estados de carga con skeleton screens
- Estado vacío con mensaje amigable
- Usa el componente `CardLugar` existente
- Ordenamiento: Relevancia, A-Z, Z-A, Precio (menor/mayor)

### 5. **Sección de Contacto**
- Banner inferior con overlay e imagen de naturaleza
- Botones de contacto: WhatsApp, Email, Ubicación
- Íconos de redes sociales: Facebook e Instagram
- Información dinámica desde el backend (store `finca`)

### 6. **Footer Elegante**
- Logo + nombre de la finca
- Copyright dinámico con año actual
- Fondo beige claro con borde superior

### 7. **Botón "Volver Arriba"**
- Aparece al hacer scroll (>300px)
- Botón flotante verde con ícono de flecha
- Scroll suave hacia arriba

---

## 🎨 Paleta de Colores

La paleta está inspirada en tonos naturales y agropecuarios:

```css
--color-green-primary: #2d5016  /* Verde oscuro/oliva */
--color-green-light: #4a7c23    /* Verde medio */
--color-green-accent: #6b9b37   /* Verde claro */
--color-earth: #8b6f47          /* Tonos tierra */
--color-beige: #f5f1e8          /* Beige claro */
```

---

## 🛠️ Tecnologías y Librerías

- **Vue 3** (Composition API con `<script setup>`)
- **Quasar Framework** (QLayout, QCard, QBtn, QCarousel, QChip, QIcon, QToolbar, QInput, QSelect)
- **Pinia Stores**:
  - `useProductoStore`: para productos
  - `useCategoriaStore`: para categorías
  - `useFincaStore`: para información de la finca
- **Axios** (integrado en los stores)
- **Quasar Notify** para notificaciones

---

## 📦 Estructura del Componente

```
House.vue
├── Template
│   ├── Header Toolbar (login)
│   ├── Hero Banner
│   ├── Sección Sobre Nosotros
│   ├── Categorías Destacadas
│   ├── Productos Recientes (con filtros)
│   ├── Sección de Contacto
│   ├── Footer
│   └── Botón Volver Arriba
├── Script (Composition API)
│   ├── Stores (producto, categoria, finca)
│   ├── State (busqueda, filtros, loading, etc.)
│   ├── Computed (productos filtrados/ordenados)
│   ├── Lifecycle (onMounted, onBeforeUnmount)
│   └── Funciones (scroll, filtros, notificaciones)
└── Styles (Scoped)
    ├── Variables CSS
    ├── Hero Banner
    ├── About Section
    ├── Categories Section
    ├── Products Section
    ├── Contact Section
    ├── Footer
    └── Responsive Design
```

---

## 🚀 Funcionalidades Implementadas

### Carga de Datos
```javascript
onMounted(async () => {
  await Promise.all([
    fincaStore.obtenerInfoBasica(),
    fincaStore.obtenerContacto(),
    fincaStore.obtenerGaleria(),
    categoriaStore.listarCategorias(),
    productoStore.listarProductos()
  ])
})
```

### Filtros Inteligentes
- Búsqueda por texto (nombre/descripción)
- Filtro por categoría
- Ordenamiento: Relevancia, A-Z, Z-A, Precio
- Solo muestra productos activos (`estado === 1`)
- Prioriza productos destacados

### Scroll Suave
- `scrollToProductos()`: desde el hero banner
- `goTop()`: botón volver arriba
- Smooth behavior nativo del navegador

### Notificaciones
```javascript
function mostrarNotificacionCarrito(producto) {
  Notify.create({
    type: 'positive',
    message: `${producto.nombre} agregado al carrito`,
    icon: 'check_circle',
    position: 'top',
    timeout: 2000
  })
}
```

---

## 📱 Diseño Responsive

- **Desktop**: Layout en columnas, carousels grandes, espaciado generoso
- **Tablet**: Ajustes en grid (col-md-6, col-md-4)
- **Mobile**: Columna única, botones apilados, tamaños reducidos

Breakpoints:
```css
@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .hero-banner { min-height: 400px; }
  .contact-btn { width: 100%; }
}
```

---

## 🎯 Mejoras Visuales

1. **Animaciones suaves**: float en iconos, hover en cards
2. **Sombras profesionales**: `box-shadow` con opacidad gradual
3. **Degradados naturales**: verde → tierra → beige
4. **Tipografía elegante**: Georgia (serif) para títulos
5. **Transiciones globales**: color, background, transform
6. **Bordes redondeados**: 12px-16px
7. **Overlays semitransparentes**: en hero y contacto

---

## 🔧 Mantenimiento y Extensiones

### Para agregar más secciones:
1. Crear una nueva `<section>` en el template
2. Agregar estilos scoped correspondientes
3. Si requiere datos del backend, usar los stores existentes

### Para cambiar imágenes de fondo:
- Hero Banner: línea 306 del CSS (background url)
- Contact Section: línea 376 del CSS
- Usar imágenes de alta calidad (1200px+ de ancho)

### Para personalizar colores:
Modificar las variables CSS en el bloque `:root`

---

## ✅ Requisitos Cumplidos

- ✅ Diseño agropecuario elegante y profesional
- ✅ Paleta verde esmeralda, tierra y beige
- ✅ Hero banner con imagen de fondo
- ✅ Sección "Sobre Nosotros" con carousel
- ✅ Categorías destacadas con cards
- ✅ Productos con filtros y ordenamiento
- ✅ Sección de contacto con botones sociales
- ✅ Footer con copyright dinámico
- ✅ Responsive design completo
- ✅ Integración con stores Pinia
- ✅ Componentes Quasar nativos
- ✅ Transiciones y animaciones suaves

---

## 📸 Estructura Visual

```
┌─────────────────────────────────────┐
│  🌿 HEADER: Finca Maranatha + Login │
├─────────────────────────────────────┤
│                                     │
│   🎨 HERO BANNER (imagen fondo)     │
│   Título + Subtítulo + CTA          │
│                                     │
├─────────────────────────────────────┤
│  📖 SOBRE NOSOTROS                  │
│  [Texto] [Carousel de imágenes]     │
├─────────────────────────────────────┤
│  🏷️ CATEGORÍAS DESTACADAS           │
│  [Card] [Card] [Card]               │
├─────────────────────────────────────┤
│  🌾 PRODUCTOS                       │
│  [Filtros]                          │
│  [Card] [Card] [Card]               │
├─────────────────────────────────────┤
│  📞 CONTACTO (imagen fondo)         │
│  WhatsApp | Email | Ubicación       │
├─────────────────────────────────────┤
│  🌿 FOOTER                          │
│  Finca Maranatha © 2025             │
└─────────────────────────────────────┘
```

---

## 🎁 Extras Implementados

- **Skeleton screens** durante carga de productos
- **Estado vacío** con mensaje amigable
- **Scroll listener** para botón "volver arriba"
- **Hover effects** en todas las cards
- **Animación flotante** en icono hero
- **Notificación toast** al agregar al carrito
- **Galería placeholder** si no hay imágenes

---

## 🚀 Próximos Pasos (Opcionales)

1. Agregar más imágenes reales de la finca
2. Implementar lazy loading para imágenes
3. Agregar sección de testimonios
4. Crear página de detalle de producto mejorada
5. Agregar mapa de ubicación interactivo
6. Implementar carrito de compras funcional

---

**Desarrollado para:** Finca Maranatha  
**Framework:** Vue 3 + Quasar  
**Año:** 2025  
**Enfoque:** Diseño agropecuario profesional y elegante
