# 🎨 Ejemplos de Personalización - Home Finca Maranatha

## 📌 Guía Rápida de Personalización

Este archivo contiene ejemplos prácticos para personalizar el componente House.vue según tus necesidades.

---

## 1. 🎨 Cambiar la Paleta de Colores

### Ejemplo 1: Tonos Verdes más Claros

Reemplaza las variables CSS (línea ~306):

```css
:root {
  --color-green-primary: #4a7c23;  /* Verde más claro */
  --color-green-light: #6b9b37;
  --color-green-accent: #8bc34a;
  --color-earth: #a89968;
  --color-beige: #f9f7f0;
}
```

### Ejemplo 2: Tonos Tierra y Marrón

```css
:root {
  --color-green-primary: #6b4423;  /* Marrón tierra */
  --color-green-light: #8b5a2b;
  --color-green-accent: #a0734d;
  --color-earth: #d4a574;
  --color-beige: #faf7f2;
}
```

### Ejemplo 3: Azul Agua y Verde Menta

```css
:root {
  --color-green-primary: #1e6b7b;  /* Azul agua */
  --color-green-light: #2d8a9e;
  --color-green-accent: #5fb3c1;
  --color-earth: #7ec8d2;
  --color-beige: #e8f4f8;
}
```

---

## 2. 🖼️ Personalizar el Hero Banner

### Ejemplo 1: Cambiar Imagen de Fondo

```css
.hero-banner {
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.95) 0%, rgba(74, 124, 35, 0.9) 100%),
              url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600') center/cover no-repeat;
  /* ☝️ Cambia la URL por tu imagen */
}
```

### Ejemplo 2: Usar Imagen Local

```css
.hero-banner {
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.95) 0%, rgba(74, 124, 35, 0.9) 100%),
              url('../assets/finca-banner.jpg') center/cover no-repeat;
  /* ☝️ Guarda tu imagen en src/assets/ */
}
```

### Ejemplo 3: Cambiar Título y Subtítulo

En el template (líneas ~27-32):

```vue
<div class="text-h3 text-weight-bold text-white text-center q-mb-sm hero-title">
  Tu Finca Aquí
</div>
<div class="text-h6 text-white text-center q-mb-lg hero-subtitle">
  Tu eslogan personalizado
</div>
```

---

## 3. 🏷️ Personalizar Categorías

### Ejemplo 1: Mostrar Más/Menos Categorías

En el template (línea ~103):

```vue
<!-- Mostrar solo 4 categorías -->
<div v-for="cat in categoriasActivas.slice(0, 4)" ...>

<!-- Mostrar todas las categorías -->
<div v-for="cat in categoriasActivas" ...>
```

### Ejemplo 2: Usar Iconos Personalizados por Categoría

En el template (línea ~113):

```vue
<q-icon 
  :name="obtenerIconoCategoria(cat.nombre)" 
  size="64px" 
  color="green-7" 
  class="q-mb-md" 
/>
```

En el script:

```javascript
function obtenerIconoCategoria(nombre) {
  const iconos = {
    'Frutas': 'apple',
    'Verduras': 'grass',
    'Lácteos': 'water_drop',
    'Carnes': 'grill',
    'Huevos': 'egg'
  }
  return iconos[nombre] || 'category'
}
```

---

## 4. 🌾 Personalizar Sección de Productos

### Ejemplo 1: Mostrar Más Productos

En el template (línea ~177):

```vue
<!-- Mostrar 12 productos en lugar de 9 -->
<div v-for="producto in productosOrdenados.slice(0, 12)" ...>

<!-- Mostrar todos los productos -->
<div v-for="producto in productosOrdenados" ...>
```

### Ejemplo 2: Agregar Filtro de Precio

En el template (después de los filtros actuales):

```vue
<div class="col-12 col-md-3">
  <q-range
    v-model="rangoPrecio"
    :min="0"
    :max="100000"
    :step="1000"
    label
    color="green-8"
  />
</div>
```

En el script:

```javascript
const rangoPrecio = ref({ min: 0, max: 100000 })

// Actualizar productosFiltrados
const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    // ... filtros existentes ...
    const matchPrecio = p.precio >= rangoPrecio.value.min && 
                        p.precio <= rangoPrecio.value.max
    return matchCategoria && matchTexto && matchPrecio
  })
})
```

