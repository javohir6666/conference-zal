import { defineComponent } from 'vue'
import { Icon } from '@iconify/vue'
import { env } from '@/lib/env'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const phone = env('VITE_PHONE_1_HUMAN', '+998 99 408 4408')
  const phoneHref = env('VITE_PHONE_1', '+998994084408')
  const { t } = useI18n()
  const addressEnv = env('VITE_ADDRESS_TEXT', '')
  const address = addressEnv || (t('topbar.address') as string)
  const tg = env('VITE_SOCIAL_TELEGRAM','')
  const ig = env('VITE_SOCIAL_INSTAGRAM','')
  const fb = env('VITE_SOCIAL_FACEBOOK','')
  return () => (
    <div class="topbar">
      <div class="container row space-between center">
        <div class="tb-left">
          <a href={`tel:${phoneHref}`} class="tb-item">
            <Icon icon="mdi:phone-outline" width="16" /> {phone}
          </a>
        </div>
        <div class="tb-center">
          <div class="tb-item">
            <Icon icon="mdi:map-marker-outline" width="16" /> {address}
          </div>
        </div>
        <div class="tb-right">
          {tg && <a class="tb-icon" href={tg} target="_blank" rel="noopener" aria-label="Telegram"><Icon icon="mdi:telegram" width="18"/></a>}
          {ig && <a class="tb-icon" href={ig} target="_blank" rel="noopener" aria-label="Instagram"><Icon icon="mdi:instagram" width="18"/></a>}
          {fb && <a class="tb-icon" href={fb} target="_blank" rel="noopener" aria-label="Facebook"><Icon icon="mdi:facebook" width="18"/></a>}
        </div>
      </div>
    </div>
  )
})
