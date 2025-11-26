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
  background: linear-gradient(135deg, #2d5016 0%, #4a7c23 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.2);
}

.header-toolbar .q-toolbar-title span {
  font-family: 'Georgia', serif;
  letter-spacing: 1.5px;
  font-size: 1.4rem;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.95) 0%, rgba(74, 124, 35, 0.9) 100%),
              url('../assets/finca-banner.jpg') center/cover no-repeat;
  border-radius: 16px;
  min-height: 500px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(45, 80, 22, 0.3);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.85) 0%, rgba(74, 124, 35, 0.75) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 40px 20px;
}

.hero-icon {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-title {
  font-family: 'Georgia', serif;
  font-size: 3.5rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  letter-spacing: 2px;
}

.hero-subtitle {
  font-family: 'Georgia', serif;
  font-weight: 300;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.hero-btn {
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.3);
  transition: transform 0.3s, box-shadow 0.3s;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(255, 255, 255, 0.4);
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