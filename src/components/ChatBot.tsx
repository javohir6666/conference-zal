import { defineComponent, ref, onMounted, nextTick, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { env } from '@/lib/env'

type Msg = { role: 'bot' | 'user', text: string, typing?: boolean }

function detectLang(locale: string, text: string) {
  if (/[А-Яа-яЁё]/.test(text)) return 'ru'
  return locale.startsWith('ru') ? 'ru' : 'uz'
}

function answer(locale: string, q: string) {
  const lang = detectLang(locale, q)
  const tel1 = env('VITE_PHONE_1_HUMAN', '+998 99 408 4408')
  const tel2 = env('VITE_PHONE_2_HUMAN', '+998 99 827 4422')
  const addr = env('VITE_ADDRESS_TEXT', 'Toshkent')
  const hours = env('VITE_WORKING_HOURS', '09:00–21:00')

  const lower = q.toLowerCase()
  const has = (...ks: string[]) => ks.some(k => lower.includes(k))
  if (lang==='uz') {
    if (has('narx','narxlar','price','narxi')) return 'Narxlar sahifasi: /pricing — qisqacha: 500 o\'rin: kelishuv, 50 o\'rin: 500k/soat (5+ soat 400k), 20 o\'rin: 250k/soat (4+ soat 200k).'
    if (has('manzil','qayer','joylashuv','lokatsiya','adres')) return `Manzil: ${addr}. Xarita: /contact`
    if (has('telefon','aloqa','bog\'lan')) return `Telefon: ${tel1}, ${tel2}. Aloqa sahifasi: /contact`
    if (has('ish vaqti','soat','ochiq','working')) return `Ish vaqti: ${hours}`
    if (has('band','bandlik','mavjud','date','sana','booking','ariza','zayavka')) return 'Bandlikni tekshirish uchun ariza qoldiring: /contact (tez javob beramiz).'
    if (has('jihoz','oborud','equipment','mikrofon','projektor','ekran','audio')) return 'Jihozlar: projektor/LED, ekran, audio tizim, mikrofonlar, klikker va boshqalar.'
    if (has('catering','coffee','coffe','katering')) return 'Coffee‑break va catering xizmatlari bor (oldindan kelishiladi).'
    if (has('zal','500','50','20','sig\'im','sigim','vmes')) return 'Zallar: 500 / 50 / 20 o\'rin. Batafsil: /halls/500, /halls/50, /halls/20'
    return `Bu savol bo'yicha operator bilan bog'laning: ${tel1} yoki ${tel2}`
  } else {
    if (has('цена','цены','стоим','прайс','price')) return 'Страница цен: /pricing — кратко: 500 мест: по договоренности, 50 мест: 500k/час (5+ ч 400k), 20 мест: 250k/час (4+ ч 200k).'
    if (has('адрес','где','располож','локац','манзил')) return `Адрес: ${addr}. Карта: /contact`
    if (has('телефон','контакт','связаться')) return `Телефон: ${tel1}, ${tel2}. Контакты: /contact`
    if (has('время','режим','работ','часы')) return `Время работы: ${hours}`
    if (has('занят','доступ','бронь','заявка','дата')) return 'Чтобы проверить доступность, оставьте заявку: /contact (оперативно ответим).'
    if (has('оборуд','микрофон','проектор','экран','аудио','equipment')) return 'Оборудование: проектор/LED, экран, аудио, микрофоны, кликер и др.'
    if (has('кейтер','кофе','coffee')) return 'Coffee‑break и кейтеринг доступны по предварительному согласованию.'
    if (has('зал','500','50','20','вмест')) return 'Залы: 500 / 50 / 20 мест. Подробнее: /halls/500, /halls/50, /halls/20'
    return `По этому вопросу свяжитесь с оператором: ${tel1} или ${tel2}`
  }
}

export default defineComponent(() => {
  const { locale, t, tm } = useI18n()
  const open = ref(false)
  const input = ref('')
  const msgs = ref<Msg[]>([])
  const body = ref<HTMLDivElement|null>(null)
  const tel1 = env('VITE_PHONE_1', '+998994084408')
  const tel1Human = env('VITE_PHONE_1_HUMAN', '+998 99 408 4408')
  const tgLink = env('VITE_SOCIAL_TELEGRAM', '')

  const scrollBottom = async () => { await nextTick(); if (body.value) body.value.scrollTop = body.value.scrollHeight }

  let typingTimer: any = null
  let lastTyping: { msg: Msg, full: string } | null = null
  const typeBot = async (text: string) => {
    // finalize previous typing if exists
    if (lastTyping && lastTyping.msg.typing) {
      lastTyping.msg.text = lastTyping.full
      lastTyping.msg.typing = false
      if (typingTimer) { clearInterval(typingTimer); typingTimer = null }
      await nextTick(); await scrollBottom()
    }
    const msg = reactive<Msg>({ role:'bot', text:'', typing:true })
    msgs.value.push(msg)
    lastTyping = { msg, full: text }
    await scrollBottom()
    await new Promise<void>((resolve) => {
      let i = 0
      if (typingTimer) clearInterval(typingTimer)
      typingTimer = setInterval(async () => {
        msg.text = text.slice(0, ++i)
        await nextTick(); await scrollBottom()
        if (i >= text.length) {
          clearInterval(typingTimer); typingTimer = null
          msg.typing = false
          lastTyping = null
          resolve()
        }
      }, 15)
    })
    await nextTick(); await scrollBottom()
  }

  type LeadStep = 'idle'|'name'|'phone'|'date'|'guests'|'hall'
  const step = ref<LeadStep>('idle')
  const lead: any = ref({ name:'', phone:'', date:'', guests:10, hall:'unknown' })

  const startLead = async () => {
    step.value = 'name'
    await typeBot(t('chat.leadStart'))
  }

  const trySendLead = async () => {
    try {
      const res = await fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(lead.value) })
      if (!res.ok) throw new Error('bad')
      await typeBot(t('chat.leadOk'))
    } catch {
      await typeBot(t('chat.leadErr'))
    } finally {
      step.value = 'idle'
      lead.value = { name:'', phone:'', date:'', guests:10, hall:'unknown' }
    }
  }

  const handleUser = async (q: string) => {
    msgs.value.push({ role:'user', text: q }); await scrollBottom()
    if (step.value !== 'idle') {
      // lead wizard
      if (step.value === 'name') { lead.value.name = q; step.value = 'phone'; await typeBot(t('chat.leadPhone')); return }
      if (step.value === 'phone') { lead.value.phone = q; step.value = 'date'; await typeBot(t('chat.leadDate')); return }
      if (step.value === 'date') { lead.value.date = q; step.value = 'guests'; await typeBot(t('chat.leadGuests')); return }
      if (step.value === 'guests') { const n = parseInt(q.replace(/\D+/g,'')) || 1; lead.value.guests = n; step.value = 'hall'; await typeBot(t('chat.leadHall')); return }
      if (step.value === 'hall') { const v = q.includes('500')?'500':q.includes('50')?'50':q.includes('20')?'20':'unknown'; lead.value.hall = v; await trySendLead(); return }
      return
    }
    const a = answer(locale.value, q)
    await typeBot(a)
  }

  const greet = async () => {
    await typeBot(t('chat.greet'))
    await typeBot(`${t('chat.fastContact')} ${tel1Human}`)
  }

  const send = () => {
    const q = input.value.trim()
    if (!q) return
    input.value = ''
    handleUser(q)
  }

  const quick = (q: string) => { input.value = q; send() }

  const toggle = () => {
    open.value = !open.value
    if (open.value && msgs.value.length === 0) greet()
  }

  // attention animation on load
  const tease = ref(true)
  onMounted(() => {
    setTimeout(()=> tease.value = false, 6000)
  })

  return () => (
    <div>
      <button class={"chat-fab" + (tease.value? ' attn':'')} onClick={toggle} aria-label="chat">
        <Icon icon="mdi:chat-processing-outline" width="24" />
      </button>
      {tease.value && (
        <div class="chat-hint">{t('chat.tapToOpen') || 'Chat'}</div>
      )}
      {open.value && (
        <div class="chat-panel">
          <div class="chat-head">
            <span>{t('chat.title')}</span>
            <button class="chat-x" onClick={toggle}>✕</button>
          </div>
          <div class="chat-body" ref={body}>
            {msgs.value.map((m,i)=> (
              <div class={"chat-msg "+m.role} key={i}>
                {m.text}
                {m.typing && <span style={{marginLeft:'6px',opacity:.7}}>…</span>}
              </div>
            ))}
          </div>
          <div class="chat-quick">
            {(() => {
              const lang = locale.value.startsWith('ru') ? 'ru' : 'uz'
              const arr = tm(lang==='ru' ? 'chat.quickRu' : 'chat.quickUz') as any
              const list = Array.isArray(arr) ? arr as string[] : []
              return list
            })().map((x) => <button onClick={()=> quick(x)}>{x}</button>)}
            <button onClick={startLead} style={{marginLeft:'auto'}}>{t('chat.operator')}</button>
            <a href={`tel:${tel1}`} class="btn" style={{padding:'6px 10px'}}>{t('chat.operatorCall')}</a>
            {tgLink && <a href={tgLink} target="_blank" class="btn" style={{padding:'6px 10px'}} rel="noopener">{t('chat.operatorTg')}</a>}
          </div>
          <div class="chat-input">
            <input placeholder={t('chat.placeholder')} value={input.value} onInput={(e:any)=>input.value=e.target.value} onKeydown={(e:any)=>{ if (e.key==='Enter') send() }} />
            <button onClick={send}><Icon icon="mdi:send" width="18"/></button>
          </div>
        </div>
      )}
    </div>
  )
})
