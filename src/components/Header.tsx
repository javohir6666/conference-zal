import { defineComponent, ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { env as envVar } from '@/lib/env'
import { useRoute } from 'vue-router'
import { onMounted as onMountedVue } from 'vue'

export default defineComponent(() => {
  const { t, locale } = useI18n()
  const router = useRouter()
  const open = ref(false)
  const openDrop = ref(false)
  const headerEl = ref<HTMLElement | null>(null)
  const navEl = ref<HTMLElement | null>(null)
  const indicator = ref<HTMLElement | null>(null)
  const getInitialTheme = (): 'light'|'dark' => {
    try {
      const stored = localStorage.getItem('theme') as 'light'|'dark'|null
      if (stored === 'light' || stored === 'dark') return stored
    } catch {}
    return (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  }
  const theme = ref<'light'|'dark'>(getInitialTheme())
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }
  onMounted(()=>{ applyTheme() })

  const switchLang = () => {
    locale.value = locale.value === 'uz' ? 'ru' : 'uz'
    document.documentElement.lang = locale.value
  }
  const langText = computed(() => locale.value === 'ru' ? 'RU' : 'UZ')
  const langIcon = computed(() => locale.value === 'ru' ? 'twemoji:flag-russia' : 'twemoji:flag-for-flag-uzbekistan')
  const onScroll = () => {
    const h = headerEl.value
    if (!h) return
    if (window.scrollY > 4) h.classList.add('shadow')
    else h.classList.remove('shadow')
  }
  onMounted(() => window.addEventListener('scroll', onScroll))
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

  const route = useRoute()
  const isActiveRoute = (path: string) => {
    return route.path === path || route.path.startsWith(path + '/') ? 'router-link-active' : ''
  }
  const updateIndicator = async () => {
    if (window.innerWidth <= 900) return // Only for desktop
    await nextTick()
    const nav = navEl.value?.querySelector('.nav-inner') as HTMLElement | null
    const ind = indicator.value
    if (!nav || !ind) return
    const active = nav.querySelector('a.router-link-active') as HTMLElement | null
    if (!active) { ind.style.transform = 'scaleX(0)'; return }
    const rect = active.getBoundingClientRect()
    const nrect = nav.getBoundingClientRect()
    const left = rect.left - nrect.left + 10
    const width = rect.width - 20
    ind.style.width = `${Math.max(0, width)}px`
    ind.style.transform = `translateX(${Math.max(0,left)}px)`
    ind.style.opacity = '1'
  }
  onMounted(updateIndicator)
  onMounted(() => {
    // Desktop navigation indicator (only for desktop)
    const handleDesktopEvents = () => {
      if (window.innerWidth > 900) {
        const nav = navEl.value?.querySelector('.nav-inner') as HTMLElement | null
        if (!nav) return
        
        nav.addEventListener('mouseover', (e:any)=>{
          const a = (e.target as HTMLElement).closest('a') as HTMLElement | null
          if (!a || !indicator.value) return
          const navr = nav.getBoundingClientRect(); const r = a.getBoundingClientRect()
          indicator.value.style.width = `${r.width-20}px`
          indicator.value.style.transform = `translateX(${r.left - navr.left + 10}px)`
        })
        nav.addEventListener('mouseleave', ()=> updateIndicator())
      }
    }
    
    handleDesktopEvents()
    window.addEventListener('resize', handleDesktopEvents)
    
    // Mobile navigation close on click
    const nav = navEl.value
    if (nav) {
      nav.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement
        const link = target.closest('a')
        if (link && open.value) {
          setTimeout(() => closeMenu(), 100) // Small delay to allow navigation
        }
      })
    }
  })

  const closeMenu = () => {
    open.value = false
    openDrop.value = false
    try { document.body.classList.remove('no-scroll') } catch {}
  }
  
  const navigateAndClose = (path: string) => {
    closeMenu()
    router.push(path)
  }
  const toggleMenu = () => {
    open.value = !open.value
    try {
      if (open.value) document.body.classList.add('no-scroll')
      else document.body.classList.remove('no-scroll')
    } catch {}
  }
  let trapHandler: ((e: KeyboardEvent)=>void) | null = null
  const enableFocusTrap = () => {
    const panel = navEl.value?.querySelector('.nav-inner') as HTMLElement | null
    if (!panel) return
    const focusables = panel.querySelectorAll<HTMLElement>('a[href], button, select, textarea, [tabindex]:not([tabindex="-1"])')
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (!first || !last) return
    first.focus()
    trapHandler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); (last as HTMLElement).focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); (first as HTMLElement).focus()
      }
    }
    window.addEventListener('keydown', trapHandler)
  }
  const disableFocusTrap = () => {
    if (trapHandler) window.removeEventListener('keydown', trapHandler)
    trapHandler = null
  }
  onMounted(() => {
    // apply trap when menu opens
    watch(open, (v) => { 
      if (v) {
        setTimeout(() => enableFocusTrap(), 100)
      } else {
        disableFocusTrap()
      }
    })
  })
  const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape' && open.value) closeMenu() }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

  return () => (
    <header ref={headerEl} class="site-header">
      <div class="container row space-between center">
        <RouterLink to="/" class="brand">
          <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
            <Icon icon="mdi:domain" width="22" />
            {t('brand')}
          </span>
        </RouterLink>
        
        <button class="burger" aria-expanded={open.value} aria-controls="main-nav" onClick={toggleMenu} aria-label="menu">
          <Icon icon={open.value? 'mdi:close':'mdi:menu'} width="28" />
        </button>
        
        <nav id="main-nav" ref={navEl} class={"nav" + (open.value? ' open':'' )} onClick={()=>{ if (open.value) closeMenu() }} onKeydown={(e:KeyboardEvent)=>{ if (e.key === 'Escape') closeMenu() }}>
          <div class="nav-inner" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true">
            <div class="brand-mobile">
              <span class="brand">{t('brand')}</span>
              <button class="burger" aria-label="close menu" onClick={closeMenu}><Icon icon="mdi:close" width="28"/></button>
            </div>
            <div class={"dropdown" + (openDrop.value? ' open':'')} onMouseenter={()=>openDrop.value=true} onMouseleave={()=>openDrop.value=false} onFocusin={()=>openDrop.value=true} onFocusout={()=>openDrop.value=false}>
              <button class="drop-btn" onClick={()=>openDrop.value=!openDrop.value}>
                <span style={{display:'inline-flex',alignItems:'center',gap:'6px'}}>
                  <Icon icon="mdi:office-building-outline" width="18"/> {t('nav.halls')}
                  <Icon icon={openDrop.value? 'mdi:chevron-up':'mdi:chevron-down'} width="16"/>
                </span>
              </button>
              <div class="drop-menu" onMouseleave={()=>{ if (!open.value) openDrop.value=false }}>
                <RouterLink to="/halls/500" class="hall-link">500</RouterLink>
                <RouterLink to="/halls/50" class="hall-link">50</RouterLink>
                <RouterLink to="/halls/20" class="hall-link">20</RouterLink>
              </div>
            </div>
            <RouterLink to="/pricing">{t('nav.pricing')}</RouterLink>
            <RouterLink to="/gallery">{t('nav.gallery')}</RouterLink>
            <RouterLink to="/contact">{t('nav.contact')}</RouterLink>
            <button class="theme-btn" onClick={()=>{ theme.value = theme.value==='light'?'dark':'light'; applyTheme() }} aria-label="theme">
              <Icon icon={theme.value==='light' ? 'mdi:weather-night' : 'mdi:white-balance-sunny'} width="20" />
            </button>
            <button class="lang" onClick={switchLang} aria-label="language">
              <Icon icon={langIcon.value} width="18" /> {langText.value}
            </button>
            <a href={`tel:${envVar('VITE_PHONE_1','+998994084408')}`} class="cta" style={{marginLeft:'8px'}}>
              <span style={{display:'inline-flex',alignItems:'center',gap:'8px'}}>
                <Icon icon="mdi:phone-outline" width="18" />
                {t('cta.call')}
              </span>
            </a>
            <div class="nav-indicator" ref={indicator}></div>
          </div>
        </nav>
      </div>
    </header>
  )
})
