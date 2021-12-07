import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Info from '../views/Info.vue'
import CrossRoute from '../views/CrossRoute.vue'
import Route from '../views/Route.vue'
import Platform from '../views/Platform.vue'
import Statistics from '../views/Statistics.vue'

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
    path: '/crossRoute',
    name: 'CrossRoute',
    component: CrossRoute
  },
  {
    path: '/route',
    name: 'Route',
    component: Route
  },
  
  {
    path: '/platform',
    name: 'Platform',
    component: Platform
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
