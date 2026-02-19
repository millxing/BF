// Add or remove cards by editing this array.
// Each object below renders one card on the homepage.
const posts = [
  {
    id: 8,
    title: "Tax Foundation Report: Massachusetts Proposition 2 ½ Is Working",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "The MMA has argued for Prop 2 1/2 reform. Here is an alternative view from Tax Foundation, a DC-based think tank.",
    resourcePage: "massachusetts_proposition_2_12_working_20260212.html"
  },
  {
    id: 7,
    title: "What is Proposition 2 1/2",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "Most everyone has heard of Proposition 2 1/2, but there are some common misunderstandings about it.",
    resourcePage: "proposition_2_1_2_20260212.html"
  },
  {
    id: 6,
    title: "Brookline News: Town's financial plan lays out high stakes for schools, fire department as override vote looms",
    category: "journal",
    date: "February 18, 2026",
    excerpt:
      "\"Town Administrator Charles Carey has released a $481 million budget proposal for fiscal year 2027 that offers the most detailed rationale to date for a tax override question likely to be on Brookline's ballot in the May election.\"",
    resourcePage: "brookline_news_override_20260218.html"
  },
  {
    id: 5,
    title: "FY2027 Financial Plan was released",
    category: "journal",
    date: "February 16, 2026",
    excerpt:
      "\"This will be a pivotal year for Brookline: the community will likely be asked to decide if it wishes to accept higher taxes or significant reductions in services.\"",
    resourcePage: "fy2027_financial_plan_20260216.html"
  },
  {
    id: 1,
    title: "Draft Report from the Expenditures & Revenues Study Committee (ERSC)",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "Brookline's ERSC released a draft of their report on Brookline's financial health, which will ultimately contain recommendations to the Select Board regarding a possible override ballot question for the May 2026 election.",
    resourcePage: "ersc_20260212.html"
  },
  {
    id: 2,
    title: "MMA report: Navigating the Storm",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "The Massachusetts Municipal Association (MMA) followed up their October post about the fiscal crisis with a detailed plan to solve it",
    resourcePage: "mma_navigate_20260212.html"
  },
  {
    id: 3,
    title: "MMA report: A Perfect Storm",
    category: "journal",
    date: "Feb 12, 2026",
    excerpt:
      "In October 2025, the Massachusetts Municipal Association (MMA) released a report that examines the key factors pressuring municipal budgets.",
    resourcePage: "mma_perfectstorm_20260212.html"
  },
  {
    id: 4,
    title: "Brookline's FY27-FY31 Long Range Financial Forecast",
    category: "journal",
    date: "January 13, 2026",
    excerpt:
      "The FY27-FY Long Range Financial Plan was presented to the Advisory Committee on January 13, 2026.",
    resourcePage: "LRF_20260113.html"
  }
  
];

const state = {
  query: ""
};

const postList = document.querySelector("#post-list");
const postTemplate = document.querySelector("#post-template");
const searchInput = document.querySelector("#search-posts");

function filterPosts() {
  const normalizedQuery = state.query.trim().toLowerCase();

  if (!normalizedQuery) {
    return posts;
  }

  return posts.filter((post) => {
    const content =
      `${post.title || ""} ${post.excerpt || ""} ${post.body || ""} ${post.category || ""}`.toLowerCase();
    return content.includes(normalizedQuery);
  });
}

function addRevealAnimation() {
  const cards = postList.querySelectorAll(".post-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 55}ms`;
    observer.observe(card);
  });
}

function renderPosts() {
  const filteredPosts = filterPosts();
  postList.innerHTML = "";

  if (!filteredPosts.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No posts match your search.";
    postList.append(emptyState);
    return;
  }

  filteredPosts.forEach((post) => {
    const fragment = postTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".post-card");

    fragment.querySelector(".post-date").textContent = post.date;
    fragment.querySelector(".post-excerpt").textContent = post.excerpt;
    fragment.querySelector(".post-title").textContent = post.title;

    const body = fragment.querySelector(".post-body");
    const button = fragment.querySelector(".read-more");

    if (post.resourcePage) {
      card.classList.add("clickable-card");
      card.tabIndex = 0;
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", `Open ${post.title}`);
      body.remove();
      button.remove();

      card.addEventListener("click", () => {
        window.location.href = post.resourcePage;
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = post.resourcePage;
        }
      });
    } else {
      body.textContent = post.body;

      button.addEventListener("click", () => {
        const isOpen = !body.hidden;
        body.hidden = isOpen;
        button.textContent = isOpen ? "Read more" : "Read less";
        button.setAttribute("aria-expanded", String(!isOpen));
      });
    }

    postList.append(fragment);
  });

  addRevealAnimation();
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderPosts();
});

renderPosts();
