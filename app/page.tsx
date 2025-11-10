// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar, Users, Settings, LogIn, UserPlus, ArrowRight, Clock, MapPin } from "lucide-react"
// import AuthModal from "@/components/auth-modal"
// import Link from "next/link"

// export default function HomePage() {
//   const [authModal, setAuthModal] = useState<{
//     isOpen: boolean
//     type: "login" | "register"
//     userType: "user" | "admin"
//   }>({
//     isOpen: false,
//     type: "login",
//     userType: "user",
//   })

//   const featuredEvents = [
//     {
//       id: 1,
//       title: "Tech Innovation Summit 2024",
//       date: "2024-03-15",
//       time: "09:00 AM",
//       location: "San Francisco Convention Center",
//       description: "Join industry leaders for cutting-edge technology discussions and networking.",
//       image: "/tech-conference-modern-stage.jpg",
//       category: "Technology",
//       attendees: 1250,
//     },
//     {
//       id: 2,
//       title: "Digital Marketing Masterclass",
//       date: "2024-03-22",
//       time: "02:00 PM",
//       location: "Virtual Event",
//       description: "Learn advanced digital marketing strategies from top industry experts.",
//       image: "/digital-marketing-presentation.png",
//       category: "Marketing",
//       attendees: 850,
//     },
//     {
//       id: 3,
//       title: "Startup Pitch Competition",
//       date: "2024-03-28",
//       time: "06:00 PM",
//       location: "Innovation Hub NYC",
//       description: "Watch promising startups pitch their ideas to top investors.",
//       image: "/startup-pitch-presentation-stage.jpg",
//       category: "Business",
//       attendees: 500,
//     },
//   ]

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Navigation */}
//       <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                 <Calendar className="w-5 h-5 text-primary-foreground" />
//               </div>
//               <span className="text-xl font-bold font-[var(--font-montserrat)] text-foreground">Event Sphere</span>
//             </div>

//             <div className="hidden md:flex items-center space-x-8">
//               <Link href="#events" className="text-muted-foreground hover:text-foreground transition-colors">
//                 Events
//               </Link>
//               <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
//                 About
//               </Link>
//               <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
//                 Contact
//               </Link>
//             </div>

//             <div className="flex items-center space-x-3">
//               <Button
//                 variant="ghost"
//                 onClick={() => setAuthModal({ isOpen: true, type: "login", userType: "user" })}
//                 className="hover-lift"
//               >
//                 <LogIn className="w-4 h-4 mr-2" />
//                 User Login
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setAuthModal({ isOpen: true, type: "login", userType: "admin" })}
//                 className="hover-lift"
//               >
//                 <Settings className="w-4 h-4 mr-2" />
//                 Admin
//               </Button>
//               <Button
//                 onClick={() => setAuthModal({ isOpen: true, type: "register", userType: "user" })}
//                 className="bg-primary hover:bg-primary/90 hover-lift"
//               >
//                 <UserPlus className="w-4 h-4 mr-2" />
//                 Sign Up
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative py-20 px-4 sm:px-6 lg:px-8 animate-fade-in">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="animate-slide-up">
//             <h1 className="text-5xl md:text-6xl font-black font-[var(--font-montserrat)] text-foreground mb-6 text-balance">
//               Professional Event
//               <span className="text-primary block">Management Platform</span>
//             </h1>
//             <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
//               Streamline your event planning with our comprehensive platform featuring dual dashboards, calendar
//               integration, and professional-grade tools for both organizers and attendees.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button
//                 size="lg"
//                 className="bg-primary hover:bg-primary/90 hover-lift text-lg px-8 py-3"
//                 onClick={() => setAuthModal({ isOpen: true, type: "register", userType: "user" })}
//               >
//                 Get Started Free
//                 <ArrowRight className="w-5 h-5 ml-2" />
//               </Button>
//               <Button size="lg" variant="outline" className="hover-lift text-lg px-8 py-3 bg-transparent">
//                 Watch Demo
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16 animate-slide-up">
//             <h2 className="text-4xl font-bold font-[var(--font-montserrat)] text-foreground mb-4">
//               Powerful Features for Every User
//             </h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Whether you're an event organizer or attendee, our platform provides the tools you need.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             <Card className="hover-lift animate-scale-in border-border/50">
//               <CardHeader>
//                 <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
//                   <Calendar className="w-6 h-6 text-primary" />
//                 </div>
//                 <CardTitle className="font-[var(--font-montserrat)]">Smart Calendar Integration</CardTitle>
//                 <CardDescription>
//                   View, schedule, and manage events with our intuitive calendar interface.
//                 </CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover-lift animate-scale-in border-border/50" style={{ animationDelay: "0.1s" }}>
//               <CardHeader>
//                 <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
//                   <Users className="w-6 h-6 text-secondary" />
//                 </div>
//                 <CardTitle className="font-[var(--font-montserrat)]">Dual Dashboard System</CardTitle>
//                 <CardDescription>Separate, optimized dashboards for event organizers and attendees.</CardDescription>
//               </CardHeader>
//             </Card>

