import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MapPin, Star, ArrowRight } from "lucide-react"
import { getPlaces, getPlaceReviews, type Place } from "../lib/api"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

export default function VoyageSection() {
  const [places, setPlaces] = useState<(Place & { avgRating: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getPlaces()
        const first3 = data.slice(0, 3)
        const withRatings = await Promise.all(
          first3.map(async (place) => {
            try {
              const reviews = await getPlaceReviews(place.id)
              const avg = reviews.length > 0
                ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                : 0
              return { ...place, avgRating: avg }
            } catch {
              return { ...place, avgRating: 0 }
            }
          })
        )
        setPlaces(withRatings)
      } catch {
        setPlaces([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="pt-32 md:pt-44 pb-12 md:pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-28">
        {/* Header */}
        <motion.h2
          {...fadeUp(0)}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-[-0.04em] leading-[0.95] mb-5 text-center"
        >
          Le voyage a{" "}
          <span className="font-serif italic font-normal">chang&eacute;.</span>{" "}
          Et vous ?
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-16 md:mb-20 text-center leading-relaxed"
        >
          L&rsquo;espace n&rsquo;est plus r&eacute;serv&eacute; aux astronautes.
          D&eacute;couvrez les nouvelles fa&ccedil;ons de voyager, habiter et vivre
          au-del&agrave; de la Terre.
        </motion.p>

        {/* Place cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : places.length === 0 ? (
          <motion.p {...fadeUp(0.2)} className="text-muted-foreground text-sm text-center py-16">
            Aucune destination disponible pour le moment.
          </motion.p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-12">
            {places.map((place, i) => (
              <motion.div key={place.id} {...fadeUp(0.1 + i * 0.08)}>
                <Link
                  to={`/places/${place.id}`}
                  className="block group rounded-2xl overflow-hidden bg-card border border-border/20 hover:border-border/50 transition-all duration-300"
                >
                  {/* Image area */}
                  <div className="aspect-[4/3] bg-secondary/60 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                    {/* Price badge */}
                    <div className="absolute bottom-3 left-3 bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-full">
                      {place.price.toFixed(0)} &euro; / nuit
                    </div>
                    {/* Rating badge */}
                    {place.avgRating > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/70 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-foreground text-foreground" />
                        {place.avgRating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-[15px] mb-1.5 group-hover:text-foreground transition-colors">
                      {place.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {place.description || "Aucune description"}
                    </p>
                    {place.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {place.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a.id}
                            className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View all link */}
        <motion.div {...fadeUp(0.4)} className="text-center">
          <Link
            to="/places"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Voir toutes les destinations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
