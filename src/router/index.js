import Vue from 'vue'
import VueRouter from 'vue-router'
import Calculator from '@/components/Calculator.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/', name: 'Calculator', component: Calculator },
    { path: '/mathematics', name: 'Mathematics', component: Calculator }
  ]
})
