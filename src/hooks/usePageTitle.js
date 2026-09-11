import { useEffect } from 'react'

const BRAND = 'Aromas Córdoba — de la familia Aura'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BRAND}` : BRAND
    return () => { document.title = BRAND }
  }, [title])
}
