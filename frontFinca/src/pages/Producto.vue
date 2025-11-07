<template>
  <div style="background-color: white;">
    <div style="margin: 45px;">
      <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h4 style="color: orange; margin: 0;">Productos</h4>
        <q-btn 
          @click="abrirDialogCrear" 
          color="orange" 
          icon="add" 
          label="CREAR" 
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

      
      <!-- Filtros -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-3">
          <q-select
            v-model="filtroEstado"
            :options="[
              { label: 'Todos', value: '' },
              { label: 'Activo', value: '1' },
              { label: 'Inactivo', value: '0' }
            ]"
            label="Estado"
            map-options
            emit-value
            dense
            outlined
          />
        </div>
        <div class="col-12 col-sm-3">
          <q-input
            v-model="filtroNombre"
            label="Buscar por nombre"
            clearable
            dense
            outlined
          />
        </div>
      </div>
      <q-table
        :rows="productosFiltrados"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        :dense="true"
      >
        <template v-slot:body-cell-imagenes="props">
          <q-td>
            <img
              v-if="props.row.imagenes && props.row.imagenes.length"
              :src="props.row.imagenes[0]"
              alt="imagen producto"
              style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td>
            <span :class="{'text-positive': props.row.estado === 1, 'text-negative': props.row.estado === 0}">
              {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
            </span>
        
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" align="center">
            <q-btn @click.stop="traerDatos(props.row)" color="green" icon="edit" size="sm" />
            <q-btn
              @click.stop="eliminarProducto(props.row._id)"
              class="q-ml-sm"
              color="red"
              icon="delete"
              size="sm"
              :loading="rowLoading[props.row._id]"
              :disable="rowLoading[props.row._id]"
              label="Eliminar"
            />
            <q-btn
              v-if="props.row.estado === 0"
              @click.stop="activarProducto(props.row._id)"
              class="q-ml-sm"
              color="blue"
              icon="check_circle"
              size="sm"
              :loading="rowLoading['activar_' + props.row._id]"
              :disable="rowLoading['activar_' + props.row._id]"
              label="Activar"
            />
            <q-btn
              v-if="props.row.estado === 1"
              @click.stop="desactivarProducto(props.row._id)"
              class="q-ml-sm"
              color="orange"
              icon="block"
              size="sm"
              :loading="rowLoading['desactivar_' + props.row._id]"
              :disable="rowLoading['desactivar_' + props.row._id]"
              label="Desactivar"
            />
          </q-td>
        </template>
      </q-table>
      <!-- Modal de edición/creación -->
      <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ b ? "Editar Producto" : "Crear Producto" }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section style="max-height: 60vh" class="scroll">
            <q-form ref="formProducto" class="q-gutter-md">
              <q-input filled v-model="nombre" label="Nombre" :dense="dense" :rules="[req]" />

              <q-select
                v-model="categoria_id"
                :options="categoriasOptions"
                label="Categoría"
                option-label="nombre"
                option-value="_id"
                emit-value
                map-options
                :dense="dense"
                outlined
                :rules="[req]"
              />
              <q-select
                v-model="marca_id"
                :options="marcasOptions"
                label="Marca"
                option-label="nombre"
                option-value="_id"
                emit-value
                map-options
                :dense="dense"
                outlined
                :rules="[req]"
              />
              <q-input filled v-model="referencia" label="Referencia" :dense="dense" />
              <q-input filled v-model="precio" label="Precio" type="number" :dense="dense" :rules="[req]" />
              <q-input filled v-model="capacidad" label="Capacidad" :dense="dense" />
              <q-input filled v-model="cantidad" label="Cantidad" type="number" :dense="dense" :rules="[req]" />
              <q-toggle v-model="destacado" label="Destacado" />
              <q-toggle v-model="estado" label="Activo" true-value="1" false-value="0" />
              
              <!-- Especificaciones solo editables, sin agregar ni eliminar claves -->
              <div class="q-mb-md">
                <div class="text-caption text-grey-7 q-mb-xs">Especificaciones</div>
                <div v-for="(label, clave) in especificacionesModelo" :key="clave" class="row q-col-gutter-xs q-mb-xs">
                  <div class="col-12">
                    <q-input
                      dense
                      outlined
                      v-model="especificaciones[clave]"
                      :label="label"
                      :rules="[clave === 'ram' || clave === 'pantalla' ? req : null]"
                      @update:model-value="onEditEspecificacion(clave, $event)"
                    />
                  </div>
                </div>
              </div>

              <!-- Si quieres dejar el campo JSON oculto para debug, puedes dejarlo así: -->
              <q-input
                v-model="especificacionesStr"
                label="Especificaciones (JSON)"
                dense
                outlined
                class="q-mt-xs"
                style="display:none"
              />

              <!-- Imagen mejorada (opcional, no requerida) -->
              <div class="image-field q-mt-md">

                 <!-- Mostrar todas las imágenes actuales -->
              <div class="image-col">
                <div class="text-caption text-grey-7 q-mb-xs">Imágenes actuales</div>
                <div v-if="imagenActual && imagenActual.length" class="image-list">
                  <div v-for="(img, idx) in imagenActual" :key="idx" class="image-preview" style="position:relative;">
                    <q-img :src="img" ratio="1" />
                    <q-btn
                      round
                      dense
                      size="xs"
                      color="primary"
                      icon="star"
                      :flat="principalIdx !== idx"
                      :unelevated="principalIdx === idx"
                      style="position:absolute;top:6px;right:6px;"
                      @click="setPrincipal(idx)"
                    />
                    <div v-if="principalIdx === idx" class="text-caption text-green-8" style="position:absolute;bottom:6px;left:6px;">Principal</div>
                  </div>
                </div>
                <div v-else class="image-preview placeholder">
                  <q-icon name="image_not_supported" size="32px" class="text-grey-5" />
                </div>
              </div>
                <div class="image-col">
                  <div class="text-caption text-grey-7 q-mb-xs">Nueva imagen</div>
                  <div class="upload-box" @dragover.prevent @drop.prevent="onDropImagen">
                    <input
                      ref="fileInput"
                      class="hidden-input"
                      type="file"
                      accept="image/*"
                      multiple
                      @change="onImagenSeleccionada"
                    />
                    <div v-if="!imagenNueva.length" class="upload-hint">
                      <q-icon name="image" size="32px" class="text-grey-6" />
                      <div class="q-mt-sm">
                        Arrastra una imagen o
                        <span class="link" @click="abrirFileDialog"> haz clic para seleccionar</span>
                      </div>
                      <div class="text-caption text-grey-7 q-mt-xs">
                        JPG, PNG o WEBP. Máx 5 MB.
                      </div>
                    </div>
                    <div v-else class="preview-wrapper">
                      <div v-if="imagenNuevaUrls.length && imagenNueva[0]" style="position:relative;">
                        <q-img
                          :src="imagenNuevaUrls[0]"
                          class="image-preview"
                          ratio="1"
                        />
                      </div>
                      <div v-else class="image-preview placeholder" style="display:flex;align-items:center;justify-content:center;">
                        <q-icon name="image_not_supported" size="32px" class="text-grey-5" />
                      </div>
                      <div class="actions">
                        <q-btn flat dense color="primary" icon="swap_horiz" label="Cambiar" @click="abrirFileDialog" />
                        <q-btn flat dense color="negative" icon="close" label="Quitar" @click="limpiarImagenNueva" />
                      </div>
                      <div class="text-caption ellipsis q-mt-xs">
                        {{ imagenNueva.length ? imagenNueva[0].name : 'No hay imagen seleccionada' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="red" v-close-popup @click="cerrar" />
            <q-btn flat label="Guardar" color="primary" :loading="saving" :disable="saving" @click="guardarProducto" />
          </q-card-actions>
          <q-inner-loading :showing="saving">
            <q-spinner-gears size="50px" color="primary" />
            <div class="q-mt-sm">Guardando...</div>
          </q-inner-loading>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { Notify } from 'quasar'
import { useProductoStore } from '../stores/producto.js'
import { useCategoriaStore } from '../stores/categoria.js'
import { useMarcaStore } from '../stores/marca.js'
import Card from '../componentes/Card.vue'

const filtroNombre = ref('')
const filtroEstado = ref('')
const productoStore = useProductoStore()
const categoriaStore = useCategoriaStore()
const marcaStore = useMarcaStore()

const fixed = ref(false)
const b = ref(false)
const dense = ref(true)
const id = ref("")
const nombre = ref("")
const categoria_id = ref("")
const marca_id = ref("")
const referencia = ref("")
const precio = ref("")
const capacidad = ref("")
const cantidad = ref("")
const destacado = ref(false)
const estado = ref(1)
const especificacionesStr = ref("")
const imagenActual = ref("")
const imagenNueva = ref([]) // Cambia a array

const fileInput = ref(null)
// Manejo seguro de object URLs para vista previa
const imagenNuevaUrls = ref([])
// Actualiza los object URLs cuando cambian los archivos
watch(imagenNueva, (files, prev) => {
  // Limpia los object URLs anteriores
  imagenNuevaUrls.value.forEach(url => URL.revokeObjectURL(url));
  imagenNuevaUrls.value = [];
  if (Array.isArray(files)) {
    imagenNuevaUrls.value = files
      .filter(f => f instanceof File)
      .map(f => URL.createObjectURL(f));
  }
});
onBeforeUnmount(() => {
  imagenNuevaUrls.value.forEach(url => URL.revokeObjectURL(url));
})

onMounted(async () => {
  await categoriaStore.listarCategorias()
  await marcaStore.listarMarcas()
  await productoStore.listarProductos()
})

const categoriasOptions = computed(() => categoriaStore.categorias)
const marcasOptions = computed(() => marcaStore.marcas)
const productos = computed(() => productoStore.productos)

const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    return (
      (!filtroEstado.value || String(p.estado) === filtroEstado.value) &&
      (!filtroNombre.value || p.nombre?.toLowerCase().includes(filtroNombre.value.toLowerCase()))
    )
  })
})

