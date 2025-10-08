import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const { t } = useI18n()
  return () => (
  <div class="container section">
    <h1>{t('pricing.title')}</h1>
    <div class="grid-3">
      <div class="card">
        <h3>{t('pricing.h500')}</h3>
        <ul>
          <li>{t('pricing.h500l1')}</li>
          <li>{t('pricing.h500l2')}</li>
        </ul>
      </div>
      <div class="card">
        <h3>{t('pricing.h50')}</h3>
        <ul>
          <li>{t('pricing.h50l1')}</li>
          <li>{t('pricing.h50l2')}</li>
        </ul>
      </div>
      <div class="card">
        <h3>{t('pricing.h20')}</h3>
        <ul>
          <li>{t('pricing.h20l1')}</li>
          <li>{t('pricing.h20l2')}</li>
        </ul>
      </div>
    </div>
    <p>{t('pricing.note')}</p>
  </div>
  )
})
