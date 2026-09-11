// ------------------------------------------------------------
// Vidriera de productos de limpieza "Aura" en la Home.
// Fetch INDEPENDIENTE contra el catálogo "aura" del panel — no pasa
// por ProductsContext (que sigue apuntando siempre al catálogo
// principal "aromas"). No se muestra ni se agrega al carrito nada
// que no tenga imagen real cargada en el panel.
// ------------------------------------------------------------
const BASE = (import.meta.env.VITE_CATALOG_API_URL || '').replace(/\/$/, '')

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function toShowcaseProduct(prod, variante) {
  const precios = variante.precios || {}
  const minorista =
    num(precios.minorista?.precio) ||
    num(Object.values(precios)[0]?.precio)
  const mayorista = num(precios.mayorista?.precio) || minorista

  return {
    // prefijado para no chocar nunca con ids del catálogo "aromas"
    id: `aura-${variante.sku || prod.id}`,
    catalog: 'aura',
    sku: variante.sku || null,
    name: prod.nombre,
    brand: prod.marca || 'Aura',
    description: prod.descripcion || '',
    price: minorista,
    wholesalePrice: mayorista,
    stock: num(variante.stock),
    image: prod.imagenes[0],
  }
}

/** Trae hasta `limit` productos del catálogo "aura" con imagen y stock. */
export async function fetchAuraShowcase(limit = 2, signal) {
  if (!BASE) return []

  const res = await fetch(`${BASE}/api/publico/aura/productos?limit=50`, { signal })
  if (!res.ok) throw new Error(`Catálogo Aura: HTTP ${res.status}`)
  const { productos = [] } = await res.json()

  const items = []
  for (const prod of productos) {
    if (!prod.imagenes?.length) continue
    const variante = (prod.presentaciones || []).find((v) => v.disponible)
    if (!variante) continue
    items.push(toShowcaseProduct(prod, variante))
    if (items.length >= limit) break
  }
  return items
}
