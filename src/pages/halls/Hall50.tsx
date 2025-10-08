import { defineComponent } from 'vue'
import BookingForm from '../../components/BookingForm'
import { env } from '@/lib/env'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const { t } = useI18n()
  return () => (
    <div class="container section">
      <h1>{t('hall.50.title')}</h1>
      <div class="img-frame reveal" style={{margin:'12px 0 18px',backgroundImage:`url('${env('VITE_HALL50_IMG','https://images.unsplash.com/photo-1518156677180-95a2893f3e9d?q=80&w=1400&auto=format&fit=crop')}')`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
      <p>{t('hall.50.desc')}</p>
      <ul>
        <li>{t('hall.50.capacity')}</li>
        <li>{t('hall.50.layouts')}</li>
      </ul>
      <h2>{t('form.title')}</h2>
      <BookingForm />
    </div>
  )
})
