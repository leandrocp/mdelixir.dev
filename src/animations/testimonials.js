const testimonials = [
  {
    author: "Bradley Golden",
    handle: "exbradleygolden",
    text: "Congrats on big milestone! I absolutely loove MDEx ❤️",
    url: "https://x.com/exbradleygolden/status/2010801212715909350"
  },
  {
    author: "Aníbal Rojas",
    handle: "anibal",
    text: "En un mundo Markdowncéntrico esta librería que a partir de texto en Markdow hace lo que le da la gana está súper cool.",
    url: "https://x.com/anibal/status/2010794938334921067"
  },
  {
    author: "Jakub Skałecki",
    handle: "jskalc",
    text: "This is a great Elixir library! 💜\nI'm using it in multiple projects. Glad it's growing.\nAnd that new website looks awesome!",
    url: "https://x.com/jskalc/status/2010793457414258841"
  },
  {
    author: "Peter Ullrich",
    handle: "peterullrich",
    text: "If you're interested in how I built my blog with NimblePublisher + MDEx + LiveView, I've documented the setup here.",
    url: "https://bsky.app/profile/peterullrich.com/post/3li4xd6iz3k2m"
  },
  {
    author: "ElixirClub.DEV",
    handle: "elixirclub",
    text: "Need Markdown expressions support in Elixir? Take a look at  MDEx library.",
    url: "https://bsky.app/profile/elixirclub.bsky.social/post/3lpro3zrkok2q"
  },
  {
    author: "Terris Linenbach",
    handle: "dev-guy",
    text: "We should be talking more about MDEx #elixirlang",
    url: "https://bsky.app/profile/dev-guy.bsky.social/post/3mbtzqnhz3k27"
  },
  {
    author: "Pieter Claerhout",
    handle: "yellowduck",
    text: "🐥 Converting markdown to HTML using MDEx with syntax highlighting",
    url: "https://bsky.app/profile/yellowduck.be/post/3lq3nthjwhc2e"
  },
  {
    author: "Jakub Skalecki",
    handle: "jskalc",
    text: "I needed a Markdown -> Quill Delta conversion.\n\nSo on Sunday in ~3h I've made a non-trivial OS contribution to the popular Elixir library MDEx by @leandrocesquini",
    url: "https://x.com/jskalc/status/1965167498204258616"
  },
  {
    author: "Tom Dorr",
    handle: "tom_doerr",
    text: "Markdown parser and formatter for Elixir\n\ngithub.com/leandrocp/mdex",
    url: "https://x.com/tom_doerr/status/2000474781255102703"
  },
  {
    author: "Flo",
    handle: "flo_arens",
    text: "Today I worked on an article that explains how I built the table of contents component for my blog pages 📝 It involves talking about how to parse MDEx-generated HTML into a data structure that can be used to build such a component.",
    url: "https://x.com/flo_arens/status/1820152023238484303"
  },
  {
    author: "Mario",
    handle: "MarioWhileCode",
    text: "Deprecating Earmark in favor of Mdex.\nWhen I started building, I thought earmark was the go-to Markdown parser in Elixir. I was wrong, on Aug 28th, I opened an issue to migrate after seeing the great work happening on Mdex, and the latest release they did is just fire. gj guys.",
    url: "https://x.com/MarioWhileCode/status/1974972087354978375"
  },
  {
    author: "Cristian Alvarez",
    handle: "crbelaus",
    text: "MDEx is great but (sadly) I don't have to deal with Markdown frequently.",
    url: "https://x.com/crbelaus/status/1890072781448216762"
  },
  {
    author: "Shahryar Tavakkoli",
    handle: "shahryar_tbiz",
    text: "mdex can convert phoenix stateless component to html. so most of my components can be used :)).\nCreate a blog under 2 min with some templates",
    url: "https://x.com/shahryar_tbiz/status/1846308118566691120"
  },
  {
    author: "Shahryar Tavakkoli",
    handle: "shahryar_tbiz",
    text: "Discover how to transform markdown into dynamic HTML using Phoenix components for a seamless static site experience\nWith Nimble_publisher and MDEx Build a Static Site in #Elixir Under 5 Minutes",
    url: "https://x.com/shahryar_tbiz/status/1851114365501554752"
  },
  {
    author: "Philip Brown",
    handle: "philipbrown",
    text: "What's your Elixir stack? 🥞\nWhat packages do you use in almost every project?\nHere's mine:\nPhoenix + Ecto + Req + Floki + MDEx",
    url: "https://x.com/philipbrown/status/1890064640941674718"
  },
  {
    author: "Mitch Hanberg",
    handle: "mitchhanberg",
    text: "MDEx is awesome, and is what we use in the Tableau SSG",
    url: "https://x.com/mitchhanberg/status/1844067921427038530"
  },
  {
    author: "Code_of_Kai",
    handle: "Code_of_Kai",
    text: "MDEx is a fast, CommonMark-compliant Markdown parser and formatter built specifically for Elixir",
    url: "https://x.com/Code_of_Kai/status/1844125500584919306"
  },
  {
    author: "Mitch Hanberg",
    handle: "mitchhanberg",
    text: "Mdex is the goat",
    url: "https://x.com/mitchhanberg/status/1814289014993653995"
  }
]

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function createCard(t) {
  const card = document.createElement('a')
  card.href = t.url
  card.target = '_blank'
  card.rel = 'noopener'
  card.className = 'testimonial-card group block p-6 border border-dashed border-stone-300 bg-stone-50 hover:border-brand hover:bg-white transition-all duration-300 relative'
  card.innerHTML = `
    <span class="card-corner absolute -top-2 -left-1 text-stone-300 group-hover:text-brand text-sm select-none bg-white">+</span>
    <span class="card-corner absolute -top-2 -right-1 text-stone-300 group-hover:text-brand text-sm select-none bg-white">+</span>
    <span class="card-corner absolute -bottom-2 -left-1 text-stone-300 group-hover:text-brand text-sm select-none bg-white">+</span>
    <span class="card-corner absolute -bottom-2 -right-1 text-stone-300 group-hover:text-brand text-sm select-none bg-white">+</span>
    <div class="flex items-start gap-3 mb-3">
      <span class="text-2xl text-stone-300 select-none">></span>
      <p class="text-stone-700 text-sm leading-relaxed flex-1">${t.text}</p>
    </div>
    <div class="flex items-center gap-3 pl-7">
      <img src="/images/avatars/${t.handle}.jpg" alt="${t.author}" class="w-8 h-8 rounded-full border border-stone-200">
      <div>
        <p class="text-sm font-semibold text-stone-900">${t.author}</p>
        <p class="text-xs text-brand">@${t.handle}</p>
      </div>
    </div>
  `
  return card
}

export function initTestimonials() {
  const row1 = document.getElementById('marquee-row-1')
  const row2 = document.getElementById('marquee-row-2')
  if (!row1 || !row2) return

  const shuffled = shuffle(testimonials)
  const midpoint = Math.ceil(shuffled.length / 2)
  const row1Items = shuffled.slice(0, midpoint)
  const row2Items = shuffled.slice(midpoint)

  function populateRow(row, items) {
    items.forEach(t => row.appendChild(createCard(t)))
    items.forEach(t => row.appendChild(createCard(t)))
  }

  populateRow(row1, row1Items)
  populateRow(row2, row2Items)
}
