<template>
  <div class="carrito-container">
    <div class="carrito-header">
      <div style="position: relative; display: inline-block;">
        <q-icon name="shopping_cart" size="32px" color="primary" />
        <span v-if="productos.length" class="carrito-badge">{{ productos.length }}</span>
      </div>
      <h4 class="carrito-title">Mi carrito</h4>
      <!-- <span class="carrito-count">({{ productos.length }} productos)</span> -->
      <q-btn
        color="negative"
        icon="delete_forever"
        label="Vaciar"
        class="vaciar-btn"
        @click="vaciarCarrito"
        :disable="!productos.length || vaciando"
        size="sm"
        flat
      />
    </div>
    <q-separator spaced />
    <div v-if="productos.length">
      <q-list bordered class="carrito-list">
        <q-item v-for="p in productos" :key="p.productoId._id" class="carrito-item">
          <q-item-section avatar>
            <q-avatar rounded size="48px">
              <q-img :src="p.productoId.imagenes?.[0]" fit="cover" v-if="p.productoId.imagenes && p.productoId.imagenes.length" />
              <q-icon v-else name="image_not_supported" color="grey-5" size="32px" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <div class="carrito-nombre">{{ p.productoId.nombre }}</div>
            <div class="carrito-precio">Precio: <span>${{ p.productoId.precio.toLocaleString() }}</span></div>
            <div class="carrito-cantidad">Cantidad: <span>{{ p.cantidad }}</span></div>
          </q-item-section>
          <q-item-section side>
            <div style="display: flex; align-items: center; gap: 6px;">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="remove"
                @click="restarCantidad(p.productoId._id)"
                :disable="quitando[p.productoId._id] || p.cantidad <= 1"
                size="sm"
              />
              <span>{{ p.cantidad }}</span>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="add"
                @click="sumarCantidad(p.productoId._id)"
                :disable="quitando[p.productoId._id]"
                size="sm"
              />
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="quitarProducto(p.productoId._id)"
                :disable="quitando[p.productoId._id]"
                size="sm"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="carrito-total">
        <span>Total:</span>
        <span class="text-primary text-weight-bold">${{ total.toLocaleString() }}</span>
      </div>
    </div>
    <div v-else class="carrito-vacio">
      <q-icon name="shopping_cart" size="48px" color="grey-5" />
      <div>No hay productos en el carrito.</div>
    </div>
    <!-- Botón para cerrar el carrito -->
    <div class="carrito-cerrar">
      <q-btn
        color="primary"
        label="Cerrar"
        flat
        size="md"
        @click="$emit('close')"
        class="full-width"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue'
import { useCarritoStore } from '../stores/carrito.js'

const carritoStore = useCarritoStore()
const quitando = ref({})
const vaciando = ref(false)

onMounted(() => {
  carritoStore.listarCarritos()
})

const carritoActivo = computed(() =>
  carritoStore.carritos.find(c => c.estado === 'activo') || { productos: [] }
)

const productos = computed(() =>
  (carritoActivo.value.productos || []).filter(p => p.productoId && p.productoId.nombre)
)

const total = computed(() =>
  productos.value.reduce((sum, p) => sum + ((p.productoId?.precio || 0) * (p.cantidad || 1)), 0)
)

function guardarCarritoConExpiracion(productos) {
  const data = {
    productos,
    expiracion: Date.now() + 9000 // 9 segundos
  }
  localStorage.setItem('carrito', JSON.stringify(data))
}


function cargarCarrito() {
  const data = JSON.parse(localStorage.getItem('carrito'))
  if (data) {
    if (data.expiracion > Date.now()) {
      // OK: no expiró, puedes sincronizar si quieres
    } else {
      // Solo si expiró, limpia localStorage y backend
      localStorage.removeItem('carrito')
      vaciarCarritoLocal()
    }
  }
  // Si no hay data, NO hagas nada (no borres el backend)
}

