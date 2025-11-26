<template>
  <div class="finca-container">
    <div class="finca-content">
      <!-- Header mejorado -->
      <div class="page-header">
        <div class="header-left">
          <q-icon name="agriculture" size="48px" class="header-icon" />
          <div class="header-text">
            <h2 class="page-title">Gestión de la Finca</h2>
            <p class="page-subtitle">Administra la información de tu finca agropecuaria</p>
          </div>
        </div>
        <div class="header-actions">
          <q-btn 
            v-if="!fincaExiste"
            @click="abrirDialogCrear" 
            unelevated
            class="btn-crear"
            icon="add_circle"
            label="Crear Información" 
          />
          <q-btn 
            v-else
            @click="abrirDialogEditar" 
            unelevated
            class="btn-editar"
            icon="edit"
            label="Editar" 
          />
          <q-btn 
            flat
            class="btn-volver"
            icon="arrow_back"
            label="Volver"
            @click="$router.back()"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="fincaStore.loading" class="flex flex-center q-py-xl">
        <q-spinner-dots color="green-8" size="60px" />
      </div>

      <!-- Información de la finca -->
      <div v-else-if="fincaExiste" class="info-section">
        <!-- Información Básica -->
        <q-card class="info-card">
          <q-card-section class="card-header">
            <q-icon name="info" size="28px" class="q-mr-sm" />
            <span class="section-title">Información Básica</span>
          </q-card-section>
          <q-separator />
          <q-card-section class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-icon-wrapper green">
                  <q-icon name="agriculture" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Nombre de la Finca</div>
                  <div class="info-value">{{ fincaData?.nombre || 'N/A' }}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon-wrapper blue">
                  <q-icon name="location_on" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Ubicación</div>
                  <div class="info-value">{{ fincaData?.ubicacion || 'N/A' }}</div>
                </div>
              </div>
              <div class="info-item full-width">
                <div class="info-icon-wrapper teal">
                  <q-icon name="description" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Descripción</div>
                  <div class="info-value">{{ fincaData?.descripcion || 'N/A' }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Contacto -->
        <q-card class="info-card">
          <q-card-section class="card-header">
            <q-icon name="contact_phone" size="28px" class="q-mr-sm" />
            <span class="section-title">Información de Contacto</span>
          </q-card-section>
          <q-separator />
          <q-card-section class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-icon-wrapper orange">
                  <q-icon name="phone" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Teléfono</div>
                  <div class="info-value">{{ fincaData?.telefono || 'N/A' }}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon-wrapper red">
                  <q-icon name="email" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Email</div>
                  <div class="info-value">{{ fincaData?.email || 'N/A' }}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon-wrapper green">
                  <q-icon name="chat" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">WhatsApp</div>
                  <div class="info-value">{{ fincaData?.whatsapp || 'N/A' }}</div>
                </div>
              </div>
              <div class="info-item full-width">
                <div class="info-icon-wrapper purple">
                  <q-icon name="place" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Dirección</div>
                  <div class="info-value">{{ fincaData?.direccion || 'N/A' }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Redes Sociales -->
        <q-card class="info-card">
          <q-card-section class="card-header">
            <q-icon name="share" size="28px" class="q-mr-sm" />
            <span class="section-title">Redes Sociales</span>
          </q-card-section>
          <q-separator />
          <q-card-section class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-icon-wrapper blue">
                  <q-icon name="facebook" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Facebook</div>
                  <div class="info-value">{{ fincaData?.facebook || 'N/A' }}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon-wrapper pink">
                  <q-icon name="photo_camera" size="24px" />
                </div>
                <div class="info-content">
                  <div class="info-label">Instagram</div>
                  <div class="info-value">{{ fincaData?.instagram || 'N/A' }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Galería de Imágenes -->
        <q-card class="info-card">
          <q-card-section class="card-header">
            <q-icon name="collections" size="28px" class="q-mr-sm" />
            <span class="section-title">
              Galería de Imágenes
              <span v-if="fincaData?.imagenesFinca" class="image-count">
                ({{ fincaData.imagenesFinca.length }} imagen(es))
              </span>
            </span>
          </q-card-section>
          <q-separator />
          <q-card-section class="card-body">
            <div class="gallery-section">
              <div v-if="fincaData?.imagenesFinca && fincaData.imagenesFinca.length > 0" class="gallery-grid">
                <div 
                  v-for="(img, index) in fincaData.imagenesFinca" 
                  :key="index"
                  class="gallery-item"
                >
                  <div class="image-card">
                    <q-img 
                      :src="img" 
                      ratio="16/9"
                      fit="cover"
                      loading="lazy"
                      class="gallery-image"
                    >
                      <template v-slot:loading>
                        <div class="absolute-full flex flex-center bg-grey-2">
                          <q-spinner-dots color="green-8" size="40px" />
                        </div>
                      </template>
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-grey-3 column">
                          <q-icon name="broken_image" size="48px" color="grey-6" />
                          <div class="text-caption text-grey-6 q-mt-sm">Error al cargar</div>
                        </div>
                      </template>
                    </q-img>
                    <div class="image-overlay">
                      <q-btn 
                        round
                        color="red" 
                        icon="delete" 
                        size="sm"
                        @click="confirmarEliminarImagen(index)"
                      >
                        <q-tooltip>Eliminar imagen {{ index + 1 }}</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-gallery">
                <q-icon name="image_not_supported" size="80px" color="grey-4" />
                <div class="empty-text">No hay imágenes en la galería</div>
                <div class="empty-subtext">Agrega imágenes de tu finca usando el botón editar</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Sin información -->
      <div v-else class="empty-state">
        <div class="empty-state-icon">
          <q-icon name="agriculture" size="120px" />
        </div>
        <div class="empty-state-title">No hay información de la finca</div>
        <div class="empty-state-subtitle">Crea la información básica de tu finca agropecuaria</div>
        <q-btn 
          @click="abrirDialogCrear" 
          unelevated
          class="btn-crear-empty"
          icon="add_circle"
          label="Crear Información" 
          size="lg"
        />
      </div>

      <!-- Dialog Crear/Editar -->
      <q-dialog 
        v-model="dialogFinca" 
        :backdrop-filter="'blur(4px) saturate(150%)'" 
        transition-show="rotate" 
        transition-hide="rotate" 
        persistent
        maximized
      >
        <q-card>
          <q-card-section class="bg-green-8 text-white">
            <div class="text-h6">{{ modoEdicion ? "Editar Información de la Finca" : "Crear Información de la Finca" }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 70vh" class="scroll">
            <!-- Información Básica -->
            <div class="text-h6 text-green-8 q-mb-md">Información Básica</div>
            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.nombre" label="Nombre de la Finca *" :dense="dense" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.ubicacion" label="Ubicación *" :dense="dense" />
              </div>
              <div class="col-12">
                <q-input filled v-model="form.descripcion" label="Descripción *" type="textarea" rows="3" :dense="dense" />
              </div>
              <div class="col-12">
                <q-input filled v-model="form.historia" label="Historia" type="textarea" rows="3" :dense="dense" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.mision" label="Misión" type="textarea" rows="2" :dense="dense" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.vision" label="Visión" type="textarea" rows="2" :dense="dense" />
              </div>
            </div>

            <!-- Contacto -->
            <div class="text-h6 text-green-8 q-mb-md">Información de Contacto</div>
            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-12 col-md-4">
                <q-input filled v-model="form.telefono" label="Teléfono *" :dense="dense" />
              </div>
              <div class="col-12 col-md-4">
                <q-input filled v-model="form.email" label="Email *" type="email" :dense="dense" />
              </div>
              <div class="col-12 col-md-4">
                <q-input filled v-model="form.whatsapp" label="WhatsApp" :dense="dense" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.direccion" label="Dirección" :dense="dense" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.horarioAtencion" label="Horario de Atención" :dense="dense" />
              </div>
            </div>

            <!-- Redes Sociales -->
            <div class="text-h6 text-green-8 q-mb-md">Redes Sociales</div>
            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.facebook" label="Facebook URL" :dense="dense" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="form.instagram" label="Instagram URL" :dense="dense" />
              </div>
            </div>

            <!-- Institucional -->
            <div class="text-h6 text-green-8 q-mb-md">Información Institucional</div>
            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-12">
                <q-input filled v-model="form.objetivos" label="Objetivos" type="textarea" rows="2" :dense="dense" />
              </div>
              <div class="col-12">
                <q-input filled v-model="form.alcance" label="Alcance" type="textarea" rows="2" :dense="dense" />
              </div>
            </div>

            <!-- Imágenes -->
            <div class="text-h6 text-green-8 q-mb-md">Galería de Imágenes</div>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-file 
                  filled 
                  v-model="imagenesNuevas" 
                  label="Seleccionar imágenes de la finca" 
                  multiple 
                  accept="image/*"
                  :dense="dense"
                  counter
                  max-files="10"
                >
                  <template v-slot:prepend>
                    <q-icon name="add_photo_alternate" />
                  </template>
                </q-file>
                <div class="text-caption text-grey-6 q-mt-xs">Puedes seleccionar hasta 10 imágenes</div>
              </div>
            </div>

            <!-- Logo -->
            <div class="text-h6 text-green-8 q-mb-md q-mt-lg">Logo de la Finca</div>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-file 
                  filled 
                  v-model="logoNuevo" 
                  label="Seleccionar logo" 
                  accept="image/*"
                  :dense="dense"
                >
                  <template v-slot:prepend>
                    <q-icon name="image" />
                  </template>
                </q-file>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="red" v-close-popup @click="cerrarDialog" />
            <q-btn flat label="Guardar" color="green-8" @click="guardarFinca" :loading="fincaStore.loading" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog Confirmar Eliminar Imagen -->
      <q-dialog v-model="dialogEliminarImagen" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="warning" color="warning" size="32px" class="q-mr-sm" />
            <span class="q-ml-sm">¿Seguro que quieres eliminar esta imagen?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Eliminar" color="red" @click="eliminarImagen" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed, watch } from "vue"
import { Notify, Dark } from 'quasar'
import { useFincaStore } from '../stores/finca.js'

const fincaStore = useFincaStore()

// State
const dialogFinca = ref(false)
const dialogEliminarImagen = ref(false)
const modoEdicion = ref(false)
const imagenAEliminar = ref(null)
const isDark = ref(Dark.isActive)
const dense = ref(true)

// Form data
const form = ref({
  nombre: '',
  ubicacion: '',
  descripcion: '',
  historia: '',
  mision: '',
  vision: '',
  telefono: '',
  email: '',
  whatsapp: '',
  direccion: '',
  horarioAtencion: '',
  facebook: '',
  instagram: '',
  objetivos: '',
  alcance: ''
})

const imagenesNuevas = ref(null)
const logoNuevo = ref(null)

// Computed
const fincaExiste = computed(() => {
  return fincaStore.finca !== null
})

const fincaData = computed(() => {
  return fincaStore.finca
})

// Watch
watch(isDark, (val) => {
  Dark.set(val)
})

// Lifecycle
onBeforeMount(async () => {
  await fincaStore.obtenerFinca()
  console.log('Datos de la finca:', fincaStore.finca)
  console.log('Imágenes de la finca:', fincaStore.finca?.imagenesFinca)
})

// Functions
function abrirDialogCrear() {
  modoEdicion.value = false
  limpiarFormulario()
  dialogFinca.value = true
}

function abrirDialogEditar() {
  modoEdicion.value = true
  cargarDatosFinca()
  dialogFinca.value = true
}

function cargarDatosFinca() {
  const finca = fincaStore.finca
  if (finca) {
    form.value = {
      nombre: finca.nombre || '',
      ubicacion: finca.ubicacion || '',
      descripcion: finca.descripcion || '',
      historia: finca.historia || '',
      mision: finca.mision || '',
      vision: finca.vision || '',
      telefono: finca.telefono || '',
      email: finca.email || '',
      whatsapp: finca.whatsapp || '',
      direccion: finca.direccion || '',
      horarioAtencion: finca.horarioAtencion || '',
      facebook: finca.facebook || '',
      instagram: finca.instagram || '',
      objetivos: finca.objetivos || '',
      alcance: finca.alcance || ''
    }
  }
}

function limpiarFormulario() {
  form.value = {
    nombre: '',
    ubicacion: '',
    descripcion: '',
    historia: '',
    mision: '',
    vision: '',
    telefono: '',
    email: '',
    whatsapp: '',
    direccion: '',
    horarioAtencion: '',
    facebook: '',
    instagram: '',
    objetivos: '',
    alcance: ''
  }
  imagenesNuevas.value = null
  logoNuevo.value = null
}

function cerrarDialog() {
  dialogFinca.value = false
  limpiarFormulario()
}

async function guardarFinca() {
  // Validaciones
  if (!form.value.nombre || !form.value.ubicacion || !form.value.descripcion || 
      !form.value.telefono || !form.value.email) {
    Notify.create({ 
      type: 'negative', 
      message: 'Nombre, ubicación, descripción, teléfono y email son obligatorios.' 
    })
    return
  }

  // Construir FormData
  const formData = fincaStore.construirFormData(form.value)

  // Agregar imágenes nuevas
  if (imagenesNuevas.value && Array.isArray(imagenesNuevas.value)) {
    imagenesNuevas.value.forEach(img => {
      formData.append('imagenesFinca', img)
    })
  }

  // Agregar logo nuevo
  if (logoNuevo.value) {
    formData.append('logo', logoNuevo.value)
  }

  // Crear o actualizar
  let res
  if (modoEdicion.value) {
    res = await fincaStore.actualizarFinca(formData)
  } else {
    res = await fincaStore.crearFinca(formData)
  }

  if (res) {
    await fincaStore.obtenerFinca()
    dialogFinca.value = false
    limpiarFormulario()
  }
}

function confirmarEliminarImagen(index) {
  imagenAEliminar.value = index
  dialogEliminarImagen.value = true
}

async function eliminarImagen() {
  if (imagenAEliminar.value !== null) {
    const res = await fincaStore.eliminarImagenFinca(imagenAEliminar.value)
    if (res) {
      await fincaStore.obtenerFinca()
    }
    imagenAEliminar.value = null
  }
}
</script>

<style scoped>
/* Contenedor principal */
.finca-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  padding: 0;
}

.finca-content {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #2e7d32 0%, #43a047 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.2);
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
  padding: 12px;
  border-radius: 14px;
}

.header-text {
  color: white;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: white;
}

.page-subtitle {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.95;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-crear, .btn-crear-empty {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-crear:hover, .btn-crear-empty:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
}

.btn-editar {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-editar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.btn-volver {
  color: white;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-volver:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Sección de información */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #e8f5e9 100%);
  padding: 20px 24px !important;
  display: flex;
  align-items: center;
  border-bottom: 3px solid #22c55e;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
}

.image-count {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  margin-left: 8px;
}

.card-body {
  padding: 24px !important;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 14px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.info-item:hover {
  background: #f1f5f9;
  border-color: #22c55e;
  transform: translateX(4px);
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-icon-wrapper.green {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.info-icon-wrapper.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.info-icon-wrapper.teal {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
}

.info-icon-wrapper.orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.info-icon-wrapper.red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.info-icon-wrapper.purple {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
}

.info-icon-wrapper.pink {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  line-height: 1.4;
}

/* Galería */
.gallery-section {
  width: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-4px);
}

.image-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.image-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.gallery-image {
  height: 200px;
  border-radius: 14px;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.empty-gallery {
  text-align: center;
  padding: 60px 20px;
  background: #f8fafc;
  border-radius: 14px;
  border: 2px dashed #cbd5e1;
}

.empty-text {
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 16px;
}

.empty-subtext {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-top: 8px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-state-icon {
  color: #cbd5e1;
  margin-bottom: 24px;
}

.empty-state-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.empty-state-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 32px;
}

/* Responsive */
@media (max-width: 1024px) {
  .page-header {
    padding: 20px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .finca-content {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
    border-radius: 16px;
  }

  .header-left {
    width: 100%;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .page-title {
    font-size: 1.3rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .card-body {
    padding: 16px !important;
  }
}

@media (max-width: 480px) {
  .finca-content {
    padding: 12px;
  }

  .page-header {
    padding: 12px;
    border-radius: 12px;
  }

  .header-icon {
    padding: 8px;
  }

  .page-title {
    font-size: 1.1rem;
  }

  .page-subtitle {
    font-size: 0.8rem;
  }

  .btn-crear, .btn-editar, .btn-volver {
    width: 100%;
    justify-content: center;
  }

  .info-item {
    padding: 12px;
  }

  .info-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .info-label {
    font-size: 0.7rem;
  }

  .info-value {
    font-size: 0.9rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .empty-state {
    padding: 60px 16px;
  }

  .empty-state-title {
    font-size: 1.4rem;
  }
}
</style>
 