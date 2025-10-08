import { defineComponent } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const items = [
  { name: 'TechConf', text: "Zal juda qulay va texnik jamoa a’lo!" },
  { name: 'EduCamp', text: 'Treninglarimiz uchun mukammal joy.' },
  { name: 'BizMeet', text: 'Shahar markazida, logistika oson.' },
]

export default defineComponent(() => {
  const { t } = useI18n()
  return () => (
    <section class="section container">
      <h2 style={{marginTop:0,display:'flex',alignItems:'center',gap:'10px'}}>
        <Icon icon="mdi:star-outline"/> {t('testimonials.title')}
      </h2>
      <div class="grid-3">
        {items.map((it) => (
          <div class="card reveal">
            <p style={{margin:'0 0 10px'}}>“{it.text}”</p>
            <div style={{display:'flex',alignItems:'center',gap:'8px',color:'var(--muted)'}}>
              <Icon icon="mdi:account-circle-outline"/> {it.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
})