async function vaciarCarritoLocal() {
  const carritoId = carritoActivo.value._id
  if (carritoId) {
    await carritoStore.eliminarCarrito(carritoId)
    await carritoStore.listarCarritos()
  }
}

onMounted(() => {
  cargarCarrito()
  setInterval(() => {
    const data = JSON.parse(localStorage.getItem('carrito'))
    if (data && data.expiracion <= Date.now()) {
      localStorage.removeItem('carrito')
      vaciarCarritoLocal()
    }
  }, 50*60*1000) // Cada 50 minutos
})


// Quitar un producto
async function quitarProducto(productoId) {
  const carritoId = carritoActivo.value._id
  if (!carritoId) return
  quitando.value[productoId] = true
  try {
    await carritoStore.editarCarrito(carritoId, [{ productoId }])
    await carritoStore.listarCarritos()
  } finally {
    quitando.value[productoId] = false
  }
}

// Vaciar todo el carrito
async function vaciarCarrito() {
  const carritoId = carritoActivo.value._id
  if (!carritoId) return
  vaciando.value = true
  try {
    await carritoStore.eliminarCarrito(carritoId)
    await carritoStore.listarCarritos()
  } finally {
    vaciando.value = false
  }
} 

// Sumar cantidad
async function sumarCantidad(productoId) {
  const carritoId = carritoActivo.value._id
  if (!carritoId) return
  quitando.value[productoId] = true
  try {
    await carritoStore.editarCarrito(carritoId, [{ productoId, accion: 'sumar' }])
    await carritoStore.listarCarritos()
  } finally {
    quitando.value[productoId] = false
  }
}

// Restar cantidad
async function restarCantidad(productoId) {
  const carritoId = carritoActivo.value._id
  if (!carritoId) return
  quitando.value[productoId] = true
  try {
    await carritoStore.editarCarrito(carritoId, [{ productoId, accion: 'restar' }])
    await carritoStore.listarCarritos()
  } finally {
    quitando.value[productoId] = false
  }
}

// Llama a guardarCarritoConExpiracion(productos.value) cada vez que el carrito cambie
watch(productos, (newVal) => {
  guardarCarritoConExpiracion(newVal)
}, { deep: true })


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
.carrito-container {
  min-width: 350px;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
  background: #fff;
  border-radius: 25px;
  box-shadow: 0 2px 12px rgba(30,41,59,0.08);
  padding: 24px;
  border: 2px solid #0e1602a0;
  position: relative;
  margin-top: -280px;
  left: 52px;
}
.carrito-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.vaciar-btn {
  margin-left: auto;
  font-size: 0.85rem;
  min-width: 80px;
  padding: 2px 8px;
}
.carrito-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}
.carrito-count {
  font-size: 1rem;
  color: #666;
  margin-left: 4px;
}
.carrito-list {
  margin-top: 10px;
  background: #fafbfc;
  border-radius: 8px;
}
.carrito-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.carrito-nombre {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 2px;
}
.carrito-precio, .carrito-cantidad {
  font-size: 0.98rem;
  color: #555;
}
.carrito-precio span, .carrito-cantidad span {
  font-weight: 500;
  color: #1976d2;
}
.carrito-total {
  margin-top: 18px;
  font-size: 1.2rem;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
}
.carrito-vacio {
  padding: 32px 0;
  text-align: center;
  color: #888;
}
.carrito-cerrar {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}
.full-width {
  width: 100%;
  margin-top: 8px;
}
@media (max-width: 600px) {
  .carrito-container {
        min-width: 75vw;
        max-width: 70vw;
        border-radius: 10;
        padding: 10px;
        border-width: 0 0 2px 0;
        position: relative;
        left: 29px;
        margin-top: -110px;
  }
  .carrito-title {
    font-size: 1.1rem;
  }
  .carrito-list {
    border-radius: 0;
  }
  .vaciar-btn {
    font-size: 0.75rem;
    min-width: 60px;
    padding: 2px 4px;
  }
}
</style>

