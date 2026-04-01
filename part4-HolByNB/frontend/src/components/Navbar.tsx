import { motion } from "framer-motion"
import { Globe, Send, AtSign, LogOut, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const links = [
  { label: "Accueil", to: "/" },
  { label: "Destinations", to: "/places" },
]

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-28 py-4 bg-background/60 backdrop-blur-md"
    >
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border-2 border-foreground/60 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border border-foreground/60" />
          </div>
          <span className="font-bold text-lg">HolByNB</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {links.map((link, i) => (
            <span key={link.to} className="flex items-center gap-1">
              {i > 0 && <span className="text-muted-foreground mx-1">&bull;</span>}
              <Link
                to={link.to}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <Link
              to="/places/new"
              className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Publier un lieu
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{user?.first_name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-foreground text-background rounded-full px-6 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Connexion
          </Link>
        )}
        <div className="hidden md:flex items-center gap-2">
          {[Globe, Send, AtSign].map((Icon, i) => (
            <button
              key={i}
              className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
