import Link from "next/link" // Importing Next.js Link component for client-side navigation

/**
 * Navbar component
 * Renders the top navigation bar with links to different sections of the page.
 */
export function Navbar() {
  return (
    // Sticky header remains at the top of the viewport when scrolling.
    // Uses backdrop-blur for a translucent background effect and border-b for bottom border.
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      
      {/* Navigation container centered with max width and padding for spacing */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        {/* Logo / Brand name linking to the home page */}
        <Link href="/" className="inline-flex items-center gap-2" aria-label="Event Sphere home">
          {/* Site title with larger font, semibold weight, and tight letter spacing */}
          <span className="text-lg font-semibold tracking-tight">Event Sphere</span>
        </Link>

        {/* Navigation links to different sections of the page */}
        <div className="flex items-center gap-6">
          {/* Each link scrolls to a specific section (Events, About, Contact) within the page.
              Hover effect changes text color smoothly using transition-colors. */}
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
