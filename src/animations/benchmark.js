let hasAnimated = false

export function initBenchmark() {
  const chart = document.getElementById('benchmark-chart')
  if (!chart || hasAnimated) return

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasAnimated) {
      hasAnimated = true
      startBenchmarkRace()
      observer.disconnect()
    }
  }, { threshold: 0.3 })

  observer.observe(chart)
}

function startBenchmarkRace() {
  const rows = document.querySelectorAll('.benchmark-row')
  const maxValue = 8983

  rows.forEach((row, index) => {
    const target = parseInt(row.dataset.target, 10)
    const bar = row.querySelector('.benchmark-bar')
    const counter = row.querySelector('.benchmark-counter')
    const percentage = (target / maxValue) * 100

    setTimeout(() => {
      if (bar) {
        bar.style.width = `${percentage}%`
      }

      if (counter) {
        animateBenchmarkCounter(counter, target)
      }
    }, index * 200)
  })

  setTimeout(() => {
    const memoryEl = document.getElementById('memory-comparison')
    if (memoryEl) {
      memoryEl.classList.remove('opacity-0')
      memoryEl.classList.add('animate-slide-up')
    }
  }, 800)
}

function animateBenchmarkCounter(element, target) {
  const duration = 2500
  const start = 0
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(start + (target - start) * eased)

    element.textContent = current.toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

export { startBenchmarkRace }
