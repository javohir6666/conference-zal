export function initReveal() {
  if (typeof window === 'undefined') return
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
  if (!('IntersectionObserver' in window) || els.length === 0) return els.forEach(el => el.classList.add('in'))
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 })
  els.forEach(el => io.observe(el))
}

