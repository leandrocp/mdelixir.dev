import './styles.css'
import { initTypewriter } from './animations/typewriter.js'
import { initCounter } from './animations/counter.js'
import { initBenchmark } from './animations/benchmark.js'
import { initTestimonials } from './animations/testimonials.js'
import { initScrollAnimations, initNavScroll } from './utils/scroll.js'

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll()
  initScrollAnimations()
  initTypewriter()
  initCopyButtons()
  initTabs()
  initStreamingDemo()
  initTestimonials()
  initHashNavigation()
})

function initHashNavigation() {
  window.addEventListener('hashchange', () => {
    if (!window.location.hash || window.location.hash === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const customText = btn.dataset.copyText
      const targetId = btn.dataset.copy
      const codeEl = document.getElementById(targetId)
      if (!customText && !codeEl) return

      try {
        await navigator.clipboard.writeText(customText || codeEl.textContent)
        const originalHTML = btn.innerHTML
        btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
        btn.classList.add('text-emerald-600')

        setTimeout(() => {
          btn.innerHTML = originalHTML
          btn.classList.remove('text-emerald-600')
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    })
  })
}

function initTabs() {
  const tabs = document.querySelectorAll('[data-tab]')
  const panels = document.querySelectorAll('[data-panel]')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab

      tabs.forEach(t => {
        t.classList.remove('bg-brand', 'text-white', 'border-brand')
        t.classList.add('text-stone-500', 'hover:text-brand', 'hover:border-brand', 'border-stone-300')
      })
      tab.classList.add('bg-brand', 'text-white', 'border-brand')
      tab.classList.remove('text-stone-500', 'hover:text-brand', 'hover:border-brand', 'border-stone-300')

      panels.forEach(panel => {
        if (panel.dataset.panel === target) {
          panel.classList.remove('hidden')
          panel.classList.add('animate-fade-in')
        } else {
          panel.classList.add('hidden')
        }
      })
    })
  })
}

function initStreamingDemo() {
  const container = document.getElementById('streaming-content')
  if (!container) return

  const poem = [
    { text: '## ', delay: 100, render: '<span class="text-brand">##</span> ' },
    { text: 'The', delay: 80 },
    { text: ' ', delay: 40 },
    { text: 'Rust', delay: 80 },
    { text: ' ', delay: 40 },
    { text: 'Beneath', delay: 80 },
    { text: '\n\n', delay: 300, render: '<br><br>' },
    { text: '_', delay: 60, render: '<em>' },
    { text: 'Silent', delay: 80 },
    { text: ' ', delay: 40 },
    { text: 'code', delay: 80 },
    { text: ' ', delay: 40 },
    { text: 'compiles', delay: 80 },
    { text: '_', delay: 60, render: '</em>' },
    { text: '\n', delay: 200, render: '<br>' },
    { text: 'Through', delay: 80 },
    { text: ' ', delay: 40 },
    { text: 'the', delay: 60 },
    { text: ' ', delay: 40 },
    { text: '**', delay: 60, render: '<strong>' },
    { text: 'BEAM', delay: 100 },
    { text: '**', delay: 60, render: '</strong>' },
    { text: ' ', delay: 40 },
    { text: 'it', delay: 60 },
    { text: ' ', delay: 40 },
    { text: '`', delay: 60, render: '<code class="bg-stone-100 px-1 border border-stone-200 text-brand">' },
    { text: 'flies', delay: 100 },
    { text: '`', delay: 60, render: '</code>' },
  ]

  let index = 0
  let html = ''

  function streamNext() {
    if (index < poem.length) {
      const item = poem[index]
      html += item.render || item.text
      container.innerHTML = html + '<span class="animate-blink text-brand">|</span>'
      index++
      setTimeout(streamNext, item.delay + Math.random() * 30)
    } else {
      setTimeout(() => {
        html = ''
        index = 0
        container.innerHTML = '<span class="animate-blink text-brand">|</span>'
        setTimeout(streamNext, 1000)
      }, 4000)
    }
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(streamNext, 500)
      observer.disconnect()
    }
  }, { threshold: 0.3 })

  const section = document.getElementById('built-for-ai-applications')
  if (section) observer.observe(section)
}

export { initCounter, initBenchmark }
