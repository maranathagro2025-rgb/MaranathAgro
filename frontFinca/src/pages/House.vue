<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Modal de Login para Administrador -->
  <q-dialog v-model="mostrarLogin" @hide="mostrarLogin = false">
  <Login @close="mostrarLogin = false" />
</q-dialog>

    <!-- Modal de Carrito -->
    <q-dialog v-model="mostrarCarrito" @hide="mostrarCarrito = false">
      <carrito @close="mostrarCarrito = false" />
    </q-dialog>

    <q-page-container>
      <div class="q-pa-md">
        <!-- Encabezado -->
        <q-toolbar dense class="bg-green text-white q-mb-md header-toolbar">
          <q-toolbar-title class="row items-center no-wrap">
            <span class="text-weight-medium">CASA CELULAR M&A</span>
            <q-badge color="green" rounded class="q-ml-sm">{{ productosFiltrados.length }}</q-badge>
          </q-toolbar-title>
          <q-space />
          <q-btn size="sm" flat round icon="login" @click="mostrarLogin = true" :aria-label="'Abrir login'" />
          <div style="position: relative; display: inline-block;">
            <q-btn size="sm" flat round icon="shopping_cart" @click="mostrarCarrito = true" :aria-label="'Ir al carrito'" />
            <span
              v-if="cantidadCarrito > 0"
              class="carrito-badge"
            >{{ cantidadCarrito }}</span>
          </div>
          <!-- <q-btn size="sm" flat round icon="search" @click="toggleBuscador" :aria-label="'Mostrar/ocultar buscador'" /> -->
        </q-toolbar>

        <!-- Hero Banner -->
        <section class="hero-banner q-pa-md q-mb-lg">
                    
          <div class="hero-content">
                  <div class="q-pa-md q-gutter-sm">
            <q-bar dense class="bg-teal text-white">
              <!-- <q-icon :name="fasSignal" /> -->
              <div>moviles</div>
              <div>4G-5G</div>
              <!-- <q-icon :name="fasWifi" /> -->
              <q-space />
              <q-icon name="near_me" />
              <div>100%</div>
              <!-- <q-icon :name="fasBatteryFull" /> -->
            </q-bar>
            </div>
            <div class="text-h4 text-weight-bold line-tight q-mb-sm">
              ¡Las mejores ofertas en celulares y accesorios tecnológicos!
            </div>
            <div class="text-body1 text-white text-weight-regular q-mb-md hero-sub">
              Compra celulares, tablets y accesorios con entrega inmediata y promociones exclusivas.
            </div>
            
            <!-- carrusel -->
               <div class="q-pa-md">
            <q-carousel
              animated
              v-model="slide"
              navigation
              infinite
              :autoplay="autoplay"
              arrows
              transition-prev="slide-right"
              transition-next="slide-left"
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = true"
            >
              <q-carousel-slide :name="1" img-src="../assets/celss.jpg" />
              <q-carousel-slide :name="2" img-src="../assets/phone.jpg" />
              <q-carousel-slide :name="3" img-src="../assets/social3.jpg" />
              <q-carousel-slide :name="4" img-src="../assets/phone33.jpg" />
            </q-carousel>
          </div>
          
            <div class="text-body1 text-white text-weight-regular q-mb-md hero-sub">
              Busca por nombre, categoría o marca y descubre opciones confiables.
            </div>

            <div class="row q-col-gutter-sm items-center hero-cta">
              <div class="col-12 col-md">
                <q-input v-model="busqueda" outlined dense color="white" label="¿Qué estás buscando?" class="bg-white text-primary rounded-borders">
                  <template #prepend>
                    <q-icon name="search" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-auto">
                <q-btn color="secondary" unelevated icon="travel_explore" label="Explorar productos" @click="scrollToResultados" />
              </div>
            </div>

            <div class="row q-gutter-xs q-mt-sm no-wrap scroll-x chip-row">
              <!-- Categoría chip -->
              <q-chip
                v-for="cat in categoriasOptions.slice(0, 6)"
                :key="cat._id"
                dense
                color="white"
                text-color="primary"
                clickable
                @click="categoriaSeleccionada = cat"
              >
                {{ cat.nombre }}
              </q-chip>

              <!-- Marca chip -->
              <q-chip
                v-for="marca in marcasOptions.slice(0, 6)"
                :key="marca._id"
                dense
                color="white"
                text-color="primary"
                clickable
                @click="marcaSeleccionada = marca"
              >
                {{ marca.nombre }}
              </q-chip>
            </div>
          </div>
        </section>

        <!-- Filtros principales: Buscador + Categoría + Marca -->
        <div class="row q-col-gutter-md q-mb-md" v-show="mostrarBuscador">
          <div class="col-12 col-md-4">
            <q-input
              v-model="busqueda"
              outlined
              debounce="300"
              label="Buscar productos..."
              clearable
              dense
              color="primary"
              class="input-styled"
              :aria-label="'Buscar por texto'"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="categoriaSeleccionada"
              :options="categoriasOptions"
              label="Filtrar por categoría"
              dense
              outlined
              color="primary"
              clearable
              option-label="nombre"
              :option-value="cat => cat"
              use-input
              input-debounce="0"
              :aria-label="'Seleccionar categoría'"
            >
              <template #prepend>
                <q-icon name="category" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="marcaSeleccionada"
              :options="marcasOptions"
              label="Filtrar por marca"
              dense
              outlined
              color="primary"
              clearable
              option-label="nombre"
              :option-value="marca => marca"
              use-input
              input-debounce="0"
              :aria-label="'Seleccionar marca'"
            >
              <template #prepend>
                <q-icon name="sell" />
              </template>
            </q-select>
          </div>
        </div>

        <!-- Filtros secundarios: Orden + Limpiar -->
        <div class="row q-col-gutter-md q-mb-lg items-center">
          <div class="col-12 col-md-8"></div>
          <div class="col-12 col-md-4">
            <div class="row items-center q-gutter-sm justify-end">
              <q-select
                v-model="ordenSeleccionado"
                :options="opcionesOrden"
                dense
                outlined
                label="Ordenar"
                color="primary"
                class="col"
                :aria-label="'Ordenar resultados'"
              />
              <q-btn flat color="negative" icon="restart_alt" label="Limpiar" @click="limpiarFiltros" />
            </div>
          </div>
        </div>

        <!-- Resultados -->
        <div v-if="cargando" class="row q-col-gutter-md">
          <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3">
            <q-card class="fit">
              <q-skeleton height="160px" square />
              <q-card-section>
                <q-skeleton type="text" class="q-mb-sm" />
                <q-skeleton type="text" width="60%" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else ref="resultadosRef">
          <div v-if="productosOrdenados.length === 0" class="q-pa-xl text-center text-grey-7">
            <q-icon name="travel_explore" size="64px" class="q-mb-md text-grey-5" />
            <div class="text-h6 q-mb-xs">Sin resultados</div>
            <div class="text-body2 q-mb-md">No hay productos disponibles.</div>
            <q-btn color="primary" outline icon="filter_alt_off" label="Limpiar filtros" @click="limpiarFiltros" />
          </div>
          <div v-else class="row q-col-gutter-md items-stretch">
            <div
              v-for="producto in productosOrdenados"
              :key="producto._id"
              class="col-12 col-sm-6 col-md-3 col-lg-3 col-xl-3"
            >
              <CardLugar
                :lugar="producto"
                @add-carrito="agregarAlCarrito"
              />
            </div>
          </div>
        </div>

      <!-- Bottom Banner -->
  <section class="bottom-banner q-pa-md q-mt-xl">
    <div class="row items-center q-col-gutter-lg">
      <div class="col-12 col-md-7">
        <div class="text-subtitle2 text-white text-uppercase letter-spaced q-mb-xs">
          ¿Quieres comprar directamente?
        </div>
        <div class="text-h5 text-weight-bold text-white line-tight q-mb-sm">
          Compra fácil y seguro en nuestro almacén
        </div>
        <div class="text-body1 text-white hero-sub q-mb-md">
          Haz tu pedido por WhatsApp y recibe atención personalizada. ¡Te guiamos en todo el proceso!
        </div>
        <div class="row q-gutter-sm q-mb-md benefits">
          <div class="col-auto text-white"><q-icon name="check_circle" size="20px" class="q-mr-xs" /> Compra directa</div>
          <div class="col-auto text-white"><q-icon name="check_circle" size="20px" class="q-mr-xs" /> Asesoría personalizada</div>
          <div class="col-auto text-white"><q-icon name="check_circle" size="20px" class="q-mr-xs" /> Pago seguro</div>
          <!-- Social icons -->
          <div class="col-auto">
            <div class="row no-wrap items-center social-icons">
              <a :href="facebookLink" target="_blank" rel="noopener" aria-label="Facebook">
                <q-btn flat round dense color="white" class="q-pa-xs">
                  <q-icon name="mdi-facebook" />
                </q-btn>
              </a>
              <a :href="instagramLink" target="_blank" rel="noopener" class="q-ml-sm" aria-label="Instagram">
                <q-btn flat round dense color="red" class="q-pa-xs">
                  <q-icon name="mdi-instagram" />
                </q-btn>
              </a>
              <a :href="whatsAppLink" target="_blank" rel="noopener" class="q-ml-sm" aria-label="WhatsApp" @click.prevent="openWhatsApp">
                <q-btn flat round dense color="white" class="q-pa-xs">
                  <q-icon name="mdi-whatsapp" />
                </q-btn>
              </a>
            </div>
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div class="col-auto">
            <q-btn
              color="white"
              text-color="primary"
              unelevated
              icon="mdi-whatsapp"
              label="Comprar por WhatsApp"
              :href="whatsAppLink"
              target="_blank"
              rel="noopener"
              @click="openWhatsApp"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-5 text-center">
        <q-icon name="storefront" size="120px" class="text-white q-mb-sm storefront-icon" />
        <div class="text-white text-italic">¡Tu tienda de confianza!</div>
      </div>
    </div>
  </section>

        <!-- Botón volver arriba -->
        <q-btn v-show="showBackToTop" class="back-to-top" round color="primary" icon="keyboard_arrow_up" @click="goTop" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Notify } from 'quasar'
