// import Informe from '../components/Informe.vue'  
import { createRouter, createWebHashHistory } from 'vue-router'



const routes = [
  // {
  //   path: '/',
  //   component: () => import('../pages/Home.vue')
  // },
    {
    path: '/',
    component: () => import('../pages/House.vue')
  },
  {
    path: '/productos',
    name: 'productos',
    component: () => import('../pages/Productos.vue')
  },
  {
    path: '/login',
    component: () => import('../componentes/Login.vue'),
    // meta: { requiresAdmin: true }
  },
  {
    path: '/adminHome',
    name: 'adminHome',
    component: () => import('../pages/adminHome.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/categoria',
    name: 'categoria',
    component: () => import('../tablasAdm/Categoria.vue'),
    meta: { requiresAdmin: true }
  },
    {
    path: '/finca',
    name: 'finca',
    component: () => import('../tablasAdm/Finca.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/producto',
    name: 'producto',
    component: () => import('../tablasAdm/Producto.vue'),
    meta: { requiresAdmin: true }
  },
    {
    path: '/publicacion',
    name: 'publicacion',
    component: () => import('../tablasAdm/Publicacion.vue'),
    meta: { requiresAdmin: true }
  },
  // Puedes agregar más rutas aquí según tus necesidades
]


export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard global para rutas protegidas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAdmin && !token) {
    next({ path: '/' }) // Redirige a House si no hay token
  }  
   // si ya está logueado, evitar ir a /login
  if (to.path === '/login' && token) {
    return next({ name: 'adminHome' })
  } else {
    next()
  }
})