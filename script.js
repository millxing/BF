// Add or remove cards by editing this array.
// Each object below renders one card on the homepage.
const posts = [
  {
    id: 10,
    title: "ESRC Futures Committee report (February 13, 2026)",
    category: "journal",
    date: "February 20, 2026",
    excerpt: "The Futures Subcommittee report focuses on economic development strategy.",
    resourcePage: "pages/esrc_futures_committee_report_20260220.html"
  },
  {
    id: 9,
    title: "ESRC Schools Subcommittee report (February 9, 2026)",
    category: "journal",
    date: "February 20, 2026",
    excerpt:
      "Two major financial findings areas are discussed: unreimbursed special education for non-resident students and teacher salaries.",
    resourcePage: "pages/esrc_schools_subcommittee_report_20260220.html"
  },
  {
    id: 6,
    title: "Brookline News: Town's financial plan lays out high stakes for schools, fire department as override vote looms",
    category: "journal",
    date: "February 18, 2026",
    excerpt:
      "\"Town Administrator Charles Carey has released a $481 million budget proposal for fiscal year 2027 that offers the most detailed rationale to date for a tax override question likely to be on Brookline's ballot in the May election.\"",
    resourcePage: "pages/brookline_news_override_20260218.html"
  },
  {
    id: 5,
    title: "FY2027 Financial Plan is now available",
    category: "journal",
    date: "February 16, 2026",
    excerpt:
      "\"This will be a pivotal year for Brookline: the community will likely be asked to decide if it wishes to accept higher taxes or significant reductions in services.\"",
    resourcePage: "pages/fy2027_financial_plan_20260216.html"
  },
  {
    id: 1,
    title: "Draft Report from the Expenditures & Revenues Study Committee (ERSC)",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "Brookline's ERSC released a draft of their report on Brookline's financial health, which will ultimately contain recommendations to the Select Board regarding a possible override ballot question for the May 2026 election.",
    resourcePage: "pages/ersc_20260212.html"
  },
  {
    id: 8,
    title: "Tax Foundation Report: Massachusetts Proposition 2 1/2 Is Working",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "The MMA has argued for Prop 2 1/2 reform. Here is an alternative view from Tax Foundation, a DC-based think tank.",
    resourcePage: "pages/massachusetts_proposition_2_12_working_20260212.html"
  },
  {
    id: 2,
    title: "MMA report: Navigating the Storm",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "The Massachusetts Municipal Association (MMA) followed up their October post about the fiscal crisis with a detailed plan to solve it.",
    resourcePage: "pages/mma_navigate_20260212.html"
  },
  {
    id: 3,
    title: "MMA report: A Perfect Storm",
    category: "journal",
    date: "Feb 12, 2026",
    excerpt:
      "In October 2025, the Massachusetts Municipal Association (MMA) released a report that examines the key factors pressuring municipal budgets.",
    resourcePage: "pages/mma_perfectstorm_20260212.html"
  },
  {
    id: 7,
    title: "What is Proposition 2 1/2",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "Most everyone has heard of Proposition 2 1/2, but there are some common misunderstandings about it.",
    resourcePage: "pages/proposition_2_1_2_20260212.html"
  },
  {
    id: 4,
    title: "Brookline's FY27-FY31 Long Range Financial Forecast",
    category: "journal",
    date: "February 12, 2026",
    excerpt:
      "The FY27-FY Long Range Financial Plan was presented to the Advisory Committee on January 13, 2026.",
    resourcePage: "pages/LRF_20260113.html"
  }
];

const resourceLinks = [
  {
    label: "Budget Central",
    url: "https://www.brooklinema.gov/851/Budget-Central"
  },
  {
    label: "FY2027 Financial Plan",
    url: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M"
  },
  {
    label: "FY2027 Financial Plan (presentation)",
    url: "https://www.brooklinema.gov/DocumentCenter/View/61071/FY2027-Financial-Plan?bidId="
  },
  {
    label: "FY27-FY31 Long Range Financial Plan",
    url: "https://www.brooklinema.gov/DocumentCenter/View/60730"
  },
  {
    label: "Organization Chart",
    url: "https://www.brooklinema.gov/DocumentCenter/View/3327/Town-of-Brookline-Organizational-Chart?bidId="
  },
  {
    label: "Open Checkbook",
    url: "https://stories.opengov.com/brooklinema/published/3gE577bjs"
  },
  {
    label: "Brookline Public Schools Budget",
    url: "https://brooklinema.portal.civicclerk.com/event/14954/files/attachment/10857"
  }
];

