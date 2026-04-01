import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
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
    <section className="relative py-32 md:py-44 px-6 border-t border-border/30 overflow-hidden">
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
      <div className="absolute inset-0 bg-background/45 z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo icon */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <div className="w-10 h-10 rounded-full border-2 border-foreground/60 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border border-foreground/60" />
          </div>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl font-medium tracking-[-2px] mb-6"
        >
          Commencez{" "}
          <span className="font-serif italic font-normal">l&rsquo;Aventure</span>
        </motion.h2>

        <motion.p {...fadeUp(0.2)} className="text-muted-foreground text-lg mb-10">
          Votre prochaine destination est &agrave; des ann&eacute;es-lumi&egrave;re. Litt&eacute;ralement.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex items-center justify-center gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-foreground text-background rounded-lg px-8 py-3.5 font-semibold text-sm"
          >
            R&eacute;server Maintenant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="liquid-glass rounded-lg px-8 py-3.5 font-semibold text-sm"
          >
            Devenir H&ocirc;te
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
