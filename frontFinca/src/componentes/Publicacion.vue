<template>
  <section class="publicaciones-section q-mb-xl" v-if="publicacionesRecientes.length > 0">
    <div class="text-center q-mb-lg">
      <div class="text-overline text-green-8 text-weight-bold">Novedades</div>
      <div class="text-h4 text-weight-bold text-grey-9">Últimas Publicaciones</div>
      <div class="text-body1 text-grey-6 q-mt-sm">
        Mantente informado sobre nuestras actividades y novedades
      </div>
    </div>

    <!-- Loading de publicaciones -->
    <div v-if="publicacionStore.loading" class="flex flex-center q-py-xl">
      <q-spinner-dots color="green-8" size="40px" />
    </div>

    <!-- Grid de publicaciones -->
    <div v-else class="row q-col-gutter-md">
      <div 
        v-for="pub in publicacionesRecientes" 
        :key="pub._id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat class="publicacion-card">
          <!-- Imagen principal -->
          <div class="publicacion-img-wrapper">
            <q-img
              v-if="pub.imagenPrincipal || (pub.imagenes && pub.imagenes.length > 0)"
              :src="pub.imagenPrincipal || pub.imagenes[0]"
              :ratio="16/9"
              spinner-color="green-8"
              spinner-size="40px"
              fit="cover"
              loading="lazy"
              class="publicacion-img"
              @error="onImageError"
            >
              <template v-slot:loading>
                <div class="absolute-full flex flex-center">
                  <q-spinner-dots color="green-8" size="40px" />
                </div>
              </template>

              <!-- Badge de tipo -->
              <div class="absolute-top-right q-ma-sm">
                <q-chip 
                  dense 
                  :color="getTipoColor(pub.tipo)" 
                  text-color="white"
                  :icon="getTipoIcon(pub.tipo)"
                  size="sm"
                >
                  {{ getTipoLabel(pub.tipo) }}
                </q-chip>
              </div>
              
              <!-- Badge destacada -->
              <div v-if="pub.destacada" class="absolute-top-left q-ma-sm">
                <q-chip dense color="amber-8" text-color="white" icon="star" size="sm">
                  Destacada
                </q-chip>
              </div>
            </q-img>

            <!-- Placeholder si no hay imagen -->
            <div v-else class="publicacion-placeholder">
              <q-icon name="article" size="64px" color="green-3" />
              
              <!-- Badges sobre placeholder -->
              <div class="absolute-top-right q-ma-sm">
                <q-chip 
                  dense 
                  :color="getTipoColor(pub.tipo)" 
                  text-color="white"
                  :icon="getTipoIcon(pub.tipo)"
                  size="sm"
                >
                  {{ getTipoLabel(pub.tipo) }}
                </q-chip>
              </div>
              
              <div v-if="pub.destacada" class="absolute-top-left q-ma-sm">
                <q-chip dense color="amber-8" text-color="white" icon="star" size="sm">
                  Destacada
                </q-chip>
              </div>
            </div>
          </div>

          <q-card-section>
            <!-- Título -->
            <div class="text-h6 text-weight-bold text-grey-9 q-mb-sm ellipsis-2-lines">
              {{ pub.titulo }}
            </div>

            <!-- Descripción -->
            <div class="text-body2 text-grey-7 q-mb-md ellipsis-3-lines">
              {{ pub.descripcion }}
            </div>

            <!-- Footer -->
            <div class="row items-center justify-between text-caption text-grey-6">
              <div class="row items-center q-gutter-xs">
                <q-icon name="person" size="16px" />
                <span>{{ pub.autor || 'Maranatha Agro' }}</span>
              </div>
              <div class="row items-center q-gutter-xs">
                <q-icon name="schedule" size="16px" />
                <span>{{ formatearFecha(pub.fechaPublicacion) }}</span>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- <q-card-actions align="right">
            <q-btn flat color="green-8" label="Leer más" icon-right="arrow_forward" />
          </q-card-actions> -->
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePublicacionStore } from '../stores/publicacion.js'

// Store
const publicacionStore = usePublicacionStore()

// Props
const props = defineProps({
  limite: {
    type: Number,
    default: 6
  }
})

// Computed - Publicaciones recientes
const publicacionesRecientes = computed(() => {
  return publicacionStore.publicaciones.slice(0, props.limite)
})

// Manejar error de carga de imagen
function onImageError(event) {
  console.error('Error al cargar imagen:', event)
}

// Helper functions
function getTipoColor(tipo) {
  const colores = {
    noticia: 'blue-8',
    evento: 'purple-8',
    producto_nuevo: 'green-8',
    tips: 'orange-8',
    cosecha: 'teal-8',
    general: 'grey-8'
  }
  return colores[tipo] || 'grey-8'
}

function getTipoIcon(tipo) {
  const iconos = {
    noticia: 'newspaper',
    evento: 'event',
    producto_nuevo: 'new_releases',
    tips: 'lightbulb',
    cosecha: 'agriculture',
    general: 'article'
  }
  return iconos[tipo] || 'article'
}

function getTipoLabel(tipo) {
  const labels = {
    noticia: 'Noticia',
    evento: 'Evento',
    producto_nuevo: 'Nuevo Producto',
    tips: 'Consejo',
    cosecha: 'Cosecha',
    general: 'General'
  }
  return labels[tipo] || 'Publicación'
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  const date = new Date(fecha)
  const opciones = { year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString('es-ES', opciones)
}

// Cargar publicaciones al montar
onMounted(async () => {
  if (publicacionStore.publicaciones.length === 0) {
    await publicacionStore.listarPublicaciones()
  }
})
</script>

<style scoped>
/**
 * PUBLICACIONES SECTION - Componente de publicaciones recientes
 */

/* Variables CSS heredadas del sistema */
:root {
  --space-xl: 3rem;
  --space-md: 1.5rem;
  --radius-lg: 16px;
  --shadow-sm: 0 2px 8px rgba(45, 80, 22, 0.08);
  --shadow-lg: 0 8px 24px rgba(45, 80, 22, 0.16);
  --transition-base: 250ms ease-in-out;
  --color-bg-light: #f5f1e8;
  --color-border: #e8e4da;
}

.publicaciones-section {
  padding: var(--space-xl) 0;
}

/**
 * PUBLICACION CARD - Tarjeta de publicación
 */
.publicacion-card {
  border-radius: var(--radius-lg);
  background: white;
  transition: 
    transform var(--transition-base),
    box-shadow var(--transition-base);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.publicacion-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Wrapper para imagen */
.publicacion-img-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* Imagen de publicación */
.publicacion-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Placeholder para publicaciones sin imagen */
.publicacion-placeholder {
  height: 200px;
  background: linear-gradient(135deg, var(--color-bg-light) 0%, var(--color-border) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Truncar texto a múltiples líneas */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-height: 2.8em;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
  max-height: 4.8em;
}

/* Estados de interacción */
.publicacion-card:focus-visible {
  outline: 3px solid #2d5016;
  outline-offset: 2px;
}

/* Loading center */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive - Tablet */
@media (min-width: 600px) {
  .publicacion-card:hover {
    transform: translateY(-6px);
  }
  
  .publicacion-placeholder {
    height: 220px;
  }
}

/* Responsive - Desktop */
@media (min-width: 1024px) {
  .publicacion-card:hover {
    transform: translateY(-8px);
  }
  
  .publicacion-placeholder {
    height: 240px;
  }
}

/* Accesibilidad - Reducir movimiento */
@media (prefers-reduced-motion: reduce) {
  .publicacion-card {
    transition: none;
  }
  
  .publicacion-card:hover {
    transform: none;
  }
}
</style>
