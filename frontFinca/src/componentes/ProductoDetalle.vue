<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="detalle-card">
      <q-card-section>
        <div class="row q-col-gutter-xl flex-wrap">
          <div class="col-12 col-md-5 flex flex-center">
            <div class="img-container">
              <q-carousel
                v-if="producto.imagenes && producto.imagenes.length"
                v-model="slide"
                arrows
                navigation
                height="380px"
                class="detalle-carousel"
                control-color="primary"
                swipeable
                autoplay
                :autoplay-interval="3500"
                infinite
              >
                <q-carousel-slide
                  v-for="(img, idx) in producto.imagenes"
                  :key="idx"
                  :name="idx"
                  :img-src="img"
                  :img-style="{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }"
                />
              </q-carousel>
              <q-img
                v-else
                src="https://via.placeholder.com/450x380?text=Sin+Imagen"
                class="detalle-img"
              />
            </div>
          </div>
          <div class="col-12 col-md-7 q-mt-md q-mt-none-md">
            <div class="text-h5 text-weight-bold q-mb-xs text-primary">
              {{ producto.nombre }}
            </div>
            <div class="text-h6 text-green-8 q-mb-md">
              ${{ producto.precio?.toLocaleString() }}
            </div>
            
            <!-- Descripción -->
            <div v-if="producto.descripcion" class="text-body2 text-grey-8 q-mb-md">
              {{ producto.descripcion }}
            </div>
            
            <q-separator spaced />
            <div class="q-mb-md">
              <q-list dense>
                <!-- Categoría -->
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="category" color="grey-7" />
                  </q-item-section>
                  <q-item-section>
                    <span class="text-bold">Categoría:</span>
                    {{ getCategoriaName(producto.categoria) }}
                  </q-item-section>
                </q-item>
                
                <!-- Presentación -->
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="inventory_2" color="grey-7" />
                  </q-item-section>
                  <q-item-section>
                    <span class="text-bold">Presentación:</span>
                    {{ producto.presentacion }} {{ producto.unidad || '' }}
                  </q-item-section>
                </q-item>
                
                <!-- Origen -->
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="public" color="grey-7" />
                  </q-item-section>
                  <q-item-section>
                    <span class="text-bold">Origen:</span>
                    {{ producto.origen || 'N/A' }}
                  </q-item-section>
                </q-item>
                
                <!-- Producto Orgánico -->
                <q-item v-if="producto.esOrganico">
                  <q-item-section avatar>
                    <q-icon name="eco" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-chip color="green" text-color="white" icon="eco" size="sm">
                      Producto Orgánico
                    </q-chip>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <q-separator spaced />
            <div
              v-if="producto.especificaciones && Object.keys(producto.especificaciones).length"
              class="q-mt-md"
            >
              <div class="text-bold q-mb-xs text-primary">Especificaciones:</div>
              <q-markup-table dense flat>
                <tbody>
                  <tr v-for="(valor, clave) in producto.especificaciones" :key="clave">
                    <td class="text-bold text-grey-8">{{ clave }}</td>
                    <td>{{ valor }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
             <q-btn
          color="teal-9"
          icon="shopping_cart"
          label="Añadir al carrito"
          @click="emit('add-carrito', producto)"
        />
        <q-btn label="Cerrar" color="primary" v-close-popup />
   
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  producto: { type: Object, required: true },
});
const emit = defineEmits(["update:modelValue", "add-carrito"]);

const visible = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => (visible.value = val)
);
watch(visible, (val) => emit("update:modelValue", val));

const slide = ref(0);

// Helper para obtener nombre de categoría
const getCategoriaName = (categoria) => {
  if (!categoria) return 'N/A';
  if (typeof categoria === 'object' && categoria !== null) {
    return categoria.nombre || 'N/A';
  }
  if (typeof categoria === 'string') {
    return categoria;
  }
  return 'N/A';
};
</script>

<style scoped>
.detalle-card {
  max-width: 900px;
  width: 98vw;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.09);
  background: #fff;
}
.img-container {
  background: #f7f7f7;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.08);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  min-width: 380px;
}
.detalle-img {
  border-radius: 12px;
  min-height: 320px;
  object-fit: cover;
  width: 100%;
  max-width: 450px;
}
.detalle-carousel {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.08);
  background: #fff;
  min-width: 350px;
  min-height: 380px;
  max-width: 450px;
}
.q-list .q-item {
  padding: 0 0 2px 0;
}
.q-markup-table {
  background: #fafbfc;
  border-radius: 8px;
  margin-top: 4px;
}
.q-markup-table td {
  border: none;
  padding: 4px 12px;
}
.text-bold {
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .detalle-card {
    max-width: 99vw;
    padding: 0;
  }
  .img-container,
  .detalle-carousel,
  .detalle-img {
    min-width: 220px;
    max-width: 99vw;
    min-height: 220px;
    max-height: 320px;
  }
}
@media (max-width: 600px) {
  .detalle-card {
    max-width: 100vw;
    border-radius: 0;
    padding: 0;
  }
  .img-container,
  .detalle-carousel,
  .detalle-img {
    min-width: 100vw;
    max-width: 100vw;
    min-height: 180px;
    max-height: 220px;
  border-radius: 0;
    padding: 0;
  }
  .q-card-section {
    padding: 8px !important;
  }
  .q-card-actions {
    padding: 0 8px 8px 8px !important;
  }
  .text-h5, .text-h6 {
    font-size: 1.1rem;
  }
}
</style>
