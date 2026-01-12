export function initCounter() {
}

export function animateCounter(element, target, duration = 2000, decimals = 0) {
  if (!element) return

  const start = 0
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = start + (target - start) * eased

    if (decimals > 0) {
      element.textContent = current.toFixed(decimals)
    } else {
      element.textContent = Math.floor(current).toLocaleString()
    }

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

export function animateCounterById(id, target, duration = 2000, decimals = 0) {
  const element = document.getElementById(id)
  animateCounter(element, target, duration, decimals)
}
