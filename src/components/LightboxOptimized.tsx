import { defineComponent, ref, onMounted, onBeforeUnmount, computed, PropType } from 'vue'

export default defineComponent({
  name: 'LightboxOptimized',
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
          {list.value.map((src, i) => (
            <div class="img-frame reveal" style={{cursor:'zoom-in'}} onClick={()=>show(i)}>
              <img 
                src={src} 
                alt={caps.value[i] || `Gallery image ${i+1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
          ))}
        </div>

        {open.value && (
          <div class="lightbox" onClick={close}>
            <div class="lb-content" onClick={(e) => e.stopPropagation()}>
              <button class="lb-close" onClick={close} aria-label="Close">×</button>
              <button class="lb-nav prev" onClick={prev} aria-label="Previous">‹</button>
              <button class="lb-nav next" onClick={next} aria-label="Next">›</button>
              
              <div class="lb-main">
                <img 
                  class="lb-img" 
                  src={list.value[idx.value]} 
                  alt={caps.value[idx.value] || 'gallery'} 
                  loading="eager"
                />
              </div>
              
              {caps.value[idx.value] && <div class="lb-caption">{caps.value[idx.value]}</div>}
              
              <div class="lb-thumbs" onTouchstart={ts} onTouchmove={tm} onTouchend={te}>
                {list.value.map((src, i) => (
                  <div class={"lb-thumb" + (i === idx.value ? " active" : "")} onClick={() => { idx.value = i }}>
                    <img 
                      src={src} 
                      alt={caps.value[i] || `thumb ${i+1}`} 
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
})
