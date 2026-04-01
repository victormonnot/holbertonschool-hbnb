import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, Link, useNavigate } from "react-router-dom"
import { MapPin, Star, ArrowLeft, Trash2 } from "lucide-react"
import { getPlace, getPlaceReviews, getUser, createReview, deleteReview, type Place, type Review, type User } from "../lib/api"
import { useAuth } from "../context/AuthContext"

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className="disabled:cursor-default"
        >
          <Star
            className={`w-4 h-4 transition-colors ${
              star <= value
                ? "fill-foreground text-foreground"
                : "text-muted-foreground/25"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    )
  }

  if (!place) return null

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-28">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/places"
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Toutes les destinations
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="aspect-[16/9] bg-card border border-border/20 rounded-2xl mb-6 flex items-center justify-center"
            >
              <MapPin className="w-12 h-12 text-muted-foreground/15" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-4xl font-medium tracking-[-0.03em] mb-3">
                {place.title}
              </h1>

              <div className="flex items-center gap-4 mb-5 flex-wrap">
                {avgRating > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
                    <span>{avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({reviews.length} avis)</span>
                  </div>
                )}
                {owner && (
                  <span className="text-sm text-muted-foreground">
                    H&ocirc;te : {owner.first_name} {owner.last_name}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {place.description || "Aucune description disponible."}
              </p>

              {place.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[13px] font-semibold mb-2">&Eacute;quipements</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {place.amenities.map((a) => (
                      <span
                        key={a.id}
                        className="text-[13px] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="border-t border-border/20 pt-6 mt-6"
            >
              <h2 className="text-xl font-medium tracking-[-0.02em] mb-5">
                <span className="font-serif italic font-normal">Avis</span>
                {reviews.length > 0 && (
                  <span className="text-muted-foreground text-base ml-2">({reviews.length})</span>
                )}
              </h2>

              {/* Review form */}
              {isLoggedIn && !isOwner && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-card rounded-xl border border-border/20">
                  <div className="mb-2.5">
                    <StarRating value={reviewRating} onChange={setReviewRating} />
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={3}
                    placeholder="Partagez votre exp\u00e9rience..."
                    className="w-full bg-transparent border border-border/30 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-foreground/30 transition-colors placeholder:text-muted-foreground/50 resize-none mb-2.5"
                  />
                  {reviewError && (
                    <p className="text-red-400 text-sm mb-2.5">{reviewError}</p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="bg-foreground text-background rounded-lg px-5 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    {submitting ? "Envoi..." : "Publier"}
                  </motion.button>
                </form>
              )}

              {!isLoggedIn && (
                <p className="text-muted-foreground text-sm mb-5">
                  <Link to="/login" className="text-foreground hover:underline">Connectez-vous</Link>{" "}
                  pour laisser un avis.
                </p>
              )}

              {/* Review list */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="flex gap-3 pb-4 border-b border-border/10 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold shrink-0 mt-0.5">
                      {review.user
                        ? review.user.first_name[0] + review.user.last_name[0]
                        : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {review.user
                            ? `${review.user.first_name} ${review.user.last_name}`
                            : "Utilisateur"}
                        </p>
                        {(authUser?.id === review.user_id || isAdmin) && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-muted-foreground/50 hover:text-red-400 transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <StarRating value={review.rating} />
                      <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucun avis pour le moment.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="liquid-glass rounded-2xl p-5 sticky top-24">
              <div className="text-2xl font-medium mb-0.5">
                {place.price.toFixed(0)} &euro;
                <span className="text-sm font-normal text-muted-foreground"> / nuit</span>
              </div>

              <div className="border-t border-border/20 my-4" />

              <div className="space-y-2.5 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latitude</span>
                  <span className="font-mono text-[13px]">{place.latitude.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longitude</span>
                  <span className="font-mono text-[13px]">{place.longitude.toFixed(4)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-foreground text-background rounded-lg py-3 text-sm font-semibold"
              >
                R&eacute;server
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
