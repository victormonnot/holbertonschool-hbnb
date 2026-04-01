import { motion } from "framer-motion"
import { Globe, Send, AtSign, LogOut, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-28 h-16"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      {/* Left: Logo + links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full border-2 border-foreground/60 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border border-foreground/60" />
          </div>
          <span className="font-bold text-base tracking-tight">HolByNB</span>
        </Link>

        <div className="hidden md:flex items-center text-[13px]">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Accueil
          </Link>
          <span className="text-muted-foreground/40 mx-2">&bull;</span>
          <Link to="/places" className="text-muted-foreground hover:text-foreground transition-colors">
            Destinations
          </Link>
        </div>
      </div>

      {/* Right: Auth + socials */}
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Link
              to="/places/new"
              className="hidden md:inline-flex text-[13px] text-muted-foreground hover:text-foreground transition-colors mr-2"
            >
              Publier un lieu
            </Link>
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mr-1">
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{user?.first_name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-foreground text-background rounded-full px-5 py-1.5 text-[13px] font-semibold hover:opacity-90 transition-opacity mr-2"
          >
            Connexion
          </Link>
        )}
        <div className="hidden md:flex items-center gap-1.5">
          {[Globe, Send, AtSign].map((Icon, i) => (
            <button
              key={i}
              className="liquid-glass w-9 h-9 rounded-full flex items-center justify-center"
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
