export default function errorHandler(err, req, res, next) {
  console.error("Error:", err)
  const status = err.status || 500
  const message = err.message || "Internal Server Error"
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(status).json({ error: message })
  }
  return res.status(status).render("error", { title: "Error", message })
}
