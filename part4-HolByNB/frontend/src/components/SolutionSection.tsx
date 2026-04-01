import { motion } from "framer-motion"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

const features = [
  {
    title: "S\u00e9jours Curat\u00e9s",
    desc: "Des logements tri\u00e9s sur le volet, de la capsule martienne au d\u00f4me lunaire.",
  },
  {
    title: "Outils H\u00f4tes",
    desc: "G\u00e9rez vos propri\u00e9t\u00e9s extraterrestres avec un tableau de bord intuitif.",
  },
  {
    title: "Communaut\u00e9",
    desc: "Rejoignez un r\u00e9seau de voyageurs et d\u2019h\u00f4tes passionn\u00e9s par l\u2019espace.",
  },
  {
    title: "R\u00e9servation Instantan\u00e9e",
    desc: "Disponibilit\u00e9 en temps r\u00e9el, confirmation imm\u00e9diate, d\u00e9collage garanti.",
  },
]

export default function SolutionSection() {
  return (
    <section className="py-24 md:py-36 border-t border-border/20">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-28">
        <motion.p
          {...fadeUp(0)}
          className="text-[11px] tracking-[3px] uppercase text-muted-foreground mb-4"
        >
          LA PLATEFORME
        </motion.p>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-[-0.04em] leading-[0.95] mb-10 md:mb-14"
        >
          L&rsquo;h&eacute;bergement spatial{" "}
          <span className="font-serif italic font-normal">r&eacute;invent&eacute;</span>
        </motion.h2>

        {/* Video */}
        <motion.div {...fadeUp(0.2)} className="mb-12 md:mb-16">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-2xl aspect-[3/1] object-cover"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feat, i) => (
            <motion.div key={feat.title} {...fadeUp(0.15 + i * 0.06)}>
              <h3 className="font-semibold text-[15px] mb-2">{feat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
