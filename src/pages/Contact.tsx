import { defineComponent } from 'vue'
import BookingForm from '../components/BookingForm'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const { t } = useI18n()
  return () => (
    <div class="container section">
      <h1>{t('contact.title')}</h1>
      <p>{t('contact.phones')} <a href="tel:+998994084408">+998 99 408 4408</a>, <a href="tel:+998998274422">+998 99 827 4422</a></p>
      <p>{t('contact.addressNote')}</p>
      <BookingForm />
    </div>
  )
})
