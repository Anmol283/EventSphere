// Main JavaScript file for Event Sphere

document.addEventListener("DOMContentLoaded", () => {
  // Auto-hide flash messages after 5 seconds
  const alerts = document.querySelectorAll(".alert")
  alerts.forEach((alert) => {
    setTimeout(() => {
      if (alert && alert.parentNode) {
        alert.style.opacity = "0"
        setTimeout(() => {
          alert.remove()
        }, 300)
      }
    }, 5000)
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Form validation enhancement
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const requiredFields = form.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add("is-invalid")
          isValid = false
        } else {
          field.classList.remove("is-invalid")
        }
      })

      if (!isValid) {
        e.preventDefault()
        showAlert("Please fill in all required fields.", "danger")
      }
    })
  })

  // Delete confirmation for admin panel
  const deleteButtons = document.querySelectorAll(".btn-delete")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (!confirm("Are you sure you want to delete this event?")) {
        e.preventDefault()
      }
    })
  })

  // Save user preferences (removed localStorage - using server sessions instead)
  const saveUserPreferences = () => {
    // Preferences are now saved server-side via Redis sessions
    console.log("User preferences saved to session")
  }

  // Load user preferences (removed localStorage)
  const loadUserPreferences = () => {
    // Preferences are now loaded from server-side Redis sessions
    console.log("User preferences loaded from session")
  }

  // Initialize
  loadUserPreferences()

  // Save preferences before leaving
  window.addEventListener("beforeunload", saveUserPreferences)
})

// Utility function to show alerts
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  const container = document.querySelector("main")
  if (container) {
    container.insertBefore(alertDiv, container.firstChild)

    // Auto-hide after 5 seconds
    setTimeout(() => {
      alertDiv.style.opacity = "0"
      setTimeout(() => {
        alertDiv.remove()
      }, 300)
    }, 5000)
  }
}

// Add loading states to forms
function addLoadingState(form) {
  const submitBtn = form.querySelector('button[type="submit"]')
  if (submitBtn) {
    const originalText = submitBtn.textContent
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...'
    submitBtn.disabled = true

    // Reset after 3 seconds (fallback)
    setTimeout(() => {
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }, 3000)
  }
}

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    // Change icon when toggled
    themeToggle.textContent =
      document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });
}