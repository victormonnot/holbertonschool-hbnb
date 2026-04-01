import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Hls from "hls.js"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

const HLS_URL =
  "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"

export default function CtaSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(HLS_URL)
      hls.attachMedia(video)
      return () => hls.destroy()
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL
    }
  }, [])

  return (
    <section className="relative py-24 md:py-36 border-t border-border/20 overflow-hidden">
      {/* HLS Background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl mx-auto px-6">
        {/* Logo icon */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <div className="w-10 h-10 rounded-full border-2 border-foreground/60 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border border-foreground/60" />
          </div>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-[-0.04em] leading-[0.95] mb-5"
        >
          Commencez{" "}
          <span className="font-serif italic font-normal">l&rsquo;Aventure</span>
        </motion.h2>

        <motion.p {...fadeUp(0.2)} className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed">
          Votre prochaine destination est &agrave; des ann&eacute;es-lumi&egrave;re. Litt&eacute;ralement.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/places">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block bg-foreground text-background rounded-lg px-7 py-3 font-semibold text-sm cursor-pointer"
            >
              R&eacute;server Maintenant
            </motion.span>
          </Link>
          <Link to="/places/new">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block liquid-glass rounded-lg px-7 py-3 font-semibold text-sm cursor-pointer"
            >
              Devenir H&ocirc;te
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
