import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

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
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 rounded-full border-2 border-foreground/60 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-foreground/60" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-[-0.04em] mb-2">
            <span className="font-serif italic font-normal">Connexion</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Connectez-vous pour acc&eacute;der &agrave; la plateforme.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2.5 px-4"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-[13px] text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-card border border-border/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-foreground/30 transition-colors placeholder:text-muted-foreground/60"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block text-[13px] text-muted-foreground mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-card border border-border/40 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-foreground/30 transition-colors placeholder:text-muted-foreground/60"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50 mt-1"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </motion.button>
        </form>

        <p className="text-center text-muted-foreground text-[13px] mt-8">
          <Link to="/" className="hover:text-foreground transition-colors">
            &larr; Retour &agrave; l&rsquo;accueil
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
