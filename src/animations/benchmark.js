import { animateCounter } from "./counter.js";

let hasAnimated = false;

export function initBenchmark() {
  const chart = document.getElementById("benchmark-chart");
  if (!chart || hasAnimated) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;
        startBenchmarkRace();
        observer.disconnect();
      }
    },
    { threshold: 0.3 },
  );

  observer.observe(chart);
}

function startBenchmarkRace() {
  const rows = document.querySelectorAll(".benchmark-row");

  rows.forEach((row, index) => {
    const target = parseFloat(row.dataset.target);
    const decimals = parseInt(row.dataset.decimals ?? "0", 10);
    const counter = row.querySelector(".benchmark-counter");

    setTimeout(() => {
      if (counter) {
        animateCounter(counter, target, 2000, decimals);
      }
    }, index * 200);
  });

  setTimeout(() => {
    const foundationEl = document.getElementById("perf-foundation");
    if (foundationEl) {
      foundationEl.classList.remove("opacity-0");
      foundationEl.classList.add("animate-slide-up");
    }
  }, 800);
}

export { startBenchmarkRace };
