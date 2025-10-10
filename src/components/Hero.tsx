import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { env } from '@/lib/env'

export default defineComponent(() => {
  const { t } = useI18n()
  const showVideo = ref(false)
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') showVideo.value = false }
  onMounted(()=> window.addEventListener('keydown', onKey))
  onBeforeUnmount(()=> window.removeEventListener('keydown', onKey))
  const heroLogo = env('VITE_HERO_LOGO', '')
  const poster = env('VITE_HERO_POSTER', '') || env('VITE_HERO_IMG1','https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=1400&auto=format&fit=crop')
  const heroVideo = env('VITE_HERO_VIDEO', '/videos/Hero-Video.MP4')
  
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
            <span class="chip metro"><Icon class="ico" icon="mdi:train"/> {t('metro.qodiriy')}: 330{t('units.m')}</span>
            <span class="chip metro"><Icon class="ico" icon="mdi:train"/> {t('metro.minor')}: 980{t('units.m')}</span>
            <span class="chip metro"><Icon class="ico" icon="mdi:train"/> {t('metro.mustaqillik')}: 740{t('units.m')}</span>
          </div>
          <div style={{marginTop:'18px'}}>
            <RouterLink to="/contact" class="btn primary">{t('hero.cta')}</RouterLink>
          </div>
        </div>
        <div class="video-frame reveal" style={{backgroundImage:`url('${poster}')`,backgroundSize:'cover',backgroundPosition:'center'}}>
          <div class="video-mask" onClick={()=> showVideo.value = true}>
            <button class="play-btn" aria-label="play">▶</button>
          </div>
        </div>
        {showVideo.value && (
          <div class="vid-modal" onClick={()=> showVideo.value = false}>
            <div class="vid-wrap" onClick={(e)=>e.stopPropagation()}>
              <video class="hero-video" src={heroVideo} playsInline controls autoplay preload="metadata" poster={poster || undefined}></video>
              <button class="vid-close" aria-label="close" onClick={()=> showVideo.value = false}>✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
})

