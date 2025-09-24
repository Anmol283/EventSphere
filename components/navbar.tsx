import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Event Sphere home">
          <span className="text-lg font-semibold tracking-tight">Event Sphere</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="#events" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Events
          </Link>
          <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  )
}
