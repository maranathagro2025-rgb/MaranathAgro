<template>
  <div class="admin-container">
    <!-- Modal para crear negocio usando el componente Negocio.vue -->
    <q-dialog v-model="mostrarCrearNegocio" persistent>
      <Negocio @close="mostrarCrearNegocio = false" modo="crear" />
    </q-dialog>

    <!-- Header mejorado con diseño agropecuario -->
    <div class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <q-icon name="agriculture" size="36px" class="header-icon" />
          <div class="header-text">
            <div class="header-title">Panel de Administración</div>
            <div class="header-subtitle">Sistema de Gestión Agropecuaria</div>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <q-avatar color="white" text-color="green-8" size="40px" class="q-mr-sm">
              <q-icon name="person" size="24px" />
            </q-avatar>
            <div class="user-details">
              <div class="user-name">{{ usuario?.nombre || "Admin" }}</div>
              <div class="user-role">Administrador</div>
            </div>
          </div>
          <q-btn
            unelevated
            color="white"
            text-color="green-8"
            icon="logout"
            label="Cerrar sesión"
            @click="cerrarSesion"
            class="logout-btn"
          />
        </div>
      </div>
    </div>

    <!-- Stats Cards con diseño agropecuario -->
    <div class="stats-section">
      <div class="stats-grid">
        <!-- Productos -->
        <q-card class="stat-card productos-card">
          <q-card-section class="stat-content">
            <div class="stat-icon-wrapper green">
              <q-icon name="inventory" size="32px" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.productos }}</div>
              <div class="stat-label">Productos</div>
            </div>
          </q-card-section>
          <div class="card-shine"></div>
        </q-card>

        <!-- Categorías -->
        <q-card class="stat-card categorias-card">
          <q-card-section class="stat-content">
            <div class="stat-icon-wrapper blue">
              <q-icon name="category" size="32px" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.categorias }}</div>
              <div class="stat-label">Categorías</div>
            </div>
          </q-card-section>
          <div class="card-shine"></div>
        </q-card>

        <!-- Publicaciones -->
        <q-card class="stat-card publicaciones-card">
          <q-card-section class="stat-content">
            <div class="stat-icon-wrapper orange">
              <q-icon name="campaign" size="32px" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.publicacion }}</div>
              <div class="stat-label">Publicaciones</div>
            </div>
          </q-card-section>
          <div class="card-shine"></div>
        </q-card>

        <!-- Finca -->
        <q-card class="stat-card finca-card">
          <q-card-section class="stat-content">
            <div class="stat-icon-wrapper teal">
              <q-icon name="home_work" size="32px" />
            </div>
            <div class="stat-info">
              <div class="stat-value">1</div>
              <div class="stat-label">Finca</div>
            </div>
          </q-card-section>
          <div class="card-shine"></div>
        </q-card>
      </div>
    </div>

    <!-- Accesos rápidos con diseño moderno -->
    <q-card class="access-card">
      <q-card-section class="access-header">
        <q-icon name="dashboard" size="28px" color="green-8" class="q-mr-sm" />
        <span class="access-title">Accesos Rápidos</span>
      </q-card-section>
      <q-separator />
      <q-card-section class="access-content">
        <div class="access-grid">
          <!-- Productos -->
          <q-btn
            unelevated
            :to="{ name: 'producto' }"
            class="access-btn productos-btn"
          >
            <div class="access-btn-content">
              <q-icon name="inventory" size="40px" />
              <div class="access-btn-text">
                <div class="access-btn-title">Productos</div>
                <div class="access-btn-subtitle">Gestionar inventario</div>
              </div>
            </div>
          </q-btn>

          <!-- Categorías -->
          <q-btn
            unelevated
            :to="{ name: 'categoria' }"
            class="access-btn categorias-btn"
          >
            <div class="access-btn-content">
              <q-icon name="category" size="40px" />
              <div class="access-btn-text">
                <div class="access-btn-title">Categorías</div>
                <div class="access-btn-subtitle">Organizar productos</div>
              </div>
            </div>
          </q-btn>

          <!-- Publicaciones -->
          <q-btn
            unelevated
            :to="{ name: 'publicacion' }"
            class="access-btn publicaciones-btn"
          >
            <div class="access-btn-content">
              <q-icon name="campaign" size="40px" />
              <div class="access-btn-text">
                <div class="access-btn-title">Publicaciones</div>
                <div class="access-btn-subtitle">Anuncios y noticias</div>
              </div>
            </div>
          </q-btn>

          <!-- Finca -->
          <q-btn
            unelevated
            :to="{ name: 'finca' }"
            class="access-btn finca-btn"
          >
            <div class="access-btn-content">
              <q-icon name="home_work" size="40px" />
              <div class="access-btn-text">
                <div class="access-btn-title">Finca</div>
                <div class="access-btn-subtitle">Información general</div>
              </div>
            </div>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePublicacionStore } from '../stores/publicacion.js'