const tickerTapeRows = [
  { label: "Property Tax", amount: 349452499 },
  { label: "Local Receipts", amount: 37633556 },
  { label: "State Aid", amount: 26693757 },
  { label: "Free Cash", amount: 20200000 },
  { label: "Other Available Funds", amount: 6267275 },
  { label: "Enterprises (net)", amount: 40896030 },
  { label: "TOTAL REVENUE", amount: 481143117, isTotal: true },
  { label: "Municipal Departments", amount: 101259557 },
  { label: "School Department", amount: 144533296 },
  { label: "Non-Departmental", amount: 161991096 },
  { label: "Special Appropriations", amount: 21671104 },
  { label: "Enterprises (net)", amount: 40896030 },
  { label: "Non-Appropriated", amount: 10792034 },
  { label: "TOTAL EXPENDITURES", amount: 481143117, isTotal: true }
];

const tickerConfig = {
  enableSecondaryLoop: false,
  showSecondaryTickerBar: false,
  activeTickerContent: "override"
};

const overrideTickerMessage =
  "The Town of Brookline will likely put a $5.31M override on the ballot for the May 5, 2026 election. The stated purpose is to stabilize the operating budget, fund contractual obligations, avoid deeper cuts in FY2028 and FY2029, and maintain expected service levels. This is a municipal operations override question only and would not include the schools. The schools may request their own override.";

const defaultBudgetRows = [
  {
    fiscalYear: "FY2027",
    category: "Operating Budget (Town + Schools)",
    amount: 481100000,
    priorAmount: 464800000,
    deltaAmount: 16300000,
    deltaPercent: 3.5,
    percentOfTotal: 100,
    fundType: "operating",
    isOneTime: false,
    notes: "Reported in FY2027 Financial Plan overview.",
    sourceDoc: "FY2027 Financial Plan",
    sourcePage: "Overview",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M",
    metricKey: "operating_total"
  },
  {
    fiscalYear: "FY2027",
    category: "Proposed Override",
    amount: 5310000,
    priorAmount: 0,
    deltaAmount: 5310000,
    deltaPercent: null,
    percentOfTotal: 1.1,
    fundType: "revenue",
    isOneTime: false,
    notes: "Proposed Proposition 2 1/2 override amount.",
    sourceDoc: "FY2027 Financial Plan",
    sourcePage: "Budget Message",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M",
    metricKey: "override"
  },
  {
    fiscalYear: "FY2027",
    category: "Town Initial Structural Gap",
    amount: 3000000,
    priorAmount: 2100000,
    deltaAmount: 900000,
    deltaPercent: 42.9,
    percentOfTotal: 0.6,
    fundType: "operating",
    isOneTime: false,
    notes: "Initial gap before proposed efficiencies and revenue adjustments.",
    sourceDoc: "FY2027 Financial Plan",
    sourcePage: "Budget Message",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M",
    metricKey: "town_gap"
  },
  {
    fiscalYear: "FY2027",
    category: "Public Schools Projected Gap",
    amount: 6000000,
    priorAmount: 4800000,
    deltaAmount: 1200000,
    deltaPercent: 25,
    percentOfTotal: 1.2,
    fundType: "operating",
    isOneTime: false,
    notes: "Plan cites a projected school budget gap exceeding this amount.",
    sourceDoc: "FY2027 Financial Plan",
    sourcePage: "Budget Message",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M",
    metricKey: "school_gap"
  },
  {
    fiscalYear: "FY2027",
    category: "Anticipated Free Cash",
    amount: 23000000,
    priorAmount: 20100000,
    deltaAmount: 2900000,
    deltaPercent: 14.4,
    percentOfTotal: 4.8,
    fundType: "capital",
    isOneTime: true,
    notes: "Largely allocated to capital, reserves, and liabilities.",
    sourceDoc: "FY2027 Financial Plan",
    sourcePage: "Budget Message",
    sourceLabel: "FY2027 Financial Plan",
    sourceUrl: "https://stories.opengov.com/brooklinema/5cf061e0-65c6-428e-be0f-fee5a4848e8f/published/mpRiIYj5M",
    metricKey: "free_cash"
  }
];

