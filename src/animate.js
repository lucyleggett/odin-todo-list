export function Animate() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isProjects = entry.target.classList.contains("projects");
        const container = isProjects
          ? ".view-panel.projects"
          : ".view-panel.tasks";
        const card = isProjects ? ".project-card" : ".task-card";

        if (entry.isIntersecting) {
          animateCards(container, card);
        } else {
          resetCards(container, card);
        }
      });
    },
    { threshold: 0.5 },
  );

  function animateCards(containerSelector, cardSelector) {
    const cards = document.querySelectorAll(
      `${containerSelector} ${cardSelector}`,
    );
    cards.forEach((card, index) => {
      card.style.setProperty("--card-delay", `${index * 80}ms`);
      card.classList.add("slide-in");
    });
  }

  function resetCards(containerSelector, cardSelector) {
    const cards = document.querySelectorAll(
      `${containerSelector} ${cardSelector}`,
    );
    cards.forEach((card) => {
      card.classList.remove("slide-in");
      card.style.removeProperty("--card-delay");
    });
  }

  observer.observe(document.querySelector(".view-panel.projects"));
  observer.observe(document.querySelector(".view-panel.tasks"));
}
