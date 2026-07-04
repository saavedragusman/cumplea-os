import { useEffect, useMemo, useRef, useState, useCallback } from 'react'

/* -------------------------------------------------------------------------- */
/*  Event configuration — edit these to reuse the invitation                  */
/* -------------------------------------------------------------------------- */

const EVENT = {
  honoreeShort: 'Gabriel Andrés',
  honoreeFull: 'Gabriel Andrés Saavedra Luján',
  date: 'Sábado 1 de Agosto',
  time: '3:00 PM a 7:00 PM',
  venue: 'Colegio de Médicos Veterinarios del Zulia',
  city: 'Maracaibo',
  // Full ISO datetime with venue timezone offset (Venezuela = -04:00).
  targetISO: '2026-08-01T15:00:00-04:00',
  mapsQuery: 'Colegio de Médicos Veterinarios del Zulia, Maracaibo',
  // Host WhatsApp number in international format WITHOUT "+" or spaces (e.g. 584121234567).
  hostWhatsapp: '584246890902',
}

// Gabriel photos — auto-loaded from src/assets/gabriel/ sorted by number
const gabrielModules = import.meta.glob('/src/assets/gabriel/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})
const KING_PHOTOS = Object.values(gabrielModules).sort(
  (a, b) => (parseInt(a.match(/(\d+)/)?.[1] ?? '0')) - (parseInt(b.match(/(\d+)/)?.[1] ?? '0')),
)

// Family photos — auto-loaded from src/assets/familia/ sorted alphabetically
const familiaModules = import.meta.glob('/src/assets/familia/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})
const FAMILY_PHOTOS = Object.values(familiaModules).sort()

const STORAGE_KEY = 'manada-gabriel-v1'

/* -------------------------------------------------------------------------- */
/*  Reveal — fade + rise the children in once they scroll into view           */
/* -------------------------------------------------------------------------- */

function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section header — pill badge + title + optional subtitle                    */
/* -------------------------------------------------------------------------- */

function SectionHeader({ badge, badgeIcon, title, subtitle }) {
  return (
    <div className="text-center">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cadmium to-willpower px-5 py-2 font-display text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-md shadow-willpower/30">
          {badgeIcon}
          {badge}
        </span>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-maroon sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={150}>
          <p className="mx-auto mt-3 max-w-md text-lg text-rockspray/80">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Decorative SVGs                                                            */
/* -------------------------------------------------------------------------- */

function Sun({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="#FCF03C">
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * 360
          return (
            <rect
              key={i}
              x="96"
              y="6"
              width="8"
              height="30"
              rx="4"
              transform={`rotate(${a} 100 100)`}
            />
          )
        })}
      </g>
      <circle cx="100" cy="100" r="60" fill="#FF9B15" />
      <circle cx="100" cy="100" r="46" fill="#FCF03C" />
    </svg>
  )
}

function Leaf({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M50 5 C20 25 20 70 50 95 C80 70 80 25 50 5 Z" fill="currentColor" />
      <path d="M50 12 V90" stroke="#1C0001" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M50 30 L34 40 M50 45 L66 55 M50 58 L36 66"
        stroke="#1C0001"
        strokeOpacity="0.2"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  )
}

function Paw({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="currentColor">
      <ellipse cx="50" cy="66" rx="26" ry="21" />
      <circle cx="24" cy="40" r="10" />
      <circle cx="42" cy="26" r="10.5" />
      <circle cx="60" cy="26" r="10.5" />
      <circle cx="76" cy="40" r="10" />
    </svg>
  )
}

function LionCub({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="30" cy="34" r="12" fill="#BB3D02" />
      <circle cx="70" cy="34" r="12" fill="#BB3D02" />
      <circle cx="50" cy="52" r="34" fill="#FF9B15" />
      <circle cx="38" cy="48" r="4.6" fill="#1C0001" />
      <circle cx="62" cy="48" r="4.6" fill="#1C0001" />
      <path d="M44 62 h12 l-6 6 z" fill="#6B120E" />
      <path
        d="M50 68 q-8 6 -14 1 M50 68 q8 6 14 1"
        stroke="#6B120E"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Meerkat({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="52" rx="26" ry="36" fill="#F7C948" />
      <ellipse cx="32" cy="26" rx="9" ry="7" fill="#E8A32C" />
      <ellipse cx="68" cy="26" rx="9" ry="7" fill="#E8A32C" />
      <ellipse cx="50" cy="60" rx="16" ry="20" fill="#FBE7A1" />
      <circle cx="41" cy="44" r="4.4" fill="#1C0001" />
      <circle cx="59" cy="44" r="4.4" fill="#1C0001" />
      <ellipse cx="50" cy="58" rx="5" ry="4" fill="#6B120E" />
    </svg>
  )
}

function Warthog({ className = '' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="52" rx="34" ry="30" fill="#8A4B2A" />
      <path d="M26 60 q-8 8 -2 16" stroke="#5E2F16" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M74 60 q8 8 2 16" stroke="#5E2F16" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="60" rx="20" ry="16" fill="#A9663F" />
      <circle cx="43" cy="60" r="3.6" fill="#3A1B0D" />
      <circle cx="57" cy="60" r="3.6" fill="#3A1B0D" />
      <circle cx="40" cy="42" r="4" fill="#1C0001" />
      <circle cx="60" cy="42" r="4" fill="#1C0001" />
    </svg>
  )
}

// Floating Lion King mascot that hops — sprinkled across sections for a lively feel.
function HopMascot({ src = '/images/reyleon2.png', className = '', flip = false, delay = '0ms' }) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`pointer-events-none absolute z-20 animate-hop select-none ${className}`}
      aria-hidden="true"
    >
      <img
        src={src}
        alt=""
        className={`h-20 w-auto drop-shadow-xl sm:h-28 ${flip ? '-scale-x-100' : ''}`}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Stroke icons                                                               */
/* -------------------------------------------------------------------------- */

const iconStroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const CalendarIcon = (p) => (
  <svg viewBox="0 0 24 24" {...iconStroke} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 9h18M8 3v4M16 3v4" />
    <circle cx="8.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

const ClockIcon = (p) => (
  <svg viewBox="0 0 24 24" {...iconStroke} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

const PinIcon = (p) => (
  <svg viewBox="0 0 24 24" {...iconStroke} {...p}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

const RouteIcon = (p) => (
  <svg viewBox="0 0 24 24" {...iconStroke} {...p}>
    <path d="M3 11l18-8-8 18-2-8-8-2z" />
  </svg>
)

const UsersIcon = (p) => (
  <svg viewBox="0 0 24 24" {...iconStroke} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.6M17 20a5.5 5.5 0 0 0-3-4.9" />
  </svg>
)

const UserPlusIcon = (p) => (
  <svg viewBox="0 0 24 24" {...iconStroke} {...p}>
    <circle cx="9" cy="8" r="3.4" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0M18 8v6M15 11h6" />
  </svg>
)

const SpeakerOn = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
)

const SpeakerOff = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
)

/* Floating mute/unmute button — top-left corner */
function MuteButton({ muted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-rockspray shadow-lg backdrop-blur ring-1 ring-cadmium/20 transition hover:scale-105 hover:bg-white active:scale-95"
      aria-label={muted ? 'Activar sonido' : 'Silenciar'}
    >
      {muted ? <SpeakerOff className="h-5 w-5" /> : <SpeakerOn className="h-5 w-5" />}
    </button>
  )
}

const WhatsappIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.7-4.2-4.9-4.4-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.8 2 .9 2.1.1.2.1.3 0 .5-.1.2-.2.4-.3.5l-.4.5c-.2.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.7.8 2 1 .3.1.5.2.5.3.1.2.1.7-.1 1.2Z" />
  </svg>
)

/* -------------------------------------------------------------------------- */
/*  Full-bleed savanna video band — emerges from the hero background          */
/* -------------------------------------------------------------------------- */

const featherMask =
  'linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)'

function SavannaVideo() {
  const videoRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Reveal delay={120} className="relative left-1/2 mt-14 w-screen -translate-x-1/2">
      <div
        className="relative"
        style={{ WebkitMaskImage: featherMask, maskImage: featherMask }}
      >
        <video
          ref={videoRef}
          className="h-[58vw] max-h-[440px] min-h-[230px] w-full object-cover"
          poster="/images/poster.webp"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Video del pequeño rey en la sabana"
        >
          {shouldLoad && (
            <source src="/images/leoncito.mp4" type="video/mp4" />
          )}
        </video>
        {/* Warm savanna color grade */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-willpower/25 via-transparent to-cadmium/15 mix-blend-multiply" />
        {/* Edge vignette for cinematic depth */}
        <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_120px_40px_rgba(28,0,1,0.35)]" />
        {/* Overlaid tagline */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        </div>
      </div>
      {/* Floating leaves framing the band */}
      <Leaf className="pointer-events-none absolute left-4 top-6 h-14 w-14 animate-sway text-[#7cc59a] opacity-80 sm:left-16" />
      <Leaf className="pointer-events-none absolute bottom-6 right-4 h-16 w-16 animate-float text-[#8fd0a8] opacity-80 sm:right-16" />
    </Reveal>
  )
}

/* -------------------------------------------------------------------------- */
/*  HERO                                                                        */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative pt-10 text-center sm:pt-14">
      {/* Rotating savanna sun behind the portrait */}
      <Sun className="pointer-events-none absolute left-1/2 top-6 h-[26rem] w-[26rem] -translate-x-1/2 animate-spin-slow opacity-25 blur-[1px] sm:h-[34rem] sm:w-[34rem]" />

      <div className="relative">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-rockspray ring-1 ring-cadmium/30 backdrop-blur">
            <span aria-hidden="true">🌴</span> Te invito a mi fiesta{' '}
            <span aria-hidden="true">🌿</span>
          </span>
        </Reveal>

        {/* Circular portrait with rotating color ring + animated color glow */}
        <Reveal delay={140}>
          <div className="relative mx-auto mt-8 h-56 w-56 animate-float sm:h-64 sm:w-64">
            <div
              className="absolute -inset-1 animate-ring rounded-full"
              style={{
                background:
                  'conic-gradient(from 0deg, #F95404, #FF9B15, #FCF03C, #FF9B15, #BB3D02, #F95404)',
              }}
            />
            <img
              src="/images/gabriel2.webp"
              alt={`Retrato de ${EVENT.honoreeShort}`}
              className="absolute inset-[7px] h-[calc(100%-14px)] w-[calc(100%-14px)] animate-glow rounded-full object-cover ring-4 ring-white"
            />
          </div>
        </Reveal>

        <SavannaVideo />

        <Reveal delay={220}>
          <h3 className="title-gradient mt-8 font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-8xl">
           GABRIEL ANDRES SAAVEDRA LUJAN
          </h3>
        </Reveal>

        <Reveal delay={380} className="relative z-0">
          <div className="pointer-events-none relative mx-auto -mb-10 mt-8 w-fit sm:-mb-14">
            <div className="absolute inset-x-0 top-4 bottom-10 -z-10 animate-pulse-soft rounded-full bg-cadmium/40 blur-2xl" />
            <img
              src="/images/reyleon1.webp"
              alt="El Rey León"
              className="mx-auto h-60 w-auto animate-float object-contain drop-shadow-xl sm:h-80"
            />
          </div>
        </Reveal>

        <Reveal delay={460} className="relative z-0">
          <a
            href="#manada"
            className="inline-block rounded-full bg-gradient-to-r from-willpower to-cadmium px-8 py-3 font-display text-2xl font-semibold text-white shadow-lg shadow-willpower/40 transition hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Sumarme a la manada 🐾
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  DETAILS                                                                     */
/* -------------------------------------------------------------------------- */

function DetailCard({ icon: Icon, label, value, emoji, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="group h-full rounded-3xl bg-white/80 p-6 text-center shadow-lg shadow-rockspray/10 ring-1 ring-cadmium/20 backdrop-blur transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-willpower/20">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cadmium to-willpower text-white shadow-md shadow-willpower/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Icon className="h-8 w-8" />
        </div>
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-rockspray">
          {label} <span aria-hidden="true">{emoji}</span>
        </p>
        <p className="mt-2 font-display text-xl font-semibold leading-snug text-maroon">{value}</p>
      </div>
    </Reveal>
  )
}

function Details() {
  return (
    <section className="relative mt-24">
      <HopMascot className="-top-16 right-1 sm:right-6" delay="0ms" />
      <SectionHeader
        badge="Los detalles"
        badgeIcon={<CalendarIcon className="h-4 w-4" />}
        title="La gran aventura"
        subtitle="Todo lo que necesitás saber para acompañarnos en la sabana."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <DetailCard icon={CalendarIcon} label="Fecha" value={EVENT.date} emoji="📅" delay={80} />
        <DetailCard icon={ClockIcon} label="Hora" value={EVENT.time} emoji="⏰" delay={180} />
        <DetailCard icon={PinIcon} label="Lugar" value={EVENT.venue} emoji="📍" delay={280} />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  COUNTDOWN                                                                   */
/* -------------------------------------------------------------------------- */

function useCountdown(targetISO) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, target - now)
  const finished = diff === 0
  const s = Math.floor(diff / 1000)
  return {
    finished,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function CountUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-maroon to-rockspray font-display text-2xl font-bold text-psychedelic shadow-lg shadow-maroon/30 tabular-nums sm:h-24 sm:w-24 sm:rounded-2xl sm:text-4xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-2 font-display text-xs font-semibold uppercase tracking-widest text-rockspray sm:text-sm">
        {label}
      </span>
    </div>
  )
}

function Countdown() {
  const { days, hours, minutes, seconds, finished } = useCountdown(EVENT.targetISO)

  return (
    <section className="relative mt-24 px-4 sm:px-6">
      <HopMascot src="/images/reyleon6.webp" className="-top-16 left-1 sm:left-6" flip delay="400ms" />
      <SectionHeader
        badge="Cuenta regresiva"
        badgeIcon={<ClockIcon className="h-4 w-4" />}
        title="Cada vez falta menos"
        subtitle="El rugido más esperado del año está por llegar."
      />
      <Reveal delay={120}>
        {finished ? (
          <p className="mt-10 text-center font-display text-3xl font-bold text-willpower">
            ¡Hoy es el gran día! 🎉🦁
          </p>
        ) : (
          <div className="mt-10 flex items-center justify-center gap-1.5 sm:gap-5">
            <CountUnit value={days} label="Días" />
            <span className="pb-4 font-display text-xl font-bold text-cadmium sm:pb-6 sm:text-3xl">:</span>
            <CountUnit value={hours} label="Horas" />
            <span className="pb-4 font-display text-xl font-bold text-cadmium sm:pb-6 sm:text-3xl">:</span>
            <CountUnit value={minutes} label="Min" />
            <span className="pb-4 font-display text-xl font-bold text-cadmium sm:pb-6 sm:text-3xl">:</span>
            <CountUnit value={seconds} label="Seg" />
          </div>
        )}
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  HOW TO ARRIVE                                                              */
/* -------------------------------------------------------------------------- */

function HowToArrive() {
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(EVENT.mapsQuery)}&output=embed`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(EVENT.mapsQuery)}`

  return (
    <section className="relative mt-24">
      <HopMascot className="-top-16 right-1 sm:right-6" delay="200ms" />
      <SectionHeader
        badge="Ubicación"
        badgeIcon={<PinIcon className="h-4 w-4" />}
        title="¿Cómo llegar?"
        subtitle={EVENT.venue}
      />

      <Reveal delay={120}>
        <div className="mt-10 overflow-hidden rounded-[2rem] bg-white/80 p-3 shadow-xl shadow-rockspray/10 ring-1 ring-cadmium/20 backdrop-blur">
          <iframe
            title={`Mapa de ${EVENT.venue}`}
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full rounded-2xl border-0 sm:h-80"
          />
          <div className="flex items-center gap-4 px-3 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-willpower to-rockspray text-white shadow-md shadow-willpower/30">
              <PinIcon className="h-5 w-5" />
            </span>
            <div className="text-left">
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-rockspray">
                Dirección
              </p>
              <p className="font-display text-base font-semibold text-maroon">
                {EVENT.venue}, {EVENT.city}
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-7 text-center">
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-willpower to-cadmium px-8 py-4 font-display text-lg font-semibold text-white shadow-lg shadow-willpower/40 transition hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <RouteIcon className="h-5 w-5" /> Abrir ruta en Google Maps
          </a>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lightbox + King gallery                                                    */
/* -------------------------------------------------------------------------- */

function Lightbox({ images, index, onClose, onNav }) {
  const open = index !== null
  const touchX = useRef(null)
  const prevIdx = useRef(index)
  const dirRef = useRef(0)

  /* Track swipe direction synchronously during render so the animation class
     is correct on the very first frame after the index changes. */
  if (open && index !== null && prevIdx.current !== null && index !== prevIdx.current) {
    dirRef.current = index > prevIdx.current ? 1 : -1
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, onNav])

  /* Keep prevIdx in sync after render commits */
  useEffect(() => {
    if (open) prevIdx.current = index
  }, [index, open])

  const handleTouchStart = useCallback(
    (e) => {
      touchX.current = e.touches[0].clientX
    },
    [],
  )

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchX.current === null) return
      const diff = touchX.current - e.changedTouches[0].clientX
      const threshold = 50
      if (Math.abs(diff) > threshold) {
        onNav(diff > 0 ? 1 : -1)
      }
      touchX.current = null
    },
    [onNav],
  )

  if (!open) return null

  const enterAnim =
    dirRef.current === 0
      ? 'animate-pop'
      : dirRef.current > 0
        ? 'animate-slide-from-right'
        : 'animate-slide-from-left'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blackrose/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de fotos"
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30"
      >
        ✕
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNav(-1)
        }}
        aria-label="Anterior"
        className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 sm:left-6"
      >
        ‹
      </button>
      <div
        key={index}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`flex max-h-[82vh] max-w-full items-center justify-center ${enterAnim}`}
      >
        <img
          src={images[index]}
          alt={`Foto ${index + 1} de ${EVENT.honoreeShort}`}
          className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl ring-4 ring-white/20"
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNav(1)
        }}
        aria-label="Siguiente"
        className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 sm:right-6"
      >
        ›
      </button>
      <span className="absolute bottom-5 z-10 rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white">
        {index + 1} / {images.length}
      </span>
    </div>
  )
}