//             <Card className="hover-lift animate-scale-in border-border/50" style={{ animationDelay: "0.2s" }}>
//               <CardHeader>
//                 <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
//                   <Settings className="w-6 h-6 text-accent" />
//                 </div>
//                 <CardTitle className="font-[var(--font-montserrat)]">Professional Tools</CardTitle>
//                 <CardDescription>
//                   Advanced event management features with real-time analytics and reporting.
//                 </CardDescription>
//               </CardHeader>
//             </Card>
//           </div>
//         </div>
//       </section>

//       {/* Featured Events */}
//       <section id="events" className="py-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold font-[var(--font-montserrat)] text-foreground mb-4">Featured Events</h2>
//             <p className="text-xl text-muted-foreground">
//               Discover upcoming events and join thousands of professionals.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {featuredEvents.map((event, index) => (
//               <Card
//                 key={event.id}
//                 className="hover-lift animate-scale-in overflow-hidden border-border/50"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className="aspect-video relative overflow-hidden">
//                   <img
//                     src={event.image || "/placeholder.svg"}
//                     alt={event.title}
//                     className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                   />
//                   <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
//                     {event.category}
//                   </Badge>
//                 </div>
//                 <CardHeader>
//                   <CardTitle className="font-[var(--font-montserrat)] text-lg">{event.title}</CardTitle>
//                   <CardDescription className="text-sm">{event.description}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2 text-sm text-muted-foreground">
//                     <div className="flex items-center">
//                       <Clock className="w-4 h-4 mr-2" />
//                       {event.date} at {event.time}
//                     </div>
//                     <div className="flex items-center">
//                       <MapPin className="w-4 h-4 mr-2" />
//                       {event.location}
//                     </div>
//                     <div className="flex items-center">
//                       <Users className="w-4 h-4 mr-2" />
//                       {event.attendees} attendees
//                     </div>
//                   </div>
//                   <Button className="w-full mt-4 hover-lift bg-transparent" variant="outline">
//                     Learn More
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="flex items-center justify-center space-x-2 mb-4">
//             <div className="w-8 h-8 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
//               <Calendar className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-bold font-[var(--font-montserrat)]">Event Sphere</span>
//           </div>
//           <p className="text-primary-foreground/80 mb-4">Professional event management made simple.</p>
//           <p className="text-primary-foreground/60 text-sm">© 2024 Event Sphere. All rights reserved.</p>
//         </div>
//       </footer>

//       <AuthModal
//         isOpen={authModal.isOpen}
//         onClose={() => setAuthModal({ ...authModal, isOpen: false })}
//         type={authModal.type}
//         userType={authModal.userType}
//       />
//     </div>
//   )
// }
