<template>
  <div class="q-pa-md">
    <!-- Modal para crear negocio usando el componente Negocio.vue -->
    <q-dialog v-model="mostrarCrearNegocio" persistent>
      <Negocio @close="mostrarCrearNegocio = false" modo="crear" />
    </q-dialog>

    <q-toolbar class="bg-primary text-white q-mb-lg">
      <q-toolbar-title>Panel de Administración</q-toolbar-title>
      <div class="text-caption opacity-80">
        Hola, {{ usuario?.nombre || "Admin" }}
      </div>
      <q-space />
      <!-- Botón Cerrar sesión y volver a House -->
      <q-btn
        dense
        flat
        color="white"
        icon="logout"
        label="Cerrar sesión"
        @click="cerrarSesion"
        class="q-ml-sm"
      />
    </q-toolbar>

    <div class="row q-col-gutter-md q-mb-md">
      <!-- Productos -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2">Productos</div>
            <div class="text-h5">{{ stats.productos }}</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Categorías -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2">Categorías</div>
            <div class="text-h5">{{ stats.categorias }}</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- Marcas -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle2">Marcas</div>
            <div class="text-h5">{{ stats.marcas }}</div>
          </q-card-section>
        </q-card>
      </div>
      <!-- ...otros cards existentes... -->
    </div>

    <q-card flat bordered>
      <q-card-section class="text-subtitle1">Accesos rápidos</q-card-section>
      <q-separator />
      <q-card-actions class="q-pa-md">
        <q-btn
          color="primary"
          icon="add_business"
           :to="{ name: 'producto' }"
          label=" Administrar productos"
          @click="mostrarCrearNegocio = true"
          class="q-mr-sm"
        />
        <q-btn
          color="secondary"
          icon="category"
          label="Administrar categorias"
          :to="{ name: 'categoria' }"
          class="q-mr-sm"
        />
        <q-btn
          color="dark"
          icon="people"
          label="Administrar marcas"
          :to="{ name: 'marca' }"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriaStore } from '../stores/categoria.js'
import { useProductoStore } from '../stores/producto.js'
import { useMarcaStore } from '../stores/marca.js' // <-- Importa MarcaStore

const router = useRouter()

const mostrarCrearNegocio = ref(false)

const stats = reactive({
  negocios: 0,
  tipos: 0,
  productos: 0,   // <-- Agrega productos
  categorias: 0,  // <-- Agrega categorías
  marcas: 0,      // <-- Agrega marcas
  pendientes: 0
})

const productoStore = useProductoStore()
const categoriaStore = useCategoriaStore()
const marcaStore = useMarcaStore()

onMounted(async () => {
  await Promise.all([
    productoStore.listarProductos(),
    categoriaStore.listarCategorias(),
    marcaStore.listarMarcas()
  ])
  stats.productos = productoStore.productos.length
  stats.categorias = categoriaStore.categorias.length
  stats.marcas = marcaStore.marcas.length
})

watch(() => productoStore.productos.length, v => (stats.productos = v), { immediate: true })
watch(() => categoriaStore.categorias.length, v => (stats.categorias = v), { immediate: true })
watch(() => marcaStore.marcas.length, v => (stats.marcas = v), { immediate: true })

const cerrarSesion = () => {
  try {
    localStorage.removeItem('token')
  } finally {
    router.push({ path: '/' })
  }
}
</script>
