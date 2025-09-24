import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export type EventItem = {
  id: string
  title: string
  date: string
  location: string
  href?: string
  imageQuery?: string
}

export function EventCard({ event }: { event: EventItem }) {
  const { title, date, location, href = "#", imageQuery = "concert crowd at night" } = event

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-0">
        {/* Using placeholder image with a hard-coded query and fixed dimensions */}
        <div className="relative h-40 w-full">
          <Image
            src="/event-crowd-night.jpg"
            alt={`Image for ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{date}</p>
        <p className="text-sm">{location}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={href} aria-label={`View details for ${title}`}>
            View details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
