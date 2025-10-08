import { defineComponent } from 'vue'
import Map from './Map'
import { env } from '@/lib/env'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
export default defineComponent(() => {
  const { t } = useI18n()
  return () => (
    <footer class="site-footer">
      <div class="container">
        <div class="grid-3" style={{gap:'20px'}}>
          <div>
            <h3 style={{marginTop:0}}>{t('brand')}</h3>
            <p style={{marginTop:0,color:'var(--muted)'}}>{t('footer.about')}</p>
            <div style={{marginTop:'12px'}}>
              <Map />
            </div>
          </div>
          <div>
            <h4>{t('footer.contact')}</h4>
            <p style={{margin:0}}><a href={`tel:${env('VITE_PHONE_1', '+998994084408')}`}>{env('VITE_PHONE_1_HUMAN', '+998 99 408 4408')}</a></p>
            <p style={{margin:0}}><a href={`tel:${env('VITE_PHONE_2', '+998998274422')}`}>{env('VITE_PHONE_2_HUMAN', '+998 99 827 4422')}</a></p>
            <p style={{marginTop:'8px'}}>{env('VITE_ADDRESS_TEXT', 'Toshkent')}</p>
            <p>{t('footer.hours')}: {env('VITE_WORKING_HOURS', '09:00–21:00')}</p>
            <div style={{display:'flex',gap:'10px',marginTop:'10px'}}>
              {env('VITE_SOCIAL_TELEGRAM','') && <a href={env('VITE_SOCIAL_TELEGRAM','')} target="_blank" rel="noopener" aria-label="Telegram"><Icon icon="mdi:telegram" width="22"/></a>}
              {env('VITE_SOCIAL_INSTAGRAM','') && <a href={env('VITE_SOCIAL_INSTAGRAM','')} target="_blank" rel="noopener" aria-label="Instagram"><Icon icon="mdi:instagram" width="22"/></a>}
              {env('VITE_SOCIAL_FACEBOOK','') && <a href={env('VITE_SOCIAL_FACEBOOK','')} target="_blank" rel="noopener" aria-label="Facebook"><Icon icon="mdi:facebook" width="22"/></a>}
            </div>
          </div>
          <div>
            <h4>{t('footer.links')}</h4>
            <p><a href="/pricing">{t('nav.pricing')}</a></p>
            <p><a href="/gallery">{t('nav.gallery')}</a></p>
            <p><a href="/contact">{t('nav.contact')}</a></p>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'16px',color:'var(--muted)'}}>
          <span>© {new Date().getFullYear()} Arenda-Zala.uz</span>
          <span>{env('VITE_FOOTER_NOTE', '')}</span>
        </div>
      </div>
    </footer>
  )
})
