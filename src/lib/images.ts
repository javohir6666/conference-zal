export function deriveSources(url: string) {
  const isUnsplash = /images\.unsplash\.com/.test(url)
  if (isUnsplash) {
    const base = url.replace(/(&?q=)\d+/i, '').replace(/(&?w=)\d+/i, '')
    const mk = (w: number) => `${base}${base.includes('?') ? '&' : '?'}w=${w}&auto=format`
    const toSet = (arr: number[]) => arr.map(w => `${mk(w)} ${w}w`).join(', ')
    return {
      avif: [toSet([800, 1200, 1600])],
      webp: [toSet([800, 1200, 1600])],
      jpg: [mk(1200)],
      sizes: '(max-width: 900px) 100vw, 600px'
    }
  }
  // generic fallback
  return { avif: [] as string[], webp: [] as string[], jpg: [url], sizes: '100vw' }
}
