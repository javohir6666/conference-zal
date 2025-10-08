import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { env } from '@/lib/env'

export default defineComponent(() => {
  const { t } = useI18n()
  const heroLogo = env('VITE_HERO_LOGO', '')
  
  return () => (
    <section class="hero">
      <div class="container lead">
        <div class="reveal">
          <h1>{t('hero.title')}</h1>
          <p class="sub">{t('hero.subtitle')}</p>
          <div class="chips">
            <span class="chip"><Icon class="ico" icon="mdi:projector-screen-outline"/> {t('chips.projector')}</span>
            <span class="chip"><Icon class="ico" icon="mdi:account-group-outline"/> {t('chips.capacity')}</span>
            <span class="chip"><Icon class="ico" icon="mdi:wifi"/> {t('chips.wifi')}</span>
            <span class="chip"><Icon class="ico" icon="mdi:car"/> {t('chips.parking')}</span>
            <span class="chip"><Icon class="ico" icon="mdi:coffee"/> {t('chips.coffee')}</span>
          </div>
          <div style={{marginTop:'18px'}}>
            <RouterLink to="/contact" class="btn primary">{t('hero.cta')}</RouterLink>
          </div>
        </div>
        <div class="img-stack reveal">
          {heroLogo && (
            <img 
              src={heroLogo} 
              alt="Hero Image" 
              style={{
                position: 'absolute',
                top: '1px',
                right: '1px',
                zIndex: 10,
                width: '480px',
                height: 'auto',
                maxHeight: '350px',
                objectFit: 'cover',
                borderRadius: '15px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
              }}
            />
          )}
          <div class="img-frame" style={{backgroundImage:`url('${env('VITE_HERO_IMG1','https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=1400&auto=format&fit=crop')})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
          <div class="img-frame" style={{backgroundImage:`url('${env('VITE_HERO_IMG2','https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200&auto=format&fit=crop')})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
        </div>
      </div>
    </section>
  )
})
