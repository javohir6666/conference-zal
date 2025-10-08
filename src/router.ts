import type { RouteRecordRaw } from 'vue-router'
import Home from './pages/Home'
import Hall500 from './pages/halls/Hall500'
import Hall50 from './pages/halls/Hall50'
import Hall20 from './pages/halls/Hall20'
import Pricing from './pages/Pricing'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home, meta: { title: 'Arenda-Zala.uz — Konferensiya zali ijarasi' } },
  { path: '/halls/500', name: 'hall-500', component: Hall500, meta: { title: 'Katta zal — 500 o\'rin' } },
  { path: '/halls/50', name: 'hall-50', component: Hall50, meta: { title: 'O\'rta zal — 50 o\'rin' } },
  { path: '/halls/20', name: 'hall-20', component: Hall20, meta: { title: 'Uchrashuv xonasi — 20 o\'rin' } },
  { path: '/pricing', name: 'pricing', component: Pricing, meta: { title: 'Narxlar' } },
  { path: '/gallery', name: 'gallery', component: Gallery, meta: { title: 'Galereya' } },
  { path: '/contact', name: 'contact', component: Contact, meta: { title: 'Aloqa' } },
  { path: '/faq', name: 'faq', component: FAQ, meta: { title: 'FAQ' } },
  { path: '/404', name: '404', component: NotFound, meta: { title: '404' } },
  { path: '/:pathMatch(.*)*', redirect: '/404' },
]
