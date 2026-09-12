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
  const rows = [...document.querySelectorAll(".benchmark-row")];
  const targets = rows.map((row) => parseInt(row.dataset.target, 10));
  const maxValue = Math.max(...targets);

  rows.forEach((row, index) => {
    const target = targets[index];
    const bar = row.querySelector(".benchmark-bar");
    const counter = row.querySelector(".benchmark-counter");

    setTimeout(() => {
      if (bar) {
        // keep the smallest bars visible rather than collapsing to a hairline
        bar.style.transform = `scaleX(${Math.max(target / maxValue, 0.015)})`;
      }

      if (counter) {
        animateCounter(counter, target, 2500);
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
