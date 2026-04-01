import { motion } from "framer-motion"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

function MarsIcon() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <circle cx="100" cy="100" r="50" stroke="white" strokeWidth="1" opacity="0.2" />
      <circle cx="100" cy="100" r="20" fill="white" opacity="0.1" />
      <path d="M60 100 Q80 60 100 80 Q120 100 140 70" stroke="white" strokeWidth="1.5" opacity="0.4" fill="none" />
      <circle cx="75" cy="85" r="8" stroke="white" strokeWidth="1" opacity="0.25" />
      <circle cx="125" cy="110" r="12" stroke="white" strokeWidth="1" opacity="0.2" />
    </svg>
  )
}

function StationIcon() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="80" ry="30" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <ellipse cx="100" cy="100" rx="50" ry="50" stroke="white" strokeWidth="1" opacity="0.2" />
      <rect x="85" y="70" width="30" height="60" rx="8" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <line x1="60" y1="100" x2="85" y2="100" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="115" y1="100" x2="140" y2="100" stroke="white" strokeWidth="1" opacity="0.3" />
      <rect x="45" y="90" width="15" height="20" rx="3" stroke="white" strokeWidth="1" opacity="0.25" />
      <rect x="140" y="90" width="15" height="20" rx="3" stroke="white" strokeWidth="1" opacity="0.25" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="1.5" opacity="0.3" />
      <circle cx="85" cy="80" r="15" stroke="white" strokeWidth="1" opacity="0.15" />
      <circle cx="120" cy="110" r="20" stroke="white" strokeWidth="1" opacity="0.15" />
      <circle cx="90" cy="120" r="10" stroke="white" strokeWidth="1" opacity="0.1" />
      <circle cx="110" cy="75" r="6" fill="white" opacity="0.05" />
      <path d="M130 50 Q160 100 130 150" stroke="white" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
    </svg>
  )
}

const destinations = [
  {
    Icon: MarsIcon,
    name: "Mars Colony",
    desc: "Des habitats pressuris\u00e9s avec vue sur Olympus Mons. Le luxe martien, sans compromis.",
  },
  {
    Icon: StationIcon,
    name: "Station Orbitale",
    desc: "S\u00e9journez en apesanteur avec panorama terrestre \u00e0 360\u00b0. L\u2019h\u00f4tel qui tourne autour du monde.",
  },
  {
    Icon: MoonIcon,
    name: "Base Lunaire",
    desc: "Crat\u00e8res, silence absolu et ciel \u00e9toil\u00e9 permanent. La retraite ultime.",
  },
]

export default function VoyageSection() {
  return (
    <section className="pt-52 md:pt-64 pb-6 md:pb-9 px-6 text-center">
      <motion.h2
        {...fadeUp(0)}
        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] mb-6"
      >
        Le voyage a{" "}
        <span className="font-serif italic font-normal">chang&eacute;.</span>{" "}
        Et vous ?
      </motion.h2>

      <motion.p
        {...fadeUp(0.1)}
        className="text-muted-foreground text-lg max-w-2xl mx-auto mb-24"
      >
        L&rsquo;espace n&rsquo;est plus r&eacute;serv&eacute; aux astronautes.
        D&eacute;couvrez les nouvelles fa&ccedil;ons de voyager, habiter et vivre
        au-del&agrave; de la Terre.
      </motion.p>

      {/* Destination cards */}
      <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-20 max-w-5xl mx-auto">
        {destinations.map((dest, i) => (
          <motion.div key={dest.name} {...fadeUp(0.1 * (i + 1))} className="flex flex-col items-center">
            <dest.Icon />
            <h3 className="font-semibold text-base mb-2 mt-6">{dest.name}</h3>
            <p className="text-muted-foreground text-sm max-w-xs">{dest.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.p {...fadeUp(0.4)} className="text-muted-foreground text-sm text-center">
        Si vous ne r&eacute;servez pas votre place, quelqu&rsquo;un d&rsquo;autre le fera.
      </motion.p>
    </section>
  )
}
