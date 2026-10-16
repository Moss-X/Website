// Adds on-the-fly resizing + modern formats to Cloudinary URLs; other URLs pass through.
export function cld(url, { w, h, crop = 'fill' } = {}) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  const parts = ['f_auto', 'q_auto', w && `w_${w}`, h && `h_${h}`, (w || h) && `c_${crop}`, crop === 'fill' && 'g_auto']
  return url.replace('/upload/', `/upload/${parts.filter(Boolean).join(',')}/`)
}