// Show a 3-row preview; the remaining photos live only inside the lightbox.
const KING_PREVIEW = 6

function KingGallery() {
  const [current, setCurrent] = useState(null)
  const nav = useCallback(
    (dir) =>
      setCurrent((i) => (i === null ? i : (i + dir + KING_PHOTOS.length) % KING_PHOTOS.length)),
    [],
  )

  const preview = KING_PHOTOS.slice(0, KING_PREVIEW)
  const hidden = KING_PHOTOS.length - KING_PREVIEW

  return (
    <section className="relative mt-24">
      <HopMascot src="/images/reyleon6.webp" className="-top-16 left-1 sm:left-6" flip delay="600ms" />
      <SectionHeader
        badge="El pequeño rey"
        badgeIcon={<span aria-hidden="true">❤️</span>}
        title="El pequeño rey"
        subtitle="Tocá una foto para verla en grande."
      />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {preview.map((src, i) => {
          const isLast = i === KING_PREVIEW - 1 && hidden > 0
          return (
            <Reveal key={src} delay={(i % 3) * 90}>
              <button
                onClick={() => setCurrent(i)}
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-white p-1.5 shadow-md shadow-rockspray/10 ring-1 ring-cadmium/20 transition duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-willpower focus:outline-none focus-visible:ring-4 focus-visible:ring-willpower"
                aria-label={isLast ? `Ver todas las fotos (${KING_PHOTOS.length})` : `Ampliar foto ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`Foto ${i + 1} de ${EVENT.honoreeShort}`}
                  loading="lazy"
                  className="h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-110"
                />
                {isLast ? (
                  <span className="pointer-events-none absolute inset-1.5 flex flex-col items-center justify-center rounded-xl bg-blackrose/55 text-white backdrop-blur-[1px] transition group-hover:bg-blackrose/65">
                    <span className="font-display text-3xl font-bold">+{hidden}</span>
                    <span className="mt-0.5 font-display text-xs font-semibold uppercase tracking-widest">
                      Ver todas
                    </span>
                  </span>
                ) : (
                  <span className="pointer-events-none absolute inset-1.5 rounded-xl bg-gradient-to-t from-blackrose/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                )}
              </button>
            </Reveal>
          )
        })}
      </div>

      <Lightbox images={KING_PHOTOS} index={current} onClose={() => setCurrent(null)} onNav={nav} />
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  CIRCLE OF LIFE — family photo gallery                                      */
/* -------------------------------------------------------------------------- */

const FAMILY_PREVIEW = 6

function CircleOfLife() {
  const [current, setCurrent] = useState(null)
  const nav = useCallback(
    (dir) =>
      setCurrent((i) =>
        i === null ? i : (i + dir + FAMILY_PHOTOS.length) % FAMILY_PHOTOS.length,
      ),
    [],
  )

  const preview = FAMILY_PHOTOS.slice(0, FAMILY_PREVIEW)
  const hidden = FAMILY_PHOTOS.length - FAMILY_PREVIEW

  return (
    <section className="relative mt-24">
      <HopMascot className="-top-16 right-1 sm:right-6" delay="300ms" />
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cadmium/25 via-butter to-mint/60 p-7 shadow-lg shadow-rockspray/10 ring-1 ring-white/60 sm:p-10">
        <Sun className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 animate-spin-slow opacity-20" />

        {/* Timón (Meerkat) decorativo flotante */}
        <div className="pointer-events-none absolute -left-6 -bottom-4 z-10 animate-float select-none opacity-40">
          <Meerkat className="h-24 w-24 sm:h-28 sm:w-28" />
        </div>

        <SectionHeader
          badge="Galería mágica"
          badgeIcon={<span aria-hidden="true">✨</span>}
          title="El círculo de la vida"
          subtitle="Personajes y escenas que forman parte de mi vida."
        />

        {/* Photo gallery grid — same layout as El pequeño rey */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {preview.map((src, i) => {
            const isLast = i === FAMILY_PREVIEW - 1 && hidden > 0
            return (
              <Reveal key={src} delay={(i % 3) * 90}>
                <button
                  onClick={() => setCurrent(i)}
                  className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-white p-1.5 shadow-md shadow-rockspray/10 ring-1 ring-cadmium/20 transition duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-willpower focus:outline-none focus-visible:ring-4 focus-visible:ring-willpower"
                  aria-label={isLast ? `Ver todas las fotos (${FAMILY_PHOTOS.length})` : `Ampliar foto ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`Foto familiar ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full rounded-xl object-cover transition duration-500 group-hover:scale-110"
                  />
                  {isLast ? (
                    <span className="pointer-events-none absolute inset-1.5 flex flex-col items-center justify-center rounded-xl bg-blackrose/55 text-white backdrop-blur-[1px] transition group-hover:bg-blackrose/65">
                      <span className="font-display text-3xl font-bold">+{hidden}</span>
                      <span className="mt-0.5 font-display text-xs font-semibold uppercase tracking-widest">
                        Ver todas
                      </span>
                    </span>
                  ) : (
                    <span className="pointer-events-none absolute inset-1.5 rounded-xl bg-gradient-to-t from-blackrose/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                  )}
                </button>
              </Reveal>
            )
          })}
        </div>

        <Lightbox
          images={FAMILY_PHOTOS}
          index={current}
          onClose={() => setCurrent(null)}
          onNav={nav}
        />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  LA MANADA — confirmation                                                   */
/* -------------------------------------------------------------------------- */

function loadPack() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function whatsappHref(name, count) {
  const who = name ? ` Somos ${name}` : ''
  const many = count > 1 ? ` (${count} personas)` : ''
  const message = `¡Hola! 🦁 Confirmamos nuestra asistencia al 1er añito de ${EVENT.honoreeShort} el ${EVENT.date}.${who}${many} 🎉🐾`
  const base = EVENT.hostWhatsapp ? `https://wa.me/${EVENT.hostWhatsapp}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(message)}`
}

function Manada({ onRoar }) {
  const [pack, setPack] = useState(loadPack)
  const [name, setName] = useState('')
  const [count, setCount] = useState(1)
  const [justAdded, setJustAdded] = useState(null)
  const [syncing, setSyncing] = useState(true)

  /* Sync from Google Sheets on mount — fallback a localStorage si la API no responde */
  useEffect(() => {
    fetch('/api/manada')
      .then((res) => res.json())
      .then((data) => {
        if (data.entries?.length > 0) {
          const apiPack = data.entries.map((e) => ({
            name: e.nombre,
            count: e.personas,
          }))
          setPack(apiPack)
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(apiPack))
          } catch {
            /* no problem */
          }
        }
      })
      .catch(() => {
        /* API no disponible — mantener datos locales */
      })
      .finally(() => setSyncing(false))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pack))
    } catch {
      /* storage unavailable — counter simply won't persist */
    }
  }, [pack])

  const totalPeople = pack.reduce((sum, e) => sum + (e.count || 1), 0)
  const families = pack.length

  const handleSubmit = (e) => {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return
    const entry = { name: clean, count }

    /* POST a la API (fire-and-forget, no bloquea la UX) */
    fetch('/api/manada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: clean, personas: count }),
    }).catch(() => {
      /* API no disponible — guardado localmente igual */
    })

    setPack((prev) => [...prev, entry])
    setJustAdded(entry)
    setName('')
    setCount(1)
    onRoar?.()
  }

  return (
    <section id="manada" className="relative mt-24 scroll-mt-6">
      <HopMascot src="/images/reyleon6.webp" className="-top-16 left-1 sm:left-6" flip delay="500ms" />
      <SectionHeader
        badge="La manada"
        badgeIcon={<UsersIcon className="h-4 w-4" />}
        title="¿Quiénes rugirán con Gabriel?"
        subtitle="Deja tu nombre y súmate a la manada 🐾"
      />

      {/* Counter card */}
      <Reveal delay={120}>
        <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-willpower via-rockspray to-maroon px-6 py-9 text-center shadow-2xl shadow-rockspray/30">
          <Leaf className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rotate-12 text-cadmium/30" />
          <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-cream/90">
            Confirmados
          </p>
          <p className="mt-1 font-display text-7xl font-bold text-white tabular-nums drop-shadow">
            {syncing ? (
              <span className="inline-block animate-pulse text-5xl opacity-60">—</span>
            ) : (
              totalPeople
            )}
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-cream/90">
            {syncing ? 'Cargando…' : `${families} ${families === 1 ? 'familia' : 'familias'} en la manada`}
          </p>
        </div>
      </Reveal>

      {/* Form card */}
      <Reveal delay={200}>
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-[2rem] bg-white/85 p-6 shadow-xl shadow-rockspray/10 ring-1 ring-cadmium/20 backdrop-blur sm:p-8"
        >
          <label htmlFor="pack-name" className="font-display text-sm font-semibold uppercase tracking-widest text-rockspray">
            Tu nombre
          </label>
          <input
            id="pack-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Familia Saavedra"
            className="mt-2 w-full rounded-2xl border-2 border-cadmium/30 bg-cream/60 px-5 py-3.5 font-display text-lg text-maroon placeholder:text-maroon/40 transition focus:border-willpower focus:outline-none focus:ring-4 focus:ring-willpower/20"
          />

          <p className="mt-5 font-display text-sm font-semibold uppercase tracking-widest text-rockspray">
            Personas
          </p>
          <div className="mt-2 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              aria-label="Quitar una persona"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-cadmium/20 font-display text-2xl font-bold text-rockspray transition hover:bg-cadmium/40 active:scale-95 disabled:opacity-40"
              disabled={count <= 1}
            >
              −
            </button>
            <span className="w-12 text-center font-display text-3xl font-bold text-maroon tabular-nums">
              {count}
            </span>
            <button
              type="button"
              onClick={() => setCount((c) => Math.min(20, c + 1))}
              aria-label="Agregar una persona"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-cadmium/20 font-display text-2xl font-bold text-rockspray transition hover:bg-cadmium/40 active:scale-95"
            >
              +
            </button>
          </div>

          <button
            type="submit"
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-willpower to-cadmium px-8 py-4 font-display text-lg font-bold text-white shadow-lg shadow-willpower/40 transition hover:scale-[1.02] hover:shadow-xl active:scale-95"
          >
            <UserPlusIcon className="h-6 w-6" /> Sumarme a la manada
          </button>

          {justAdded && (
            <div className="mt-5 animate-pop rounded-2xl bg-mint/60 p-4 text-center ring-1 ring-mint">
              <p className="font-display font-semibold text-maroon">
                ¡{justAdded.name} ya ruge con Gabriel! 🦁
              </p>
              <a
                href={whatsappHref(justAdded.name, justAdded.count)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 font-display text-sm font-bold text-white shadow-md transition hover:scale-105 active:scale-95"
              >
                <WhatsappIcon className="h-5 w-5" /> Confirmar también por WhatsApp
              </a>
            </div>
          )}

          <p className="mt-5 text-center text-xs text-maroon/60">
            * Registro guardado en tu dispositivo. Recuerda confirmar también por WhatsApp.
          </p>
        </form>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                        */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [muted, setMuted] = useState(false)
  const [showTapHint, setShowTapHint] = useState(false)
  const bgRef = useRef(null)
  const roarRef = useRef(null)

  /* Initialize audio elements once and wait for user gesture to play */
  useEffect(() => {
    const bg = new Audio('/images/ciclo.mp3')
    bg.loop = true
    bg.volume = 0.25
    bg.preload = 'auto'

    const roar = new Audio('/images/rugido.mp3')
    roar.volume = 0.6
    roar.preload = 'auto'

    bgRef.current = bg
    roarRef.current = roar

    /* No autoplay attempt — browsers always block it today.
       Instead, show the tap hint and unlock on the FIRST click/tap
       anywhere. Capture phase (true) so it fires before any child
       stopPropagation. Use 'click' because it is the most reliable
       event for user-activation-gated playback across all browsers. */
    setShowTapHint(true)

    const unlock = () => {
      bg.play()
        .then(() => {
          setShowTapHint(false)
          setMuted(false)
        })
        .catch(() => {
          /* On some browsers the audio element may need a fresh load. */
          bg.load()
          bg.play().catch(() => {})
          setShowTapHint(false)
          setMuted(false)
        })
      window.removeEventListener('click', unlock, true)
      window.removeEventListener('keydown', unlock, true)
    }
    window.addEventListener('click', unlock, true)
    window.addEventListener('keydown', unlock, true)

    return () => {
      window.removeEventListener('click', unlock, true)
      window.removeEventListener('keydown', unlock, true)
      bg.pause()
      bg.src = ''
      roar.pause()
      roar.src = ''
    }
  }, [])

  const toggleMute = useCallback(() => {
    const bg = bgRef.current
    if (!bg) return
    if (bg.paused) {
      bg.play().catch(() => {})
      setMuted(false)
    } else {
      bg.pause()
      setMuted(true)
    }
  }, [])

  const playRoar = useCallback(() => {
    const roar = roarRef.current
    if (!roar) return
    roar.currentTime = 0
    roar.play().catch(() => {})
  }, [])

  return (
    <div className="savanna-grain relative min-h-screen overflow-x-hidden bg-gradient-to-b from-cream via-butter to-mint font-body text-maroon">
      {/* Ambient decorations */}
      <Leaf className="pointer-events-none absolute -left-8 top-64 h-28 w-28 animate-sway text-[#7cc59a]" />
      <Leaf className="pointer-events-none absolute -right-6 top-[42rem] hidden h-24 w-24 animate-float text-[#8fd0a8] sm:block" />

      <MuteButton muted={muted} onToggle={toggleMute} />

      {showTapHint && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="flex animate-pulse-soft items-center gap-2.5 rounded-full bg-maroon/90 px-6 py-3.5 font-display text-sm font-semibold text-cream shadow-2xl shadow-black/30 ring-1 ring-cadmium/40 backdrop-blur">
            <SpeakerOn className="h-5 w-5 shrink-0 text-psychedelic" />
            Tocá la pantalla para activar la música 🎶
          </div>
        </div>
      )}

      <main className="relative mx-auto max-w-3xl px-5 pb-20">
        <Hero />
        <Details />
        <Countdown />
        <HowToArrive />
        <KingGallery />
        <CircleOfLife />
        <Manada onRoar={playRoar} />

        <footer className="mt-20 text-center">
          <Reveal>
            <p className="font-display text-2xl font-semibold text-rockspray">
              ¡Te esperamos en la sabana! 🦁🌅
            </p>
            <p className="mt-2 text-md text-maroon/60">
              Con amor, la familia de {EVENT.honoreeShort}
            </p>
            <p className="mt-6 text-sm font-display font-semibold tracking-wide text-rockspray/50">
              Desarrollado con amor por{' '}
              <a
                href="https://wa.me/584147359020"
                target="_blank"
                rel="noopener noreferrer"
                className="text-willpower underline decoration-willpower/30 transition hover:decoration-willpower/80"
              >
                Gusman Saavedra
              </a>{' '}
              ❤️
            </p>
          </Reveal>
        </footer>
      </main>
    </div>
  )
}