---

## 5. 📞 Personalizar Contacto

### Ejemplo 1: Agregar Más Botones de Contacto

En el template (después de los botones existentes):

```vue
<div class="col-auto">
  <q-btn
    color="white"
    text-color="green-8"
    size="lg"
    unelevated
    rounded
    icon="call"
    label="Teléfono Fijo"
    href="tel:+573012345678"
    class="contact-btn"
  />
</div>
```

### Ejemplo 2: Cambiar Enlaces de Redes Sociales

En el template (líneas ~220-240):

```vue
<!-- Agregar Twitter -->
<q-btn
  round
  color="white"
  text-color="green-8"
  icon="mdi-twitter"
  size="md"
  href="https://twitter.com/tu-finca"
  target="_blank"
/>

<!-- Agregar YouTube -->
<q-btn
  round
  color="white"
  text-color="green-8"
  icon="mdi-youtube"
  size="md"
  href="https://youtube.com/@tu-finca"
  target="_blank"
/>
```

---

## 6. 🎯 Agregar Nueva Sección

### Ejemplo: Sección de Testimonios

Agregar después de la sección de productos (línea ~185):

```vue
<!-- Sección Testimonios -->
<section class="testimonials-section q-mb-xl">
  <div class="text-center q-mb-lg">
    <div class="text-overline text-green-8 text-weight-bold">Testimonios</div>
    <div class="text-h4 text-weight-bold text-grey-9">Lo que dicen nuestros clientes</div>
  </div>
  
  <div class="row q-col-gutter-md">
    <div class="col-12 col-md-4" v-for="(testimonio, i) in testimonios" :key="i">
      <q-card flat class="testimonial-card">
        <q-card-section>
          <div class="row items-center q-mb-md">
            <q-avatar size="60px" color="green-1" text-color="green-8">
              {{ testimonio.nombre[0] }}
            </q-avatar>
            <div class="q-ml-md">
              <div class="text-h6">{{ testimonio.nombre }}</div>
              <div class="text-caption text-grey-6">{{ testimonio.fecha }}</div>
            </div>
          </div>
          <div class="text-body2 text-grey-7">
            "{{ testimonio.mensaje }}"
          </div>
          <div class="q-mt-sm">
            <q-icon v-for="n in 5" :key="n" name="star" color="orange" size="18px" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</section>
```

En el script:

```javascript
const testimonios = ref([
  {
    nombre: "María González",
    fecha: "Hace 1 semana",
    mensaje: "Excelente calidad de productos, siempre frescos y deliciosos."
  },
  {
    nombre: "Carlos Ruiz",
    fecha: "Hace 2 semanas",
    mensaje: "La mejor finca de la región, recomendadísima."
  },
  {
    nombre: "Ana López",
    fecha: "Hace 1 mes",
    mensaje: "Atención personalizada y productos de primera."
  }
])
```

En el style:

```css
.testimonials-section {
  padding: 60px 0;
}

.testimonial-card {
  border-radius: 12px;
  border: 2px solid #e8e4da;
  transition: transform 0.3s, box-shadow 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(45, 80, 22, 0.15);
}
```

---

## 7. 🖼️ Galería Fullscreen

### Agregar Modal de Galería

En el template (después del carousel):

```vue
<!-- Modal Galería Fullscreen -->
<q-dialog v-model="mostrarGaleriaFull" maximized>
  <q-card>
    <q-bar class="bg-green-8">
      <q-space />
      <q-btn flat dense icon="close" @click="mostrarGaleriaFull = false" />
    </q-bar>
    <q-card-section class="q-pa-none">
      <q-carousel
        v-model="slideGaleriaFull"
        navigation
        infinite
        arrows
        height="90vh"
      >
        <q-carousel-slide
          v-for="(img, index) in galeriaFinca"
          :key="index"
          :name="index + 1"
          :img-src="img"
        />
      </q-carousel>
    </q-card-section>
  </q-card>
</q-dialog>
```

Agregar click al carousel existente:

```vue
<q-carousel
  @click="abrirGaleriaFull"
  style="cursor: pointer;"
  ...
>
```

