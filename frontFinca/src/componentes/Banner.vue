<template>
  <div>
    <!-- Encabezado -->
    <q-toolbar dense class="bg-green text-white q-mb-md header-toolbar">
      <q-toolbar-title class="row items-center no-wrap">
        <q-icon name="spa" size="28px" class="q-mr-sm" />
        <span class="text-weight-bold">FINCA MARANATHA</span>
      </q-toolbar-title>
      <q-space />
      


      <q-btn 
        size="sm" 
        flat 
        round 
        icon="login" 
        @click="$emit('open-login')" 
        :aria-label="'Abrir login'"
      >
        <q-tooltip>Iniciar sesión como administrador</q-tooltip>
      </q-btn>
    </q-toolbar>

    <!-- Hero Banner con imagen de fondo -->
    <section class="hero-banner q-pa-lg q-mb-xl">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="text-center q-mb-md">
          <img 
            src="../assets/logomaranatha.jpg" 
            style="width: 80px; height: 80px; object-fit: contain; border-radius: 200px;"
            class="hero-icon"
            alt="Logo Finca Maranatha"
          />
        </div>
        <div class="text-h3 text-weight-bold text-white text-center q-mb-sm hero-title">
          Finca Maranatha
        </div>
        <div class="text-h6 text-white text-center q-mb-lg hero-subtitle">
          Calidad y tradición agropecuaria
        </div>
        <div class="text-center q-mb-md">
          <q-btn 
            color="white" 
            text-color="green-8" 
            size="lg" 
            unelevated 
            rounded
            icon="storefront"
            label="Ver nuestros productos" 
            @click="navegarAProductos"
            class="hero-btn"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Emits para comunicación con el componente padre
defineEmits(['open-login'])

// Función para navegar a la página de productos
function navegarAProductos() {
  router.push({ name: 'productos' })
}
</script>

<style scoped>
/* Header Toolbar */
.header-toolbar {
  background: linear-gradient(135deg, #5a8a47 0%, #6b9e5a 45%, #ff9d5c 55%, #6b9e5a 100%);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(107, 158, 90, 0.5), 0 2px 8px rgba(255, 157, 92, 0.3);
}

.header-toolbar .q-toolbar-title span {
  font-family: 'Georgia', serif;
  letter-spacing: 1.5px;
  font-size: 1.4rem;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, rgba(158, 146, 90, 0.2) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 157, 92, 0.2) 100%),
              url('../assets/finca-banner.jpg') center/cover no-repeat;
  border-radius: 16px;
  min-height: 500px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(255, 157, 92, 0.5);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(90, 138, 71, 0.85) 0%, rgba(107, 158, 90, 0.75) 35%, rgba(255, 157, 92, 0.45) 55%, rgba(107, 158, 90, 0.80) 100%);
  z-index: 1;
}


.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 40px 20px;
}

.hero-icon {
  filter: drop-shadow(0 4px 12px rgba(255, 157, 92, 0.7));
  animation: float 3s ease-in-out infinite;
  background: white;
  padding: 10px;
  border: 4px solid #ff9d5c;
  box-shadow: 0 6px 20px rgba(255, 157, 92, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.8);
}


@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.hero-title {
  font-family: 'Georgia', serif;
  font-size: 3.5rem;
  color: #ffffff;
  text-shadow: 0 3px 6px rgba(90, 138, 71, 0.8), 
               0 6px 20px rgba(255, 157, 92, 0.6),
               0 1px 3px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
}

.hero-subtitle {
  font-family: 'Georgia', serif;
  font-weight: 300;
  text-shadow: 0 2px 8px rgba(107, 158, 90, 0.7), 0 1px 3px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  color: #ffe8d6;
}

.hero-btn {
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #ffffff 0%, #fff5ed 50%, #ffe8d6 100%) !important;
  color: #6b9e5a !important;
  border: 3px solid #ff9d5c;
  box-shadow: 0 4px 20px rgba(255, 157, 92, 0.6);
  transition: transform 0.3s, box-shadow 0.3s, background 0.3s;
}

.hero-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 28px rgba(255, 157, 92, 0.8);
  background: linear-gradient(135deg, #ffe8d6 0%, #ffcfad 50%, #ff9d5c 100%) !important;
  color: #ffffff !important;
}

/* Nav Button */
.nav-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: background-color 0.3s, transform 0.2s;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-banner {
    min-height: 400px;
  }
}
</style>