// Global error handling middleware for Express
// This function will catch any errors passed to 'next(err)' in the app.
export default function errorHandler(err, req, res, next) {
  // Log the error details to the server console (useful for debugging during development)
  console.error("Error:", err)

  // Set the HTTP status code:
  // If the error object has a 'status' property, use it; otherwise default to 500 (Internal Server Error).
  const status = err.status || 500

  // Extract the error message:
  // If the error object has a 'message', use it; otherwise, provide a generic fallback message.
  const message = err.message || "Internal Server Error"

  // Check if the client expects a JSON response:
  // Look at the 'Accept' header to determine if the request is likely from an API client.
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    // Send JSON-formatted error response for API clients
    return res.status(status).json({ error: message })
  }

  // If the client does not explicitly request JSON (likely a browser request),
  // render an HTML error page using a view template named "error".
  return res.status(status).render("error", { title: "Error", message })
}
