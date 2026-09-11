/**
 * Wordmark tipográfica de "Aromas Córdoba" — reemplaza el logo gráfico
 * (imagen /logo-aura.png, que era el logo de Aura y generaba confusión de
 * marca en un sitio ahora independiente). Cormorant Garamond itálica, la
 * misma fuente "display" que ya usa el resto del sitio.
 */
function Wordmark({ size = 36, dark = false }) {
  const nameSize  = size * 0.62
  const subSize   = Math.max(9, size * 0.2)
  const nameColor = dark ? 'text-white' : 'text-primary-800 dark:text-white'
  const subColor  = dark ? 'text-accent-300' : 'text-accent-600 dark:text-accent-300'

  return (
    <span className="flex flex-col leading-none select-none">
      <span
        className={`font-display italic font-medium ${nameColor}`}
        style={{ fontSize: nameSize, lineHeight: 1 }}
      >
        Aromas
      </span>
      <span
        className={`font-sans font-semibold uppercase ${subColor}`}
        style={{ fontSize: subSize, letterSpacing: '0.3em', lineHeight: 1.6 }}
      >
        Córdoba
      </span>
    </span>
  )
}

export function LogoMark({ size = 36, dark = false }) {
  return <Wordmark size={size} dark={dark} />
}

export function LogoFull({ dark = false, size = 36 }) {
  return <Wordmark size={size * 1.3} dark={dark} />
}

export default function LogoHeader() {
  return <Wordmark size={34} />
}
