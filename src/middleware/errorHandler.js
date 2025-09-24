// Global error handling middleware for Express
export default function errorHandler(err, req, res, next) {
  // Log the error details to the server console (useful for debugging)
  console.error("Error:", err)

  // Determine HTTP status code (use provided one or default to 500)
  const status = err.status || 500

  // Use error's message if available, otherwise fallback to generic message
  const message = err.message || "Internal Server Error"

  // Check if client expects JSON response (e.g., API request)
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    // Send JSON error response
    return res.status(status).json({ error: message })
  }

  // Otherwise, render an error page (for normal web requests)
  return res.status(status).render("error", { title: "Error", message })
}
