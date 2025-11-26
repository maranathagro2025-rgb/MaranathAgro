<template>
  <q-card v-if="producto" class="my-card">
    <!-- Badge de Destacado -->
    <div v-if="esDestacado" class="badge-destacado">
      <q-icon name="star" size="16px" />
      <span>Destacado</span>
    </div>

    <!-- Badge Orgánico -->
    <div v-if="esOrganico" class="badge-organico">
      <q-icon name="eco" size="16px" />
      <span>Orgánico</span>
    </div>

    <!-- Imagen con overlay gradient -->
    <div class="img-container">
      <q-img
        :src="imageUrl"
        ratio="1"
        class="card-img"
        spinner-color="primary"
        spinner-size="50px"
      >
        <template v-slot:loading>
          <div class="absolute-full flex flex-center">
            <q-spinner-dots color="primary" size="50px" />
          </div>
        </template>
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-grey-3">
            <div class="text-center">
              <q-icon name="broken_image" size="80px" color="grey-5" />
              <div class="text-grey-6 q-mt-sm">Error al cargar imagen</div>
            </div>
          </div>
        </template>
      </q-img>
      <div class="img-overlay"></div>
    </div>

    <q-card-section class="card-content">
      <!-- Header con título y precio -->
      <div class="header-section">
        <div class="card-title">{{ producto.nombre || 'Sin nombre' }}</div>
        <div class="precio-container">
          <span class="precio-label">Precio</span>
          <span class="card-precio">${{ precioFormateado }}</span>
        </div>
      </div>

      <q-separator class="separator-custom" />

      <!-- Info Grid -->
      <div class="info-grid">
        <div class="info-item">
          <div class="info-icon-wrapper green">
            <q-icon name="category" size="18px" />
          </div>
          <div class="info-content">
            <span class="info-label">Categoría</span>
            <span class="info-value">{{ categoriaNombre }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon-wrapper blue">
            <q-icon name="inventory_2" size="18px" />
          </div>
          <div class="info-content">
            <span class="info-label">Presentación</span>
            <span class="info-value">{{ presentacionCompleta }}</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon-wrapper purple">
            <q-icon name="public" size="18px" />
          </div>
          <div class="info-content">
            <span class="info-label">Origen</span>
            <span class="info-value">{{ origen }}</span>
          </div>
        </div>

        <!-- ✅ CAMPO DE DESCRIPCIÓN -->
        <div class="info-item full-width">
          <div class="info-icon-wrapper cyan">
            <q-icon name="description" size="18px" />
          </div>
          <div class="info-content">
            <span class="info-label">Descripción</span>
            <span class="info-value descripcion-text">{{ descripcion }}</span>
          </div>
        </div>

      </div>
    </q-card-section>

    <!-- Botones de acción -->
    <q-card-actions class="botones-card">
      <q-btn
        class="btn-action btn-vermas"
        unelevated
        @click="showDetalle = true"
      >
        <q-icon name="visibility" size="20px" class="q-mr-sm" />
        <span>Ver Detalles</span>
        <q-tooltip class="custom-tooltip">Ver información completa del producto</q-tooltip>
      </q-btn>
      
      <!-- <q-btn
        class="btn-action btn-carrito"
        @click="$emit('add-carrito', producto)"
        unelevated
      >
        <q-icon name="add_shopping_cart" size="20px" class="q-mr-sm" />
        <span>Añadir</span>
        <q-tooltip class="custom-tooltip">Agregar al carrito de compras</q-tooltip>
      </q-btn> -->
    </q-card-actions>

    <ProductoDetalle v-model="showDetalle" :producto="producto" @add-carrito="$emit('add-carrito', $event)" />
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductoDetalle from './ProductoDetalle.vue'

const props = defineProps({
  producto: {
    type: Object, 
    required: true 
  }
})

const showDetalle = ref(false)


// Computed para URL de imagen
const imageUrl = computed(() => {
  if (props.producto.imagenPrincipal && props.producto.imagenPrincipal.trim() !== '') {
    return props.producto.imagenPrincipal
  }

  if (props.producto.imagenes && Array.isArray(props.producto.imagenes) && props.producto.imagenes.length > 0) {
    return props.producto.imagenes[0]
  }

  return 'https://via.placeholder.com/400x400?text=Sin+Imagen'
})

// Computed para formatear precio
const precioFormateado = computed(() => {
  if (props.producto.precio_formateado) {
    return props.producto.precio_formateado.replace('$', '').trim()
  }

  const precio = props.producto.precio
  if (!precio && precio !== 0) return '0'
  
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(precio)
})

// Computed para categoría
const categoriaNombre = computed(() => {
  if (props.producto.categoria) {
    if (typeof props.producto.categoria === 'object' && props.producto.categoria !== null) {
      return props.producto.categoria.nombre || 'N/A'
    }
    if (typeof props.producto.categoria === 'string') {
      return props.producto.categoria
    }
  }
  return 'N/A'
})

// Computed para presentación + unidad
const presentacionCompleta = computed(() => {
  const presentacion = props.producto.presentacion
  const unidad = props.producto.unidad
  
  if (presentacion && unidad) {
    return `${presentacion} ${unidad}`
  }
  if (presentacion) return presentacion.toString()
  if (unidad) return unidad
  
  return 'N/A'
})

// ✅ Computed para descripción
const descripcion = computed(() => {
  return props.producto.descripcion || 'Sin descripción'
})

// Computed para origen
const origen = computed(() => {
  return props.producto.origen || 'N/A'
})

// Computed para estado
const estadoInfo = computed(() => {
  const activo = props.producto.estado === 1 || props.producto.estado === true
  return {
    activo,
    color: activo ? 'positive' : 'negative',
    icon: activo ? 'check_circle' : 'cancel',
    texto: activo ? 'Activo' : 'Inactivo'
  }
})

// Computed para destacado
const esDestacado = computed(() => {
  return props.producto.destacado === true || props.producto.destacado === 1
})

// Computed para producto orgánico
const esOrganico = computed(() => {
  return props.producto.esOrganico === true || props.producto.esOrganico === 1
})
</script>

<style scoped>
/* Tarjeta base con altura uniforme */
.my-card {
  max-width: 350px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
  height: 320px;
}

.my-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(25, 118, 210, 0.2);
}

