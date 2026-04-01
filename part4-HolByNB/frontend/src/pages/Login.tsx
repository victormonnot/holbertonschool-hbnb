import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" },
})

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/places")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <motion.div {...fadeUp(0)} className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-medium tracking-[-2px] mb-3">
            <span className="font-serif italic font-normal">Connexion</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Connectez-vous pour r&eacute;server votre prochain s&eacute;jour spatial.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-3"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-foreground/40 transition-colors placeholder:text-muted-foreground"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-foreground text-background rounded-lg py-3.5 text-sm font-semibold disabled:opacity-50 mt-2"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </motion.button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            &larr; Retour &agrave; l&rsquo;accueil
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
