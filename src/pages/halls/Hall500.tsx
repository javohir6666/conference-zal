import { defineComponent } from 'vue'
import BookingForm from '../../components/BookingForm'
import { env } from '@/lib/env'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const { t } = useI18n()
  return () => (
    <div class="container section">
      <h1>{t('hall.500.title')}</h1>
      <div class="img-frame reveal" style={{margin:'12px 0 18px',backgroundImage:`url('${env('VITE_HALL500_IMG','https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1400&auto=format&fit=crop')}')`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
      <p>{t('hall.500.desc')}</p>
      <ul>
        <li>{t('hall.500.capacity')}</li>
        <li>{t('hall.500.layouts')}</li>
        <li>{t('hall.500.extras')}</li>
      </ul>
      <h2>{t('form.title')}</h2>
      <BookingForm />
    </div>
  )
})
