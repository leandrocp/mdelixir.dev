import { initBenchmark } from '../animations/benchmark.js'

export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = entry.target.dataset.animate || 'fade-in'
        entry.target.classList.add(`animate-${animation}`)
        entry.target.classList.remove('opacity-0')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  animatedElements.forEach(el => observer.observe(el))

  initBenchmark()

  initFeatureCards()
}

function initFeatureCards() {
  const cards = document.querySelectorAll('.feature-card')
  if (cards.length === 0) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate-slide-up')
          entry.target.classList.remove('opacity-0', 'translate-y-4')
        }, index * 100)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  cards.forEach(card => observer.observe(card))
}

export function initNavScroll() {
  const nav = document.getElementById('nav')
  if (!nav) return

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('bg-stone-50/95', 'dark:bg-stone-950/95', 'backdrop-blur-md', 'shadow-sm', 'dark:shadow-stone-900/50')
      nav.classList.remove('bg-transparent')
    } else {
      nav.classList.remove('bg-stone-50/95', 'dark:bg-stone-950/95', 'backdrop-blur-md', 'shadow-sm', 'dark:shadow-stone-900/50')
      nav.classList.add('bg-transparent')
    }
  }, { passive: true })
}
