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

    const show = (i: number) => { 
      console.log('Opening lightbox for image:', i, list.value[i])
      if (list.value.length) { 
        idx.value = i
        open.value = true 
        document.body.classList.add('no-scroll')
      } 
    }
    
    const close = () => { 
      console.log('Closing lightbox')
      open.value = false 
      document.body.classList.remove('no-scroll')
    }
    
    const prev = () => { if (list.value.length) idx.value = (idx.value + list.value.length - 1) % list.value.length }
    const next = () => { if (list.value.length) idx.value = (idx.value + 1) % list.value.length }

    const onKey = (e: KeyboardEvent) => {
      if (!open.value) return
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    
    onMounted(() => window.addEventListener('keydown', onKey))
    onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    })

    // touch swipe support
    let sx = 0, sy = 0
    const ts = (e: TouchEvent) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY }
    const te = (e: TouchEvent) => {
      if (!open.value) return
      const t = e.changedTouches[0]; const dx = t.clientX - sx; const dy = t.clientY - sy
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? next() : prev()
      }
    }

    return () => (
      <div>
        {/* Gallery Grid */}
        <div class="grid-3">
          {list.value.map((src, i) => (
            <div 
              key={i}
              class="img-frame reveal" 
              style={{cursor:'zoom-in'}} 
              onClick={() => show(i)}
            >
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

        {/* Lightbox Modal */}
        {open.value && (
          <div class="lightbox" onClick={close}>
            <div class="lb-content" onClick={(e) => e.stopPropagation()}>
              <button class="lb-close" onClick={close} aria-label="Close">×</button>
              
              {list.value.length > 1 && (
                <>
                  <button class="lb-nav prev" onClick={prev} aria-label="Previous">‹</button>
                  <button class="lb-nav next" onClick={next} aria-label="Next">›</button>
                </>
              )}
              
              <div class="lb-main">
                <img 
                  class="lb-img" 
                  src={list.value[idx.value]} 
                  alt={caps.value[idx.value] || 'Gallery image'} 
                  loading="eager"
                />
              </div>
              
              {caps.value[idx.value] && (
                <div class="lb-caption">{caps.value[idx.value]}</div>
              )}
              
              {list.value.length > 1 && (
                <div class="lb-thumbs" onTouchstart={ts} onTouchend={te}>
                  {list.value.map((src, i) => (
                    <button 
                      key={i}
                      class={`lb-thumb${i === idx.value ? ' active' : ''}`} 
                      onClick={() => { idx.value = i }}
                    >
                      <img 
                        src={src} 
                        alt={caps.value[i] || `Thumbnail ${i+1}`} 
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
})
