import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useSearchParams } from "react-router-dom"
import { MapPin, Star } from "lucide-react"
import { getPlaces, getPlaceReviews, type Place } from "../lib/api"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

function PlaceCard({ place, index }: { place: Place & { avgRating?: number }; index: number }) {
  return (
    <motion.div {...fadeUp(0.05 * index)}>
      <Link
        to={`/places/${place.id}`}
        className="block liquid-glass rounded-2xl overflow-hidden group"
      >
        {/* Image placeholder */}
        <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <MapPin className="w-8 h-8 opacity-30" />
          </div>
          <div className="absolute bottom-3 right-3 bg-foreground text-background text-xs font-semibold px-3 py-1.5 rounded-full">
            {place.price.toFixed(0)} &euro; / nuit
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base group-hover:text-foreground transition-colors leading-tight">
              {place.title}
            </h3>
            {place.avgRating !== undefined && place.avgRating > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
                <span>{place.avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {place.description || "Aucune description"}
          </p>
          {place.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {place.amenities.slice(0, 3).map((a) => (
                <span
                  key={a.id}
                  className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full"
                >
                  {a.name}
                </span>
              ))}
              {place.amenities.length > 3 && (
                <span className="text-xs text-muted-foreground px-1 py-1">
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
        // Fetch average ratings
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
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-28">
      <motion.div {...fadeUp(0)} className="mb-12">
        <h1 className="text-4xl md:text-6xl font-medium tracking-[-2px] mb-3">
          <span className="font-serif italic font-normal">Destinations</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          {query
            ? `R\u00e9sultats pour \u00ab ${query} \u00bb`
            : "Tous les lieux disponibles"}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div {...fadeUp(0)} className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-4">Aucun lieu trouv&eacute;.</p>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Retour &agrave; l&rsquo;accueil
          </Link>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
