export function animateCounter(element, target, duration = 2000, decimals = 0) {
  if (!element) return

  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = target * eased

    element.textContent = decimals > 0
      ? current.toFixed(decimals)
      : Math.floor(current).toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

export function animateCounterById(id, target, duration = 2000, decimals = 0) {
  animateCounter(document.getElementById(id), target, duration, decimals)
}
