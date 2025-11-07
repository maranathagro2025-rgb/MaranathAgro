<template>
  <q-dialog v-model="dialogOpen" persistent>
    <q-card class="q-pa-lg q-mx-auto" style="max-width: 400px;">
      <div class="text-h6 q-mb-lg">Recuperar Contraseña</div>
      <div v-if="mensaje" class="q-mb-md" :class="colorMsg">{{ mensaje }}</div>
      <q-form @submit.prevent="handleSubmit">
        <div v-if="step === 1">
          <q-input v-model="email" label="Correo registrado" type="email" dense required />
          <q-btn label="Enviar código" color="primary" class="full-width q-mt-md" type="submit" />
        </div>
        <div v-if="step === 2">
          <q-input v-model="codigo" label="Código recibido por correo" dense required />
          <q-btn label="Verificar código" color="primary" class="full-width q-mt-md" type="submit" />
        </div>
        <div v-if="step === 3">
          <q-input
            v-model="nuevaPassword"
            label="Nueva contraseña"
            :type="showPassword ? 'text' : 'password'"
            dense
            required
            :rules="[val => val.length >= 8 || 'Min. 8 caracteres']"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <q-btn label="Cambiar contraseña" color="primary" class="full-width q-mt-md" type="submit" />
        </div>
        <div v-if="step === 4" class="q-mt-md text-positive text-center">
          ¡Listo! Ahora puedes iniciar sesión con tu nueva contraseña.<br />
          <span class="text-caption">Redirigiendo...</span>
        </div>
      </q-form>
      <q-btn
        flat
        label="Cerrar"
        color="primary"
        class="q-mt-lg full-width"
        v-if="step < 4"
        @click="closeDialog"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStoreUsuarios } from '../stores/usuario.js'
import { Notify } from 'quasar'

const step = ref(1)
const email = ref("")
const codigo = ref("")
const nuevaPassword = ref("")
const mensaje = ref("")
const dialogOpen = ref(true)
const showPassword = ref(false)
const router = useRouter()
const store = useStoreUsuarios()

const emit = defineEmits(['close'])

const colorMsg = computed(() =>
  mensaje.value.toLowerCase().includes("error") || mensaje.value.toLowerCase().includes("incorrecto")
    ? 'text-negative'
    : 'text-primary'
)

const handleSubmit = async () => {
  if (step.value === 1) {
    const res = await store.codigoRecuperar(email.value)
    mensaje.value = store.validacion || res?.msg
    if (store.estatus === 200) {
      mensaje.value = res.msg
      step.value = 2
      Notify.create({ type: "positive", message: "Código enviado a tu correo" })
    } else {
      Notify.create({ type: "negative", message: mensaje.value })
    }
  } else if (step.value === 2) {
    const res = await store.confirmarCodigo(email.value, codigo.value)
    mensaje.value = store.validacion || res?.msg
    if (store.estatus === 200) {
      mensaje.value = res.msg
      step.value = 3
      Notify.create({ type: "positive", message: "Código verificado" })
    } else {
      Notify.create({ type: "negative", message: mensaje.value })
    }
  } else if (step.value === 3) {
    const res = await store.nuevaPassword({
      email: email.value,
      codigo: codigo.value,
      password: nuevaPassword.value
    })
    mensaje.value = store.validacion || res?.msg
    if (store.estatus === 200) {
      mensaje.value = res.msg
      step.value = 4
      Notify.create({ type: "positive", message: "Contraseña cambiada correctamente" })
      setTimeout(() => {
        closeDialog()
        router.push('/login')
      }, 2000)
    } else {
      Notify.create({ type: "negative", message: mensaje.value })
    }
  }
}

function closeDialog() {
  dialogOpen.value = false
  emit('close')
}

// Si se cierra el modal, reinicia los valores
watch(dialogOpen, (val) => {
  if (!val) {
    step.value = 1
    email.value = ""
    codigo.value = ""
    nuevaPassword.value = ""
    mensaje.value = ""
    showPassword.value = false
  }
})
</script>
