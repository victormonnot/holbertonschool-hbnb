import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, Link, useNavigate } from "react-router-dom"
import { MapPin, Star, ArrowLeft, Trash2 } from "lucide-react"
import { getPlace, getPlaceReviews, getUser, createReview, deleteReview, type Place, type Review, type User } from "../lib/api"
import { useAuth } from "../context/AuthContext"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className="disabled:cursor-default"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= value
                ? "fill-foreground text-foreground"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>()
  const { isLoggedIn, user: authUser, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [place, setPlace] = useState<Place | null>(null)
  const [owner, setOwner] = useState<User | null>(null)
  const [reviews, setReviews] = useState<(Review & { user?: User })[]>([])
  const [loading, setLoading] = useState(true)

  // Review form
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewError, setReviewError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const p = await getPlace(id!)
        setPlace(p)
        const o = await getUser(p.owner_id)
        setOwner(o)
        const revs = await getPlaceReviews(id!)
        const revsWithUsers = await Promise.all(
          revs.map(async (r) => {
            try {
              const u = await getUser(r.user_id)
              return { ...r, user: u }
            } catch {
              return r
            }
          })
        )
        setReviews(revsWithUsers)
      } catch {
        navigate("/places")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0

  const isOwner = authUser?.id === place?.owner_id

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setReviewError("")
    setSubmitting(true)
    try {
      const newReview = await createReview({
        text: reviewText,
        rating: reviewRating,
        place_id: id,
      })
      const u = authUser ? { ...authUser } : undefined
      setReviews((prev) => [{ ...newReview, user: u }, ...prev])
      setReviewText("")
      setReviewRating(5)
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId)
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-6 h-6 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    )
  }

  if (!place) return null

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-28">
      {/* Back link */}
      <motion.div {...fadeUp(0)}>
        <Link
          to="/places"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Toutes les destinations
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Image placeholder */}
          <motion.div
            {...fadeUp(0.05)}
            className="aspect-[16/9] bg-secondary rounded-2xl mb-8 flex items-center justify-center"
          >
            <MapPin className="w-12 h-12 text-muted-foreground/30" />
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <h1 className="text-3xl md:text-5xl font-medium tracking-[-2px] mb-3">
              {place.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              {avgRating > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Star className="w-4 h-4 fill-foreground text-foreground" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({reviews.length} avis)
                  </span>
                </div>
              )}
              {owner && (
                <span className="text-sm text-muted-foreground">
                  H&ocirc;te : {owner.first_name} {owner.last_name}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {place.description || "Aucune description disponible."}
            </p>

            {place.amenities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3">
                  &Eacute;quipements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {place.amenities.map((a) => (
                    <span
                      key={a.id}
                      className="text-sm bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full"
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Reviews */}
          <motion.div {...fadeUp(0.15)} className="border-t border-border/30 pt-8 mt-8">
            <h2 className="text-2xl font-medium tracking-[-1px] mb-6">
              <span className="font-serif italic font-normal">Avis</span>
              {reviews.length > 0 && (
                <span className="text-muted-foreground text-lg ml-2">
                  ({reviews.length})
                </span>
              )}
            </h2>

            {/* Review form */}
            {isLoggedIn && !isOwner && (
              <form onSubmit={handleSubmitReview} className="mb-8">
                <div className="mb-3">
                  <StarRating value={reviewRating} onChange={setReviewRating} />
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  rows={3}
                  placeholder="Partagez votre exp&eacute;rience..."
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground resize-none mb-3"
                />
                {reviewError && (
                  <p className="text-red-400 text-sm mb-3">{reviewError}</p>
                )}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-foreground text-background rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? "Envoi..." : "Publier l\u2019avis"}
                </motion.button>
              </form>
            )}

            {!isLoggedIn && (
              <p className="text-muted-foreground text-sm mb-6">
                <Link to="/login" className="text-foreground hover:underline">
                  Connectez-vous
                </Link>{" "}
                pour laisser un avis.
              </p>
            )}

            {/* Review list */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-border/20 pb-6 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold">
                        {review.user
                          ? review.user.first_name[0] + review.user.last_name[0]
                          : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {review.user
                            ? `${review.user.first_name} ${review.user.last_name}`
                            : "Utilisateur"}
                        </p>
                        <StarRating value={review.rating} />
                      </div>
                    </div>
                    {(authUser?.id === review.user_id || isAdmin) && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-muted-foreground hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm ml-11">
                    {review.text}
                  </p>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucun avis pour le moment.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-2">
          <div className="liquid-glass rounded-2xl p-6 sticky top-28">
            <div className="text-3xl font-medium mb-1">
              {place.price.toFixed(0)} &euro;
              <span className="text-base font-normal text-muted-foreground">
                {" "}/ nuit
              </span>
            </div>

            <div className="border-t border-border/30 my-5" />

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latitude</span>
                <span>{place.latitude.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Longitude</span>
                <span>{place.longitude.toFixed(4)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-foreground text-background rounded-lg py-3.5 text-sm font-semibold"
            >
              R&eacute;server
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
