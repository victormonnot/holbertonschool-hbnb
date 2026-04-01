import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

const paragraph1 =
  "Nous construisons un monde o\u00f9 l\u2019aventure rencontre le confort \u2014 o\u00f9 les voyageurs trouvent l\u2019extraordinaire, les h\u00f4tes trouvent leur communaut\u00e9, et chaque s\u00e9jour devient une exp\u00e9rience inoubliable."
const paragraph2 =
  "Une plateforme o\u00f9 exploration, hospitalit\u00e9 et innovation se rejoignent \u2014 avec moins de friction, plus d\u2019immersion et un sens nouveau du voyage."

const highlighted = ["aventure", "rencontre", "confort"]

function WordReveal({
  text,
  highlightWords,
  className,
}: {
  text: string
  highlightWords?: string[]
  className: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.4"],
  })

  const words = text.split(" ")

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word
            key={i}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
            highlight={highlightWords?.includes(word.replace(/[^a-zA-Z\u00C0-\u024F]/g, "")) ?? false}
          />
        )
      })}
    </p>
  )
}

function Word({
  word,
  range,
  progress,
  highlight,
}: {
  word: string
  range: [number, number]
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  highlight: boolean
}) {
  const opacity = useTransform(progress, range, [0.15, 1])

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.3em] ${highlight ? "text-foreground" : ""}`}
    >
      {word}
    </motion.span>
  )
}

export default function MissionSection() {
  return (
    <section className="pt-0 pb-32 md:pb-44 px-6">
      {/* Video */}
      <motion.div {...fadeUp(0)} className="flex justify-center mb-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[800px] aspect-square object-cover rounded-2xl"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* Word-by-word reveal */}
      <div className="max-w-5xl mx-auto">
        <WordReveal
          text={paragraph1}
          highlightWords={highlighted}
          className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-tight"

        />
        <WordReveal
          text={paragraph2}
          className="text-xl md:text-2xl lg:text-3xl font-medium mt-10 leading-tight"
        />
      </div>
    </section>
  )
}
