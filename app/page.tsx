import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { EventCard, type EventItem } from "@/components/event-card"
import { Button } from "@/components/ui/button"

// Home page component for the Event Sphere app
export default function HomePage() {
  // Sample featured events data (could be fetched from an API in a real app)
  const featuredEvents: EventItem[] = [
    {
      id: "1",
      title: "Tech Innovators Summit",
      date: "Nov 12, 2025 · 9:00 AM",
      location: "San Francisco, CA",
      href: "#",
      imageQuery: "technology conference keynote stage",
    },
    {
      id: "2",
      title: "City Jazz Nights",
      date: "Oct 30, 2025 · 8:00 PM",
      location: "New Orleans, LA",
      href: "#",
      imageQuery: "jazz concert saxophone on stage",
    },
    {
      id: "3",
      title: "Outdoor Food Fest",
      date: "Dec 5, 2025 · 12:00 PM",
      location: "Austin, TX",
      href: "#",
      imageQuery: "food festival stalls outdoors daytime",
    },
  ]

  return (
    <>
      {/* Site navigation bar */}
      <Navbar />

      <main>
        {/* Hero section with tagline and call-to-action buttons */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-pretty text-4xl font-semibold tracking-tight sm:text-5xl">
              Discover. Host. Experience. All your events in one place.
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Event Sphere helps you find unforgettable events and gives organizers the tools to sell tickets, manage
              attendees, and grow their audience.
            </p>

            {/* Buttons to explore events or learn more */}
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="#events" aria-label="Explore events">
                  Explore events
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="#about" aria-label="Learn about Event Sphere">
                  Learn more
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured events section displaying sample events */}
        <section id="events" aria-labelledby="featured-heading" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 id="featured-heading" className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                  Featured events
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Hand-picked experiences happening soon.</p>
              </div>
              {/* Link to browse all events */}
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Browse all events"
              >
                Browse all
              </Link>
            </div>

            {/* Grid layout for event cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        </section>

        {/* About section explaining platform benefits */}
        <section id="about" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Why Event Sphere?</h2>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground md:text-base">
                  <li>Effortless discovery with curated listings and filters</li>
                  <li>Organizer-first tools: ticketing, guest lists, analytics</li>
                  <li>Fast, accessible experience on any device</li>
                </ul>
              </div>
              {/* Highlight organizer features with a call-to-action button */}
              <div className="rounded-lg border bg-card p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Ready to host your next event? Event Sphere gives you a streamlined flow to publish your event, set
                  ticket tiers, and track sales in real-time.
                </p>
                <div className="mt-4">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="#" aria-label="Start hosting on Event Sphere">
                      Start hosting
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact section with email link */}
        <section id="contact" className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Get in touch</h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Questions or feedback? We’d love to hear from you.
            </p>
            <div className="mt-4">
              <Button asChild variant="secondary">
                <a href="mailto:hello@eventsphere.local" aria-label="Email Event Sphere">
                  Email us
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with current year and site name */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Event Sphere. All rights reserved.
        </div>
      </footer>
    </>
  )
}
