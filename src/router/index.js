import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Info from '../views/Info.vue'
import Analysis from '../views/Analysis.vue'
import Route from '../views/Route.vue'
import Shift from '../views/Shift.vue'
import Platform from '../views/Platform.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/info',
    name: 'Info',
    component: Info
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: Analysis
  },
  {
    path: '/route',
    name: 'Route',
    component: Route
  },
  {
    path: '/shift',
    name: 'Shift',
    component: Shift
  },
  {
    path: '/platform',
    name: 'Platform',
    component: Platform
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
