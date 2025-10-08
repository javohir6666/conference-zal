import { defineComponent, ref, onMounted, onBeforeUnmount, PropType } from 'vue'

export default defineComponent({
  name: 'Carousel',
  props: {
    images: { type: Array as PropType<string[]>, default: () => [] },
    interval: { type: Number, default: 5000 },
    autoplay: { type: Boolean, default: true },
  },
  setup(props) {
    const i = ref(0)
    let timer: any = null
    const start = () => {
      if (!props.autoplay || props.images.length <= 1) return
      stop()
      timer = setInterval(() => { i.value = (i.value + 1) % props.images.length }, props.interval)
    }
    const stop = () => { if (timer) { clearInterval(timer); timer = null } }
    onMounted(start)
    onBeforeUnmount(stop)

    const go = (n: number) => { i.value = (n + props.images.length) % props.images.length }
    const prev = () => go(i.value - 1)
    const next = () => go(i.value + 1)

    let sx = 0, sy = 0
    const ts = (e: TouchEvent) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY }
    const te = (e: TouchEvent) => { const t = e.changedTouches[0]; const dx = t.clientX - sx; const dy = t.clientY - sy; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev() } }

    return () => (
      <div class="carousel" onMouseenter={stop} onMouseleave={start} onTouchstart={ts} onTouchend={te}>
        <div class="carousel-track" style={{transform:`translateX(-${i.value*100}%)`}}>
          {props.images.map((src, idx) => {
            const isActive = idx === i.value
            const isNext = idx === (i.value + 1) % props.images.length
            const isPrev = idx === (i.value - 1 + props.images.length) % props.images.length
            
            return (
              <div class="carousel-item">
                <img 
                  src={src} 
                  alt={`Slide ${idx + 1}`}
                  loading={isActive || isNext || isPrev ? "eager" : "lazy"}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              </div>
            )
          })}
        </div>
        {props.images.length>1 && <>
          <button class="car-btn prev" aria-label="Prev" onClick={prev}>‹</button>
          <button class="car-btn next" aria-label="Next" onClick={next}>›</button>
          <div class="car-dots">
            {props.images.map((_,idx)=>(<button class={"dot"+(idx===i.value?' active':'')} onClick={()=>go(idx)} aria-label={`Go ${idx+1}`}></button>))}
          </div>
        </>}
      </div>
    )
  }
})

