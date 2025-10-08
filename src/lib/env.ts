export function env(key: string, fallback = ''): string {
  // Vite client-side env
  // Only VITE_* keys are exposed to client.
  const val = (import.meta as any).env?.[key]
  return (val ?? fallback) as string
}

export function num(key: string, fallback: number): number {
  const s = env(key, '')
  const n = parseFloat(String(s))
  return Number.isFinite(n) ? n : fallback
}

export function envList(prefix: string, countKey?: string, defaultList: string[] = [], max = 12): string[] {
  const list: string[] = []
  const cnt = countKey ? Number(num(countKey, 0)) : 0
  const limit = cnt > 0 ? Math.min(cnt, max) : max
  for (let i = 1; i <= limit; i++) {
    const v = env(`${prefix}${i}`, '')
    if (v) list.push(v)
  }
  return list.length ? list : defaultList
}
