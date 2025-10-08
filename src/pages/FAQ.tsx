import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const { t } = useI18n()
  return () => (
    <div class="container section">
      <h1>{t('faq.title')}</h1>
      <details>
        <summary>{t('faq.q1')}</summary>
        <p>{t('faq.a1')}</p>
      </details>
      <details>
        <summary>{t('faq.q2')}</summary>
        <p>{t('faq.a2')}</p>
      </details>
    </div>
  )
})