const budgetCategoryMenu = [
  {
    key: "budget_summaries",
    label: "1. Budget Summaries"
  },
  {
    key: "revenue_funds",
    label: "2. Revenue and Fund Accounting"
  },
  {
    key: "department_budgets",
    label: "3. Department Budget Tables"
  },
  {
    key: "non_appropriated_balances",
    label: "4. Non-Appropriated and Fund Balances"
  },
  {
    key: "capital_plan",
    label: "5. Capital Improvements Plan"
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
  },
  links: {
    label: "Links",
    searchPlaceholder: "Search links"
  }
};

const civicClerkSourceUrl =
  "https://brooklinema.portal.civicclerk.com/?category_id=28,59,144,87,26";

const initialMeetingsData = Array.isArray(window.MEETINGS_DATA) ? window.MEETINGS_DATA : [];
const initialMeetingsMeta =
  window.MEETINGS_META && typeof window.MEETINGS_META === "object" ? window.MEETINGS_META : null;
const initialBudgetData = Array.isArray(window.BUDGET_SUMMARY_DATA) ? window.BUDGET_SUMMARY_DATA : [];

function normalizeBudgetRows(rows) {
  return (Array.isArray(rows) ? rows : []).map(normalizeBudgetRow).filter(Boolean);
}

const state = {
  activeView: getViewFromHash(),
  query: "",
  meetings: initialMeetingsData,
  meetingsMeta: {
    sourceUrl: initialMeetingsMeta?.sourceUrl || civicClerkSourceUrl,
    lastUpdated: initialMeetingsMeta?.lastUpdated || null,
    count: initialMeetingsMeta?.count || initialMeetingsData.length
  },
  budgetRows: normalizeBudgetRows(initialBudgetData).length
    ? normalizeBudgetRows(initialBudgetData)
    : normalizeBudgetRows(defaultBudgetRows),
  budgetCategory: budgetCategoryMenu[0].key
};

const viewContent = document.querySelector("#view-content");
const postTemplate = document.querySelector("#post-template");
const searchInput = document.querySelector("#search-posts");
const searchWrap = document.querySelector(".search-wrap");
const viewMeta = document.querySelector("#view-meta");
const tabList = document.querySelector("#view-tablist");
const tabs = tabList ? Array.from(tabList.querySelectorAll(".view-tab[data-view]")) : [];
const siteHeader = document.querySelector(".site-header");
const tickerTrack = document.querySelector("#budget-ticker-track");
const secondaryTickerBar = document.querySelector("#secondary-ticker-bar");
const overrideTickerTrack = document.querySelector("#override-ticker-track");

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

