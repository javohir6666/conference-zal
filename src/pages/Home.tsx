import { defineComponent } from 'vue'
import { useHead } from '@unhead/vue'
import { venueJsonLd } from '../seo'
import Hero from '../components/Hero'
import { RouterLink } from 'vue-router'
import BookingForm from '../components/BookingForm'
import { Icon } from '@iconify/vue'
import Testimonials from '../components/Testimonials'
import Partners from '../components/Partners'
import { env } from '@/lib/env'
import { useI18n } from 'vue-i18n'
import QuickContacts from '@/components/QuickContacts'
import Carousel from '@/components/Carousel'
import { envList, num, env as envVar } from '@/lib/env'
import { getSliderImages } from '@/lib/gallery'

export default defineComponent(() => {
  useHead({
    title: 'Arenda-Zala.uz — Konferensiya zali ijarasi',
    meta: [
      { name: 'description', content: "Tashkentda 500/50/20 o'rinli konferensiya zallari. Ariza onlayn." },
      { property: 'og:title', content: 'Arenda-Zala.uz' },
      { property: 'og:description', content: "Konferensiya zali ijarasi — ariza onlayn." }
    ],
    link: [
      { rel: 'alternate', hrefLang: 'uz', href: '/' },
      { rel: 'alternate', hrefLang: 'ru', href: '/' }
    ],
    script: [
      { type: 'application/ld+json', children: venueJsonLd() }
    ]
  })
  const { t } = useI18n()
  // Read carousels from .env and gallery helper
  const car1 = envList('VITE_CAROUSEL_1_', 'VITE_CAROUSEL_1_COUNT', getSliderImages('1'))
  const car2 = envList('VITE_CAROUSEL_2_', 'VITE_CAROUSEL_2_COUNT', getSliderImages('2').slice(0, 5))
  const car3 = envList('VITE_CAROUSEL_3_', 'VITE_CAROUSEL_3_COUNT', getSliderImages('3'))
  const autoplay = envVar('VITE_CAROUSEL_AUTOPLAY','1') !== '0'
  const interval = Number(num('VITE_CAROUSEL_INTERVAL', 4500))
  return () => (
    <div class="home">
      <Hero />
      {/* 1st carousel: central hall */}
      <section class="section container">
        <h2 class="section-title car-title">{t('rooms.types.1')}</h2>
        <Carousel images={car1} autoplay={autoplay} interval={interval} />
      </section>

      {/* Hall cards (types) */}
      <section class="section container">
        <div class="grid-3">
          <div class="card reveal">
            <div class="img-frame" style={{marginBottom:'12px',backgroundImage:`url('${env('VITE_CARD_IMG_500','https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop')}')`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
            <h3 style={{margin:'8px 0'}}>{t('home.cards.500.title')}</h3>
            <p>{t('home.cards.500.desc')}</p>
            <RouterLink class="btn" to="/halls/500">
              <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
                {t('home.more')} <Icon icon="mdi:arrow-right" width="18"/>
              </span>
            </RouterLink>
          </div>
          <div class="card reveal">
            <div class="img-frame" style={{marginBottom:'12px',backgroundImage:`url('${env('VITE_CARD_IMG_50','https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop')}')`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
            <h3 style={{margin:'8px 0'}}>{t('home.cards.50.title')}</h3>
            <p>{t('home.cards.50.desc')}</p>
            <RouterLink class="btn" to="/halls/50">
              <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
                {t('home.more')} <Icon icon="mdi:arrow-right" width="18"/>
              </span>
            </RouterLink>
          </div>
          <div class="card reveal">
            <div class="img-frame" style={{marginBottom:'12px',backgroundImage:`url('${env('VITE_CARD_IMG_20','https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop')}')`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
            <h3 style={{margin:'8px 0'}}>{t('home.cards.20.title')}</h3>
            <p>{t('home.cards.20.desc')}</p>
            <RouterLink class="btn" to="/halls/20">
              <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
                {t('home.more')} <Icon icon="mdi:arrow-right" width="18"/>
              </span>
            </RouterLink>
          </div>
        </div>
      </section>

      {/* 2nd carousel: presentation hall */}
      <section class="section container">
        <h2 class="section-title car-title">{t('rooms.types.2')}</h2>
        <Carousel images={car2} autoplay={autoplay} interval={interval} />
      </section>

      {/* Features */}
      <section class="section container">
        <div class="grid-3">
          <div class="card reveal">
            <h3 style={{display:'flex',alignItems:'center',gap:'10px'}}><Icon icon="mdi:map-marker-outline"/> {t('home.features.location.title')}</h3>
            <p>{t('home.features.location.desc')}</p>
          </div>
          <div class="card reveal">
            <h3 style={{display:'flex',alignItems:'center',gap:'10px'}}><Icon icon="mdi:shield-check-outline"/> {t('home.features.support.title')}</h3>
            <p>{t('home.features.support.desc')}</p>
          </div>
          <div class="card reveal">
            <h3 style={{display:'flex',alignItems:'center',gap:'10px'}}><Icon icon="mdi:clock-outline"/> {t('home.features.flex.title')}</h3>
            <p>{t('home.features.flex.desc')}</p>
          </div>
        </div>
      </section>

      {/* 3rd carousel: equipped cabinets */}
      <section class="section container">
        <h2 class="section-title car-title">{t('rooms.types.3')}</h2>
        <Carousel images={car3} autoplay={autoplay} interval={interval} />
      </section>

      {/* Quick contacts + partners + testimonials */}
      <QuickContacts />

      <Partners />

      <Testimonials />

      <section class="section container">
        <BookingForm />
      </section>
    </div>
  )
})
