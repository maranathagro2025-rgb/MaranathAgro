<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Modal de Login para Administrador -->
    <q-dialog v-model="mostrarLogin" @hide="mostrarLogin = false">
      <Login @close="mostrarLogin = false" />
    </q-dialog>

    <q-page-container>
      <!-- Loading general mientras carga la información de la finca -->
      <div v-if="fincaStore.loading && !fincaStore.fincaPublica" class="flex flex-center" style="min-height: 80vh;">
        <div class="text-center">
          <q-spinner-dots color="green-8" size="60px" />
          <div class="text-h6 text-green-8 q-mt-md">Cargando información de la finca...</div>
        </div>
      </div>

      <div v-else class="q-pa-md">
        <!-- ✅ Componente Banner (Encabezado + Hero) -->
        <Banner @open-login="mostrarLogin = true" />

        <!-- Sección Sobre Nosotros -->
        <section class="about-section q-mb-xl">
          <div class="row q-col-gutter-lg items-center">
            <div class="col-12 col-md-6">
              <div class="text-overline text-green-8 text-weight-bold q-mb-sm">Sobre Nosotros</div>
              <div class="text-h4 text-weight-bold text-grey-9 q-mb-md">
                {{ infoFinca?.nombre || 'Finca Maranatha' }}
              </div>
              
              <!-- Ubicación -->
              <div v-if="infoFinca?.ubicacion" class="text-body2 text-grey-6 q-mb-md">
                <q-icon name="place" size="18px" class="q-mr-xs" />
                {{ infoFinca.ubicacion }}
              </div>

              <!-- Descripción -->
              <div class="text-body1 text-grey-7 q-mb-md line-height-loose">
                {{ infoFinca?.descripcion || 'La Finca Maranatha es un proyecto agropecuario dedicado a la producción sostenible y de alta calidad. Con años de experiencia, nos especializamos en ofrecer productos frescos que reflejan nuestro compromiso con la tierra y el medio ambiente.' }}
              </div>

              <!-- Misión -->
              <div v-if="infoFinca?.mision" class="text-body1 text-grey-7 q-mb-md line-height-loose">
                <strong class="text-green-8">Misión:</strong> {{ infoFinca.mision }}
              </div>

              <!-- Visión -->
              <div v-if="infoFinca?.vision" class="text-body1 text-grey-7 q-mb-md line-height-loose">
                <strong class="text-green-8">Visión:</strong> {{ infoFinca.vision }}
              </div>

              <!-- Certificaciones -->
              <div v-if="institucionalFinca?.certificaciones && institucionalFinca.certificaciones.length > 0" class="q-mb-md">
                <div class="text-subtitle2 text-green-8 q-mb-xs">Certificaciones:</div>
                <div class="row q-gutter-xs">
                  <q-chip 
                    v-for="(cert, i) in institucionalFinca.certificaciones" 
                    :key="i"
                    icon="verified"
                    color="green-1" 
                    text-color="green-8"
                    size="sm"
                  >
                    {{ cert }}
                  </q-chip>
                </div>
              </div>

              <!-- Chips de valores -->
              <div class="row q-gutter-sm">
                <q-chip icon="verified" color="green-1" text-color="green-8" class="q-px-md">
                  Calidad Garantizada
                </q-chip>
                <q-chip icon="eco" color="green-1" text-color="green-8" class="q-px-md">
                  Producción Sostenible
                </q-chip>
                <q-chip icon="groups" color="green-1" text-color="green-8" class="q-px-md">
                  Tradición Familiar
                </q-chip>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <!-- Carousel de imágenes -->
              <q-carousel
                v-if="galeriaFinca && galeriaFinca.length > 0"
                animated
                v-model="slideGaleria"
                navigation
                infinite
                :autoplay="autoplayGaleria"
                arrows
                transition-prev="slide-right"
                transition-next="slide-left"
                @mouseenter="autoplayGaleria = false"
                @mouseleave="autoplayGaleria = true"
                class="about-carousel rounded-borders shadow-4"
                height="350px"
              >
                <q-carousel-slide
                  v-for="(img, index) in galeriaFinca"
                  :key="index"
                  :name="index + 1"
                  :img-src="img"
                  class="carousel-slide"
                />
              </q-carousel>
              <div v-else class="about-placeholder rounded-borders">
                <q-icon name="landscape" size="120px" color="green-3" />
                <div class="text-grey-6 q-mt-md">
                  Galería de imágenes no disponible
                </div>
              </div>

              <!-- Horario de atención -->
              <div v-if="contactoFinca?.horarioAtencion" class="q-mt-md q-pa-md bg-green-1 rounded-borders">
                <div class="row items-center">
                  <q-icon name="schedule" color="green-8" size="24px" class="q-mr-sm" />
                  <div>
                    <div class="text-caption text-green-8 text-weight-bold">Horario de Atención</div>
                    <div class="text-body2 text-grey-8">{{ contactoFinca.horarioAtencion }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Sección Tipos de Productos -->
        <section 
          v-if="institucionalFinca?.tipoProductos && institucionalFinca.tipoProductos.length > 0" 
          class="productos-section q-mb-xl q-pa-md q-pa-sm-lg bg-green-1 rounded-borders"
        >
          <div class="text-center q-mb-sm q-mb-md-md">
            <div class="productos-title text-weight-bold text-green-8">¿Qué producimos?</div>
          </div>
          <div class="row q-gutter-xs q-gutter-sm-sm q-gutter-md-md justify-center">
            <q-chip
              v-for="(tipo, i) in institucionalFinca.tipoProductos"
              :key="i"
              icon="agriculture"
              color="green-7"
              text-color="white"
              class="producto-chip"
            >
              {{ tipo }}
            </q-chip>
          </div>
                  <!-- ✅ Componente de Publicaciones Recientes -->
        <Publicacion :limite="6" />

        </section>

        <!-- Sección Categorías Destacadas -->
        <section class="categories-section q-mb-xl" v-if="categoriasActivas.length > 0">
          <div class="text-center q-mb-lg">
            <div class="text-overline text-green-8 text-weight-bold">Nuestras Categorías</div>
            <div class="text-h4 text-weight-bold text-grey-9">Explora Nuestros Productos</div>
            <div class="text-body1 text-grey-6 q-mt-sm">
              Descubre todas las categorías de productos que tenemos para ti
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div 
              v-for="cat in categoriasActivas.slice(0, 6)" 
              :key="cat._id"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card 
                flat 
                class="category-card cursor-pointer" 
                @click="verProductosPorCategoria"
              >
                <q-card-section class="text-center q-pa-lg">
                  <q-icon name="category" size="64px" color="green-7" class="q-mb-md" />
                  <div class="text-h6 text-weight-bold text-grey-9 q-mb-xs">{{ cat.nombre }}</div>
                  <div class="text-body2 text-grey-6">{{ cat.descripcion }}</div>
                  <q-btn 
                    flat 
                    color="green-8" 
                    label="Ver productos" 
                    icon-right="arrow_forward"
                    class="q-mt-md"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>


        </section>



        <!-- ✅ Componente de Contacto y Footer -->
        <Contacto />

        <!-- Botón volver arriba -->
        <q-btn 
          v-show="showBackToTop" 
          class="back-to-top" 
          round 
          color="green-8" 
          icon="keyboard_arrow_up" 
          @click="goTop"
          size="lg"
        >
          <q-tooltip>Volver arriba</q-tooltip>
        </q-btn>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import Login from '../componentes/Login.vue'
import Banner from '../componentes/Banner.vue'
import Contacto from '../componentes/Contacto.vue'
import Publicacion from '../componentes/Publicacion.vue'
import { useCategoriaStore } from '../stores/categoria.js'
import { useFincaStore } from '../stores/finca.js'

// Router
const router = useRouter()

// Stores
const categoriaStore = useCategoriaStore()
const fincaStore = useFincaStore()

// State
const mostrarLogin = ref(false)
const showBackToTop = ref(false)

// Carousels
const slideGaleria = ref(1)
const autoplayGaleria = ref(true)

// Computed
const categoriasActivas = computed(() => {
  const categorias = categoriaStore.categorias || []
  return categorias.filter(cat => cat.estado === 1)
})

// Información de la finca desde fincaPublica
const infoFinca = computed(() => {
  const finca = fincaStore.fincaPublica
  if (!finca) return null
  return {
    nombre: finca.nombre,
    descripcion: finca.descripcion,
    ubicacion: finca.ubicacion,
    mision: finca.mision,
    vision: finca.vision,
    historia: finca.historia,
    logo: finca.logo
  }
})

const contactoFinca = computed(() => {
  const finca = fincaStore.fincaPublica
  if (!finca) return null
  return {
    telefono: finca.telefono,
    whatsapp: finca.whatsapp,
    email: finca.email,
    direccion: finca.direccion,
    facebook: finca.facebook,
    instagram: finca.instagram,
    horarioAtencion: finca.horarioAtencion
  }
})

const galeriaFinca = computed(() => {
  const finca = fincaStore.fincaPublica
  return finca?.imagenesFinca || []
})

const institucionalFinca = computed(() => {
  const finca = fincaStore.fincaPublica
  if (!finca) return null
  return {
    objetivos: finca.objetivos,
    alcance: finca.alcance,
    certificaciones: finca.certificaciones,
    tipoProductos: finca.tipoProductos
  }
})

// Inicialización
onMounted(async () => {
  try {
    await Promise.all([
      fincaStore.obtenerFincaPublica(),
      categoriaStore.listarCategorias()
    ])
  } catch (error) {
    console.error('❌ Error al cargar datos iniciales:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar la información de la finca',
      icon: 'warning'
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

function onScroll() {
  showBackToTop.value = window.scrollY > 300
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

// Funciones de navegación
function verProductosPorCategoria() {
  router.push({ name: 'productos' })
}

function goTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>

/* ===== VARIABLES CSS - Sistema de Diseño ===== */
:root {
  /* Paleta de colores primarios */
  --color-primary: #2d5016;
  --color-primary-light: #4a7c23;
  --color-primary-dark: #1e3510;
  
  /* Colores secundarios */
  --color-accent: #8fb569;
  --color-bg-light: #f5f1e8;
  --color-bg-lighter: #faf8f3;
  --color-border: #e8e4da;
  --color-border-hover: #d4cfc0;
  
  /* Escala de grises */
  --color-text-primary: #2c3e50;
  --color-text-secondary: #5a6c7d;
  --color-text-muted: #95a5a6;
  
  /* Espaciado (sistema 8px) */
  --space-xs: 0.5rem;   /* 8px */
  --space-sm: 1rem;     /* 16px */
  --space-md: 1.5rem;   /* 24px */
  --space-lg: 2rem;     /* 32px */
  --space-xl: 3rem;     /* 48px */
  --space-2xl: 4rem;    /* 64px */
  
  /* Bordes redondeados */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Sombras - niveles de elevación */
  --shadow-sm: 0 2px 8px rgba(45, 80, 22, 0.08);
  --shadow-md: 0 4px 16px rgba(45, 80, 22, 0.12);
  --shadow-lg: 0 8px 24px rgba(45, 80, 22, 0.16);
  --shadow-xl: 0 12px 32px rgba(45, 80, 22, 0.20);
  
  /* Transiciones */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  
  /* Tipografía */
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: 'Georgia', serif;
  --line-height-tight: 1.25;
  --line-height-base: 1.5;
  --line-height-loose: 1.8;
}

/* Modo oscuro (opcional) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-light: #1a1a1a;
    --color-bg-lighter: #2d2d2d;
    --color-border: #404040;
    --color-text-primary: #e8e8e8;
    --color-text-secondary: #b8b8b8;
  }
}

/* ===== ABOUT SECTION - Información de la finca ===== */
/* Mobile-First: Base styles para móvil */
.about-section {
  padding: var(--space-lg) 0; /* 32px móvil */
  margin-bottom: var(--space-xl);
}

.line-height-loose {
  line-height: var(--line-height-loose);
  color: var(--color-text-secondary);
}

/* Carousel de imágenes - Aspect ratio 16:9 controlado */
.about-carousel {
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 9; /* Mantiene proporción */
  box-shadow: var(--shadow-lg);
  transition: box-shadow var(--transition-base);
}

.about-carousel:hover {
  box-shadow: var(--shadow-xl);
}

.carousel-slide {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Placeholder cuando no hay imágenes */
.about-placeholder {
  height: 250px; /* Altura reducida para móvil */
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, var(--color-bg-light) 0%, var(--color-border) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
  transition: border-color var(--transition-base);
}

.about-placeholder:hover {
  border-color: var(--color-border-hover);
}

/* ===== CATEGORIES SECTION - Grid responsivo ===== */
.categories-section {
  padding: var(--space-xl) 0; /* 48px móvil */
  background: linear-gradient(180deg, transparent 0%, var(--color-bg-light) 50%, transparent 100%);
  position: relative;
}

/**
 * CATEGORY CARD - Tarjeta de categoría
 * Decisión: Usar Flexbox para centrado vertical, min-height para consistencia
 * Estados: default → hover → focus → active
 */
.category-card {
  border-radius: var(--radius-lg);
  background: white;
  transition: 
    transform var(--transition-base),
    box-shadow var(--transition-base),
    border-color var(--transition-base);
  border: 2px solid var(--color-border);
  min-height: 240px; /* Altura mínima móvil */
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* Estado: Hover - Elevación y escala */
.category-card:hover {
  transform: translateY(-4px); /* Móvil: menor movimiento */
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}


/* Estado: Focus - Accesibilidad para teclado */
.category-card:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-color: var(--color-primary);
}

/* Estado: Active - Feedback táctil */
.category-card:active {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Animación del ícono dentro de la tarjeta */
.category-card .q-icon {
  transition: transform var(--transition-slow);
}

.category-card:hover .q-icon {
  transform: scale(1.05); /* Móvil: escala más sutil */
}

/* Pseudo-elemento para efecto de brillo en hover */
.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left var(--transition-slow);
}

.category-card:hover::before {
  left: 100%;
}

/* ===== BACK TO TOP BUTTON - Botón flotante ===== */
/**
 * Decisión: Fixed position con z-index alto
 * Touch target: 56x56px (supera mínimo de 44px)
 * Accesibilidad: Focus visible, ARIA label requerido en template
 */
.back-to-top {
  position: fixed;
  bottom: var(--space-md); /* 24px móvil */
  right: var(--space-md);
  z-index: 1000;
  min-width: 48px;
  min-height: 48px;
  box-shadow: var(--shadow-lg);
  transition: 
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.back-to-top:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}

.back-to-top:active {
  transform: translateY(-2px);
}

/* ===== LOADING STATE - Spinner centrado ===== */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== SECCIÓN TIPOS DE PRODUCTOS - RESPONSIVA ===== */
.productos-section {
  padding: var(--space-md) var(--space-sm); /* Padding reducido móvil */
}

/* Título responsivo */
.productos-title {
  font-size: 1.25rem; /* 20px móvil */
  line-height: 1.4;
}

/* Chips responsivos */
.producto-chip {
  font-size: 0.75rem; /* 12px móvil */
  padding: 4px 8px !important;
  min-height: 28px;
  transition: transform var(--transition-fast);
}

.producto-chip :deep(.q-icon) {
  font-size: 16px; /* Ícono más pequeño móvil */
}

/* ===== CHIPS Y BADGES ===== */
/* Asegurar touch targets mínimos en móvil */
.q-chip {
  min-height: 32px;
  padding: var(--space-xs) var(--space-sm);
  transition: transform var(--transition-fast);
}

.q-chip:hover {
  transform: scale(1.02);
}

/* ===== RESPONSIVE DESIGN - Media Queries ===== */

/* TABLET: 600px - 1023px */
@media (min-width: 600px) {
  .about-section {
    padding: var(--space-2xl) 0; /* 64px tablet */
  }
  
  .categories-section {
    padding: var(--space-2xl) 0;
  }
  
  .category-card {
    min-height: 260px;
  }
  
  .category-card:hover {
    transform: translateY(-6px); /* Mayor elevación */
  }
  
  .category-card .q-icon {
    transition: transform var(--transition-slow);
  }
  
  .category-card:hover .q-icon {
    transform: scale(1.08);
  }
  
  .about-placeholder {
    height: 300px;
  }
  
  /* Productos responsive tablet */
  .productos-title {
    font-size: 1.5rem; /* 24px tablet */
  }
  
  .producto-chip {
    font-size: 0.875rem; /* 14px tablet */
    padding: 6px 12px !important;
    min-height: 32px;
  }
  
  .producto-chip :deep(.q-icon) {
    font-size: 18px;
  }
}

/* DESKTOP: 1024px+ */
@media (min-width: 1024px) {
  .about-section {
    padding: 80px 0; /* Espaciado generoso */
  }
  
  .categories-section {
    padding: 80px 0;
  }
  
  .category-card {
    min-height: 280px;
  }
  
  .category-card:hover {
    transform: translateY(-8px); /* Máxima elevación */
  }
  
  .category-card:hover .q-icon {
    transform: scale(1.12);
  }
  
  .about-placeholder {
    height: 350px;
  }
  
  .back-to-top {
    min-width: 56px;
    min-height: 56px;
  }
  
  /* Productos responsive desktop */
  .productos-section {
    padding: var(--space-lg) var(--space-xl);
  }
  
  .productos-title {
    font-size: 1.75rem; /* 28px desktop */
  }
  
  .producto-chip {
    font-size: 1rem; /* 16px desktop */
    padding: 8px 16px !important;
    min-height: 36px;
  }
  
  .producto-chip :deep(.q-icon) {
    font-size: 20px;
  }
  
  .producto-chip:hover {
    transform: scale(1.05);
  }
}

/* DESKTOP GRANDE: 1440px+ */
@media (min-width: 1440px) {
  .about-section,
  .categories-section {
    padding: 100px 0;
  }
}

/* ===== ACCESIBILIDAD - Preferencias del sistema ===== */

/* Reducir movimiento para usuarios sensibles */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .category-card:hover,
  .back-to-top:hover {
    transform: none;
  }
}

/* Alto contraste para mejor legibilidad */
@media (prefers-contrast: high) {
  .category-card {
    border-width: 3px;
  }
  
  .category-card:focus-visible {
    outline-width: 4px;
  }
}

/* ===== UTILIDADES ===== */
.rounded-borders {
  border-radius: var(--radius-lg);
}

.shadow-4 {
  box-shadow: var(--shadow-lg);
}

/* Focus visible para todos los elementos interactivos */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/**
 * ============================================================================
 * NOTAS DE TESTING MANUAL
 * ============================================================================
 * 
 * 1. CHROME DEVTOOLS - RESPONSIVE MODE (F12 → Toggle Device Toolbar)
 *    - iPhone SE (375x667): Verificar touch targets ≥44px
 *    - iPad (768x1024): Comprobar grid 2 columnas
 *    - Desktop (1920x1080): Verificar grid 3 columnas
 * 
 * 2. CONTRASTE (WCAG AA):
 *    - Text/Background: Mínimo 4.5:1
 *    - Large Text: Mínimo 3:1
 *    - Usar: https://webaim.org/resources/contrastchecker/
 * 
 * 3. NAVEGACIÓN POR TECLADO:
 *    - Tab: Navegar entre tarjetas
 *    - Enter/Space: Activar tarjeta
 *    - Verificar :focus-visible en todos los elementos
 * 
 * 4. PERFORMANCE:
 *    - Lighthouse: Mínimo 90 en Performance
 *    - First Contentful Paint < 1.8s
 *    - Largest Contentful Paint < 2.5s
 * 
 * 5. ACCESIBILIDAD:
 *    - Lighthouse: Mínimo 95 en Accessibility
 *    - Verificar atributos ARIA en template
 *    - Screen reader: NVDA/JAWS testing
 * 
 * ============================================================================
 */
</style>