function formatMeetingDate(value) {
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

function formatMeetingTime(value) {
  const date = parseMeetingDateValue(value);

  if (Number.isNaN(date.getTime())) {
    return "Time TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
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

function formatTickerAmount(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatSignedCurrency(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  if (value === 0) {
    return "$0";
  }

  return `${value > 0 ? "+" : "-"}${formatCurrency(Math.abs(value))}`;
}

function createTickerSegment(rows, options = {}) {
  const { ariaHidden = false } = options;
  const segment = document.createElement("div");
  segment.className = "ticker-segment";

  if (ariaHidden) {
    segment.setAttribute("aria-hidden", "true");
  }

  rows.forEach((row, index) => {
    const item = document.createElement("span");
    item.className = row.isTotal ? "ticker-item ticker-item-total" : "ticker-item";
    item.textContent = `${row.label}: ${formatTickerAmount(row.amount)}`;
    segment.append(item);

    if (index < rows.length - 1) {
      const separator = document.createElement("span");
      separator.className = "ticker-separator";
      separator.textContent = "•";
      separator.setAttribute("aria-hidden", "true");
      segment.append(separator);
    }
  });

  return segment;
}

function renderTickerTape() {
  if (!tickerTrack) {
    return;
  }

  tickerTrack.innerHTML = "";
  tickerTrack.classList.remove("ticker-track--loop", "ticker-track--single");

  if (tickerConfig.activeTickerContent === "override") {
    tickerTrack.classList.add("ticker-track--loop");
    tickerTrack.append(
      createTickerTextSegment(overrideTickerMessage),
      createTickerTextSegment(overrideTickerMessage, { ariaHidden: true })
    );
    return;
  }

  tickerTrack.append(createTickerSegment(tickerTapeRows));

  if (tickerConfig.enableSecondaryLoop) {
    tickerTrack.classList.add("ticker-track--loop");
    tickerTrack.append(createTickerSegment(tickerTapeRows, { ariaHidden: true }));
    return;
  }

  tickerTrack.classList.add("ticker-track--single");
}

function createTickerTextSegment(text, options = {}) {
  const { ariaHidden = false } = options;
  const segment = document.createElement("div");
  segment.className = "ticker-segment";

  if (ariaHidden) {
    segment.setAttribute("aria-hidden", "true");
  }

  const item = document.createElement("span");
  item.className = "ticker-item ticker-item-message";
  item.textContent = text;
  segment.append(item);

  return segment;
}

function renderOverrideTickerTape() {
  if (!overrideTickerTrack) {
    return;
  }

  overrideTickerTrack.innerHTML = "";
  overrideTickerTrack.classList.remove("ticker-track--loop", "ticker-track--single");
  overrideTickerTrack.classList.add("ticker-track--loop");
  overrideTickerTrack.append(
    createTickerTextSegment(overrideTickerMessage),
    createTickerTextSegment(overrideTickerMessage, { ariaHidden: true })
  );
}

function formatPercent(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return `${value.toFixed(1)}%`;
}

function formatSignedPercent(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  if (value === 0) {
    return "0.0%";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function parseFiscalYearNumber(value) {
  const match = `${value || ""}`.match(/(\d{2,4})/);
  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed < 100 ? parsed + 2000 : parsed;
}

function getLatestFiscalYear(rows) {
  let latest = null;

  rows.forEach((row) => {
    const year = parseFiscalYearNumber(row.fiscalYear);
    if (year && (!latest || year > latest)) {
      latest = year;
    }
  });

  return latest ? `FY${latest}` : null;
}

function formatFundType(value) {
  const key = normalizeText(value);
  if (key === "operating") {
    return "Operating";
  }
  if (key === "capital") {
    return "Capital";
  }
  if (key === "revenue") {
    return "Revenue";
  }
  return "-";
}

function getBudgetCategoryByKey(key) {
  return budgetCategoryMenu.find((category) => category.key === key) || null;
}

function formatBudgetCategory(value) {
  return getBudgetCategoryByKey(value)?.label || "Unmapped";
}

function inferBudgetCategoryKey(row) {
  const category = normalizeText(row.category);
  const sourcePage = normalizeText(row.sourcePage);
  const metricKey = normalizeText(row.metricKey);
  const notes = normalizeText(row.notes);

  if (category.includes("fund balance") || category.includes("non-appropriated") || sourcePage.includes("fund balance")) {
    return "non_appropriated_balances";
  }

  if (
    category.includes("free cash") ||
    category.includes("available funds") ||
    category.includes("reserve") ||
    category.includes("contingency") ||
    notes.includes("one-time funds") ||
    notes.includes("stabilization")
  ) {
    return "non_appropriated_balances";
  }

  if (
    row.fundType === "revenue" ||
    category.includes("property tax") ||
    category.includes("local receipts") ||
    category.includes("state aid") ||
    category.includes("free cash") ||
    category.includes("available funds") ||
    notes.includes("revenue")
  ) {
    return "revenue_funds";
  }

  if (
    row.fundType === "capital" ||
    sourcePage.includes("capital") ||
    category.includes("capital") ||
    category.includes("infrastructure") ||
    category.includes("facilities") ||
    category.includes("sidewalk")
  ) {
    return "capital_plan";
  }

  if (
    sourcePage.includes("operating summary") &&
    !metricKey.includes("operating_total") &&
    category !== "operating budget (town + schools)"
  ) {
    return "department_budgets";
  }

  return "budget_summaries";
}

function getBudgetTrendClass(value) {
  if (typeof value !== "number" || Number.isNaN(value) || value === 0) {
    return "";
  }
  return value > 0 ? "budget-up" : "budget-down";
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
  const hideSearch = state.activeView === "budget" || state.activeView === "links";
  if (searchWrap) {
    searchWrap.hidden = hideSearch;
  }

  if (hideSearch) {
    return;
  }

  const config = views[state.activeView] || views.journal;
  searchInput.placeholder = config.searchPlaceholder;
  searchInput.setAttribute("aria-label", `Search ${config.label}`);
}

function updateViewMeta() {
  if (state.activeView === "meetings") {
    const lastUpdated = state.meetingsMeta.lastUpdated;
    const meetingCount = Number.isFinite(state.meetingsMeta.count) ? state.meetingsMeta.count : state.meetings.length;
    const updatedText = lastUpdated
      ? `Last updated ${formatDateTime(lastUpdated)}.`
      : "No local meetings snapshot yet.";

    viewMeta.hidden = false;
    viewMeta.textContent = `${updatedText} ${meetingCount} meetings loaded.`;
    return;
  }

  if (state.activeView === "budget") {
    viewMeta.hidden = false;
    viewMeta.textContent = "Choose one of the five FY2027 plan categories to view its budget rows.";
    return;
  }

  if (state.activeView === "links") {
    const visibleLinks = filterResourceLinks().length;
    viewMeta.hidden = false;
    viewMeta.textContent = `${visibleLinks} resource link${visibleLinks === 1 ? "" : "s"} shown.`;
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

function updateStickyHeaderOffset() {
  if (!siteHeader) {
    return;
  }

  const headerHeight = Math.ceil(siteHeader.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--sticky-header-height", `${headerHeight}px`);
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

function sortMeetingsByDate(meetings, direction = "asc") {
  const sign = direction === "desc" ? -1 : 1;
  return [...meetings].sort((a, b) => {
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

    return (left - right) * sign;
  });
}

function splitMeetingsByTime(meetings) {
  const now = Date.now();
  const past = [];
  const upcoming = [];
  const undated = [];

  meetings.forEach((meeting) => {
    const timestamp = parseMeetingDateValue(meeting.dateTime).getTime();
    if (Number.isNaN(timestamp)) {
      undated.push(meeting);
      return;
    }

    if (timestamp < now) {
      past.push(meeting);
      return;
    }

    upcoming.push(meeting);
  });

  return {
    past: sortMeetingsByDate(past, "desc"),
    upcoming: [...sortMeetingsByDate(upcoming, "asc"), ...undated]
  };
}

function filterMeetingsByQuery() {
  const normalizedQuery = normalizeText(state.query);

  if (!normalizedQuery) {
    return state.meetings;
  }

  return state.meetings.filter((meeting) => {
    const content = `${meeting.body || ""} ${meeting.title || ""} ${meeting.location || ""} ${meeting.status || ""}`.toLowerCase();
    return content.includes(normalizedQuery);
  });
}

function filterResourceLinks() {
  return resourceLinks;
}

function getBudgetRowsForActiveCategory() {
  const filteredRows = state.budgetRows
    .filter((row) => row.budgetCategory === state.budgetCategory);

  return filteredRows.sort((a, b) => {
    const leftYear = parseFiscalYearNumber(a.fiscalYear) || 0;
    const rightYear = parseFiscalYearNumber(b.fiscalYear) || 0;

    if (leftYear !== rightYear) {
      return rightYear - leftYear;
    }

    const leftAmount = Number.isFinite(a.amount) ? a.amount : -Infinity;
    const rightAmount = Number.isFinite(b.amount) ? b.amount : -Infinity;

    if (leftAmount !== rightAmount) {
      return rightAmount - leftAmount;
    }

    return `${a.category || ""}`.localeCompare(`${b.category || ""}`);
  });
}

function onBudgetCategoryClick(nextCategoryKey) {
  if (state.budgetCategory === nextCategoryKey) {
    return;
  }

  if (!getBudgetCategoryByKey(nextCategoryKey)) {
    return;
  }

  state.budgetCategory = nextCategoryKey;
  renderBudget();
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

function createMeetingLink(url, label, options = {}) {
  if (!url) {
    return null;
  }

  const { secondary = false } = options;
  const link = document.createElement("a");
  link.className = secondary ? "meeting-link meeting-link-secondary" : "meeting-link";
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function createMeetingRow(meeting) {
  const row = document.createElement("article");
  row.className = "meeting-row";

  const when = document.createElement("div");
  when.className = "meeting-when";

  const date = document.createElement("p");
  date.className = "meeting-date";
  date.textContent = formatMeetingDate(meeting.dateTime);

  const time = document.createElement("p");
  time.className = "meeting-time";
  time.textContent = formatMeetingTime(meeting.dateTime);

  when.append(date, time);

  const details = document.createElement("div");
  details.className = "meeting-main";

  const title = document.createElement("h3");
  title.className = "meeting-name";
  title.textContent = meeting.body || meeting.title || "Meeting";

  const subtitle = document.createElement("p");
  subtitle.className = "meeting-subtitle";
  const subtitleParts = [];
  if (meeting.title && meeting.body && meeting.title !== meeting.body) {
    subtitleParts.push(meeting.title);
  }
  if (meeting.location) {
    subtitleParts.push(meeting.location);
  }
  if (meeting.status) {
    subtitleParts.push(meeting.status);
  }
  subtitle.textContent = subtitleParts.join(" · ") || "Finance-related meeting";

  const links = document.createElement("div");
  links.className = "meeting-links";

  const mediaLink = createMeetingLink(meeting.mediaUrl, "Media");
  const agendaLink = createMeetingLink(meeting.agendaUrl, "Agenda");
  const packetLink = createMeetingLink(meeting.packetUrl, "Packet");
  const detailsLink = createMeetingLink(meeting.meetingUrl, "Details", { secondary: true });

  [mediaLink, agendaLink, packetLink, detailsLink].forEach((link) => {
    if (link) {
      links.append(link);
    }
  });

  if (!links.childElementCount) {
    const noLinks = document.createElement("span");
    noLinks.className = "meeting-links-empty";
    noLinks.textContent = "No links posted yet";
    links.append(noLinks);
  }

  details.append(title, subtitle, links);
  row.append(when, details);
  return row;
}

function renderMeetingColumn(titleText, meetings) {
  const column = document.createElement("section");
  column.className = "meetings-column";

  const header = document.createElement("div");
  header.className = "meetings-column-head";

  const title = document.createElement("h2");
  title.className = "meetings-column-title";
  title.textContent = titleText;

  const count = document.createElement("p");
  count.className = "meetings-column-count";
  count.textContent = `${meetings.length} ${meetings.length === 1 ? "meeting" : "meetings"}`;

  header.append(title, count);
  column.append(header);

  if (!meetings.length) {
    const empty = document.createElement("p");
    empty.className = "meeting-column-empty";
    empty.textContent = "No meetings in this column.";
    column.append(empty);
    return column;
  }

  const list = document.createElement("div");
  list.className = "meeting-list";
  meetings.forEach((meeting) => list.append(createMeetingRow(meeting)));
  column.append(list);

  return column;
}

function renderMeetings() {
  const filteredMeetings = filterMeetingsByQuery();
  const split = splitMeetingsByTime(filteredMeetings);

  viewContent.className = "view-content meetings-layout";
  viewContent.innerHTML = "";

  if (!state.meetings.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.innerHTML =
      "No local meetings snapshot yet. Run <code>node tools/scrape_civic_range.js</code> to refresh <code>civic/meetings_data.js</code>.";
    viewContent.append(emptyState);
    return;
  }

  if (!split.past.length && !split.upcoming.length) {
    renderEmptyState("No meetings match your search.");
    return;
  }

  viewContent.append(
    renderMeetingColumn("Past Meetings", split.past),
    renderMeetingColumn("Upcoming Meetings", split.upcoming)
  );
}

function renderBudget() {
  const rows = getBudgetRowsForActiveCategory();
  viewContent.className = "view-content";
  viewContent.innerHTML = "";

  const shell = document.createElement("div");
  shell.className = "budget-shell";

  const categoryMenu = document.createElement("div");
  categoryMenu.className = "budget-category-menu";

  budgetCategoryMenu.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "budget-category-button";
    button.textContent = option.label;
    if (state.budgetCategory === option.key) {
      button.classList.add("is-active");
    }
    button.addEventListener("click", () => onBudgetCategoryClick(option.key));
    categoryMenu.append(button);
  });

  shell.append(categoryMenu);

  const categoryTitle = document.createElement("h3");
  categoryTitle.className = "budget-category-title";
  categoryTitle.textContent = formatBudgetCategory(state.budgetCategory);
  shell.append(categoryTitle);

  const count = document.createElement("p");
  count.className = "budget-count";
  count.textContent = `${rows.length} row${rows.length === 1 ? "" : "s"} in this category`;
  shell.append(count);

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "budget-empty";
    empty.textContent = "No rows available for this category in the local summary data.";
    shell.append(empty);
    viewContent.append(shell);
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "budget-table-wrap";

  const table = document.createElement("table");
  table.className = "budget-table";

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");

  const headers = ["Fiscal Year", "Category", "Amount", "Prior FY", "Change ($)", "Change (%)", "% of Total", "Notes", "Source"];

  headers.forEach((headerLabel) => {
    const th = document.createElement("th");
    th.textContent = headerLabel;
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
    amount.className = "budget-number";
    amount.textContent = formatCurrency(row.amount);

    const priorAmount = document.createElement("td");
    priorAmount.className = "budget-number";
    priorAmount.textContent = formatCurrency(row.priorAmount);

    const deltaAmount = document.createElement("td");
    deltaAmount.className = "budget-number";
    deltaAmount.textContent = formatSignedCurrency(row.deltaAmount);
    const deltaAmountClass = getBudgetTrendClass(row.deltaAmount);
    if (deltaAmountClass) {
      deltaAmount.classList.add(deltaAmountClass);
    }

    const deltaPercent = document.createElement("td");
    deltaPercent.className = "budget-number";
    deltaPercent.textContent = formatSignedPercent(row.deltaPercent);
    const deltaPercentClass = getBudgetTrendClass(row.deltaPercent);
    if (deltaPercentClass) {
      deltaPercent.classList.add(deltaPercentClass);
    }

    const percent = document.createElement("td");
    percent.className = "budget-number";
    percent.textContent = formatPercent(row.percentOfTotal);

    const notes = document.createElement("td");
    notes.textContent = row.notes || "-";

    const source = document.createElement("td");
    const sourceText = [row.sourceDoc, row.sourcePage ? `p. ${row.sourcePage}` : ""].filter(Boolean).join(" · ") || "-";
    if (row.sourceUrl) {
      const sourceLink = document.createElement("a");
      sourceLink.className = "budget-source";
      sourceLink.href = row.sourceUrl;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = sourceText;
      source.append(sourceLink);
    } else {
      source.textContent = sourceText;
    }

    tr.append(
      fiscalYear,
      category,
      amount,
      priorAmount,
      deltaAmount,
      deltaPercent,
      percent,
      notes,
      source
    );
    body.append(tr);
  });

  table.append(body);
  wrap.append(table);
  shell.append(wrap);
  viewContent.append(shell);
}

function renderLinks() {
  const filteredLinks = filterResourceLinks();

  viewContent.className = "view-content links-view";
  viewContent.innerHTML = "";

  const shell = document.createElement("section");
  shell.className = "links-shell";

  const title = document.createElement("h2");
  title.className = "links-title";
  title.textContent = "Brookline Finance Resources";
  shell.append(title);

  const subtitle = document.createElement("p");
  subtitle.className = "links-subtitle";
  subtitle.textContent = "Open source documents and dashboards.";
  shell.append(subtitle);

  if (!filteredLinks.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No links available right now.";
    shell.append(empty);
    viewContent.append(shell);
    return;
  }

  const bubbles = document.createElement("div");
  bubbles.className = "links-bubbles";

  filteredLinks.forEach((item) => {
    const link = document.createElement("a");
    link.className = "link-bubble";
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.label;
    bubbles.append(link);
  });

  shell.append(bubbles);
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

  if (state.activeView === "links") {
    renderLinks();
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
    body: meeting.body || meeting.committee || meeting.category || meeting.categoryName || null,
    title: meeting.title || meeting.name || meeting.eventName || meeting.description || null,
    status: meeting.status || null,
    location: meeting.location || null,
    agendaUrl: meeting.agendaUrl || (Array.isArray(meeting.agendaUrls) ? meeting.agendaUrls[0] : null) || null,
    minutesUrl: meeting.minutesUrl || null,
    packetUrl:
      meeting.packetUrl ||
      meeting.agendaPacketUrl ||
      (Array.isArray(meeting.agendaPacketUrls) ? meeting.agendaPacketUrls[0] : null) ||
      null,
    mediaUrl: meeting.mediaUrl || (Array.isArray(meeting.mediaUrls) ? meeting.mediaUrls[0] : null) || null,
    meetingUrl: meeting.meetingUrl || null,
    sourceUrl: meeting.sourceUrl || fallbackSourceUrl
  };
}

function normalizeBudgetRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const parsedAmount = typeof row.amount === "number" ? row.amount : Number(row.amount);
  const parsedPriorAmount = typeof row.priorAmount === "number" ? row.priorAmount : Number(row.priorAmount);
  const parsedDeltaAmount = typeof row.deltaAmount === "number" ? row.deltaAmount : Number(row.deltaAmount);
  const parsedDeltaPercent = typeof row.deltaPercent === "number" ? row.deltaPercent : Number(row.deltaPercent);
  const parsedPercent =
    typeof row.percentOfTotal === "number" ? row.percentOfTotal : Number(row.percentOfTotal);
  const normalizedAmount = Number.isFinite(parsedAmount) ? parsedAmount : null;
  const normalizedPriorAmount = Number.isFinite(parsedPriorAmount) ? parsedPriorAmount : null;

  let normalizedDeltaAmount = Number.isFinite(parsedDeltaAmount) ? parsedDeltaAmount : null;
  if (normalizedDeltaAmount === null && normalizedAmount !== null && normalizedPriorAmount !== null) {
    normalizedDeltaAmount = normalizedAmount - normalizedPriorAmount;
  }

  let normalizedDeltaPercent = Number.isFinite(parsedDeltaPercent) ? parsedDeltaPercent : null;
  if (
    normalizedDeltaPercent === null &&
    normalizedDeltaAmount !== null &&
    normalizedPriorAmount !== null &&
    normalizedPriorAmount !== 0
  ) {
    normalizedDeltaPercent = (normalizedDeltaAmount / normalizedPriorAmount) * 100;
  }

  const fundType = normalizeText(row.fundType);
  const normalizedFundType = ["operating", "capital", "revenue"].includes(fundType) ? fundType : "";
  const explicitCategory = normalizeText(row.budgetCategory || row.planSection);
  const hasExplicitCategory = budgetCategoryMenu.some((category) => category.key === explicitCategory);
  const normalizedCategory = hasExplicitCategory
    ? explicitCategory
    : inferBudgetCategoryKey({ ...row, fundType: normalizedFundType });

  return {
    fiscalYear: row.fiscalYear || row.fy || "",
    budgetCategory: normalizedCategory,
    category: row.category || "",
    fundType: normalizedFundType,
    amount: normalizedAmount,
    priorAmount: normalizedPriorAmount,
    deltaAmount: normalizedDeltaAmount,
    deltaPercent: normalizedDeltaPercent,
    percentOfTotal: Number.isFinite(parsedPercent) ? parsedPercent : null,
    isOneTime: typeof row.isOneTime === "boolean" ? row.isOneTime : null,
    notes: row.notes || "",
    sourceDoc: row.sourceDoc || row.sourceLabel || row.source || "",
    sourcePage: row.sourcePage || "",
    metricKey: row.metricKey || "",
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

  const results = await Promise.allSettled([fetchJson("data/budget_summary.json")]);
  const [budgetSummaryResult] = results;

  if (budgetSummaryResult.status === "fulfilled" && Array.isArray(budgetSummaryResult.value)) {
    const rows = normalizeBudgetRows(budgetSummaryResult.value);
    if (rows.length) {
      state.budgetRows = rows;
    }
  }

  updateViewMeta();
  renderActiveView();
}

function onTabKeyDown(event) {
  const focusedTab = event.target.closest(".view-tab[data-view]");
  if (!focusedTab) {
    return;
  }

  const currentIndex = tabs.indexOf(focusedTab);
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
  updateStickyHeaderOffset();
  renderTickerTape();

  if (secondaryTickerBar) {
    secondaryTickerBar.hidden = !tickerConfig.showSecondaryTickerBar;
  }

  if (tickerConfig.showSecondaryTickerBar) {
    renderOverrideTickerTape();
  }

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
    updateViewMeta();
    renderActiveView();
  });

  window.addEventListener("hashchange", () => {
    setActiveView(getViewFromHash(), { fromHash: true });
  });
  window.addEventListener("resize", updateStickyHeaderOffset);
  window.addEventListener("load", updateStickyHeaderOffset);

  setTabState();
  updateSearchUi();
  updateViewMeta();
  renderActiveView();
  loadViewData();

  if (document.fonts?.ready) {
    document.fonts.ready.then(updateStickyHeaderOffset).catch(() => {});
  }
}

initialize();
