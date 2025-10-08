import { defineComponent } from 'vue'
import { Icon } from '@iconify/vue'
import { env } from '@/lib/env'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const { t } = useI18n()
  const p1 = env('VITE_PHONE_1', '+998994084408')
  const p1h = env('VITE_PHONE_1_HUMAN', '+998 99 408 4408')
  const p2 = env('VITE_PHONE_2', '+998998274422')
  const p2h = env('VITE_PHONE_2_HUMAN', '+998 99 827 4422')
  const tg = env('VITE_SOCIAL_TELEGRAM','')
  return () => (
    <section class="section container">
      <h3 style={{display:'flex',alignItems:'center',gap:'10px',marginTop:0}}>
        <Icon icon="mdi:lightning-bolt-outline"/> {t('quick.title')}
      </h3>
      <div style={{display:'flex',flexWrap:'wrap',gap:'10px'}}>
        <a class="btn" href={`tel:${p1}`}><Icon icon="mdi:phone-outline" width="18"/> {p1h}</a>
        <a class="btn" href={`tel:${p2}`}><Icon icon="mdi:phone-outline" width="18"/> {p2h}</a>
        {tg && <a class="btn" target="_blank" rel="noopener" href={tg}><Icon icon="mdi:telegram" width="18"/> Telegram</a>}
      </div>
    </section>
  )
})

