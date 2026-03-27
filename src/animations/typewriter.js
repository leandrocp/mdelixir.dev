import { animateCounterById } from './counter.js'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initTypewriter() {
  const titleEl = document.getElementById('hero-title')
  const cursorEl = document.getElementById('hero-cursor')
  const subtitleEl = document.getElementById('hero-subtitle')
  const statsEl = document.getElementById('hero-stats')
  const codeEl = document.getElementById('hero-code')
  const ctaEl = document.getElementById('hero-cta')
  const poweredEl = document.getElementById('hero-powered')

  if (!titleEl) return

  const text = 'Markdown for Elixir'

  if (prefersReducedMotion) {
    titleEl.textContent = text
    if (cursorEl) cursorEl.classList.add('opacity-0')
    ;[subtitleEl, statsEl, codeEl, ctaEl, poweredEl].forEach(el => {
      if (el) { el.classList.remove('opacity-0'); el.classList.add('animate-fade-in') }
    })
    typeCode(true)
    return
  }

  let charIndex = 0

  function typeChar() {
    if (charIndex < text.length) {
      titleEl.textContent += text.charAt(charIndex)
      charIndex++
      const delay = 40 + Math.random() * 40
      setTimeout(typeChar, delay)
    } else {
      if (cursorEl) cursorEl.classList.add('opacity-0')
      setTimeout(showSubtitle, 200)
    }
  }

  function showSubtitle() {
    if (subtitleEl) {
      subtitleEl.classList.remove('opacity-0')
      subtitleEl.classList.add('animate-fade-in')
    }
    setTimeout(showStats, 400)
  }

  function showStats() {
    if (statsEl) {
      statsEl.classList.remove('opacity-0')
      statsEl.classList.add('animate-slide-up')
      animateCounterById('stat-speed', 8983, 2000)
      animateCounterById('stat-memory', 0.00184, 2000, 5)
    }
    setTimeout(showCode, 600)
  }

  function showCode() {
    if (codeEl) {
      codeEl.classList.remove('opacity-0')
      codeEl.classList.add('animate-slide-up')
      typeCode()
    }
    setTimeout(showCTA, 1500)
  }

  function showCTA() {
    if (ctaEl) {
      ctaEl.classList.remove('opacity-0')
      ctaEl.classList.add('animate-slide-up')
    }
    setTimeout(showPowered, 400)
  }

  function showPowered() {
    if (poweredEl) {
      poweredEl.classList.remove('opacity-0')
      poweredEl.classList.add('animate-fade-in')
    }
  }

  function typeCode(instant) {
    const codeContent = document.getElementById('hero-code-content')
    const codeCursor = document.getElementById('code-cursor')
    if (!codeContent) return

    const lines = [
      { text: 'iex> ', class: 'text-stone-500 dark:text-stone-400' },
      { text: 'MDEx.to_html!(', class: 'text-stone-800 dark:text-stone-200' },
      { text: '"# Hello **MDEx**"', class: 'text-emerald-700 dark:text-emerald-400' },
      { text: ')', class: 'text-stone-800 dark:text-stone-200' },
      { text: '\n', class: '' },
      { text: '"<h1>Hello <strong>MDEx</strong></h1>"', class: 'text-brand-light' },
    ]

    if (instant) {
      let html = ''
      lines.forEach(line => {
        for (const char of line.text) {
          if (char === '\n') html += '<br>'
          else if (char === '<') html += '&lt;'
          else if (char === '>') html += '&gt;'
          else html += line.class ? `<span class="${line.class}">${char}</span>` : char
        }
      })
      codeContent.innerHTML = html
      if (codeCursor) codeCursor.classList.add('opacity-0')
      return
    }

    let lineIndex = 0
    let charIndex = 0
    let html = ''

    function typeNext() {
      if (lineIndex < lines.length) {
        const line = lines[lineIndex]
        if (charIndex < line.text.length) {
          const char = line.text.charAt(charIndex)
          if (char === '\n') {
            html += '<br>'
          } else if (char === '<') {
            html += '&lt;'
          } else if (char === '>') {
            html += '&gt;'
          } else {
            html += line.class ? `<span class="${line.class}">${char}</span>` : char
          }
          codeContent.innerHTML = html
          charIndex++
          setTimeout(typeNext, 25 + Math.random() * 20)
        } else {
          lineIndex++
          charIndex = 0
          if (lineIndex < lines.length) {
            setTimeout(typeNext, lineIndex === 4 ? 300 : 50)
          } else if (codeCursor) {
            codeCursor.classList.add('opacity-0')
          }
        }
      }
    }

    setTimeout(typeNext, 300)
  }

  setTimeout(typeChar, 600)
}
