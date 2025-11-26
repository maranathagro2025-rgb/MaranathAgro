<template>
  <div class="contacto-wrapper">
    <!-- Sección de Contacto -->
    <section 
      class="contact-section q-pa-md q-pa-md-lg q-pa-lg-xl q-mt-lg"
      role="region"
      aria-label="Información de contacto"
    >
      <div class="contact-overlay"></div>
      
      <div class="contact-content">
        <!-- Encabezado -->
        <div class="text-center q-mb-md q-mb-md-lg">
          <h2 class="contact-title text-weight-bold text-white q-mb-xs q-mb-sm-sm">
            {{ title || 'Visítanos o contáctanos para más información' }}
          </h2>
          <p class="contact-subtitle text-white q-ma-none">
            {{ subtitle || 'Estamos aquí para atenderte y responder todas tus preguntas' }}
          </p>
        </div>
        
        <!-- Grid de botones de contacto - Responsivo -->
        <div class="row q-col-gutter-sm q-col-gutter-md-md justify-center">
          <!-- WhatsApp -->
          <div 
            class="col-12 col-sm-6 col-md-3" 
            v-if="contactoFinca?.whatsapp"
          >
            <q-btn
              color="white"
              text-color="green-8"
              :size="btnSize"
              unelevated
              rounded
              icon="mdi-whatsapp"
              :label="isMobile ? 'WhatsApp' : contactoFinca.whatsapp"
              :href="`https://wa.me/${contactoFinca.whatsapp.replace(/[^\d]/g, '')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-btn full-width"
              :aria-label="`Contactar por WhatsApp al ${contactoFinca.whatsapp}`"
              tabindex="0"
            >
              <q-tooltip 
                class="bg-green-8" 
                anchor="top middle" 
                self="bottom middle"
              >
                Contáctanos por WhatsApp
              </q-tooltip>
            </q-btn>
          </div>

          <!-- Teléfono -->
          <div 
            class="col-12 col-sm-6 col-md-3" 
            v-if="contactoFinca?.telefono"
          >
            <q-btn
              color="white"
              text-color="green-8"
              :size="btnSize"
              unelevated
              rounded
              icon="phone"
              :label="isMobile ? 'Llamar' : contactoFinca.telefono"
              :href="`tel:${contactoFinca.telefono}`"
              class="contact-btn full-width"
              :aria-label="`Llamar al teléfono ${contactoFinca.telefono}`"
              tabindex="0"
            >
              <q-tooltip 
                class="bg-green-8" 
                anchor="top middle" 
                self="bottom middle"
              >
                Llamar por teléfono
              </q-tooltip>
            </q-btn>
          </div>

          <!-- Email -->
          <div 
            class="col-12 col-sm-6 col-md-3" 
            v-if="contactoFinca?.email"
          >
            <q-btn
              color="white"
              text-color="green-8"
              :size="btnSize"
              unelevated
              rounded
              icon="email"
              :label="isMobile ? 'Email' : contactoFinca.email"
              :href="`mailto:${contactoFinca.email}`"
              class="contact-btn full-width"
              :aria-label="`Enviar correo a ${contactoFinca.email}`"
              tabindex="0"
            >
              <q-tooltip 
                class="bg-green-8" 
                anchor="top middle" 
                self="bottom middle"
              >
                Enviar un correo
              </q-tooltip>
            </q-btn>
          </div>

          <!-- Dirección/Ubicación -->
          <div 
            class="col-12 col-sm-6 col-md-3" 
            v-if="contactoFinca?.direccion"
          >
            <q-btn
              color="white"
              text-color="green-8"
              :size="btnSize"
              unelevated
              rounded
              icon="place"
              :label="isMobile ? 'Ubicación' : truncateText(contactoFinca.direccion, 30)"
              class="contact-btn full-width"
              :aria-label="`Ubicación: ${contactoFinca.direccion}`"
              tabindex="0"
              @click="showLocationDialog = true"
            >
              <q-tooltip 
                class="bg-green-8" 
                anchor="top middle" 
                self="bottom middle"
              >
                {{ contactoFinca.direccion }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Slot para contenido extra -->
        <div v-if="$slots.extra" class="q-mt-md">
          <slot name="extra"></slot>
        </div>

        <!-- Redes sociales y logo -->
        <div 
          class="row q-gutter-sm q-gutter-md-md justify-center items-center q-mt-md q-mt-md-lg" 
          v-if="contactoFinca?.instagram || contactoFinca?.facebook"
          role="navigation"
          aria-label="Redes sociales"
        >
          <q-btn
            v-if="contactoFinca?.facebook"
            round
            color="white"
            text-color="green-8"
            icon="mdi-facebook"
            :size="socialSize"
            :href="contactoFinca.facebook"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar página de Facebook"
            tabindex="0"
            class="social-btn"
          >
            <q-tooltip class="bg-blue-8">Síguenos en Facebook</q-tooltip>
          </q-btn>
          
          <q-btn
            v-if="contactoFinca?.instagram"
            round
            color="white"
            text-color="green-8"
            icon="mdi-instagram"
            :size="socialSize"
            :href="contactoFinca.instagram"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitar perfil de Instagram"
            tabindex="0"
            class="social-btn"
          >
            <q-tooltip class="bg-pink-8">Síguenos en Instagram</q-tooltip>
          </q-btn>
          
          <q-avatar :size="logoSize" class="logo-avatar">
            <img 
              src="../assets/logomaranatha.jpg" 
              alt="Logo Finca Maranatha"
              loading="lazy"
            />
          </q-avatar>
        </div>

        <!-- Slot para footer personalizado -->
        <div v-if="$slots.footer" class="q-mt-md">
          <slot name="footer"></slot>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer 
      class="footer-section q-pa-md q-pa-md-lg text-center"
      role="contentinfo"
    >
      <div class="footer-content">
        <div class="footer-title text-weight-bold q-mb-xs">
          <q-icon name="spa" :size="footerIconSize" class="q-mr-xs" />
          <span>Finca Maranatha</span>
        </div>
        <div class="footer-copyright text-grey-6">
          © {{ new Date().getFullYear() }} Todos los derechos reservados
        </div>
      </div>
    </footer>

    <!-- Dialog para mostrar dirección completa en mobile -->
    <q-dialog v-model="showLocationDialog">
      <q-card class="location-card">
        <q-card-section class="row items-center q-pb-none">
          <q-icon name="place" size="24px" color="green-8" class="q-mr-sm" />
          <div class="text-h6 text-green-8">Nuestra Ubicación</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup aria-label="Cerrar" />
        </q-card-section>

        <q-card-section>
          <p class="text-body1 q-mb-md">{{ contactoFinca?.direccion }}</p>
          <q-btn
            color="green-8"
            unelevated
            label="Ver en mapa"
            icon="map"
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactoFinca?.direccion || '')}`"
            target="_blank"
            rel="noopener noreferrer"
            class="full-width"
            aria-label="Abrir ubicación en Google Maps"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useFincaStore } from '../stores/finca.js'

// Props opcionales para mayor flexibilidad
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})

// Quasar instance para detectar breakpoints
const $q = useQuasar()
const fincaStore = useFincaStore()

// State
const showLocationDialog = ref(false)

// Computed - Información de contacto
const contactoFinca = computed(() => {
  const finca = fincaStore.fincaPublica
  if (!finca) return null
  return {
    telefono: finca.telefono,
    whatsapp: finca.whatsapp,
    email: finca.email,
    direccion: finca.direccion,
    facebook: finca.facebook,
    instagram: finca.instagram,
    horarioAtencion: finca.horarioAtencion
  }
})

// Computed - Detección de breakpoints
// Mobile: < 600px, Tablet: 600-1023px, Desktop: >= 1024px
const isMobile = computed(() => $q.screen.lt.sm) // < 600px
const isTablet = computed(() => $q.screen.gt.xs && $q.screen.lt.md) // 600-1023px
const isDesktop = computed(() => $q.screen.gt.sm) // >= 1024px

// Tamaños responsivos para botones
const btnSize = computed(() => {
  if (isMobile.value) return 'sm'      // Móvil: botones pequeños
  if (isTablet.value) return 'md'      // Tablet: botones medianos
  return 'md'                          // Desktop: botones medianos (no muy grandes)
})

// Tamaños para botones sociales
const socialSize = computed(() => {
  if (isMobile.value) return 'sm'
  if (isTablet.value) return 'md'
  return 'md'
})

// Tamaño del logo
const logoSize = computed(() => {
  if (isMobile.value) return '32px'
  if (isTablet.value) return '40px'
  return '40px'
})

// Tamaño del ícono del footer
const footerIconSize = computed(() => {
  if (isMobile.value) return '20px'
  if (isTablet.value) return '24px'
  return '24px'
})

// Utilidad para truncar texto
function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
/**
 * SISTEMA DE BREAKPOINTS (siguiendo Quasar Framework):
 * - xs: 0-599px (móvil pequeño)
 * - sm: 600-1023px (móvil grande/tablet pequeña)
 * - md: 1024-1439px (tablet/desktop pequeño)
 * - lg: 1440-1919px (desktop mediano)
 * - xl: 1920px+ (desktop grande)
 * 
 * ESTRATEGIA: Mobile-first con ajustes progresivos
 */

/* Variables CSS para modo claro y oscuro */
:root {
  --contact-bg-overlay: rgba(45, 80, 22, 0.92);
  --contact-bg-overlay-end: rgba(74, 124, 35, 0.88);
  --footer-bg: #f5f1e8;
  --footer-border: #e8e4da;
  --btn-shadow: rgba(255, 255, 255, 0.25);
  --btn-hover-shadow: rgba(255, 255, 255, 0.4);
}

/* Soporte para modo oscuro */
body.body--dark {
  --contact-bg-overlay: rgba(45, 80, 22, 0.95);
  --contact-bg-overlay-end: rgba(74, 124, 35, 0.92);
  --footer-bg: #1e1e1e;
  --footer-border: #333;
  --btn-shadow: rgba(255, 255, 255, 0.15);
  --btn-hover-shadow: rgba(255, 255, 255, 0.3);
}

/* ===== SECCIÓN DE CONTACTO ===== */
.contact-section {
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.95) 0%, rgba(74, 124, 35, 0.9) 100%),
              url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200') center/cover no-repeat;
  border-radius: 12px;
  min-height: 280px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(45, 80, 22, 0.3);
  transition: box-shadow 0.3s ease;
}

.contact-section:hover {
  box-shadow: 0 10px 40px rgba(45, 80, 22, 0.4);
}

.contact-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(45, 80, 22, 0.9) 0%, rgba(74, 124, 35, 0.85) 100%);
  z-index: 1;
}

.contact-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px; /* Limitar ancho máximo en pantallas grandes */
  padding: 16px; /* Mobile: padding reducido */
}

/* Títulos responsivos */
.contact-title {
  font-size: 1.25rem; /* Mobile: 20px */
  line-height: 1.3;
  letter-spacing: 0.01em;
}

.contact-subtitle {
  font-size: 0.875rem; /* Mobile: 14px */
  line-height: 1.5;
  opacity: 0.95;
}

/* Botones de contacto */
.contact-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.2s ease;
  font-weight: 600;
  font-size: 0.813rem; /* Mobile: 13px - más pequeño */
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 8px var(--btn-shadow);
  min-height: 40px; /* Altura mínima uniforme */
  height: 40px; /* Altura fija en móvil */
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--btn-hover-shadow);
}

.contact-btn:active {
  transform: translateY(0);
}

/* Botones sociales */
.social-btn {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px var(--btn-shadow);
}

.social-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px var(--btn-hover-shadow);
}

/* Logo con animación */
.logo-avatar {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

/* ===== FOOTER ===== */
.footer-section {
  background: var(--footer-bg);
  border-top: 2px solid var(--footer-border);
  margin-top: 40px; /* Mobile: margen reducido */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-title {
  font-size: 1rem; /* Mobile: 16px */
  color: #4a7c23;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.footer-copyright {
  font-size: 0.75rem; /* Mobile: 12px */
}

/* Dialog de ubicación */
.location-card {
  min-width: 280px;
  max-width: 400px;
}

/* ===== BREAKPOINT: TABLET (600px - 1023px) ===== */
@media (min-width: 600px) {
  .contact-section {
    min-height: 320px;
    border-radius: 16px;
  }

  .contact-content {
    padding: 24px;
  }

  .contact-title {
    font-size: 1.5rem; /* 24px */
  }

  .contact-subtitle {
    font-size: 1rem; /* 16px */
  }

  .contact-btn {
    font-size: 0.875rem; /* 14px */
    height: 44px; /* Altura fija en tablet */
  }

  .footer-section {
    margin-top: 50px;
  }

  .footer-title {
    font-size: 1.125rem; /* 18px */
  }

  .footer-copyright {
    font-size: 0.813rem; /* 13px */
  }
}

/* ===== BREAKPOINT: DESKTOP (1024px+) ===== */
@media (min-width: 1024px) {
  .contact-section {
    min-height: 350px;
  }

  .contact-content {
    padding: 32px 40px;
  }

  .contact-title {
    font-size: 1.75rem; /* 28px - reducido de 32px para pantallas grandes */
  }

  .contact-subtitle {
    font-size: 1.063rem; /* 17px */
  }

  .contact-btn {
    font-size: 0.875rem; /* 14px - tamaño moderado */
    height: 46px; /* Altura fija en desktop */
  }

  .footer-section {
    margin-top: 60px;
  }

  .footer-title {
    font-size: 1.25rem; /* 20px */
  }

  .footer-copyright {
    font-size: 0.875rem; /* 14px */
  }
}

/* ===== BREAKPOINT: DESKTOP GRANDE (1440px+) ===== */
@media (min-width: 1440px) {
  .contact-title {
    font-size: 2rem; /* 32px */
  }

  .contact-subtitle {
    font-size: 1.125rem; /* 18px */
  }

  .contact-btn {
    font-size: 0.938rem; /* 15px */
    max-width: 320px;
  }
}

/* ===== ACCESIBILIDAD ===== */
/* Mejoras para navegación por teclado */
.contact-btn:focus-visible,
.social-btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.6);
  outline-offset: 2px;
}

/* Reducir movimiento para usuarios con preferencias de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .contact-btn,
  .social-btn,
  .logo-avatar {
    animation: none;
    transition: none;
  }
}

/* Alto contraste para mejor legibilidad */
@media (prefers-contrast: high) {
  .contact-overlay {
    background: rgba(45, 80, 22, 0.98);
  }
  
  .contact-title,
  .contact-subtitle {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  }
}
</style>