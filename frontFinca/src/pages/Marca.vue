<template>
  <div style="background-color: white;">
    <div style="margin: 45px;">
      <div style="display:flex; justify-content: space-between; align-items: center;">
  <h2 style="color: orange; margin: 0;">Marcas</h2>
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
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        :dense="true"
      >
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" align="center">
            <q-btn @click="traerDatos(props.row)" color="green" icon="edit" size="sm"></q-btn>
            <q-btn @click="confirmarEliminar(props.row._id)" class="q-ml-sm" color="red" icon="delete" size="sm"></q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props" align="center">
            <q-chip color="green" text-color="white" square label="Activo" />
          </q-td>
        </template>
      </q-table>
      <q-dialog v-model="fixed" :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ b ? "Editar marca" : "Guardar marca" }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input filled v-model="nombre" label="Nombre de marca" :dense="dense" />
            <q-input filled v-model="descripcion" label="Descripción" :dense="dense" />
          </q-card-section>
          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="red" v-close-popup @click="cerrar" />
            <q-btn flat label="Guardar" color="primary" @click="guardarMarca" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirm" persistent :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate">
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm">¿Seguro que quieres eliminar este Item?</span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn @click="eliminarFicha" flat label="Aceptar" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-toggle v-model="isDark" label="Modo Oscuro" />
    </div>
  </div>
</template>

<script setup>

import { onBeforeMount, ref, watch } from "vue"
import { Notify, useQuasar, Dark } from 'quasar'
import { useMarcaStore } from '../stores/marca.js'

const marcaStore = useMarcaStore()
const $q = useQuasar()
const confirm = ref(false)
const fixed = ref(false)
const b = ref(false)
const id = ref("")
const isDark = ref(Dark.isActive)
const rows = ref([])
const dense = ref(true)
const descripcion = ref("")
const nombre = ref("")

watch(isDark, (val) => {
  Dark.set(val)
})

onBeforeMount(async () => {
  await marcaStore.listarMarcas()
  rows.value = marcaStore.marcas
})

function traerDatos(datos) {
  id.value = datos._id
  descripcion.value = datos.descripcion
  nombre.value = datos.nombre
  fixed.value = true
  b.value = true
}

function cerrar() {
  b.value = false
  descripcion.value = ""
  nombre.value = ""
}

function abrirDialogCrear() {
  b.value = false
  descripcion.value = ""
  nombre.value = ""
  fixed.value = true
}

function confirmarEliminar(itemId) {
  id.value = itemId
  confirm.value = true
}

async function guardarMarca() {
  if (!nombre.value || !descripcion.value) {
    Notify.create({ type: 'negative', message: 'Nombre y descripción son obligatorios.' })
    return
  }
  if (b.value) {
    // Editar
    const res = await marcaStore.editarMarca(id.value, {
      descripcion: descripcion.value,
      nombre: nombre.value
    })
    if (res) {
      Notify.create({ type: 'positive', message: 'Marca editada con éxito.' })
      await marcaStore.listarMarcas()
      rows.value = marcaStore.marcas
      fixed.value = false
    }
  } else {
    // Crear
    const res = await marcaStore.crearMarca({
      descripcion: descripcion.value,
      nombre: nombre.value
    })
    if (res) {
      Notify.create({ type: 'positive', message: 'Marca creada con éxito.' })
      await marcaStore.listarMarcas()
      rows.value = marcaStore.marcas
      fixed.value = false
    }
  }
}

async function eliminarFicha() {
  if (id.value) {
    const res = await marcaStore.desactivarMarca(id.value)
    if (res) {
      await marcaStore.listarMarcas()
      rows.value = marcaStore.marcas
      confirm.value = false
    }
  }
}

const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'center', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'center', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: false },
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
 