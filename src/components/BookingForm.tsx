import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  date: z.string().min(4),
  guests: z.coerce.number().min(1),
  hall: z.string().min(1),
  hp: z.string().max(0).optional() // honeypot
})

export default defineComponent(() => {
  const { t } = useI18n()
  const form = ref({
    name: '', phone: '', date: '', guests: 10, hall: '', hp: ''
  })
  const sending = ref(false)
  const notice = ref<'success' | 'error' | ''>('')
  const errors = ref<Record<string,string>>({})

  const submit = async () => {
    notice.value = ''
    errors.value = {}
    const parsed = schema.safeParse(form.value)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.value[issue.path.join('.')] = issue.message
      }
      return
    }
    if (form.value.hp) return // bot
    sending.value = true
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      })
      if (!res.ok) throw new Error('bad status')
      notice.value = 'success'
      form.value = { name: '', phone: '', date: '', guests: 10, hall: '', hp: '' }
    } catch (e) {
      notice.value = 'error'
    } finally {
      sending.value = false
    }
  }

  return () => (
    <form class="form" onSubmit={(e)=>{e.preventDefault(); submit()}}>
      <h3>{t('form.title')}</h3>
      {notice.value==='success' && <div class="alert success">{t('form.success')}</div>}
      {notice.value==='error' && <div class="alert error">{t('form.error')}</div>}
      <div class="grid">
        <label>
          <span>{t('form.name')}</span>
          <input required value={form.value.name} onInput={(e:any)=>form.value.name=e.target.value} />
        </label>
        <label>
          <span>{t('form.phone')}</span>
          <input required placeholder="+998xx xxx xx xx" value={form.value.phone} onInput={(e:any)=>form.value.phone=e.target.value} />
        </label>
        <label>
          <span>{t('form.date')}</span>
          <input type="date" required value={form.value.date} onInput={(e:any)=>form.value.date=e.target.value} />
        </label>
        <label>
          <span>{t('form.guests')}</span>
          <input type="number" min="1" value={form.value.guests} onInput={(e:any)=>form.value.guests=e.target.value} />
        </label>
        <label>
          <span>{t('form.hall')}</span>
          <select required value={form.value.hall} onChange={(e:any)=>form.value.hall=e.target.value}>
            <option value="">—</option>
            <option value="500">500</option>
            <option value="50">50</option>
            <option value="20">20</option>
            <option value="unknown">Aniq emas</option>
          </select>
        </label>
        {/* honeypot */}
        <input class="hp" tabIndex={-1} autoComplete="off" value={form.value.hp} onInput={(e:any)=>form.value.hp=e.target.value} />
      </div>
      <button class="btn primary" disabled={sending.value} type="submit">{sending.value ? '...' : t('form.submit')}</button>
    </form>
  )
})
