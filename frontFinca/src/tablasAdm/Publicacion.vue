<template>
  <div style="background-color: white;">
    <div style="margin: 45px;">
      <div style="display:flex; justify-content: space-between; align-items: center;">
        <h2 style="color: #2d5016; margin: 0;">Gestión de Publicaciones</h2>
        <div class="q-gutter-sm">
          <q-btn 
            @click="abrirDialogCrear" 
            color="green-8" 
            icon="add" 
            label="CREAR PUBLICACIÓN" 
            text-color="white" 
          />
          <q-btn 
            color="grey-7"
            icon="arrow_back"
            label="Volver"
            text-color="white"
            @click="$router.back()"
          />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="publicacionStore.loading" class="flex flex-center q-py-xl">
        <q-spinner-dots color="green-8" size="60px" />
      </div>

      <!-- Tabla de publicaciones -->
      <q-table
        v-else
        :rows="rows"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        :dense="true"
        class="q-mt-md"
      >
        <template v-slot:body-cell-imagenes="props">
          <q-td :props="props" align="center">
            <q-avatar v-if="props.row.imagenes && props.row.imagenes.length > 0" square size="60px">
              <q-img :src="props.row.imagenes[0]" />
            </q-avatar>
            <q-icon v-else name="image_not_supported" size="40px" color="grey-5" />
          </q-td>
        </template>

        <template v-slot:body-cell-tipo="props">
          <q-td :props="props" align="center">
            <q-chip 
              :color="getTipoColor(props.row.tipo)" 
              text-color="white" 
              :icon="getTipoIcon(props.row.tipo)"
              size="sm"
            >
              {{ getTipoLabel(props.row.tipo) }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-destacada="props">
          <q-td :props="props" align="center">
            <q-icon 
              :name="props.row.destacada ? 'star' : 'star_border'" 
              :color="props.row.destacada ? 'amber-8' : 'grey-5'" 
              size="24px"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props" align="center">
            <q-chip 
              :color="props.row.estado === 1 ? 'green' : 'red'" 
              text-color="white" 
              square 
              :label="props.row.estado === 1 ? 'Activo' : 'Inactivo'" 
            />
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" align="center">
            <q-btn @click="traerDatos(props.row)" color="green" icon="edit" size="sm" class="q-mr-xs">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn 
              v-if="props.row.estado === 1"
              @click="confirmarDesactivar(props.row._id)" 
              color="orange" 
              icon="block" 
              size="sm"
              class="q-mr-xs"
            >
              <q-tooltip>Desactivar</q-tooltip>
            </q-btn>
            <q-btn 
              v-else
              @click="confirmarActivar(props.row._id)" 
              color="blue" 
              icon="check_circle" 
              size="sm"
              class="q-mr-xs"
            >
              <q-tooltip>Activar</q-tooltip>
            </q-btn>
            <q-btn @click="confirmarEliminar(props.row._id)" color="red" icon="delete" size="sm">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
      <!-- Dialog Crear/Editar -->
      <q-dialog 
        v-model="dialogPublicacion" 
        :backdrop-filter="'blur(4px) saturate(150%)'" 
        transition-show="rotate" 
        transition-hide="rotate" 
        persistent
        maximized
      >
        <q-card>
          <q-card-section class="bg-green-8 text-white">
            <div class="text-h6">{{ modoEdicion ? "Editar Publicación" : "Crear Nueva Publicación" }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 70vh" class="scroll">
            <div class="row q-col-gutter-md">
              <!-- Título -->
              <div class="col-12">
                <q-input 
                  filled 
                  v-model="form.titulo" 
                  label="Título *" 
                  :dense="dense"
                  counter
                  maxlength="200"
                  :rules="[val => val && val.length >= 5 || 'Mínimo 5 caracteres']"
                />
              </div>

              <!-- Descripción -->
              <div class="col-12">
                <q-input 
                  filled 
                  v-model="form.descripcion" 
                  label="Descripción *" 
                  type="textarea"
                  rows="3"
                  :dense="dense"
                  counter
                  maxlength="500"
                  :rules="[val => val && val.length >= 10 || 'Mínimo 10 caracteres']"
                />
              </div>

              <!-- Contenido -->
              <div class="col-12">
                <q-input 
                  filled 
                  v-model="form.contenido" 
                  label="Contenido completo (opcional)" 
                  type="textarea"
                  rows="5"
                  :dense="dense"
                />
              </div>

              <!-- Tipo -->
              <div class="col-12 col-md-6">
                <q-select
                  filled
                  v-model="form.tipo"
                  :options="tiposPublicacion"
                  label="Tipo de publicación *"
                  :dense="dense"
                  emit-value
                  map-options
                />
              </div>

              <!-- Autor -->
              <div class="col-12 col-md-6">
                <q-input 
                  filled 
                  v-model="form.autor" 
                  label="Autor" 
                  :dense="dense"
                  placeholder="Maranatha Agro"
                />
              </div>

              <!-- Destacada -->
              <div class="col-12">
                <q-toggle 
                  v-model="form.destacada" 
                  label="Marcar como destacada" 
                  color="green-8"
                />
              </div>

              <!-- Imágenes -->
              <div class="col-12">
                <q-file 
                  filled 
                  v-model="imagenesNuevas" 
                  label="Agregar imágenes" 
                  multiple 
                  accept="image/*"
                  :dense="dense"
                  counter
                  max-files="10"
                  use-chips
                  @update:model-value="onImagenesSeleccionadas"
                >
                  <template v-slot:prepend>
                    <q-icon name="add_photo_alternate" />
                  </template>
                  <template v-slot:hint>
                    Selecciona hasta 10 imágenes (JPG, PNG, WEBP)
                  </template>
                </q-file>
              </div>

              <!-- Imágenes actuales (solo en modo edición) -->
              <div v-if="modoEdicion && imagenesActuales.length > 0" class="col-12">
                <div class="text-subtitle2 text-green-8 q-mb-sm">Imágenes actuales ({{ imagenesActuales.length }}):</div>
                <div class="row q-col-gutter-sm">
                  <div 
                    v-for="(img, index) in imagenesActuales" 
                    :key="index"
                    class="col-6 col-sm-4 col-md-3"
                  >
                    <q-card flat bordered style="min-height: 200px;">
                      <q-img 
                        :src="img" 
                        :ratio="16/9"
                        spinner-color="green-8"
                        fit="cover"
                        loading="lazy"
                        style="height: 180px;"
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
                      <q-card-actions align="right">
                        <q-btn 
                          flat 
                          dense 
                          color="red" 
                          icon="delete" 
                          size="sm"
                          @click="confirmarEliminarImagen(index)"
                        >
                          <q-tooltip>Eliminar imagen {{ index + 1 }}</q-tooltip>
                        </q-btn>
                      </q-card-actions>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="red" v-close-popup @click="cerrarDialog" />
            <q-btn 
              flat 
              label="Guardar" 
              color="green-8" 
              @click="guardarPublicacion" 
              :loading="publicacionStore.loading" 
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog Confirmar Eliminar -->
      <q-dialog v-model="dialogEliminar" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="warning" color="warning" size="32px" class="q-mr-sm" />
            <span class="q-ml-sm">¿Seguro que quieres eliminar esta publicación?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Eliminar" color="red" @click="eliminarPublicacion" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog Confirmar Activar -->
      <q-dialog v-model="dialogActivar" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="check_circle" color="blue" size="32px" class="q-mr-sm" />
            <span class="q-ml-sm">¿Activar esta publicación?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Activar" color="blue" @click="activarPublicacion" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog Confirmar Desactivar -->
      <q-dialog v-model="dialogDesactivar" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="block" color="orange" size="32px" class="q-mr-sm" />
            <span class="q-ml-sm">¿Desactivar esta publicación?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Desactivar" color="orange" @click="desactivarPublicacion" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Dialog Eliminar Imagen -->
      <q-dialog v-model="dialogEliminarImagen" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="warning" color="warning" size="32px" class="q-mr-sm" />
            <span class="q-ml-sm">¿Eliminar esta imagen?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn flat label="Eliminar" color="red" @click="eliminarImagen" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-toggle v-model="isDark" label="Modo Oscuro" />
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from "vue"
import { Notify, Dark } from 'quasar'
import { usePublicacionStore } from '../stores/publicacion.js'

const publicacionStore = usePublicacionStore()

// State
const dialogPublicacion = ref(false)
const dialogEliminar = ref(false)
const dialogActivar = ref(false)
const dialogDesactivar = ref(false)
const dialogEliminarImagen = ref(false)
const modoEdicion = ref(false)
const id = ref("")
const imagenAEliminar = ref(null)
const isDark = ref(Dark.isActive)
const rows = ref([])
const dense = ref(true)

// Form data
const form = ref({
  titulo: '',
  descripcion: '',
  contenido: '',
  tipo: 'general',
  autor: 'Maranatha Agro',
  destacada: false
})

const imagenesNuevas = ref(null)
const imagenesActuales = ref([])

// Tipos de publicación
const tiposPublicacion = [
  { label: 'Noticia', value: 'noticia' },
  { label: 'Evento', value: 'evento' },
  { label: 'Nuevo Producto', value: 'producto_nuevo' },
  { label: 'Consejo/Tip', value: 'tips' },
  { label: 'Cosecha', value: 'cosecha' },
  { label: 'General', value: 'general' }
]

// Watch
watch(isDark, (val) => {
  Dark.set(val)
})

// Lifecycle
onBeforeMount(async () => {
  await publicacionStore.listarPublicaciones()
  rows.value = publicacionStore.publicaciones

})

// Helper functions
function onImagenesSeleccionadas(files) {
  console.log('Archivos seleccionados:', files)
  if (files) {
    const count = Array.isArray(files) ? files.length : 1
    console.log(`Se seleccionaron ${count} imagen(es)`)
  }
}

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
  return labels[tipo] || 'General'
}

// Functions
function abrirDialogCrear() {
  modoEdicion.value = false
  limpiarFormulario()
  dialogPublicacion.value = true
}

function traerDatos(datos) {
  modoEdicion.value = true
  id.value = datos._id
  form.value = {
    titulo: datos.titulo || '',
    descripcion: datos.descripcion || '',
    contenido: datos.contenido || '',
    tipo: datos.tipo || 'general',
    autor: datos.autor || 'Maranatha Agro',
    destacada: datos.destacada || false
  }
  // Asegurar que imagenesActuales sea un array válido
  imagenesActuales.value = Array.isArray(datos.imagenes) ? [...datos.imagenes] : []
  console.log('Imágenes actuales cargadas:', imagenesActuales.value)
  dialogPublicacion.value = true
}

function limpiarFormulario() {
  form.value = {
    titulo: '',
    descripcion: '',
    contenido: '',
    tipo: 'general',
    autor: 'Maranatha Agro',
    destacada: false
  }
  imagenesNuevas.value = null
  imagenesActuales.value = []
}

function cerrarDialog() {
  dialogPublicacion.value = false
  limpiarFormulario()
}

async function guardarPublicacion() {
  // Validaciones
  if (!form.value.titulo || form.value.titulo.length < 5) {
    Notify.create({ type: 'negative', message: 'El título debe tener al menos 5 caracteres.' })
    return
  }
  if (!form.value.descripcion || form.value.descripcion.length < 10) {
    Notify.create({ type: 'negative', message: 'La descripción debe tener al menos 10 caracteres.' })
    return
  }

  // Construir FormData
  const formData = new FormData()
  formData.append('titulo', form.value.titulo)
  formData.append('descripcion', form.value.descripcion)
  formData.append('tipo', form.value.tipo)
  formData.append('destacada', form.value.destacada)
  
  if (form.value.contenido) {
    formData.append('contenido', form.value.contenido)
  }
  if (form.value.autor) {
    formData.append('autor', form.value.autor)
  }

  // Agregar imágenes nuevas
  if (imagenesNuevas.value) {
    // Si es un array de archivos
    if (Array.isArray(imagenesNuevas.value)) {
      imagenesNuevas.value.forEach(img => {
        if (img instanceof File) {
          formData.append('imagenes', img)
        }
      })
    } 
    // Si es un solo archivo
    else if (imagenesNuevas.value instanceof File) {
      formData.append('imagenes', imagenesNuevas.value)
    }
    console.log('Imágenes a enviar:', imagenesNuevas.value)
  }

  // Crear o actualizar
  let res
  if (modoEdicion.value) {
    res = await publicacionStore.editarPublicacion(id.value, formData)
  } else {
    res = await publicacionStore.crearPublicacion(formData)
  }

  if (res) {
    await publicacionStore.listarPublicaciones()
    rows.value = publicacionStore.publicaciones
    dialogPublicacion.value = false
    limpiarFormulario()
  }
}

function confirmarEliminar(itemId) {
  id.value = itemId
  dialogEliminar.value = true
}

async function eliminarPublicacion() {
  if (id.value) {
    const res = await publicacionStore.eliminarPublicacion(id.value)
    if (res) {
      await publicacionStore.listarPublicaciones()
      rows.value = publicacionStore.publicaciones
    }
  }
}

function confirmarActivar(itemId) {
  id.value = itemId
  dialogActivar.value = true
}

async function activarPublicacion() {
  if (id.value) {
    const res = await publicacionStore.activarPublicacion(id.value)
    if (res) {
      // Actualizar el estado localmente sin recargar toda la lista
      const index = rows.value.findIndex(item => item._id === id.value)
      if (index !== -1) {
        rows.value[index].estado = 1
      }
    }
  }
}

function confirmarDesactivar(itemId) {
  id.value = itemId
  dialogDesactivar.value = true
}

async function desactivarPublicacion() {
  if (id.value) {
    const res = await publicacionStore.desactivarPublicacion(id.value)
    if (res) {
      // Actualizar el estado localmente sin recargar toda la lista
      const index = rows.value.findIndex(item => item._id === id.value)
      if (index !== -1) {
        rows.value[index].estado = 0
      }
    }
  }
}

function confirmarEliminarImagen(index) {
  imagenAEliminar.value = index
  dialogEliminarImagen.value = true
}

async function eliminarImagen() {
  if (imagenAEliminar.value !== null && id.value) {
    const res = await publicacionStore.eliminarImagenPublicacion(id.value, imagenAEliminar.value)
    if (res) {
      // Actualizar imágenes actuales
      imagenesActuales.value = res.publicacion?.imagenes || []
      await publicacionStore.listarPublicaciones()
      rows.value = publicacionStore.publicaciones
    }
    imagenAEliminar.value = null
  }
}

// Columnas de la tabla
const columns = [
  { name: 'imagenes', label: 'Imagen', align: 'center', sortable: false },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'center', sortable: true },
  { name: 'autor', label: 'Autor', field: 'autor', align: 'center', sortable: true },
  { name: 'destacada', label: 'Destacada', field: 'destacada', align: 'center', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
  { name: 'opciones', label: 'Opciones', align: 'center' }
]
</script>

<style scoped>
.q-btn {
  border-radius: 5px;
  font-size: 14px;
}
.q-table {
  border: 1px solid #ddd;
  background-color: white;
}
.q-td {
  padding: 8px;
}
.q-th, .q-td {
  text-align: center;
}
.q-chip {
  font-size: 12px;
  text-transform: uppercase;
}
.q-toolbar-title {
  font-size: 24px;
  font-weight: bold;
}
h2 {
  font-size: 24px;
  color: #3a9a42;
}

</style>
 