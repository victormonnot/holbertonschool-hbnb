import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="py-10 px-6 md:px-16 lg:px-28 border-t border-border/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-[13px]">
          &copy; 2026 HolByNB. Tous droits r&eacute;serv&eacute;s.
        </p>
        <div className="flex items-center gap-6">
          {[
            { label: "Confidentialit\u00e9", to: "#" },
            { label: "Conditions", to: "#" },
            { label: "Contact", to: "#" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-muted-foreground text-[13px] hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
