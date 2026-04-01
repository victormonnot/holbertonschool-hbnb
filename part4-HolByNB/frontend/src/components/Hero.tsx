import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

const avatars = [
  "https://i.pravatar.cc/64?img=1",
  "https://i.pravatar.cc/64?img=2",
  "https://i.pravatar.cc/64?img=3",
]

export default function Hero() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/places${search ? `?q=${encodeURIComponent(search)}` : ""}`)
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
          type="video/mp4"
        />
      </video>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 pt-28 md:pt-32 max-w-4xl mx-auto">
        {/* Avatar row */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-center mb-8">
          <div className="flex -space-x-2 mr-3">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-background object-cover"
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            7 000+ voyageurs nous font d&eacute;j&agrave; confiance
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] mb-6"
        >
          Explorez{" "}
          <span className="font-serif italic font-normal">l&rsquo;Univers</span>{" "}
          avec Nous
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-lg mb-10 max-w-2xl mx-auto"
          style={{ color: "var(--color-hero-subtitle)" }}
        >
          R&eacute;servez des s&eacute;jours uniques sur Mars, la Lune et au-del&agrave;.
          L&rsquo;h&eacute;bergement spatial, repens&eacute; pour les pionniers de demain.
        </motion.p>

        {/* Search form */}
        <motion.form
          {...fadeUp(0.3)}
          onSubmit={handleSearch}
          className="liquid-glass rounded-full p-2 max-w-lg mx-auto flex items-center"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="O&ugrave; voulez-vous aller ?"
            className="flex-1 bg-transparent px-6 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-foreground text-background rounded-full px-8 py-3 text-sm font-semibold"
          >
            EXPLORER
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
