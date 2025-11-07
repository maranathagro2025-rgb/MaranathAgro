<template>
  <q-card v-if="lugar" class="my-card">
    <q-img
      :src="lugar.imagenes && lugar.imagenes.length ? lugar.imagenes[0] : 'https://via.placeholder.com/150'"
      ratio="1"
      class="card-img"
    />
    <q-card-section>
      <div class="card-title">{{ lugar.nombre }}</div>
      <div class="card-precio">${{ lugar.precio_formateado }}</div>
      <q-separator spaced />
      <div class="info-list">
        <div class="info-row">
          <q-icon name="business" color="grey-7" size="22px" />
          <span class="info-label">Marca:</span>
          <span>{{ lugar.marca_id?.nombre || 'N/A' }}</span>
        </div>
        <div class="info-row">
          <q-icon name="confirmation_number" color="grey-7" size="22px" />
          <span class="info-label">Referencia:</span>
          <span>{{ lugar.referencia || 'N/A' }}</span>
        </div>
        <div class="info-row">
          <q-icon name="storage" color="grey-7" size="22px" />
          <span class="info-label">Capacidad:</span>
          <span>{{ lugar.capacidad || 'N/A' }}</span>
        </div>
        <!-- <div class="info-row">
          <q-icon name="inventory" color="grey-7" size="22px" />
          <span class="info-label">Cantidad:</span>
          <span>{{ lugar.cantidad || 'N/A' }}</span>
        </div> -->
        <div class="info-row">
          <q-icon name="verified_user" color="grey-7" size="22px" />
          <span class="info-label">Estado:</span>
          <q-chip
            :color="lugar.estado === 1 ? 'green' : 'red'"
            text-color="white"
            class="chip-estado"
            square
            style="width: 100px;"
          >
            {{ lugar.estado === 1 ? 'Activo' : 'Inactivo' }}
          </q-chip>
        </div>
        <div class="info-row" v-if="lugar.destacado">
          <q-icon name="star" color="orange" size="22px" />
          <q-chip color="orange" text-color="white" square icon="star" size="sm">Destacado</q-chip>
        </div>
      </div>
  <div class="botones-card">

  <q-btn
    color="prymary"
    label="VER"
    icon="search"
    class="btn-anim btn-vermas"
    unelevated
    @click="showDetalle = true"
  >
    <q-tooltip class="bg-teal">Ver detalles del producto</q-tooltip>
  </q-btn>
  <q-btn
    color="orange"
    label="AÑADIR"
    icon="shopping_cart"
    @click="$emit('add-carrito', lugar)"
    class="btn-anim btn-carrito"
    unelevated
  >
    <q-tooltip class="bg-orange">Agregar al carrito</q-tooltip>
  </q-btn>
</div>
    </q-card-section>
    <ProductoDetalle v-model="showDetalle" :producto="lugar" @add-carrito="$emit('add-carrito', $event)" />
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import ProductoDetalle from './ProductoDetalle.vue'
const props = defineProps({
  lugar: { type: Object, required: true }
})
const showDetalle = ref(false)
</script>

<style scoped>
.my-card {
  max-width: 340px;
  margin: 0 auto;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #eafaf1 0%, #e3f2fd 100%);
  box-shadow: 0 2px 12px rgba(30,41,59,0.10), 0 0px 0px 2px #22c55e inset;
  border: 1.5px solid #22c55e;
  transition: box-shadow 0.18s, transform 0.18s;
  position: relative;
}
.my-card:hover {
  box-shadow: 0 8px 32px rgba(30,41,59,0.18), 0 0px 0px 2px #1976d2 inset;
  transform: translateY(-6px) scale(1.02);
  border-color: #1976d2;
}
.card-img {
  height: 200px;
  object-fit: cover;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 8px rgba(30,41,59,0.08);
  border-bottom: 2px solid #22c55e;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: 4px;
  letter-spacing: 0.2px;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
.card-precio {
  font-size: 1.15rem;
  color: #22c55e;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  text-shadow: 0 1px 6px #e3f2fd;
}
.info-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
}
.info-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.98rem;
  color: #444;
}
.info-label {
  font-weight: 600;
  color: #1976d2;
  min-width: 80px;
}
.chip-estado {
  width: 90px;
  justify-content: center;
  font-size: 0.92rem;
  border-radius: 6px;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(67,160,71,0.08);
}
.botones-card {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  flex-direction: row;
}
.btn-anim {
  transition: transform 0.13s, box-shadow 0.13s, background 0.18s;
  font-weight: 700;
  /* font-size: 1.08rem; */
  box-shadow: 0 2px 8px rgba(30,41,59,0.10);
  border-radius: 12px;
  letter-spacing: 0.5px;
  min-width: 0;
  flex: 1 1 0;
  padding: 0 18px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.btn-anim:hover {
  transform: scale(1.09);
  box-shadow: 0 8px 24px rgba(30,41,59,0.18);
  filter: brightness(1.13);
}
.btn-vermas {
  background: linear-gradient(90deg, #22c55e 0%, #1976d2 100%);
  color: #fff;
  border: none;
  /* font-size: 1.08rem; */
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
.btn-carrito {
  background: linear-gradient(90deg, #ff9800 0%, #1976d2 100%);
  color: #fff;
  border: none;
}
.botones-card .q-btn {
  height: 44px;
  min-width: 120px;
  /* font-size: 1.08rem; */
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(34,197,94,0.10);
}
.q-chip {
  font-size: 0.92rem;
  border-radius: 6px;
  padding: 0 8px;
  height: 24px;
  align-items: center;
}
@media (max-width: 600px) {
  .my-card {
    max-width: 98vw;
  }
  .info-list {
    gap: 5px;
  }
  .botones-card {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  .botones-card .q-btn {
    width: 100%;
    min-width: 0;
    font-size: 0.95rem;
  }
}
</style>