const columns = [
  { name: 'imagenes', label: 'Imagen', align: 'left', field: 'imagenes' },
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
  { name: 'categoria', label: 'Categoría', align: 'left', field: row => row.categoria_id?.nombre || '', sortable: true },
  { name: 'marca', label: 'Marca', align: 'left', field: row => row.marca_id?.nombre || '', sortable: true },
  { name: 'referencia', label: 'Referencia', align: 'left', field: 'referencia' },
  { name: 'precio', label: 'Precio', align: 'left', field: 'precio' },
  { name: 'capacidad', label: 'Capacidad', align: 'left', field: 'capacidad' },
  { name: 'cantidad', label: 'Cantidad', align: 'left', field: 'cantidad' },
  { name: 'destacado', label: 'Destacado', align: 'center', field: 'destacado', sortable: true },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado', sortable: true },
  { name: 'opciones', label: 'Opciones', align: 'center' }
]


function abrirFileDialog() {
  fileInput.value?.click()
}

function onImagenSeleccionada(e) {
  const files = Array.from(e?.target?.files || [])
  imagenNueva.value = files.filter(f => f instanceof File)
}

function onDropImagen(e) {
  const files = Array.from(e.dataTransfer?.files || []);
  imagenNueva.value = files.filter(f => f instanceof File);
}

