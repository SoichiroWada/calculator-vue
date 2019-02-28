import Vue from 'vue'
import VueRouter from 'vue-router'
import Calculator from '@/components/Calculator'
import Mathematics from '@/components/Mathematics'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Calculator',
        component: Calculator
    },
    {
        path: '/mathematics',
        name: 'Mathematics',
        component: Mathematics
    }
];

const router = new VueRouter({
    routes
});

export default router
