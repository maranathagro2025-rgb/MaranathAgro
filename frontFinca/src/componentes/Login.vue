<template>
  <div class="login-container">
    <q-card
      v-if="!showResetPassword"
      class="q-pa-lg q-mb-xl q-pa-sm q-card-responsive"
      style="position: relative;"
    >
      <q-card-section class="row items-center q-pb-none">
        <q-avatar icon="login" size="56px" class="q-mr-md" color="white" text-color="primary"/>
        <div class="text-h6">Iniciar Sesión </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          class="close-btn"
          @click="emit('close')"
        />
      </q-card-section>

      <q-card-section class="q-mt-md">
        <q-input
          v-model="email"
          filled
          label="Nombre de Usuario"
          dense
          clearable
          hint="Ingrese su nombre de usuario"
          prefix-icon="person"
          :rules="[val => !!val || 'Este campo es requerido']"
          class="q-mb-md"
        />
        <q-input
          v-model="password"
          filled
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          dense
          class="q-mt-md"
          clearable
          hint="Ingrese su contraseña"
          prefix-icon="lock"
          :rules="[val => !!val || 'Este campo es requerido']"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right" class="q-mt-md">
        <q-btn 
          :disable="loading"
          @click="login" 
          color="primary" 
          class="full-width"
        >
          <template v-if="loading">
            <q-spinner-dots color="white" size="20px" />
          </template>
          <template v-else>
            Iniciar Sesión
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
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  border-radius: 22px;
  border: 2px solid #60432FFF;
  background: #fff;
  width: 100%;
  max-width: 400px;
  max-height: 95vh;
  overflow: auto;
  margin-bottom: 8px;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.q-card:hover {
  box-shadow: 0 12px 36px 0 rgba(31, 38, 135, 0.22);
  border-color: #a5b4fc;
}
.q-card__section--vert {
  padding: 0px !important;
}

.q-input__inner {
  border-radius: 8px;
}

.full-width {
  width: 100%;
}

/* boton x modal */
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  color: #888;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  border-radius: 50%;
  border: 1px solid #e0e7ff;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}
.close-btn:hover {
  color: #f857a6;
  background: #f5f5f5;
  border-color: #f857a6;
}

/* SOLUCIÓN FINAL: Rompe el bug de .row > * de cualquier global solo en el login */
q-mb-xl {
  margin-bottom: 0px !important;
}
</style>
