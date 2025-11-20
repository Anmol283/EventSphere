// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
// import { Settings, User, Mail, Lock, Eye, EyeOff } from "lucide-react"
// import { useRouter } from "next/navigation"

// interface AuthModalProps {
//   isOpen: boolean
//   onClose: () => void
//   type: "login" | "register"
//   userType: "user" | "admin"
// }

// export default function AuthModal({ isOpen, onClose, type, userType }: AuthModalProps) {
//   const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     firstName: "",
//     lastName: "",
//   })
//   const router = useRouter()

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Mock authentication - in real app, this would call an API
//     if (type === "login") {
//       // Simulate successful login
//       localStorage.setItem("userType", userType)
//       localStorage.setItem("isAuthenticated", "true")

//       if (userType === "admin") {
//         router.push("/admin/dashboard")
//       } else {
//         router.push("/user/dashboard")
//       }
//     } else {
//       // Simulate successful registration
//       localStorage.setItem("userType", userType)
//       localStorage.setItem("isAuthenticated", "true")
//       router.push("/user/dashboard")
//     }

//     onClose()
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md animate-scale-in">
//         <DialogHeader>
//           <DialogTitle className="flex items-center space-x-2 font-[var(--font-montserrat)]">
//             {userType === "admin" ? (
//               <Settings className="w-5 h-5 text-primary" />
//             ) : (
//               <User className="w-5 h-5 text-primary" />
//             )}
//             <span>
//               {type === "login" ? "Sign In" : "Create Account"}
//               {userType === "admin" ? " - Admin" : " - User"}
//             </span>
//           </DialogTitle>
//         </DialogHeader>

//         <Card className="border-0 shadow-none">
//           <CardHeader className="px-0 pb-4">
//             <CardDescription>
//               {type === "login"
//                 ? `Welcome back! Sign in to your ${userType} account.`
//                 : `Create your ${userType} account to get started.`}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="px-0">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {type === "register" && (
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">First Name</Label>
//                     <Input
//                       id="firstName"
//                       value={formData.firstName}
//                       onChange={(e) => handleInputChange("firstName", e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">Last Name</Label>
//                     <Input
//                       id="lastName"
//                       value={formData.lastName}
//                       onChange={(e) => handleInputChange("lastName", e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     className="pl-10"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     className="pl-10 pr-10"
//                     value={formData.password}
//                     onChange={(e) => handleInputChange("password", e.target.value)}
//                     required
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               {type === "register" && (
//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="confirmPassword"
//                       type="password"
//                       placeholder="Confirm your password"
//                       className="pl-10"
//                       value={formData.confirmPassword}
//                       onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//               )}

//               <Button type="submit" className="w-full hover-lift">
//                 {type === "login" ? "Sign In" : "Create Account"}
//               </Button>
//             </form>

//             <div className="mt-4 text-center text-sm">
//               <span className="text-muted-foreground">
//                 {type === "login" ? "Don't have an account? " : "Already have an account? "}
//               </span>
//               <Button
//                 variant="link"
//                 className="p-0 h-auto font-normal"
//                 onClick={() => {
//                   // Toggle between login and register
//                 }}
//               >
//                 {type === "login" ? "Sign up" : "Sign in"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </DialogContent>
//     </Dialog>
//   )
// }