import { useProductoStore } from '../stores/producto.js'
import { useCategoriaStore } from '../stores/categoria.js'

const router = useRouter()

const mostrarCrearNegocio = ref(false)

const stats = reactive({
  negocios: 0,
  tipos: 0,
  productos: 0,   // <-- Agrega productos
  categorias: 0,  // <-- Agrega categorías
  publicacion: 0,
  pendientes: 0
})

const productoStore = useProductoStore()
const publicacionStore = usePublicacionStore()
const categoriaStore = useCategoriaStore()

onMounted(async () => {
  await Promise.all([
    productoStore.listarProductos(),
    categoriaStore.listarCategorias(),
    publicacionStore.listarPublicaciones()
  ])
  stats.productos = productoStore.productos.length
  stats.categorias = categoriaStore.categorias.length
  stats.publicacion = publicacionStore.publicaciones.length
})

watch(() => productoStore.productos.length, v => (stats.productos = v), { immediate: true })
watch(() => categoriaStore.categorias.length, v => (stats.categorias = v), { immediate: true })
watch(() => publicacionStore.publicaciones.length, v => (stats.publicacion = v), { immediate: true })

const cerrarSesion = () => {
  try {
    localStorage.removeItem('token')
  } finally {
    router.push({ path: '/' })
  }
}

const usuario = ref({ nombre: 'Admin' })
</script>

<style scoped>
/* Contenedor principal */
.admin-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  padding: 16px;
}

/* Header mejorado */
.admin-header {
  background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.2);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 12px;
}

.header-text {
  color: white;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.header-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.user-details {
  color: white;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.9;
}

.logout-btn {
  border-radius: 10px;
  font-weight: 600;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Stats Section */
.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.stat-card:hover .card-shine {
  left: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px !important;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon-wrapper.green {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.stat-icon-wrapper.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.stat-icon-wrapper.orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-icon-wrapper.teal {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Access Card */
.access-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.access-header {
  display: flex;
  align-items: center;
  padding: 20px 24px !important;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f5e9 100%);
}

.access-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
}

.access-content {
  padding: 24px !important;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.access-btn {
  height: auto;
  padding: 20px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.access-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  opacity: 0;
  transition: opacity 0.3s;
}

.access-btn:hover::before {
  opacity: 1;
}

.access-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.access-btn-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.access-btn-text {
  text-align: left;
  flex: 1;
}

.access-btn-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.access-btn-subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 500;
}

.productos-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.categorias-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.publicaciones-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.finca-btn {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  color: white;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-title {
    font-size: 1.3rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-container {
    padding: 12px;
  }

  .admin-header {
    padding: 16px;
    border-radius: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .header-title {
    font-size: 1.2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-content {
    padding: 16px !important;
  }

  .stat-icon-wrapper {
    width: 52px;
    height: 52px;
  }

  .stat-value {
    font-size: 1.6rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .access-content {
    padding: 16px !important;
  }

  .access-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .access-btn {
    padding: 16px;
  }

  .access-btn-title {
    font-size: 1rem;
  }

  .access-btn-subtitle {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .admin-container {
    padding: 8px;
  }

  .admin-header {
    padding: 12px;
    border-radius: 12px;
  }

  .header-left {
    gap: 12px;
  }

  .header-icon {
    padding: 8px;
  }

  .header-title {
    font-size: 1.1rem;
  }

  .header-subtitle {
    font-size: 0.75rem;
  }

  .user-info {
    padding: 6px 12px;
  }

  .user-name {
    font-size: 0.85rem;
  }

  .user-role {
    font-size: 0.7rem;
  }

  .logout-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stat-content {
    padding: 14px !important;
    gap: 12px;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .access-header {
    padding: 16px !important;
  }

  .access-title {
    font-size: 1.1rem;
  }

  .access-btn {
    padding: 14px;
  }

  .access-btn-content {
    gap: 12px;
  }

  .access-btn-title {
    font-size: 0.95rem;
  }

  .access-btn-subtitle {
    font-size: 0.75rem;
  }
}

/* Animaciones adicionales */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeIn 0.5s ease-out;
}

.stat-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-card:nth-child(3) {
  animation-delay: 0.3s;
}

.stat-card:nth-child(4) {
  animation-delay: 0.4s;
}
</style>
