import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircleQuestion, X, Send, ArrowRight } from 'lucide-react'
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from '../../config/contact'
import { FREE_THRESHOLD, CORDOBA_COST } from '../../config/shipping'

const money = (n) => `$${n.toLocaleString('es-AR')}`

// Preguntas más típicas de un e-commerce — respuestas fijas, sin backend.
// Si el usuario necesita algo que no está acá, siempre queda la salida a WhatsApp.
const FAQ = [
  {
    q: '¿Cuánto cuesta y tarda el envío?',
    a: () => (
      <>
        Envío a Córdoba Capital: {money(CORDOBA_COST)}, <strong>gratis</strong> en compras
        desde {money(FREE_THRESHOLD)}. Para el resto del país coordinamos por correo o
        encomienda según destino y peso — eso lo vemos por WhatsApp al confirmar el pedido.
        También podés retirar sin cargo por nuestro local.
      </>
    ),
  },
  {
    q: '¿Puedo cambiar o devolver un producto?',
    a: () => (
      <>
        Sí. Si el producto llega con algún problema o no es lo que esperabas, escribinos
        por WhatsApp dentro de los 10 días de recibido y coordinamos el cambio o la
        devolución sin cargo. Para higiene, los productos deben estar sin usar y en su
        envase original.
      </>
    ),
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: () => (
      <>
        Efectivo al recibir o retirar, y transferencia bancaria (te pasamos CBU/alias por
        WhatsApp al confirmar). Por ahora no tenemos pago online con tarjeta.
      </>
    ),
  },
  {
    q: '¿Tienen precios mayoristas?',
    a: () => (
      <>
        Sí, desde 24 unidades por producto con precios especiales para revendedores y
        empresas — podés ver el detalle en{' '}
        <Link to="/mayorista" className="underline font-semibold">Venta Mayorista</Link>.
      </>
    ),
  },
  {
    q: '¿Cuáles son los horarios de atención?',
    a: () => <>Lunes a viernes de 9:00 a 18:00, y sábados de 9:00 a 13:00.</>,
  },
  {
    q: '¿Cómo hago el pedido?',
    a: () => (
      <>
        Agregá los productos al carrito, completá tus datos de envío y elegís cómo pagar.
        Al confirmar se abre WhatsApp con el pedido ya armado para que lo chequeemos juntos
        — no hace falta crear ninguna cuenta.
      </>
    ),
  },
  {
    q: '¿Dónde veo mis pedidos anteriores?',
    a: () => (
      <>
        En <Link to="/mis-pedidos" className="underline font-semibold">Mis Pedidos</Link>{' '}
        (se guardan en este navegador). Si cambiaste de dispositivo, contanos por WhatsApp
        el nombre con el que compraste y te los buscamos.
      </>
    ),
  },
]

function Bubble({ from, children }) {
  const isBot = from === 'bot'
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isBot
            ? 'bg-cream-100 dark:bg-navy-800 text-gray-700 dark:text-gray-200 rounded-tl-sm'
            : 'bg-primary-700 text-white rounded-tr-sm'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default function ChatAssistant() {
  const [open, setOpen]     = useState(false)
  const [history, setHistory] = useState([]) // { q, a }[]
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [history, open])

  const ask = (item) => setHistory((h) => [...h, item])

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Tengo una consulta que el asistente del sitio no me pudo resolver.')}`

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label="Asistente virtual"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-primary-700 hover:bg-primary-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircleQuestion size={24} className="text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-4 sm:left-6 z-40 w-[calc(100vw-2rem)] sm:w-96 max-h-[32rem] bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-cream-200 dark:border-navy-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary-700 text-white px-4 py-3 flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <MessageCircleQuestion size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">Asistente Aromas Córdoba</p>
              <p className="text-xs text-primary-200 leading-tight truncate">Respuestas al instante</p>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3">
            <Bubble from="bot">
              ¡Hola! 👋 Soy el asistente de Aromas Córdoba. Elegí una pregunta de abajo, o si
              preferís hablar con una persona, usá el botón de WhatsApp.
            </Bubble>

            {history.map((h, i) => (
              <div key={i} className="space-y-3">
                <Bubble from="user">{h.q}</Bubble>
                <Bubble from="bot">{h.a()}</Bubble>
              </div>
            ))}

            <div ref={endRef} />
          </div>

          {/* Quick questions */}
          <div className="border-t border-cream-200 dark:border-navy-700 p-3 space-y-2 shrink-0">
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {FAQ.map((item) => (
                <button
                  key={item.q}
                  onClick={() => ask(item)}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary-200 dark:border-navy-600 text-primary-700 dark:text-accent-400 hover:bg-primary-50 dark:hover:bg-navy-800 transition-colors text-left"
                >
                  {item.q}
                </button>
              ))}
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              <Send size={14} /> Hablar con una persona por WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-primary-600 dark:hover:text-accent-400 transition-colors pt-0.5"
            >
              o escribinos por email <ArrowRight size={11} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
