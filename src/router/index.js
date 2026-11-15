import { createRouter, createWebHashHistory } from 'vue-router'
import Calculator from '@/components/Calculator.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'Calculator', component: Calculator },
    { path: '/mathematics', name: 'Mathematics', component: Calculator }
  ]
})
