import { useEffect, useState } from 'react'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { fetchAuraShowcase } from '../../services/auraShowcase'
import { useCart }   from '../../context/CartContext'
import { useAuth }   from '../../context/AuthContext'
import { useToast }  from '../../context/ToastContext'

function AuraProductCard({ product }) {
  const { addItem }           = useCart()
  const { canBuy, openLogin } = useAuth()
  const { addToast }          = useToast()

  const handleAdd = () => {
    if (!canBuy) { openLogin(); return }
    const result = addItem(product)
    if (result.status === 'out_of_stock') {
      addToast({ type: 'error', title: 'Sin stock', message: `"${product.name}" no tiene unidades disponibles.` })
    } else if (result.status === 'at_limit') {
      addToast({ type: 'warning', title: 'Límite de stock', message: `Ya tenés las ${result.max} unidades disponibles en el carrito.` })
    } else {
      addToast({ type: 'success', title: 'Agregado al carrito', message: product.name })
    }
  }

  const outOfStock = product.stock === 0

  return (
    <div className="card overflow-hidden flex flex-col sm:flex-row">
      <div className="relative w-full sm:w-40 aspect-square sm:aspect-auto shrink-0 bg-cream-100 dark:bg-navy-800">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover ${outOfStock ? 'opacity-50' : ''}`}
          loading="lazy"
          onError={(e) => { e.target.src = `https://placehold.co/300x300/ede5d8/273145?text=${encodeURIComponent(product.name.slice(0, 2))}` }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight mb-1.5">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            ${product.price.toLocaleString('es-AR')}
          </span>
          {!outOfStock ? (
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-primary-700 hover:bg-primary-800 dark:bg-accent-500 dark:hover:bg-accent-600 text-white py-2 px-3 rounded-lg transition-all active:scale-95"
            >
              <ShoppingCart size={13} /> {canBuy ? 'Agregar' : 'Iniciar sesión'}
            </button>
          ) : (
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded-full">Sin stock</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuraShowcase() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetchAuraShowcase(2, controller.signal)
      .then(setProducts)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('AuraShowcase:', err)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  if (loading || products.length === 0) return null

  return (
    <section className="py-14 bg-cream-200 dark:bg-navy-950">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-accent-400 mb-2">
            <Sparkles size={14} /> De la familia Aura
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-gray-900 dark:text-white">
            También cuidamos tu hogar
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            Una selección de productos de limpieza de Aura, la misma familia de marcas de Aromas Córdoba.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {products.map((p) => (
            <AuraProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