function limpiarImagenNueva() {
  imagenNuevaUrls.value.forEach(url => URL.revokeObjectURL(url));
  imagenNuevaUrls.value = [];
  if (principalIdx.value >= imagenActual.value.length) {
    principalIdx.value = 0 // o el que corresponda
  }
  imagenNueva.value = [];
  if (fileInput.value) fileInput.value.value = "";
}

function cerrar() {
  b.value = false
  id.value = ""
  nombre.value = ""
  categoria_id.value = ""
  marca_id.value = ""
  referencia.value = ""
  precio.value = ""
  capacidad.value = ""
  cantidad.value = ""
  destacado.value = false
  estado.value = 1
  especificacionesStr.value = ""
  imagenActual.value = []
  imagenNueva.value = []
  fixed.value = false
  // Limpia el objeto especificaciones para que no se compartan campos entre productos
  especificaciones.value = {}
  nuevaClave.value = ''
  nuevoValor.value = ''
}

// Modelo base de especificaciones
const especificacionesModelo = {
  ram: 'RAM',
  pantalla: 'Pantalla',
  procesador: 'Procesador',
  bateria: 'Batería',
  camara: 'Cámara',
  sistema: 'Sistema'
}

// Al crear, inicializa todos los campos del modelo
function abrirDialogCrear() {
  cerrar()
  especificaciones.value = Object.fromEntries(
    Object.keys(especificacionesModelo).map(k => [k, ''])
  )
  especificacionesStr.value = JSON.stringify(especificaciones.value, null, 2)
  fixed.value = true
}

