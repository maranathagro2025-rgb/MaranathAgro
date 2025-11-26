<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <div class="q-pa-xs q-pa-sm-md q-pa-md-lg">
        <!-- Header con navegación -->
        <q-toolbar class="bg-green text-white q-mb-xs q-mb-sm-md q-mb-md-lg header-toolbar" :dense="$q.screen.lt.md">
          <q-btn
            flat
            round
            icon="arrow_back"
            color="white"
            :size="$q.screen.lt.sm ? 'sm' : 'md'"
            @click="$router.push('/')"
            class="q-mr-xs q-mr-sm-sm"
            aria-label="Volver al inicio"
          >
            <q-tooltip>Volver al inicio</q-tooltip>
          </q-btn>
          
          <q-toolbar-title class="row items-center no-wrap">
            <q-icon name="spa" :size="$q.screen.lt.sm ? '20px' : $q.screen.lt.md ? '24px' : '28px'" class="q-mr-xs q-mr-sm-sm" />
            <span class="text-weight-bold header-title">FINCA MARANATHA</span>
          </q-toolbar-title>
        </q-toolbar>

        <!-- Subtítulo de sección -->
        <div class="text-center q-mb-sm q-mb-sm-md q-mb-md-lg q-mt-xs q-mt-sm-md">
          <div class="page-title text-weight-bold text-green-8">Nuestros Productos</div>
          <div class="page-subtitle text-grey-6">Calidad y frescura garantizada</div>
        </div>

        <!-- Filtros de búsqueda -->
        <q-card flat bordered class="q-mb-sm q-mb-sm-md q-mb-md-lg filter-card" role="search" aria-label="Filtros de búsqueda de productos">
          <q-card-section class="q-pa-xs q-pa-sm-md q-pa-md-lg">
            <div class="row q-col-gutter-xs q-col-gutter-sm-sm q-col-gutter-md-md">
              <div class="col-12 col-md-5">
                <q-input
                  v-model="busqueda"
                  outlined
                  debounce="300"
                  label="Buscar productos..."
                  clearable
                  color="green-8"
                  :dense="$q.screen.lt.sm"
                  aria-label="Campo de búsqueda de productos"
                >
                  <template #prepend>
                    <q-icon name="search" color="green-8" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="categoriaSeleccionada"
                  :options="categoriasOptions"
                  label="Filtrar por categoría"
                  outlined
                  color="green-8"
                  clearable
                  option-label="nombre"
                  :option-value="cat => cat"
                  :dense="$q.screen.lt.sm"
                  aria-label="Selector de categoría"
                >
                  <template #prepend>
                    <q-icon name="category" color="green-8" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="ordenSeleccionado"
                  :options="opcionesOrden"
                  outlined
                  label="Ordenar por"
                  color="green-8"
                  :dense="$q.screen.lt.sm"
                  aria-label="Selector de orden"
                />
              </div>
            </div>

            <!-- Botón limpiar filtros -->
            <div class="row q-mt-xs q-mt-sm-sm q-mt-md-md" v-if="busqueda || categoriaSeleccionada">
              <q-btn
                flat
                color="green-8"
                icon="clear_all"
                :label="$q.screen.gt.xs ? 'Limpiar filtros' : ''"
                @click="limpiarFiltros"
                :size="$q.screen.lt.sm ? 'sm' : 'md'"
                aria-label="Limpiar todos los filtros"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Estadísticas rápidas -->
        <div class="row q-col-gutter-xs q-col-gutter-sm-sm q-col-gutter-md-md q-mb-sm q-mb-sm-md q-mb-md-lg">
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card" role="status" aria-label="Productos disponibles">
              <q-card-section class="text-center q-pa-xs q-pa-sm-sm q-pa-md-md">
                <q-icon name="inventory_2" :size="$q.screen.lt.sm ? '30px' : '40px'" color="green-7" aria-hidden="true" />
                <div class="stat-number text-weight-bold text-green-8 q-mt-xs">
                  {{ productosFiltrados.length }}
                </div>
                <div class="stat-label text-grey-6">Productos disponibles</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card" role="status" aria-label="Categorías activas">
              <q-card-section class="text-center q-pa-xs q-pa-sm-sm q-pa-md-md">
                <q-icon name="category" :size="$q.screen.lt.sm ? '30px' : '40px'" color="blue-7" aria-hidden="true" />
                <div class="stat-number text-weight-bold text-blue-8 q-mt-xs">
                  {{ categoriasActivas.length }}
                </div>
                <div class="stat-label text-grey-6">Categorías</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-4">
            <q-card flat bordered class="stat-card" role="status" aria-label="Productos destacados">
              <q-card-section class="text-center q-pa-xs q-pa-sm-sm q-pa-md-md">
                <q-icon name="star" :size="$q.screen.lt.sm ? '30px' : '40px'" color="orange-7" aria-hidden="true" />
                <div class="stat-number text-weight-bold text-orange-8 q-mt-xs">
                  {{ productosDestacados }}
                </div>
                <div class="stat-label text-grey-6">Destacados</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="cargando" class="row q-col-gutter-xs q-col-gutter-sm-sm q-col-gutter-md-md" role="status" aria-label="Cargando productos">
          <div v-for="n in 9" :key="n" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card flat class="product-skeleton">
              <q-skeleton :height="$q.screen.lt.sm ? '200px' : '250px'" square />
              <q-card-section class="q-pa-xs q-pa-sm-sm q-pa-md-md">
                <q-skeleton type="text" class="q-mb-xs" />
                <q-skeleton type="text" width="60%" />
                <q-skeleton type="text" width="40%" class="q-mt-xs q-mt-sm-sm q-mt-md-md" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else-if="productosOrdenados.length === 0" class="empty-state q-pa-md q-pa-sm-lg q-pa-md-xl text-center" role="status" aria-label="No hay productos">
          <q-icon name="search_off" :size="$q.screen.lt.sm ? '60px' : $q.screen.lt.md ? '80px' : '100px'" color="grey-4" class="q-mb-sm q-mb-sm-md q-mb-md-lg" aria-hidden="true" />
          <div class="empty-title text-grey-7 q-mb-xs q-mb-sm-sm">No se encontraron productos</div>
          <div class="empty-subtitle text-grey-6 q-mb-sm q-mb-sm-md q-mb-md-lg">
            Intenta ajustar los filtros de búsqueda
          </div>
          <q-btn 
            color="green-8" 
            unelevated
            icon="refresh" 
            :label="$q.screen.gt.xs ? 'Limpiar filtros' : ''"
            @click="limpiarFiltros"
            :size="$q.screen.lt.sm ? 'md' : 'lg'"
            aria-label="Limpiar todos los filtros"
          />
        </div>

        <!-- Grid de productos con el componente Card -->
        <div v-else class="row q-col-gutter-xs q-col-gutter-sm-sm q-col-gutter-md-md" role="list" aria-label="Lista de productos">
          <div
            v-for="producto in productosOrdenados"
            :key="producto._id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
            role="listitem"
          >
              <!-- ✅ Componente de carta informacion -->
            <Card
              :producto="producto"
              @add-carrito="mostrarNotificacionCarrito"
            />
          </div>
        </div>
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
          :size="$q.screen.lt.sm ? 'md' : 'lg'"
          aria-label="Volver arriba"
          tabindex="0"
        >
          <q-tooltip>Volver arriba</q-tooltip>
        </q-btn>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Notify } from 'quasar'
