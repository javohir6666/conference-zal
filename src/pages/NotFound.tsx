import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent(() => () => (
  <div class="container section" style={{textAlign:'center',padding:'60px 0'}}>
    <h1 style={{margin:'0 0 10px'}}>404</h1>
    <p style={{color:'var(--muted)',margin:'0 0 20px'}}>Sahifa topilmadi / Страница не найдена</p>
    <RouterLink class="btn primary" to="/">Bosh sahifa / На главную</RouterLink>
  </div>
))