// Al editar, asegúrate de que todos los campos del modelo estén presentes
function traerDatos(row) {
  id.value = row._id
  nombre.value = row.nombre
  categoria_id.value = row.categoria_id?._id || row.categoria_id || ""
  marca_id.value = row.marca_id?._id || row.marca_id || ""
  referencia.value = row.referencia || ""
  precio.value = row.precio
  capacidad.value = row.capacidad || ""
  cantidad.value = row.cantidad
  destacado.value = !!row.destacado
  estado.value = row.estado
  especificacionesStr.value = row.especificaciones ? JSON.stringify(row.especificaciones, null, 2) : ""
  imagenActual.value = Array.isArray(row.imagenes) ? row.imagenes : (row.imagenes ? [row.imagenes] : [])
  principalIdx.value = row.imagenPrincipalIdx ?? 0
  imagenNueva.value = []
  fixed.value = true
  b.value = true
  // Mezcla el modelo con los datos existentes
  try {
    const base = Object.fromEntries(
      Object.keys(especificacionesModelo).map(k => [k, ''])
    )
    especificaciones.value = row.especificaciones
      ? { ...base, ...row.especificaciones }
      : { ...base }
  } catch {
    especificaciones.value = Object.fromEntries(
      Object.keys(especificacionesModelo).map(k => [k, ''])
    )
  }
}

const formProducto = ref(null)
const saving = ref(false)

const req = v => !!String(v ?? '').trim() || 'Requerido'

async function guardarProducto() {
  if (!nombre.value || !precio.value || !cantidad.value || !categoria_id.value || !marca_id.value) {
    Notify.create({ type: 'warning', message: 'Completa los campos obligatorios' })
    return
  }

  // CORRECCIÓN: Usa el objeto especificaciones.value directamente
  let especificacionesObj = {}
  try {
    // Si especificacionesStr tiene valor, úsalo, si no, usa especificaciones.value
    if (especificacionesStr.value) {
      especificacionesObj = JSON.parse(especificacionesStr.value)
    } else {
      especificacionesObj = { ...especificaciones.value }
    }
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Especificaciones debe ser JSON válido' })
    return
  }

  const payload = new FormData()
  payload.append('nombre', nombre.value.trim())
  payload.append('categoria_id', categoria_id.value)
  payload.append('marca_id', marca_id.value)
  payload.append('referencia', referencia.value)
  payload.append('precio', precio.value)
  payload.append('capacidad', capacidad.value)
  payload.append('cantidad', cantidad.value)
  payload.append('destacado', destacado.value ? 'true' : 'false')
  payload.append('estado', estado.value)
  payload.append('especificaciones', JSON.stringify(especificacionesObj))
  if (imagenNueva.value instanceof File) payload.append('imagenes', imagenNueva.value)
  if (Array.isArray(imagenNueva.value)) {
    imagenNueva.value.forEach(file => {
      payload.append('imagenes', file)
    })
  }
  payload.append('imagenPrincipalIdx', principalIdx.value)

  try {
    saving.value = true
    const apiPromise = b.value
      ? productoStore.editarProducto(id.value, payload)
      : productoStore.crearProducto(payload)

    await apiPromise
    await productoStore.listarProductos()
    fixed.value = false
    Notify.create({ type: 'positive', message: b.value ? 'Producto actualizado' : 'Producto creado' })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error.response?.data?.msg || error.response?.data?.errors?.[0]?.msg || 'Error'
    })
  } finally {
    saving.value = false
  }
}