import Card from '../componentes/Card.vue'
import { useProductoStore } from '../stores/producto.js'

import { useCategoriaStore } from '../stores/categoria.js'
import { useFincaStore } from '../stores/finca.js'
import Contacto from '../componentes/Contacto.vue'

const productoStore = useProductoStore()
const categoriaStore = useCategoriaStore()
const fincaStore = useFincaStore()

// State
const busqueda = ref('')
const categoriaSeleccionada = ref(null)
const ordenSeleccionado = ref('Relevancia')
const opcionesOrden = ['Relevancia', 'A-Z', 'Z-A', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor']
const cargando = ref(false)
const showBackToTop = ref(false)

// Computed
const categoriasOptions = computed(() => categoriaStore.categorias || [])
const categoriasActivas = computed(() => 
  categoriasOptions.value.filter(cat => cat.estado === 1)
)
const productos = computed(() => productoStore.productos || [])

const productosDestacados = computed(() => 
  productos.value.filter(p => p.destacado && p.estado === 1).length
)

// Filtros y ordenamiento
const productosFiltrados = computed(() => {
  const text = busqueda.value.toLowerCase().trim()
  return productos.value.filter(p => {
    if (p.estado !== 1) return false

    let catId = null
    if (p.categoria) {
      if (typeof p.categoria === 'object' && p.categoria !== null) {
        catId = p.categoria._id
      } 
      else if (typeof p.categoria === 'string') {
        catId = p.categoria
      }
    }

    const selectedCatId = categoriaSeleccionada.value?._id
    const matchCategoria = !selectedCatId || catId === selectedCatId

    const matchTexto =
      !text ||
      p.nombre?.toLowerCase().includes(text) ||
      p.descripcion?.toLowerCase().includes(text)

    return matchCategoria && matchTexto
  })
})

const productosOrdenados = computed(() => {
  const arr = [...productosFiltrados.value]
  
  if (ordenSeleccionado.value === 'A-Z') {
    arr.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
  } else if (ordenSeleccionado.value === 'Z-A') {
    arr.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''))
  } else if (ordenSeleccionado.value === 'Precio: Menor a Mayor') {
    arr.sort((a, b) => (a.precio || 0) - (b.precio || 0))
  } else if (ordenSeleccionado.value === 'Precio: Mayor a Menor') {
    arr.sort((a, b) => (b.precio || 0) - (a.precio || 0))
  } else {
    // Relevancia: destacados primero
    arr.sort((a, b) => {
      if (a.destacado && !b.destacado) return -1
      if (!a.destacado && b.destacado) return 1
      return 0
    })
  }

  return arr
})

