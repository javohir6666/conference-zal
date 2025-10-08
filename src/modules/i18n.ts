import { createI18n } from 'vue-i18n'
import uz from '../translations/uz.json'
import ru from '../translations/ru.json'

export function createI18nInstance() {
  const locale = (typeof navigator !== 'undefined' ? (navigator.language.startsWith('ru') ? 'ru' : 'uz') : 'uz') as 'uz' | 'ru'
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'uz',
    messages: { uz, ru },
  })
}