/* Badges */
.badge-destacado, .badge-organico {
  position: absolute;
  top: 16px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.badge-destacado { right: 16px; background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color:#fff; }
.badge-organico { left: 16px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color:#fff; }

/* Imagen */
.img-container { position: relative; overflow: hidden; }
.card-img { height: 180px; object-fit: cover; transition: transform .5s ease; }
.my-card:hover .card-img { transform: scale(1.08); }
.img-overlay { position:absolute; bottom:0; left:0; right:0; height:60px; background:linear-gradient(to top, rgba(255,255,255,0.95), transparent); pointer-events:none; }

/* Contenido */
.card-content { padding:12px !important; flex:1; display:flex; flex-direction:column; overflow:hidden; }
.header-section { margin-bottom:8px; }
.card-title { font-size:1.2rem; font-weight:700; color:#1e293b; margin-bottom:8px; line-height:1.2; font-family:'Segoe UI','Roboto',Arial,sans-serif; display:-webkit-box; -webkit-line-clamp:2; line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.precio-container { display:flex; align-items:baseline; gap:6px; }
.precio-label { font-size:.75rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:.5px; }
.card-precio { font-size:1.4rem; color:#22c55e; font-weight:800; font-family:'Segoe UI','Roboto',Arial,sans-serif; }
.separator-custom { background:linear-gradient(90deg, transparent,#e2e8f0, transparent); height:1px; margin:8px 0; }

/* Info Grid */
.info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; overflow:hidden; }
.info-item { display:flex; align-items:flex-start; gap:6px; padding:6px; background:#f8fafc; border-radius:10px; transition:.2s ease; overflow:hidden; }
.info-item:hover { background:#f1f5f9; }
.info-item.full-width { grid-column:1 / -1; }
.info-icon-wrapper { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#fff; font-size:14px; }
.info-icon-wrapper.green { background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%); }
.info-icon-wrapper.blue { background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%); }
.info-icon-wrapper.purple { background:linear-gradient(135deg,#a855f7 0%,#7c3aed 100%); }
.info-icon-wrapper.cyan { background:linear-gradient(135deg,#06b6d4 0%,#0891b2 100%); }
.info-content { display:flex; flex-direction:column; gap:2px; flex:1; }
.info-label { font-size:.65rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:.4px; }
.info-value { font-size:.85rem; color:#1e293b; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.descripcion-text { display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis; line-height:1.3; -webkit-line-clamp:2; line-clamp:2; max-height:2.6em; }

/* Botones */
.botones-card { padding:0 10px 10px 10px !important; display:flex; gap:6px; margin-top:auto; }
.btn-action { flex:1; height:38px; border-radius:10px; font-weight:700; font-size:.8rem; letter-spacing:.3px; transition:.3s cubic-bezier(0.4,0,0.2,1); position:relative; overflow:hidden; }
.btn-action::before { content:''; position:absolute; top:50%; left:50%; width:0; height:0; border-radius:50%; background:rgba(255,255,255,0.3); transform:translate(-50%,-50%); transition:width .6s,height .6s; }
.btn-action:hover::before { width:280px; height:280px; }
.btn-vermas { background:linear-gradient(135deg,#1976d2 0%,#1565c0 100%); color:#fff; }
.btn-vermas:hover { background:linear-gradient(135deg,#1565c0 0%,#0d47a1 100%); transform:translateY(-2px); box-shadow:0 8px 20px rgba(25,118,210,.3); }
.btn-carrito { background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%); color:#fff; }
.btn-carrito:hover { background:linear-gradient(135deg,#16a34a 0%,#15803d 100%); transform:translateY(-2px); box-shadow:0 8px 20px rgba(34,197,94,.3); }
.custom-tooltip { background:#1e293b; font-size:.75rem; padding:6px 10px; border-radius:8px; }

/* Responsive 600px */
@media (max-width: 600px) {
  .my-card { max-width:100%; border-radius:14px; height:300px; }
  .card-img { height:160px; }
  .card-title { font-size:1rem; }
  .card-precio { font-size:1.15rem; }
  .info-grid { grid-template-columns:1fr; }
  .botones-card { flex-direction:column; }
  .btn-action { width:100%; height:34px; font-size:.7rem; }
}

/* Extra compact <450px */
@media (max-width: 450px) {
  .my-card { height:280px; border-radius:12px; }
  .card-img { height:140px; }
  .card-content { padding:10px !important; }
  .header-section { margin-bottom:6px; }
  .card-title { font-size:.9rem; margin-bottom:4px; }
  .card-precio { font-size:1.05rem; }
  .precio-label { font-size:.6rem; }
  .info-grid { gap:6px; margin-bottom:6px; }
  .info-item { padding:5px; }
  .info-label { font-size:.55rem; }
  .info-value { font-size:.75rem; }
  .btn-action { height:32px; font-size:.65rem; }
  .badge-destacado, .badge-organico { top:8px; padding:4px 10px; font-size:.65rem; gap:4px; }
  .descripcion-text { max-height:2.4em; }
}
</style>
