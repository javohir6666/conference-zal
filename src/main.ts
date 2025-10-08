import { ViteSSG } from 'vite-ssg'
import { routes } from './router'
import App from './App'
import { createI18nInstance } from './modules/i18n'
import { createHead } from '@unhead/vue'
import './styles.css'
import { initReveal } from './lib/reveal'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, isClient }) => {
    const i18n = createI18nInstance()
    const head = createHead()
    app.use(i18n)
    app.use(head)
    if (isClient) {
      router.afterEach(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, left: 0 })
          initReveal()
        }, 0)
      })
    }
  }
)
