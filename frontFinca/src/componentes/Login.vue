<template>
  <div class="login-container">
    <q-card
      v-if="!showResetPassword"
      class="q-pa-lg q-mb-xl q-pa-sm q-card-responsive"
      style="position: relative;"
    >
      <q-card-section class="text-center q-pb-none">
        <q-avatar icon="agriculture" size="80px" class="q-mb-sm agronomist-avatar" color="green-7" text-color="white"/>
        <div class="text-h5 text-weight-bold text-green-8">Portal Agrónomo</div>
        <div class="text-caption text-grey-6 q-mt-xs">Sistema de Gestión Agrícola</div>
        <q-btn
          flat
          round
          dense
          icon="close"
          class="close-btn"
          @click="emit('close')"
        />
      </q-card-section>

      <q-card-section class="q-mt-md q-px-lg">
        <q-input
          v-model="email"
          outlined
          label="Usuario"
          dense
          clearable
          class="q-mb-md agronomist-input"
          :rules="[val => !!val || 'Este campo es requerido']"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="green-7" />
          </template>
        </q-input>
        <q-input
          v-model="password"
          outlined
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          dense
          class="agronomist-input"
          :rules="[val => !!val || 'Este campo es requerido']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="green-7" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              color="green-6"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-md q-px-lg q-pb-lg">
        <q-btn 
          :disable="loading"
          @click="login" 
          unelevated
          rounded
          color="green-7"
          text-color="white"
          class="full-width agronomist-btn"
          size="md"
        >
          <template v-if="loading">
            <q-spinner-dots color="white" size="20px" />
          </template>
          <template v-else>
            <q-icon name="login" size="20px" class="q-mr-sm" />
            Acceder al Sistema
          </template>
        </q-btn>
      </q-card-actions>

      <q-card-section align="center" class="q-mt-sm">
        <q-btn
          flat
          @click="showResetPassword = true"
          label="¿Olvidaste tu contraseña?"
          color="primary"
          class="q-pa-none"
        />
      </q-card-section>
      <q-card-section align="center" class="q-mt-sm">
        <!-- <q-btn
          flat
          @click="openRegister"
          label="¿Registrarme?"
          color="primary"
          class="q-pa-none"
        /> -->
      </q-card-section>
    </q-card>

    <ResetPasswordModal v-if="showResetPassword" @close="showResetPassword = false" />
    <RegisterModal :show="showRegister" @close="showRegister = false" @registered="onRegistered" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreUsuarios } from '../stores/usuario.js'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
// import RegisterModal from './RegistroCliente.vue'
import ResetPasswordModal from './ResetPassword.vue' // 👈 Importa el modal

const emit = defineEmits(['close'])

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const useUsuarios = useStoreUsuarios()

const showRegister = ref(false)
const showPassword = ref(false)
const showResetPassword = ref(false)

async function login() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await useUsuarios.login({ email: email.value, password: password.value })
    setTimeout(() => {
      if (res.success && res.data && res.data.token) {
        localStorage.setItem('token', res.data.token)
        emit('close')
        const rol = res.data.usuario.rol
        if (rol === 'administrador') {
          router.replace('/adminHome')
        } else if (rol === 'cliente') {
          router.replace('/home')
        } else {
          router.replace('/')
        }
        Notify.create({
          type: 'positive',
          message: 'Inicio de sesión exitoso.',
        })
      } else {
        Notify.create({
          type: 'negative',
          message: res.msg || 'Error al iniciar sesión. Por favor, verifique sus credenciales.',
        })
      }
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('Error en el login:', error)
    loading.value = false
  }
}

// function openRegister() {
//   showRegister.value = true
// }
function onRegistered(data) {
  emit('close')
  if (data.usuario.rol === 'cliente') {
    router.replace('/home')
  } else {
    router.replace('/')
  }
}
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
  background: transparent;
  min-height: unset;
}

.q-card {
  box-shadow: 0 10px 40px 0 rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  border: 3px solid #66BB6A;
  background: linear-gradient(135deg, #ffffff 0%, #f1f8f4 100%);
  width: 100%;
  max-width: 440px;
  max-height: 95vh;
  overflow: auto;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}
.q-card:hover {
  box-shadow: 0 15px 50px 0 rgba(76, 175, 80, 0.3);
  border-color: #4CAF50;
  transform: translateY(-2px);
}

.agronomist-avatar {
  border: 4px solid #81C784;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.agronomist-input {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.agronomist-input :deep(.q-field__control) {
  border-radius: 12px;
}

.agronomist-input:hover {
  transform: translateY(-1px);
}

.agronomist-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.25);
}

.agronomist-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.35);
}

.full-width {
  width: 100%;
}

/* boton x modal */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  color: #66BB6A;
  background: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
  border-radius: 50%;
  border: 2px solid #C8E6C9;
  transition: all 0.2s ease;
}
.close-btn:hover {
  color: white;
  background: #4CAF50;
  border-color: #4CAF50;
  transform: rotate(90deg);
}

/* Enlaces de recuperación */
.q-btn--flat {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.q-btn--flat:hover {
  background: rgba(76, 175, 80, 0.08);
}

q-mb-xl {
  margin-bottom: 0px !important;
}
</style>
