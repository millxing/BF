// Add or remove cards by editing this array.
// Each object below renders one card on the homepage.
const posts = [
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
    title: "FY2027 Financial Plan is now available",
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
    id: 8,
    title: "Tax Foundation Report: Massachusetts Proposition 2 1/2 Is Working",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "The MMA has argued for Prop 2 1/2 reform. Here is an alternative view from Tax Foundation, a DC-based think tank.",
    resourcePage: "massachusetts_proposition_2_12_working_20260212.html"
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
    id: 7,
    title: "What is Proposition 2 1/2",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "Most everyone has heard of Proposition 2 1/2, but there are some common misunderstandings about it.",
    resourcePage: "proposition_2_1_2_20260212.html"
  },
  {
    id: 4,
    title: "Brookline's FY27-FY31 Long Range Financial Forecast",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "The FY27-FY Long Range Financial Plan was presented to the Advisory Committee on January 13, 2026.",
    resourcePage: "LRF_20260113.html"
  }
];

const defaultBudgetRows = [
  {
    fiscalYear: "FY2027",
    category: "Operating Budget (Town + Schools)",
    amount: 481100000,
    percentOfTotal: 100,
    notes: "Reported in FY2027 Financial Plan overview.",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M"
  },
  {
    fiscalYear: "FY2027",
    category: "Proposed Override",
    amount: 5310000,
    percentOfTotal: 1.1,
    notes: "Proposed Proposition 2 1/2 override amount.",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M"
  },
  {
    fiscalYear: "FY2027",
    category: "Town Initial Structural Gap",
    amount: 3000000,
    percentOfTotal: 0.6,
    notes: "Initial gap before proposed efficiencies and revenue adjustments.",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M"
  },
  {
    fiscalYear: "FY2027",
    category: "Public Schools Projected Gap",
    amount: 6000000,
    percentOfTotal: 1.2,
    notes: "Plan cites a projected school budget gap exceeding this amount.",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M"
  },
  {
    fiscalYear: "FY2027",
    category: "Anticipated Free Cash",
    amount: 23000000,
    percentOfTotal: 4.8,
    notes: "Largely allocated to capital, reserves, and liabilities.",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M"
  }
];

const views = {
  journal: {
    label: "Journal",
    searchPlaceholder: "Search journal posts"
  },
  meetings: {
    label: "Meetings",
    searchPlaceholder: "Search meetings"
  },
  budget: {
    label: "Budget Data",
    searchPlaceholder: "Search budget categories"
  }
};

const civicClerkSourceUrl =
  "https://brooklinema.portal.civicclerk.com/?category_id=28,37,43,54,144,125,26";

const initialMeetingsData = Array.isArray(window.MEETINGS_DATA) ? window.MEETINGS_DATA : [];
const initialMeetingsMeta =
  window.MEETINGS_META && typeof window.MEETINGS_META === "object" ? window.MEETINGS_META : null;

const state = {
  activeView: getViewFromHash(),
  query: "",
  meetings: initialMeetingsData,
  meetingsMeta: {
    sourceUrl: initialMeetingsMeta?.sourceUrl || civicClerkSourceUrl,
    lastUpdated: initialMeetingsMeta?.lastUpdated || null,
    count: initialMeetingsMeta?.count || initialMeetingsData.length
  },
  budgetRows: defaultBudgetRows,
  budgetSort: {
    key: "amount",
    direction: "desc"
  }
};

const viewContent = document.querySelector("#view-content");
const postTemplate = document.querySelector("#post-template");
const searchInput = document.querySelector("#search-posts");
const viewMeta = document.querySelector("#view-meta");
const tabs = Array.from(document.querySelectorAll(".view-tab"));
const tabList = document.querySelector(".view-tabs");

function getViewFromHash() {
  const hashView = window.location.hash.replace("#", "").trim().toLowerCase();
  return views[hashView] ? hashView : "journal";
}

function formatDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatMeetingDateTime(value) {
  const date = parseMeetingDateValue(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatDateOnly(value) {
  const date = parseMeetingDateValue(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function parseMeetingDateValue(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}t\d{2}:\d{2}(:\d{2})?(\.\d+)?z$/i.test(trimmed)) {
      return new Date(trimmed.replace(/z$/i, ""));
    }
  }

  return new Date(value);
}

function formatCurrency(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function setTabState() {
  tabs.forEach((tab) => {
    const tabView = tab.dataset.view;
    const isActive = tabView === state.activeView;
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });
}

function updateSearchUi() {
  const config = views[state.activeView] || views.journal;
  searchInput.placeholder = config.searchPlaceholder;
  searchInput.setAttribute("aria-label", `Search ${config.label}`);
}

function updateViewMeta() {
  if (state.activeView === "meetings") {
    const lastUpdated = state.meetingsMeta.lastUpdated;
    const updatedText = lastUpdated
      ? `Last updated ${formatDateTime(lastUpdated)}.`
      : "No local meetings snapshot yet.";

    viewMeta.hidden = false;
    viewMeta.textContent = `${updatedText} Source: CivicClerk portal categories.`;
    return;
  }

  if (state.activeView === "budget") {
    viewMeta.hidden = false;
    // viewMeta.textContent = "Summary-level figures are stored locally in data/budget_summary.json.";
    viewMeta.textContent = "BETA FEATURE, UNDER RENOVATION";
    return;
  }

  viewMeta.hidden = true;
  viewMeta.textContent = "";
}

function setActiveView(nextView, options = {}) {
  const { fromHash = false } = options;
  if (!views[nextView]) {
    return;
  }

  state.activeView = nextView;
  setTabState();
  updateSearchUi();
  updateViewMeta();

  if (!fromHash && window.location.hash !== `#${nextView}`) {
    history.replaceState(null, "", `#${nextView}`);
  }

  renderActiveView();
}

function addRevealAnimation(container) {
  const cards = container.querySelectorAll(".post-card");

  if (!cards.length) {
    return;
  }

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

function normalizeText(value) {
  return `${value || ""}`.trim().toLowerCase();
}

function filterPosts() {
  const normalizedQuery = normalizeText(state.query);

  if (!normalizedQuery) {
    return posts;
  }

  return posts.filter((post) => {
    const content = `${post.title || ""} ${post.excerpt || ""} ${post.body || ""} ${post.category || ""}`.toLowerCase();
    return content.includes(normalizedQuery);
  });
}

function getUpcomingMeetings() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return state.meetings
    .filter((meeting) => {
      if (!meeting.dateTime) {
        return true;
      }

      const parsedMeetingDate = parseMeetingDateValue(meeting.dateTime);
      if (Number.isNaN(parsedMeetingDate.getTime())) {
        return true;
      }

      return parsedMeetingDate >= startOfToday;
    })
    .sort((a, b) => {
      const left = parseMeetingDateValue(a.dateTime).getTime();
      const right = parseMeetingDateValue(b.dateTime).getTime();

      if (Number.isNaN(left) && Number.isNaN(right)) {
        return 0;
      }
      if (Number.isNaN(left)) {
        return 1;
      }
      if (Number.isNaN(right)) {
        return -1;
      }

      return left - right;
    });
}

function filterMeetings() {
  const normalizedQuery = normalizeText(state.query);
  const upcoming = getUpcomingMeetings();

  if (!normalizedQuery) {
    return upcoming;
  }

  return upcoming.filter((meeting) => {
    const content = `${meeting.body || ""} ${meeting.title || ""} ${meeting.location || ""} ${meeting.status || ""}`.toLowerCase();
    return content.includes(normalizedQuery);
  });
}

function sortBudgetRows(rows) {
  const { key, direction } = state.budgetSort;
  const sign = direction === "asc" ? 1 : -1;

  return [...rows].sort((a, b) => {
    const left = a[key];
    const right = b[key];

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * sign;
    }

    return `${left || ""}`.localeCompare(`${right || ""}`) * sign;
  });
}

function filterBudgetRows() {
  const normalizedQuery = normalizeText(state.query);

  if (!normalizedQuery) {
    return sortBudgetRows(state.budgetRows);
  }

  const filteredRows = state.budgetRows.filter((row) => {
    const content = `${row.fiscalYear || ""} ${row.category || ""} ${row.notes || ""}`.toLowerCase();
    return content.includes(normalizedQuery);
  });

  return sortBudgetRows(filteredRows);
}

function renderEmptyState(text) {
  const emptyState = document.createElement("p");
  emptyState.className = "empty-state";
  emptyState.textContent = text;
  viewContent.append(emptyState);
}

function renderJournal() {
  const filteredPosts = filterPosts();
  viewContent.className = "view-content post-list";
  viewContent.innerHTML = "";

  if (!filteredPosts.length) {
    renderEmptyState("No posts match your search.");
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

    viewContent.append(fragment);
  });

  addRevealAnimation(viewContent);
}

