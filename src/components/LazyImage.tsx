import { defineComponent, ref, onMounted, PropType } from 'vue'

export default defineComponent({
  name: 'LazyImage',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: '' },
    placeholder: { type: String, default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Юкланмоқда...</dGV4dD48L3N2Zz4=' },
    lazy: { type: Boolean, default: true },
    aspectRatio: { type: String, default: '16/9' }
  },
  setup(props) {
    const loaded = ref(false)
    const error = ref(false)
    const imgRef = ref<HTMLImageElement>()

    const onLoad = () => {
      loaded.value = true
    }

    const onError = () => {
      error.value = true
    }

    onMounted(() => {
      if (!props.lazy) {
        loaded.value = true
      }
    })

    return () => (
      <div 
        class="lazy-image"
        style={{
          position: 'relative',
          aspectRatio: props.aspectRatio,
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        {!loaded.value && !error.value && (
          <img
            src={props.placeholder}
            alt="Loading..."
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(2px)',
              opacity: 0.7
            }}
          />
        )}
        
        <img
          ref={imgRef}
          src={props.src}
          alt={props.alt}
          loading={props.lazy ? "lazy" : "eager"}
          onLoad={onLoad}
          onError={onError}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: loaded.value ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        {error.value && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#999',
              fontSize: '14px',
              textAlign: 'center'
            }}
          >
            Rasm yuklanmadi
          </div>
        )}
      </div>
    )
  }
})
