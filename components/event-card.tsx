import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * EventItem type defines the structure of a single event object.
 * - id: unique identifier for the event.
 * - title: name of the event.
 * - date: date when the event takes place.
 * - location: where the event is happening.
 * - href: optional URL for event details (defaults to "#").
 * - imageQuery: optional string to specify image content (defaults to a placeholder text).
 */
export type EventItem = {
  id: string
  title: string
  date: string
  location: string
  href?: string
  imageQuery?: string
}

/**
 * EventCard component renders a single event in a styled card format.
 * It displays an image, title, date, location, and a "View details" button.
 */
export function EventCard({ event }: { event: EventItem }) {
  // Destructure event properties and provide fallback values for optional fields
  const { title, date, location, href = "#", imageQuery = "concert crowd at night" } = event

  return (
    // Main container card with full height and hidden overflow for a clean design
    <Card className="overflow-hidden h-full">
      
      {/* Card header containing the event image */}
      <CardHeader className="p-0">
        {/* Placeholder image with a fixed height and responsive width.
            'fill' makes the image cover the entire container while preserving aspect ratio. */}
        <div className="relative h-40 w-full">
          <Image
            src="/event-crowd-night.jpg"        // Static placeholder image path
            alt={`Image for ${title}`}          // Accessible alt text using event title
            fill                                 // Enables full container coverage
            sizes="(max-width: 768px) 100vw, 33vw" // Responsive image sizing for different screens
            className="object-cover"             // Ensures image scales and crops nicely
            priority={false}                     // Image is not prioritized for preloading
          />
        </div>
      </CardHeader>

      {/* Card content section with event details */}
      <CardContent className="space-y-2 p-4">
        <CardTitle className="text-base">{title}</CardTitle> {/* Event name */}
        <p className="text-sm text-muted-foreground">{date}</p> {/* Event date in muted text */}
        <p className="text-sm">{location}</p>                   {/* Event location */}
      </CardContent>

      {/* Card footer with a call-to-action button */}
      <CardFooter className="p-4 pt-0">
        {/* Button styled as a link to the event's detailed page */}
        <Button asChild className="w-full">
          <Link href={href} aria-label={`View details for ${title}`}>
            View details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