const rowLoading = ref({})

function setRowLoading(key, val) {
  rowLoading.value = { ...rowLoading.value, [key]: val }
}

async function eliminarProducto(id) {
  if (rowLoading.value[id]) return
  setRowLoading(id, true)
  try {
    await productoStore.eliminarProducto(id)
    await productoStore.listarProductos()
    Notify.create({ type: 'positive', message: 'Producto eliminado' })
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Error al eliminar producto' })
  } finally {
    setRowLoading(id, false)
  }
}

async function activarProducto(id) {
  const key = 'activar_' + id
  if (rowLoading.value[key]) return
  setRowLoading(key, true)
  try {
    await productoStore.activarProducto(id)
    await productoStore.listarProductos()
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Error al activar producto' })
  } finally {
    setRowLoading(key, false)
  }
}

async function desactivarProducto(id) {
  const key = 'desactivar_' + id
  if (rowLoading.value[key]) return
  setRowLoading(key, true)
  try {
    await productoStore.desactivarProducto(id)
    await productoStore.listarProductos()
  } catch (e) {
    Notify.create({ type: 'negative', message: 'Error al desactivar producto' })
  } finally {
    setRowLoading(key, false)
  }
}
const principalIdx = ref(0) // Por defecto la primera imagen es principal

function setPrincipal(idx) {
  principalIdx.value = idx
}

const imagenNuevaFiles = computed(() =>
  Array.isArray(imagenNueva.value)
    ? imagenNueva.value.filter(img => typeof File !== 'undefined' && img instanceof File)
    : []
)

const especificaciones = ref({});
const nuevaClave = ref('');
const nuevoValor = ref('');

// Sincroniza especificacionesStr <-> especificaciones (objeto)
watch(especificacionesStr, (val) => {
  try {
    especificaciones.value = val ? JSON.parse(val) : {};
  } catch {
    especificaciones.value = {};
  }
}, { immediate: true });

watch(especificaciones, (val) => {
  especificacionesStr.value = JSON.stringify(val, null, 2);
});




function agregarEspecificacion() {
  if (nuevaClave.value && nuevoValor.value) {
    especificaciones.value = {
      ...especificaciones.value,
      [nuevaClave.value]: nuevoValor.value
    };
    nuevaClave.value = '';
    nuevoValor.value = '';
  }
}
function eliminarEspecificacion(clave) {
  const obj = { ...especificaciones.value };
  delete obj[clave];
  especificaciones.value = obj;
}
function onEditEspecificacion(clave, valor) {
  especificaciones.value = {
    ...especificaciones.value,
    [clave]: valor
  };
}

</script>

<style scoped>
/* Tabla */
.q-btn { border-radius: 5px; font-size: 14px; }
.q-table { border: 1px solid #ddd; background-color: white; }
.q-td { padding: 8px; }
.q-th, .q-td { text-align: center; }
.text-positive { color: #219653; font-weight: bold; }
.text-negative { color: #b71c1c; font-weight: bold; }

/* Imagen en modal */
.image-field {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: start;
}
.image-col { display: flex; flex-direction: column; }
.image-preview {
  width: 112px;
  height: 112px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  background: #fafafa;
}
.image-preview.placeholder {
  display: grid;
  place-items: center;
}

/* Zona de carga amigable */
.upload-box {
  position: relative;
  min-height: 132px;
  border: 1px dashed #c7c7c7;
  border-radius: 8px;
  background: #fbfbfb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  text-align: center;
  transition: border-color .2s, background-color .2s;
}
.upload-box:hover,
.upload-box:focus-within {
  border-color: #90caf9;
  background-color: #f5faff;
}

/* Input nativo oculto */
.hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none; /* se abre con abrirFileDialog() */
}

/* Texto y acciones */
.upload-hint .link {
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
}
.preview-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-wrapper .actions {
  display: flex;
  gap: 4px;
  flex-direction: column;
}

@media (max-width: 640px) {
  .image-field { grid-template-columns: 1fr; }
}

/* Nueva sección para mostrar todas las imágenes actuales */
.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
}
</style>


