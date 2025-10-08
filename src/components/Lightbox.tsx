import { defineComponent, ref, onMounted, onBeforeUnmount, computed, PropType } from 'vue'
import LazyImage from './LazyImage'

export default defineComponent({
  name: 'Lightbox',
  props: {
    images: { type: Array as PropType<string[]>, default: () => [] },
    captions: { type: Array as PropType<string[]>, default: () => [] },
  },
  setup(props) {
    const open = ref(false)
    const idx = ref(0)
    const list = computed(() => props.images ?? [])
    const caps = computed(() => props.captions ?? [])

    const show = (i: number) => { if (list.value.length) { idx.value = i; open.value = true } }
    const close = () => { open.value = false }
    const prev = () => { if (list.value.length) idx.value = (idx.value + list.value.length - 1) % list.value.length }
    const next = () => { if (list.value.length) idx.value = (idx.value + 1) % list.value.length }

    const onKey = (e: KeyboardEvent) => {
      if (!open.value) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    onMounted(() => window.addEventListener('keydown', onKey))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

    // touch swipe support
    let sx = 0, sy = 0, moved = false
    const ts = (e: TouchEvent) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; moved = false }
    const tm = (e: TouchEvent) => { if (!open.value) return; const t=e.touches[0]; if (Math.abs(t.clientX - sx) > 10) moved = true }
    const te = (e: TouchEvent) => {
      if (!open.value) return
      const t = e.changedTouches[0]; const dx = t.clientX - sx; const dy = t.clientY - sy
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? next() : prev()
      }
    }

    return () => (
      <div>
        <div class="grid-3">
          {list.value.map((src, i) => {
            const s = deriveSources(src)
            return (
              <div class="img-frame reveal" style={{cursor:'zoom-in'}} onClick={()=>show(i)}>
                <picture>
                  {s.avif.length>0 && <source type="image/avif" srcset={s.avif[0]} sizes={s.sizes} />}
                  {s.webp.length>0 && <source type="image/webp" srcset={s.webp[0]} sizes={s.sizes} />}
                  <img alt={caps.value[i] || 'gallery'} src={s.jpg[0]} sizes={s.sizes} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </picture>
              </div>
            )
          })}
        </div>
        {open.value && (
          <div class="lb" role="dialog" aria-modal="true" onClick={close} onTouchstart={ts} onTouchmove={tm} onTouchend={te}>
            <button class="lb-btn prev" aria-label="Previous" onClick={(e)=>{e.stopPropagation(); prev()}}>‹</button>
            <div onClick={(e)=>e.stopPropagation()} style={{textAlign:'center'}}>
              <picture>
                {deriveSources(list.value[idx.value]).avif.length>0 && <source type="image/avif" srcset={deriveSources(list.value[idx.value]).avif[0]} sizes={deriveSources(list.value[idx.value]).sizes} />}
                {deriveSources(list.value[idx.value]).webp.length>0 && <source type="image/webp" srcset={deriveSources(list.value[idx.value]).webp[0]} sizes={deriveSources(list.value[idx.value]).sizes} />}
                <img class="lb-img" src={deriveSources(list.value[idx.value]).jpg[0]} alt={caps.value[idx.value] || 'gallery'} />
              </picture>
              {caps.value[idx.value] && <div style={{color:'#fff',marginTop:'8px'}}>{caps.value[idx.value]}</div>}
              <div style={{display:'flex',gap:'8px',marginTop:'12px',justifyContent:'center',flexWrap:'wrap'}}>
                {list.value.map((src, i) => (
                  <button aria-label={`Go to ${i+1}`} class={"thumb" + (i===idx.value? ' active':'')} onClick={()=>{idx.value=i}}>
                    <img src={deriveSources(src).jpg[0]} alt={caps.value[i] || `thumb ${i+1}`} />
                  </button>
                ))}
              </div>
            </div>
            <button class="lb-btn next" aria-label="Next" onClick={(e)=>{e.stopPropagation(); next()}}>›</button>
            <button class="lb-close" aria-label="Close" onClick={(e)=>{e.stopPropagation(); close()}}>✕</button>
          </div>
        )}
      </div>
    )
  }
})