import Login from '../componentes/Login.vue'
import CardLugar from '../componentes/Card.vue'
import { useProductoStore } from '../stores/producto.js'
import { useCategoriaStore } from '../stores/categoria.js'
import { useMarcaStore } from '../stores/marca.js'
import { useCarritoStore } from '../stores/carrito.js'
import carrito from '../componentes/carrito.vue'
import { useRouter } from 'vue-router'

const productoStore = useProductoStore()
const categoriaStore = useCategoriaStore()
const marcaStore = useMarcaStore()
const carritoStore = useCarritoStore()
const router = useRouter()
const slide = ref(1)
const autoplay = ref(true)

const busqueda = ref('')
const categoriaSeleccionada = ref('')
const marcaSeleccionada = ref('')
const ordenSeleccionado = ref('Relevancia')
const opcionesOrden = [
  'Relevancia',
  'A-Z',
  'Z-A'
]
const mostrarBuscador = ref(true)
const mostrarLogin = ref(false)
const cargando = ref(false)
const resultadosRef = ref(null)
const showBackToTop = ref(false)
// const carrito = ref([])
const mostrarCarrito = ref(false)

const categoriasOptions = computed(() => categoriaStore.categorias)
const marcasOptions = computed(() => marcaStore.marcas)
const productos = computed(() => productoStore.productos)



