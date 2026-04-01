export default function Footer() {
  return (
    <footer className="py-12 px-8 md:px-28 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        &copy; 2026 HolByNB. Tous droits r&eacute;serv&eacute;s.
      </p>
      <div className="flex items-center gap-6">
        {["Confidentialit\u00e9", "Conditions", "Contact"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}
