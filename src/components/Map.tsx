import { defineComponent, onMounted, ref } from 'vue'
import { env, num } from '@/lib/env'

declare global {
  interface Window { ymaps?: any }
}

function loadYandex(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve()
    if (window.ymaps) return resolve()
    const s = document.createElement('script')
    s.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${key ? `&apikey=${encodeURIComponent(key)}` : ''}`
    s.async = true
    s.onload = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export default defineComponent(() => {
  const el = ref<HTMLDivElement | null>(null)
  onMounted(async () => {
    const key = env('VITE_YMAPS_API_KEY', '')
    await loadYandex(key)
    const lat = num('VITE_MAP_LAT', 41.311081)
    const lng = num('VITE_MAP_LNG', 69.240562)
    const zoom = Number(num('VITE_MAP_ZOOM', 14))
    const address = env('VITE_ADDRESS_TEXT', 'Tashkent')
    const ymaps = window.ymaps
    await new Promise(r => ymaps.ready(r))
    if (!el.value) return
    const map = new ymaps.Map(el.value, { center: [lat, lng], zoom, controls: ['zoomControl'] })
    const markerImg = env('VITE_MAP_MARKER_IMG', '')
    const balloon = `
      <div style="font-family:Inter,system-ui;min-width:180px">
        <div style="font-weight:800;color:#A06D3C">Arenda‑Zala</div>
        <div style="color:#6f6258">${address}</div>
      </div>`
    const mark = new ymaps.Placemark([lat, lng], { balloonContent: balloon },
      markerImg ? {
        iconLayout: 'default#image',
        iconImageHref: markerImg,
        iconImageSize: [32, 32],
        iconImageOffset: [-16, -32]
      } : {
        preset: 'islands#brownDotIcon'
      }
    )
    map.geoObjects.add(mark)
  })
  return () => <div class="y-map" ref={el}></div>
})