function eliminarCarritoAlCerrar(e) {
  // Solo ejecuta si la navegación NO es recarga (persisted es false)
  if (!e.persisted) {
    const carritoId = carritoStore.carritos.find(c => c.estado === 'activo')?._id
    if (carritoId) {
      carritoStore.eliminarCarrito(carritoId)
    }
    localStorage.removeItem('carrito')
  }
}

onMounted(() => {
  window.addEventListener('pagehide', eliminarCarritoAlCerrar)
})

onBeforeUnmount(() => {
  window.removeEventListener('pagehide', eliminarCarritoAlCerrar)
})

onMounted(async () => {
  try {
    cargando.value = true
    await categoriaStore.listarCategorias()
    await marcaStore.listarMarcas()
    await productoStore.listarProductos()
  } finally {
    cargando.value = false
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

function onScroll() {
  showBackToTop.value = window.scrollY > 300
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const categoriasTecnologia = computed(() =>
  categoriasOptions.value.filter(cat =>
    ['celular', 'celulares', 'tablet', 'tablets', 'accesorio', 'accesorios', 'accesorios celulares']
      .includes(cat.nombre?.toLowerCase())
  ).map(cat => cat._id)
)


const productosTecnologia = computed(() =>
  productosOrdenados.value.filter(p =>
    categoriasTecnologia.value.includes(p.categoria_id?._id || p.categoria_id)
  )
)

const productosFiltrados = computed(() => {
  const text = busqueda.value.toLowerCase().trim()
  return productos.value.filter(p => {
    // Categoría
    const catId = typeof p.categoria_id === 'object' ? p.categoria_id._id : p.categoria_id
    const selectedCatId = categoriaSeleccionada.value?._id
    const matchCategoria = !selectedCatId || catId === selectedCatId

    // Marca
    const marcaId = typeof p.marca_id === 'object' ? p.marca_id._id : p.marca_id
    const selectedMarcaId = marcaSeleccionada.value?._id
    const matchMarca = !selectedMarcaId || marcaId === selectedMarcaId

    // Texto
    const matchTexto =
      !text ||
      p.nombre?.toLowerCase().includes(text) ||
      p.descripcion?.toLowerCase().includes(text) ||
      p.referencia?.toLowerCase().includes(text)

    return matchCategoria && matchMarca && matchTexto
  })
})

const productosOrdenados = computed(() => {
  const arr = [...productosFiltrados.value]
  if (ordenSeleccionado.value === 'A-Z') {
    return arr.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
  }
  if (ordenSeleccionado.value === 'Z-A') {
    return arr.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''))
  }
  return arr // Relevancia (orden original)
})

function toggleBuscador() {
  mostrarBuscador.value = !mostrarBuscador.value
}

function limpiarFiltros() {
  busqueda.value = ''
  categoriaSeleccionada.value = ''
  marcaSeleccionada.value = ''
  ordenSeleccionado.value = 'Relevancia'
}

function scrollToResultados() {
  const el = resultadosRef.value
  if (el?.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function goTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// WhatsApp del administrador (formato internacional sin '+', ej: 573001234567)
const adminWhats = (import.meta?.env?.VITE_ADMIN_WHATSAPP || '573008322616').toString().trim()
const whatsAppMessage = 'Hola, quiero comprar un producto de tu tienda. ¿Me puedes ayudar?'

const whatsDigits = adminWhats.replace(/[^\d]/g, '')
const whatsAppLink = computed(() => `https://wa.me/${whatsDigits}?text=${encodeURIComponent(whatsAppMessage)}`)
// Enlaces de redes (puedes definir VITE_FACEBOOK_PAGE / VITE_INSTAGRAM_PAGE en .env)
const facebookLink = (import.meta?.env?.VITE_FACEBOOK_PAGE) || 'https://www.facebook.com/LACASADELCELULARMYA/'
const instagramLink = (import.meta?.env?.VITE_INSTAGRAM_PAGE) || 'https://www.instagram.com/lacasadelcelularmya/'

function openWhatsApp() {
  if (!/^\d{8,15}$/.test(whatsDigits)) {
    Notify.create({ type: 'negative', message: 'Número de WhatsApp inválido. Revisa VITE_ADMIN_WHATSAPP.' })
    return
  }
  const url = whatsAppLink.value
  const win = window.open(url, '_blank', 'noopener,noreferrer')
  if (!win) window.location.href = url
}

const productosTecnologiaFiltrados = computed(() => {
  const text = busqueda.value.toLowerCase().trim()
  return productos.value.filter(p => {
    const catId = typeof p.categoria_id === 'object' ? p.categoria_id._id : p.categoria_id
    const matchCategoria = !categoriaSeleccionada.value || catId === categoriaSeleccionada.value._id

    const marcaId = typeof p.marca_id === 'object' ? p.marca_id._id : p.marca_id
    const matchMarca = !marcaSeleccionada.value || marcaId === marcaSeleccionada.value._id

    const matchTexto =
      !text ||
      p.nombre?.toLowerCase().includes(text) ||
      p.descripcion?.toLowerCase().includes(text) ||
      p.referencia?.toLowerCase().includes(text)

    // Solo productos de tecnología
    const esTecnologia = categoriasTecnologia.value.includes(catId)
    return esTecnologia && matchCategoria && matchMarca && matchTexto
  })
})

function agregarAlCarrito(producto) {
  const productoParaCarrito = {
    productoId: producto._id,
    cantidad: 1
  }
  carritoStore.crearCarrito([productoParaCarrito]).then(() => {
    carritoStore.listarCarritos()

  })
}

function goCarrito() {
  router.push({ path: '/carrito' })
}

const cantidadCarrito = computed(() => {
  const carrito = carritoStore.carritos.find(c => c.estado === 'activo')
  if (!carrito || !carrito.productos) return 0
  // Suma todas las cantidades de productos en el carrito
  return carrito.productos.reduce((sum, p) => sum + (p.cantidad || 1), 0)
})

</script>

<style scoped>
.carrito-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #d32f2f;
  color: #fff;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 0.85rem;
  font-weight: bold;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  z-index: 2;
}
/* Paleta inspirada en la imagen: verde, blanco, gris y detalles */
.hero-banner {
  background: linear-gradient(135deg, #386348 0%, #33dc71 80%);
  border-radius: 14px;
  position: relative;
  overflow: hidden;
}
.hero-banner:after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('../assets/tec.jpeg') center/cover no-repeat;
  opacity: 0.25;
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 1;
  padding: 32px 18px;
}
.text-h4, .text-h5 {
  color: #fff;
  text-shadow: 0 2px 8px rgba(30,41,59,0.18);
}
.q-carousel__slide {
  min-height: 220px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
}
.q-carousel {
  box-shadow: 0 2px 16px rgba(22, 163, 74, 0.08);
  border-radius: 12px;
  margin-bottom: 16px;
}
.chip-row .q-chip {
  background: #22c55e;
  color: #fff;
  font-weight: 500;
  margin-right: 6px;
}
.chip-row .q-chip:hover {
  background: #16a34a;
  color: #fff;
}
.hero-cta .q-btn {
  background: #22c55e;
  color: #fff;
  font-weight: 600;
  border-radius: 8px;
}
.hero-cta .q-btn:hover {
  background: #16a34a;
}
.input-styled, .hero-cta .q-input {
  border-radius: 8px;
  background: #fff;
  color: #16a34a;
}
.header-toolbar {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(22,163,74,0.08);
}
.q-toolbar-title span {
  font-size: 1.3rem;
  letter-spacing: 1px;
}
.q-badge {
  background: #16a34a;
  color: #fff;
  font-weight: 600;
}
.q-bar {
  background: #22c55e;
  color: #fff;
  border-radius: 8px;
}
.q-btn {
  min-width: 65px;
  font-weight: 500;
}
.bottom-banner {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 80%);
  border-radius: 14px;
  color: #fff;
}
.bottom-banner .text-h5 {
  color: #fff;
}


.q-pa-md .q-gutter-sm {
    padding: 0px 2px;
}


.q-card {
  border-radius: 18px;
  border: 2px solid #000000FF;
  box-shadow: 0 4px 18px rgba(34,197,94,0.10), 0 1.5px 6px rgba(30,41,59,0.08);
  transition: box-shadow 0.18s, transform 0.18s;
  background: #fff;
}
.q-card:hover {
  box-shadow: 0 8px 32px rgba(34,197,94,0.18), 0 2px 12px rgba(30,41,59,0.12);
  transform: translateY(-6px) scale(1.02);
  border-color: #16a34a;
}
.q-chip[color="orange"] {
  background: #f59e42 !important;
  color: #fff !important;
}
.q-chip[color="green"] {
  background: #22c55e !important;
  color: #fff !important;
}
.q-chip[color="red"] {
  background: #ef4444 !important;
  
  color: #fff !important;
}



</style>
