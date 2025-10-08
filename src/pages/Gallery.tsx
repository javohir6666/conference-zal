import { defineComponent } from 'vue'
import LightboxFixed from '@/components/LightboxFixed'
import { getAllImagesFromFolders } from '@/lib/gallery'
import { useI18n } from 'vue-i18n'

export default defineComponent(() => {
  const { t } = useI18n()
  
  // Gallery images - all images from all folders
  const galleryImages = getAllImagesFromFolders()
  
  return () => (
    <div class="container section">
      <h1>{t('nav.gallery')}</h1>
      <p class="sub" style={{marginBottom:'32px'}}>{t('gallery.description')}</p>
      <LightboxFixed images={galleryImages} />
    </div>
  )
})