function createMeetingLink(url, label) {
  if (!url) {
    return null;
  }

  const link = document.createElement("a");
  link.className = "meeting-link";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function renderMeetings() {
  const filteredMeetings = filterMeetings();
  viewContent.className = "view-content post-list";
  viewContent.innerHTML = "";

  if (!state.meetings.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.innerHTML =
      "No local meetings snapshot yet. Run <code>node tools/sync_meetings.js</code> from the CLI to refresh <code>data/meetings_data.js</code>.";
    viewContent.append(emptyState);
    return;
  }

  if (!filteredMeetings.length) {
    renderEmptyState("No upcoming meetings match your search.");
    return;
  }

  filteredMeetings.forEach((meeting) => {
    const card = document.createElement("article");
    card.className = "post-card meeting-card";

    const meta = document.createElement("p");
    meta.className = "post-meta";
    meta.textContent = formatMeetingDateTime(meeting.dateTime);

    if (meeting.status) {
      const status = document.createElement("span");
      status.className = "meeting-status";
      status.textContent = ` • ${meeting.status}`;
      meta.append(status);
    }

    const title = document.createElement("h2");
    title.className = "post-title";
    title.textContent = meeting.body || meeting.title || "Meeting";

    const description = document.createElement("p");
    description.className = "post-excerpt";
    description.textContent = meeting.title && meeting.body ? meeting.title : "Finance-related meeting";

    const links = document.createElement("div");
    links.className = "meeting-links";

    const mediaLink = createMeetingLink(meeting.mediaUrl, "Media");
    const meetingLink = createMeetingLink(meeting.meetingUrl, "Meeting Details");

    [mediaLink, meetingLink].forEach((link) => {
      if (link) {
        links.append(link);
      }
    });

    if (!links.childElementCount) {
      const noLinks = document.createElement("span");
      noLinks.className = "meeting-location";
      noLinks.textContent = "Meeting links are not yet posted.";
      links.append(noLinks);
    }

    card.append(meta, title, description, links);
    viewContent.append(card);
  });

  addRevealAnimation(viewContent);
}

function onBudgetSortClick(key) {
  if (state.budgetSort.key === key) {
    state.budgetSort.direction = state.budgetSort.direction === "asc" ? "desc" : "asc";
  } else {
    state.budgetSort.key = key;
    state.budgetSort.direction = key === "category" || key === "fiscalYear" ? "asc" : "desc";
  }

  renderBudget();
}

function renderBudget() {
  const rows = filterBudgetRows();
  viewContent.className = "view-content";
  viewContent.innerHTML = "";

  if (!rows.length) {
    renderEmptyState("No budget rows match your search.");
    return;
  }

  const shell = document.createElement("div");
  shell.className = "budget-shell";

  const wrap = document.createElement("div");
  wrap.className = "budget-table-wrap";

  const table = document.createElement("table");
  table.className = "budget-table";

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");

  const headers = [
    { key: "fiscalYear", label: "Fiscal Year" },
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount" },
    { key: "percentOfTotal", label: "% of Total" },
    { key: "notes", label: "Notes" },
    { key: "sourceLabel", label: "Source" }
  ];

  headers.forEach((header) => {
    const th = document.createElement("th");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "budget-sort";
    button.textContent = header.label;
    button.addEventListener("click", () => onBudgetSortClick(header.key));

    if (state.budgetSort.key === header.key) {
      button.textContent += state.budgetSort.direction === "asc" ? " ▲" : " ▼";
    }

    th.append(button);
    headRow.append(th);
  });

  head.append(headRow);
  table.append(head);

  const body = document.createElement("tbody");

  rows.forEach((row) => {
    const tr = document.createElement("tr");

    const fiscalYear = document.createElement("td");
    fiscalYear.textContent = row.fiscalYear || "-";

    const category = document.createElement("td");
    category.textContent = row.category || "-";

    const amount = document.createElement("td");
    amount.textContent = formatCurrency(row.amount);

    const percent = document.createElement("td");
    percent.textContent = Number.isFinite(row.percentOfTotal) ? `${row.percentOfTotal.toFixed(1)}%` : "-";

    const notes = document.createElement("td");
    notes.textContent = row.notes || "-";

    const source = document.createElement("td");
    if (row.sourceUrl) {
      const sourceLink = document.createElement("a");
      sourceLink.className = "budget-source";
      sourceLink.href = row.sourceUrl;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = row.sourceLabel || "Source";
      source.append(sourceLink);
    } else {
      source.textContent = row.sourceLabel || "-";
    }

    tr.append(fiscalYear, category, amount, percent, notes, source);
    body.append(tr);
  });

  table.append(body);
  wrap.append(table);
  shell.append(wrap);
  viewContent.append(shell);
}

function renderActiveView() {
  if (state.activeView === "meetings") {
    renderMeetings();
    return;
  }

  if (state.activeView === "budget") {
    renderBudget();
    return;
  }

  renderJournal();
}

function normalizeMeeting(meeting, fallbackSourceUrl = state.meetingsMeta.sourceUrl) {
  if (!meeting || typeof meeting !== "object") {
    return null;
  }

  return {
    id: meeting.id || meeting.sourceId || null,
    dateTime: meeting.dateTime || meeting.meetingDate || null,
    body: meeting.body || meeting.committee || meeting.category || null,
    title: meeting.title || meeting.name || null,
    status: meeting.status || null,
    location: meeting.location || null,
    agendaUrl: meeting.agendaUrl || null,
    minutesUrl: meeting.minutesUrl || null,
    packetUrl: meeting.packetUrl || null,
    mediaUrl: meeting.mediaUrl || null,
    meetingUrl: meeting.meetingUrl || null,
    sourceUrl: meeting.sourceUrl || fallbackSourceUrl
  };
}

function normalizeBudgetRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const parsedAmount = typeof row.amount === "number" ? row.amount : Number(row.amount);
  const parsedPercent =
    typeof row.percentOfTotal === "number" ? row.percentOfTotal : Number(row.percentOfTotal);

  return {
    fiscalYear: row.fiscalYear || row.fy || "",
    category: row.category || "",
    amount: Number.isFinite(parsedAmount) ? parsedAmount : null,
    percentOfTotal: Number.isFinite(parsedPercent) ? parsedPercent : null,
    notes: row.notes || "",
    sourceLabel: row.sourceLabel || row.source || "",
    sourceUrl: row.sourceUrl || ""
  };
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }

  return response.json();
}