// Funciones
function limpiarFiltros() {
  busqueda.value = ''
  categoriaSeleccionada.value = null
  ordenSeleccionado.value = 'Relevancia'
}

function goTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function mostrarNotificacionCarrito(producto) {
  Notify.create({
    type: 'positive',
    message: `${producto.nombre} agregado al carrito`,
    icon: 'check_circle',
    position: 'top',
    timeout: 2000
  })
}

function onScroll() {
  showBackToTop.value = window.scrollY > 300
}

// Inicialización
onMounted(async () => {
  try {
    cargando.value = true
    await Promise.all([
      fincaStore.obtenerFincaPublica(),
      categoriaStore.listarCategorias(),
      productoStore.listarProductos()
    ])
  } catch (error) {
    console.error('❌ Error al cargar productos:', error)
    Notify.create({
      type: 'negative',
      message: 'Error al cargar los productos',
      icon: 'warning'
    })
  } finally {
    cargando.value = false
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* ========================================
   MOBILE FIRST BASE STYLES (<600px)
   ======================================== */

/* Header Toolbar */
.header-toolbar {
  background: linear-gradient(135deg, #2d5016 0%, #4a7c23 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(45, 80, 22, 0.15);
  transition: all 0.3s ease;
}

.header-title {
  font-family: 'Georgia', serif;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

/* Page Title and Subtitle */
.page-title {
  font-size: 1.5rem;
  line-height: 1.3;
}

.page-subtitle {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Filtros */
.filter-card {
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f1e8 0%, #ffffff 100%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* Tarjetas de estadísticas */
.stat-card {
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  min-height: 100px;
}

.stat-number {
  font-size: 1.5rem;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Empty State */
.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-subtitle {
  font-size: 0.875rem;
}

/* Skeleton loader */
.product-skeleton {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* Botón volver arriba */
.back-to-top {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.25);
  transition: transform 0.3s, box-shadow 0.3s;
  min-width: 48px;
  min-height: 48px;
}

/* ========================================
   TABLET (600px - 1023px)
   ======================================== */
@media (min-width: 600px) {
  .header-toolbar {
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(45, 80, 22, 0.18);
  }

  .header-title {
    font-size: 1.1rem;
    letter-spacing: 1.2px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .filter-card {
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .stat-card {
    border-radius: 10px;
    min-height: 120px;
  }

  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(45, 80, 22, 0.12);
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.875rem;
  }

  .empty-state {
    min-height: 350px;
  }

  .empty-title {
    font-size: 1.5rem;
  }

  .empty-subtitle {
    font-size: 1rem;
  }

  .product-skeleton {
    border-radius: 12px;
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
  }
}

/* ========================================
   DESKTOP (1024px - 1439px)
   ======================================== */
@media (min-width: 1024px) {
  .header-toolbar {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(45, 80, 22, 0.2);
  }

  .header-title {
    font-size: 1.4rem;
    letter-spacing: 1.5px;
  }

  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1.125rem;
  }

  .filter-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .stat-card {
    border-radius: 12px;
    min-height: 140px;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(45, 80, 22, 0.15);
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .stat-label {
    font-size: 1rem;
  }

  .empty-state {
    min-height: 400px;
  }

  .empty-title {
    font-size: 1.75rem;
  }

  .empty-subtitle {
    font-size: 1.125rem;
  }

  .product-skeleton {
    border-radius: 16px;
  }

  .back-to-top {
    bottom: 24px;
    right: 24px;
  }

  .back-to-top:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(45, 80, 22, 0.3);
  }
}

/* ========================================
   LARGE DESKTOP (1440px+)
   ======================================== */
@media (min-width: 1440px) {
  .header-title {
    font-size: 1.6rem;
    letter-spacing: 2px;
  }

  .page-title {
    font-size: 3rem;
  }

  .page-subtitle {
    font-size: 1.25rem;
  }

  .stat-card {
    min-height: 160px;
  }

  .stat-number {
    font-size: 3rem;
  }

  .stat-label {
    font-size: 1.125rem;
  }

  .empty-title {
    font-size: 2rem;
  }

  .empty-subtitle {
    font-size: 1.25rem;
  }
}

/* ========================================
   ACCESSIBILITY & INTERACTIONS
   ======================================== */

/* Focus states for keyboard navigation */
.q-btn:focus-visible,
.q-input:focus-within,
.q-select:focus-within {
  outline: 3px solid #4a7c23;
  outline-offset: 2px;
}

/* Touch targets minimum 44x44px */
.q-btn {
  min-width: 44px;
  min-height: 44px;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .stat-card:hover,
  .back-to-top:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .header-toolbar,
  .filter-card,
  .stat-card {
    border: 2px solid currentColor;
  }
}
</style>