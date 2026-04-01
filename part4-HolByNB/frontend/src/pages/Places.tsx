import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useSearchParams } from "react-router-dom"
import { MapPin, Star } from "lucide-react"
import { getPlaces, getPlaceReviews, type Place } from "../lib/api"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" },
})

function PlaceCard({ place, index }: { place: Place & { avgRating?: number }; index: number }) {
  return (
    <motion.div {...fadeUp(0.04 * index)}>
      <Link
        to={`/places/${place.id}`}
        className="block group rounded-2xl overflow-hidden bg-card border border-border/20 hover:border-border/50 transition-all duration-300"
      >
        {/* Image area */}
        <div className="aspect-[4/3] bg-secondary/60 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-muted-foreground/20" />
          </div>
          <div className="absolute bottom-3 left-3 bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-full">
            {place.price.toFixed(0)} &euro; / nuit
          </div>
          {place.avgRating !== undefined && place.avgRating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/70 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 fill-foreground text-foreground" />
              {place.avgRating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-[15px] mb-1.5 group-hover:text-foreground transition-colors">
            {place.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
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
              {place.amenities.length > 3 && (
                <span className="text-[11px] text-muted-foreground px-1">
                  +{place.amenities.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default function Places() {
  const [places, setPlaces] = useState<(Place & { avgRating?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q")?.toLowerCase() ?? ""

  useEffect(() => {
    async function load() {
      try {
        const data = await getPlaces()
        const withRatings = await Promise.all(
          data.map(async (place) => {
            try {
              const reviews = await getPlaceReviews(place.id)
              const avg =
                reviews.length > 0
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

  const filtered = query
    ? places.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.description?.toLowerCase().includes(query) ?? false)
      )
    : places

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-28">
        <motion.div {...fadeUp(0)} className="mb-10">
          <h1 className="text-3xl md:text-5xl font-medium tracking-[-0.04em] mb-2">
            <span className="font-serif italic font-normal">Destinations</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {query
              ? `R\u00e9sultats pour \u00ab\u00a0${query}\u00a0\u00bb`
              : "Tous les lieux disponibles"}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div {...fadeUp(0)} className="text-center py-20">
            <p className="text-muted-foreground mb-4">Aucun lieu trouv&eacute;.</p>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Retour &agrave; l&rsquo;accueil
            </Link>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((place, i) => (
              <PlaceCard key={place.id} place={place} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