function loadMeetingsDataFromWindow() {
  const rawMeta = window.MEETINGS_META && typeof window.MEETINGS_META === "object" ? window.MEETINGS_META : {};
  const sourceUrl = rawMeta.sourceUrl || civicClerkSourceUrl;
  const rawMeetings = Array.isArray(window.MEETINGS_DATA) ? window.MEETINGS_DATA : [];
  const meetings = rawMeetings.map((meeting) => normalizeMeeting(meeting, sourceUrl)).filter(Boolean);
  const parsedCount = Number(rawMeta.count);

  state.meetings = meetings;
  state.meetingsMeta = {
    sourceUrl,
    lastUpdated: rawMeta.lastUpdated || null,
    count: Number.isFinite(parsedCount) ? parsedCount : meetings.length
  };
}

async function loadViewData() {
  loadMeetingsDataFromWindow();

  const budgetResult = await Promise.allSettled([fetchJson("data/budget_summary.json")]);
  const [budgetSummaryResult] = budgetResult;

  if (budgetSummaryResult.status === "fulfilled" && Array.isArray(budgetSummaryResult.value)) {
    const rows = budgetSummaryResult.value.map(normalizeBudgetRow).filter(Boolean);
    if (rows.length) {
      state.budgetRows = rows;
    }
  }

  updateViewMeta();
  renderActiveView();
}

function onTabKeyDown(event) {
  const currentIndex = tabs.findIndex((tab) => tab.dataset.view === state.activeView);
  if (currentIndex === -1) {
    return;
  }

  let nextIndex = currentIndex;

  if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  const nextView = tabs[nextIndex].dataset.view;
  setActiveView(nextView);
  tabs[nextIndex].focus();
}

function initialize() {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextView = tab.dataset.view;
      setActiveView(nextView);
    });
  });

  if (tabList) {
    tabList.addEventListener("keydown", onTabKeyDown);
  }

  searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderActiveView();
  });

  window.addEventListener("hashchange", () => {
    setActiveView(getViewFromHash(), { fromHash: true });
  });

  setTabState();
  updateSearchUi();
  updateViewMeta();
  renderActiveView();
  loadViewData();
}

initialize();
