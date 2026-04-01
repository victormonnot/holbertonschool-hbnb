import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { createPlace, getAmenities, type Amenity } from "../lib/api"
import { useAuth } from "../context/AuthContext"

export default function CreatePlace() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login")
      return
    }
    getAmenities().then(setAmenities).catch(() => {})
  }, [isLoggedIn, navigate])

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const place = await createPlace({
        title,
        description,
        price: parseFloat(price),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        amenities: selectedAmenities,
      })
      navigate(`/places/${place.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full bg-card border border-border/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-foreground/30 transition-colors placeholder:text-muted-foreground/50"

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-lg mx-auto px-6">
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
            Retour
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <h1 className="text-2xl md:text-4xl font-medium tracking-[-0.03em] mb-1.5">
            Publier un{" "}
            <span className="font-serif italic font-normal">lieu</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Ajoutez votre propri&eacute;t&eacute; &agrave; la plateforme.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 rounded-lg py-2.5 px-4">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[13px] text-muted-foreground mb-1.5">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
              placeholder="Ex: D\u00f4me Lunaire avec vue"
            />
          </div>

          <div>
            <label className="block text-[13px] text-muted-foreground mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="D\u00e9crivez votre lieu..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[13px] text-muted-foreground mb-1.5">Prix (&euro;/nuit)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="1"
                step="0.01"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[13px] text-muted-foreground mb-1.5">Latitude</label>
              <input
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                step="any"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[13px] text-muted-foreground mb-1.5">Longitude</label>
              <input
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                step="any"
                className={inputClass}
              />
            </div>
          </div>

          {amenities.length > 0 && (
            <div>
              <label className="block text-[13px] text-muted-foreground mb-2">&Eacute;quipements</label>
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAmenity(a.id)}
                    className={`text-[13px] px-3 py-1 rounded-full border transition-colors ${
                      selectedAmenities.includes(a.id)
                        ? "bg-foreground text-background border-foreground"
                        : "border-border/50 text-muted-foreground hover:border-foreground/30"
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50 mt-2"
          >
            {loading ? "Publication..." : "Publier le lieu"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  )
}
