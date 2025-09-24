document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("year")
  if (y) y.textContent = new Date().getFullYear()

  // Auto dismiss alerts after 4s
  const bootstrap = window.bootstrap // Declare the bootstrap variable
  setTimeout(() => {
    document.querySelectorAll(".alert").forEach((el) => {
      const alert = bootstrap.Alert.getOrCreateInstance(el)
      try {
        alert.close()
      } catch {}
    })
  }, 4000)
})