En el script:

```javascript
const mostrarGaleriaFull = ref(false)
const slideGaleriaFull = ref(1)

function abrirGaleriaFull() {
  mostrarGaleriaFull.value = true
  slideGaleriaFull.value = slideGaleria.value
}
```

---

## 8. 🔍 Búsqueda Avanzada

### Agregar Autocompletado

Reemplazar el input de búsqueda:

```vue
<q-select
  v-model="busqueda"
  use-input
  input-debounce="300"
  :options="sugerenciasBusqueda"
  @filter="filtrarSugerencias"
  label="Buscar productos..."
  outlined
  color="green-8"
  clearable
>
  <template #prepend>
    <q-icon name="search" color="green-8" />
  </template>
  <template #no-option>
    <q-item>
      <q-item-section class="text-grey">
        No hay sugerencias
      </q-item-section>
    </q-item>
  </template>
</q-select>
```

En el script:

```javascript
const sugerenciasBusqueda = ref([])

function filtrarSugerencias(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    sugerenciasBusqueda.value = productos.value
      .filter(p => p.nombre.toLowerCase().includes(needle))
      .slice(0, 5)
      .map(p => p.nombre)
  })
}
```

---

## 9. 📊 Contador de Visitas

### Agregar en el Footer

```vue
<footer class="footer-section q-pa-lg text-center">
  <div class="text-h6 text-green-8 text-weight-bold q-mb-sm">
    <q-icon name="spa" size="28px" class="q-mr-xs" />
    Finca Maranatha
  </div>
  <div class="text-body2 text-grey-6 q-mb-xs">
    © {{ new Date().getFullYear() }} Todos los derechos reservados
  </div>
  <div class="text-caption text-grey-5">
    👁️ {{ contadorVisitas }} visitas
  </div>
</footer>
```

En el script:

```javascript
const contadorVisitas = ref(0)

onMounted(async () => {
  // ... código existente ...
  
  // Cargar contador de visitas
  const visitas = localStorage.getItem('visitas') || '0'
  contadorVisitas.value = parseInt(visitas) + 1
  localStorage.setItem('visitas', contadorVisitas.value.toString())
})
```

---

## 10. 🎁 Agregar Ofertas Especiales

### Banner de Oferta

Agregar después del Hero Banner:

```vue
<!-- Banner de Oferta Especial -->
<section class="offer-banner q-mb-lg" v-if="ofertaActiva">
  <q-card flat class="bg-orange text-white">
    <q-card-section class="row items-center">
      <q-icon name="local_offer" size="48px" class="q-mr-md" />
      <div class="col">
        <div class="text-h5 text-weight-bold">{{ ofertaActiva.titulo }}</div>
        <div class="text-body1">{{ ofertaActiva.descripcion }}</div>
      </div>
      <q-btn 
        flat 
        color="white" 
        label="Ver Oferta" 
        @click="scrollToProductos"
        size="lg"
      />
    </q-card-section>
  </q-card>
</section>
```

En el script:

```javascript
const ofertaActiva = ref({
  titulo: "¡Oferta del Mes!",
  descripcion: "Descuento del 20% en todos los productos de temporada",
  activa: true
})
```

En el style:

```css
.offer-banner {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

---

## 📝 Tips Adicionales

### 1. Lazy Loading de Imágenes

Agregar a todas las imágenes:

```vue
<q-img
  :src="imagen"
  loading="lazy"
  ...
/>
```

### 2. SEO Básico

Agregar metadatos en `index.html`:

```html
<title>Finca Maranatha - Calidad y tradición agropecuaria</title>
<meta name="description" content="La mejor finca agropecuaria de la región">
<meta name="keywords" content="finca, agropecuaria, productos frescos">
```

### 3. Animaciones de Entrada

Instalar AOS (Animate On Scroll):

```bash
npm install aos
```

Importar en `main.js`:

```javascript
import AOS from 'aos'
import 'aos/dist/aos.css'

app.mount('#app')
AOS.init()
```

Usar en el template:

```vue
<section data-aos="fade-up" data-aos-duration="1000">
  ...
</section>
```

---

**¡Con estos ejemplos puedes personalizar completamente tu Home! 🚀**
