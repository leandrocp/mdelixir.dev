import { animateCounter } from './counter.js'

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
        bar.style.transform = `scaleX(${percentage / 100})`
      }

      if (counter) {
        animateCounter(counter, target, 2500)
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

export { startBenchmarkRace }
