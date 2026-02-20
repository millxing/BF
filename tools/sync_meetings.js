#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_SOURCE_URL =
  "https://brooklinema.portal.civicclerk.com/?category_id=28,37,43,54,144,125,26";
const DEFAULT_OUT_DIR = path.resolve(__dirname, "..", "data");

const DATE_KEYS = [
  "dateTime",
  "meetingDate",
  "meeting_date",
  "meetingDateTime",
  "meeting_date_time",
  "start",
  "startDate",
  "start_date",
  "startDateTime",
  "start_date_time",
  "startsAt",
  "starts_at",
  "start_at",
  "date",
  "eventDate",
  "event_date",
  "eventDateTime",
  "event_date_time",
  "datetime"
];
const BODY_KEYS = [
  "body",
  "committee",
  "committeeName",
  "committee_name",
  "board",
  "boardName",
  "board_name",
  "organization",
  "organizationName",
  "organization_name",
  "category",
  "categoryName",
  "category_name",
  "department",
  "groupName",
  "group_name"
];
const TITLE_KEYS = [
  "title",
  "name",
  "meetingName",
  "meeting_name",
  "eventName",
  "event_name",
  "subject",
  "description"
];
const STATUS_KEYS = ["status", "meetingStatus", "meeting_status"];
const LOCATION_KEYS = [
  "location",
  "location.name",
  "location.title",
  "location.displayName",
  "locationName",
  "location_name",
  "meetingLocation",
  "meetingLocation.name",
  "meetingLocation.displayName",
  "meetingLocationName",
  "meeting_location",
  "eventLocation",
  "eventLocationName",
  "venue",
  "venueName",
  "room",
  "roomName",
  "address",
  "address1",
  "addressLine1",
  "locationAddress"
];
const ID_KEYS = ["id", "meetingId", "meeting_id", "eventId", "event_id", "guid", "uuid"];
const AGENDA_KEYS = ["agendaUrl", "agenda_url", "agendaPacketUrl", "agenda_packet_url"];
const MINUTES_KEYS = ["minutesUrl", "minutes_url"];
const PACKET_KEYS = ["packetUrl", "packet_url"];
const MEDIA_KEYS = ["mediaUrl", "media_url", "videoUrl", "video_url", "streamUrl", "stream_url"];
const DETAILS_KEYS = ["meetingUrl", "meeting_url", "detailUrl", "detail_url", "url", "href", "link"];
const ENDPOINT_KEYWORDS = ["api", "event", "meeting", "calendar", "agenda", "minutes", "portal", "public"];
const FALLBACK_ENDPOINT_PATHS = [
  "/api/events",
  "/api/event",
  "/api/meetings",
  "/api/meeting",
  "/api/calendar",
  "/public/api/events",
  "/public/api/meetings",
  "/portal/api/events",
  "/portal/api/meetings"
];
const KNOWN_API_BASE = "https://brooklinema.api.civicclerk.com/v1";

function printUsage() {
  console.log(`\nUsage: node tools/sync_meetings.js [options]\n
Options:
  --source <url>     Override CivicClerk source URL.
  --out <dir>        Output directory for meetings JSON files.
  --dry-run          Parse and print summary, but do not write files.
  --debug            Print extractor diagnostics for troubleshooting.
  --diag-file <path> Write diagnostics JSON to a file.
  --allow-empty      Allow empty output and overwrite with an empty list.
  --help             Show this help text.\n`);
}

function parseArgs(argv) {
  const args = {
    sourceUrl: DEFAULT_SOURCE_URL,
    outDir: DEFAULT_OUT_DIR,
    dryRun: false,
    debug: false,
    diagFile: null,
    allowEmpty: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--source") {
      args.sourceUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--out") {
      args.outDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (arg === "--debug") {
      args.debug = true;
      continue;
    }

    if (arg === "--diag-file") {
      args.diagFile = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    if (arg === "--allow-empty") {
      args.allowEmpty = true;
      continue;
    }

    if (arg === "--help") {
      args.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function tryParseJson(raw) {
  if (!raw || typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim().replace(/;\s*$/, "");
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function readBalancedJson(text, startIndex) {
  const opening = text[startIndex];
  const closing = opening === "{" ? "}" : "]";

  let depth = 0;
  let inString = false;
  let isEscaped = false;
  let quote = null;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === quote) {
        inString = false;
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === opening) {
      depth += 1;
    } else if (char === closing) {
      depth -= 1;
      if (depth === 0) {
        return text.slice(startIndex, index + 1);
      }
    }
  }

  return null;
}

function extractAssignedJson(scriptContent, marker) {
  const parsed = [];
  let offset = 0;

  while (offset < scriptContent.length) {
    const markerIndex = scriptContent.indexOf(marker, offset);
    if (markerIndex === -1) {
      break;
    }

    let cursor = markerIndex + marker.length;
    while (cursor < scriptContent.length && scriptContent[cursor] !== "=" && scriptContent[cursor] !== ":") {
      cursor += 1;
    }

    if (cursor >= scriptContent.length) {
      break;
    }

    cursor += 1;
    while (cursor < scriptContent.length && /\s/.test(scriptContent[cursor])) {
      cursor += 1;
    }

    if (cursor >= scriptContent.length || (scriptContent[cursor] !== "{" && scriptContent[cursor] !== "[")) {
      offset = markerIndex + marker.length;
      continue;
    }

    const rawJson = readBalancedJson(scriptContent, cursor);
    if (!rawJson) {
      offset = markerIndex + marker.length;
      continue;
    }

    const parsedJson = tryParseJson(rawJson);
    if (parsedJson !== null) {
      parsed.push(parsedJson);
    }

    offset = cursor + rawJson.length;
  }

  return parsed;
}

function extractEmbeddedJson(html) {
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const extracted = [];

  const markers = [
    "window.__INITIAL_STATE__",
    "window.__NUXT__",
    "window.__NEXT_DATA__",
    "__NEXT_DATA__",
    "initialState",
    "INITIAL_STATE",
    "bootstrap"
  ];

  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const attrs = match[1] || "";
    const body = (match[2] || "").trim();

    if (!body) {
      continue;
    }

    if (/type=["']application\/(ld\+)?json["']/i.test(attrs)) {
      const parsedJson = tryParseJson(body);
      if (parsedJson !== null) {
        extracted.push(parsedJson);
      }
    }

    markers.forEach((marker) => {
      extracted.push(...extractAssignedJson(body, marker));
    });
  }

  return extracted;
}

function stripTags(value) {
  return `${value || ""}`.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value) {
  return `${value || ""}`
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function looksLikeRelativeOrAbsoluteUrl(value) {
  const trimmed = `${value || ""}`.trim();
  if (!trimmed) {
    return false;
  }

  // Reject plain labels and date-like strings.
  if (/\s/.test(trimmed) || /^\d{4}-\d{2}-\d{2}t\d{2}:\d{2}:\d{2}z$/i.test(trimmed)) {
    return false;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return true;
  }

  if (/^(\/|\.{1,2}\/)/.test(trimmed)) {
    return true;
  }

  if (/^(event|events|meeting|meetings|stream)\//i.test(trimmed)) {
    return true;
  }

  if (/\.(pdf|docx?|xlsx?|pptx?|txt|ics)([?#].*)?$/i.test(trimmed)) {
    return true;
  }

  // Allow other slash-containing relative paths.
  return trimmed.includes("/");
}

function isSuspiciousDetailUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname.toLowerCase();
    return /\/\d{4}-\d{2}-\d{2}t\d{2}:\d{2}:\d{2}z\/?$/.test(pathname) || pathname.includes("1900-01-01");
  } catch {
    return false;
  }
}

function hasLikelyResourcePath(pathname, kind = "resource") {
  const lowered = `${pathname || ""}`.toLowerCase();
  if (!lowered || lowered === "/") {
    return false;
  }

  if (/\.(pdf|docx?|xlsx?|pptx?|txt|ics|mp4|m3u8|mov|avi|mkv)(\?|$)/i.test(lowered)) {
    return true;
  }

  if (lowered.includes("/stream/") || lowered.includes("/download")) {
    return true;
  }

  if (kind === "meeting") {
    return lowered.includes("/event/") || lowered.includes("/events/") || lowered.includes("/meeting/");
  }

  if (kind === "media") {
    return (
      lowered.includes("media") ||
      lowered.includes("video") ||
      lowered.includes("watch") ||
      lowered.includes("youtube") ||
      lowered.includes("vimeo") ||
      lowered.includes("stream")
    );
  }

  if (kind === "agenda") {
    return lowered.includes("agenda") || lowered.includes("packet");
  }

  if (kind === "minutes") {
    return lowered.includes("minute");
  }

  if (kind === "packet") {
    return lowered.includes("packet") || lowered.includes("backup") || lowered.includes("/stream/");
  }

  return lowered.includes("agenda") || lowered.includes("minute") || lowered.includes("packet");
}

function sanitizeMeetingResourceUrl(url, kind = "resource") {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    if (kind === "meeting" && isSuspiciousDetailUrl(url)) {
      return null;
    }

    if (!hasLikelyResourcePath(parsed.pathname, kind)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function normalizeKnownApiDateTime(rawValue) {
  if (typeof rawValue === "number") {
    const parsed = parseDate(rawValue);
    return parsed ? parsed.toISOString() : null;
  }

  if (typeof rawValue !== "string") {
    return null;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  // CivicClerk timestamps are frequently emitted with a trailing Z even when
  // the wall-clock value is intended to be local to the municipality.
  if (/^\d{4}-\d{2}-\d{2}t\d{2}:\d{2}(:\d{2})?(\.\d+)?z$/i.test(trimmed)) {
    return trimmed.replace(/z$/i, "");
  }

  if (/^\d{4}-\d{2}-\d{2}t\d{2}:\d{2}(:\d{2})?(\.\d+)?([+-]\d{2}:\d{2})$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T00:00:00`;
  }

  const parsed = parseDate(trimmed);
  return parsed ? parsed.toISOString() : null;
}

function inferVirtualPlatform(value) {
  const lowered = `${value || ""}`.toLowerCase();
  if (!lowered) {
    return null;
  }

  if (lowered.includes("zoom.us") || lowered.includes("zoom")) {
    return "Zoom";
  }
  if (lowered.includes("teams.microsoft.com") || lowered.includes("microsoft teams") || lowered.includes("teams")) {
    return "Microsoft Teams";
  }
  if (lowered.includes("webex")) {
    return "Webex";
  }
  if (lowered.includes("meet.google.com") || lowered.includes("google meet")) {
    return "Google Meet";
  }
  if (lowered.includes("virtual") || lowered.includes("online") || lowered.includes("remote")) {
    return "Virtual";
  }

  return null;
}

function normalizeLocationLabel(rawLocation) {
  if (!rawLocation) {
    return null;
  }

  const trimmed = `${rawLocation}`.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return null;
  }

  const platform = inferVirtualPlatform(trimmed);
  if (platform) {
    return platform;
  }

  if (trimmed.length > 150) {
    return null;
  }

  return trimmed;
}

function deriveMeetingLocation(event, derivedLinks, sourceUrl) {
  const explicitLocation = pickFirstStringValue(event, LOCATION_KEYS);
  const normalizedExplicitLocation = normalizeLocationLabel(explicitLocation);
  if (normalizedExplicitLocation) {
    return normalizedExplicitLocation;
  }

  const virtualHints = [
    pickFirstStringValue(event, [
      "virtualMeetingUrl",
      "virtualMeetingLink",
      "onlineMeetingUrl",
      "onlineMeetingLink",
      "joinUrl",
      "meetingLink",
      "zoomMeetingUrl",
      "videoUrl",
      "streamUrl"
    ]),
    derivedLinks.mediaUrl,
    derivedLinks.meetingUrl,
    pickFirstStringValue(event, ["notes", "description"])
  ];

  for (const hint of virtualHints) {
    const resolvedHint = hint && hint.includes("://") ? hint : absoluteUrl(hint, sourceUrl);
    const platform = inferVirtualPlatform(resolvedHint || hint);
    if (platform) {
      return platform;
    }
  }

  return null;
}

function extractPageTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtmlEntities(stripTags(match[1])) : null;
}

function extractScriptSources(html, sourceUrl) {
  const scriptSrcRegex = /<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const sources = [];
  let match;
  while ((match = scriptSrcRegex.exec(html)) !== null) {
    const resolved = absoluteUrl(match[1], sourceUrl);
    if (resolved) {
      sources.push(resolved);
    }
  }
  return [...new Set(sources)];
}

function extractInterestingLinks(html, sourceUrl) {
  const linkRegex = /<(a|link)\b[^>]*(href)=["']([^"']+)["'][^>]*>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = absoluteUrl(match[3], sourceUrl);
    if (!href) {
      continue;
    }

    const lowered = href.toLowerCase();
    if (
      lowered.includes("rss") ||
      lowered.includes("ical") ||
      lowered.includes(".ics") ||
      lowered.includes("feed") ||
      lowered.includes("calendar")
    ) {
      links.push(href);
    }
  }
  return [...new Set(links)];
}

function detectPageSignals(html) {
  const lowered = html.toLowerCase();
  return {
    hasCloudflareSignal:
      lowered.includes("cloudflare") ||
      lowered.includes("cf-browser-verification") ||
      lowered.includes("challenge-platform"),
    hasCaptchaSignal: lowered.includes("captcha") || lowered.includes("recaptcha"),
    hasAccessDeniedSignal:
      lowered.includes("access denied") || lowered.includes("forbidden") || lowered.includes("not authorized"),
    hasAppShellSignal:
      lowered.includes("<div id=\"app\"") ||
      lowered.includes("<div id=\"root\"") ||
      lowered.includes("javascript is required")
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getSourceOrigin(sourceUrl) {
  try {
    return new URL(sourceUrl).origin;
  } catch {
    return null;
  }
}

function formatDateForApiFilter(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseCategoryIdsFromSource(sourceUrl) {
  try {
    const parsed = new URL(sourceUrl);
    const raw =
      parsed.searchParams.get("category_id") ||
      parsed.searchParams.get("categories") ||
      parsed.searchParams.get("categoryId") ||
      "";

    return raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0);
  } catch {
    return [];
  }
}

function buildKnownApiHeaders(sourceUrl) {
  const sourceOrigin = getSourceOrigin(sourceUrl) || "https://brooklinema.portal.civicclerk.com";
  return {
    accept: "application/json, text/plain, */*",
    origin: sourceOrigin,
    referer: `${sourceOrigin}/`,
    "user-agent": "BF-meeting-sync/1.0"
  };
}

function extractArrayPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidates = [payload.value, payload.items, payload.results, payload.data, payload.events];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function walkObjects(value, callback) {
  if (Array.isArray(value)) {
    value.forEach((item) => walkObjects(item, callback));
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  callback(value);
  Object.values(value).forEach((nested) => walkObjects(nested, callback));
}

function getValueByPath(obj, rawPath) {
  if (!rawPath.includes(".")) {
    return obj[rawPath];
  }

  return rawPath.split(".").reduce((acc, key) => {
    if (!acc || typeof acc !== "object") {
      return undefined;
    }
    return acc[key];
  }, obj);
}

function pickFirstValue(obj, keys) {
  for (const key of keys) {
    const value = getValueByPath(obj, key);
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      return value;
    }
  }

  return null;
}

function pickFirstStringValue(obj, keys) {
  for (const key of keys) {
    const value = getValueByPath(obj, key);
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return `${value}`;
    }

    if (value && typeof value === "object") {
      const nested = pickFirstStringValue(value, ["name", "title", "displayName", "label", "address"]);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

function pickMatchingKey(obj, predicates) {
  if (!obj || typeof obj !== "object") {
    return null;
  }

  const keys = Object.keys(obj);
  for (const key of keys) {
    const value = obj[key];
    const lowered = key.toLowerCase();
    if (predicates.some((predicate) => predicate(lowered, value))) {
      return value;
    }
  }

  return null;
}

function pickFallbackLabel(obj) {
  if (!obj || typeof obj !== "object") {
    return null;
  }

  const excluded = new Set([
    ...DATE_KEYS.map((key) => key.toLowerCase()),
    ...LOCATION_KEYS.map((key) => key.toLowerCase()),
    ...STATUS_KEYS.map((key) => key.toLowerCase()),
    ...AGENDA_KEYS.map((key) => key.toLowerCase()),
    ...MINUTES_KEYS.map((key) => key.toLowerCase()),
    ...PACKET_KEYS.map((key) => key.toLowerCase()),
    ...DETAILS_KEYS.map((key) => key.toLowerCase())
  ]);

  const keys = Object.keys(obj);
  for (const key of keys) {
    const lowered = key.toLowerCase();
    if (excluded.has(lowered)) {
      continue;
    }

    const value = obj[key];
    if (typeof value === "string") {
      const normalized = value.trim();
      if (normalized.length >= 3 && normalized.length <= 160) {
        return normalized;
      }
    }
  }

  return null;
}

function absoluteUrl(value, sourceUrl) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !looksLikeRelativeOrAbsoluteUrl(trimmed)) {
    return null;
  }

  try {
    return new URL(trimmed, sourceUrl).toString();
  } catch {
    return null;
  }
}

function normalizeEndpointCandidate(rawValue, sourceUrl) {
  if (!rawValue || typeof rawValue !== "string") {
    return null;
  }

  let value = rawValue
    .trim()
    .replace(/^['"`(]+/, "")
    .replace(/['"`),;]+$/, "")
    .replace(/\\u002f/gi, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&");

  if (!value.includes("/")) {
    return null;
  }

  if (value.startsWith("//")) {
    value = `https:${value}`;
  }

  if (!/^https?:/i.test(value) && !value.startsWith("/")) {
    return null;
  }

  let resolved;
  try {
    resolved = new URL(value, sourceUrl);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(resolved.protocol)) {
    return null;
  }

  const pathLower = `${resolved.pathname}${resolved.search}`.toLowerCase();
  if (
    pathLower.match(/\.(js|css|png|jpe?g|gif|svg|ico|map|woff2?|ttf|eot)(\?|$)/) ||
    !ENDPOINT_KEYWORDS.some((keyword) => pathLower.includes(keyword))
  ) {
    return null;
  }

  return resolved.toString();
}

function extractEndpointCandidatesFromBundle(bundleText, sourceUrl) {
  const decoded = `${bundleText || ""}`.replace(/\\\//g, "/");
  const rawMatches = [];

  const absoluteRegex = /https?:\/\/[^\s"'`<>\\]+/gi;
  const relativeRegex = /\/(?:api|public|portal|events?|meetings?|calendar|agendas?)[^"'`\s<>\\]*/gi;
  let match;

  while ((match = absoluteRegex.exec(decoded)) !== null) {
    rawMatches.push(match[0]);
  }

  while ((match = relativeRegex.exec(decoded)) !== null) {
    rawMatches.push(match[0]);
  }

  return unique(rawMatches.map((item) => normalizeEndpointCandidate(item, sourceUrl)));
}

function buildEndpointRequestUrls(endpointUrl, sourceUrl) {
  const requests = [endpointUrl];
  let source;
  try {
    source = new URL(sourceUrl);
  } catch {
    return requests;
  }

  const categoryId = source.searchParams.get("category_id");
  if (!categoryId) {
    return requests;
  }

  const variants = [
    ["category_id", categoryId],
    ["categoryId", categoryId],
    ["categories", categoryId]
  ];

  variants.forEach(([key, value]) => {
    try {
      const url = new URL(endpointUrl);
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
        requests.push(url.toString());
      }
    } catch {
      // Ignore malformed URL variants.
    }
  });

  return unique(requests);
}

function parsePotentialJsonPayloads(body) {
  const payloads = [];
  const trimmed = `${body || ""}`.trim();
  if (!trimmed) {
    return payloads;
  }

  const direct = tryParseJson(trimmed);
  if (direct !== null) {
    payloads.push(direct);
    return payloads;
  }

  const stripped = trimmed
    .replace(/^\)\]\}',?\s*/, "")
    .replace(/^while\s*\(1\);\s*/, "")
    .trim();

  const strippedParsed = tryParseJson(stripped);
  if (strippedParsed !== null) {
    payloads.push(strippedParsed);
  }

  const starts = [stripped.indexOf("{"), stripped.indexOf("[")].filter((value) => value >= 0).sort((a, b) => a - b);
  starts.forEach((startIndex) => {
    const raw = readBalancedJson(stripped, startIndex);
    const parsed = tryParseJson(raw);
    if (parsed !== null) {
      payloads.push(parsed);
    }
  });

  return payloads;
}

function parseDate(value) {
  if (typeof value === "number") {
    const millis = value > 10_000_000_000 ? value : value * 1000;
    const date = new Date(millis);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function collectAttachmentLinks(candidate, sourceUrl) {
  const links = {
    agendaUrl: null,
    minutesUrl: null,
    packetUrl: null,
    meetingUrl: null,
    mediaUrl: null
  };

  const assignFromText = (url, text) => {
    const normalizedText = `${text || ""}`.toLowerCase();
    if (!url) {
      return;
    }

    if (!links.agendaUrl && normalizedText.includes("agenda")) {
      links.agendaUrl = url;
      return;
    }

    if (!links.minutesUrl && normalizedText.includes("minute")) {
      links.minutesUrl = url;
      return;
    }

    if (!links.packetUrl && (normalizedText.includes("packet") || normalizedText.includes("backup"))) {
      links.packetUrl = url;
      return;
    }

    if (!links.meetingUrl && (normalizedText.includes("meeting") || normalizedText.includes("details"))) {
      links.meetingUrl = url;
      return;
    }

    if (
      !links.mediaUrl &&
      (normalizedText.includes("video") ||
        normalizedText.includes("media") ||
        normalizedText.includes("watch") ||
        normalizedText.includes("stream") ||
        normalizedText.includes("youtube") ||
        normalizedText.includes("vimeo"))
    ) {
      links.mediaUrl = url;
    }
  };

  Object.entries(candidate || {}).forEach(([key, value]) => {
    if (typeof value !== "string") {
      return;
    }

    const url = absoluteUrl(value, sourceUrl);
    if (!url) {
      return;
    }

    assignFromText(url, key);
  });

  walkObjects(candidate, (obj) => {
    const url = absoluteUrl(
      pickFirstValue(obj, ["url", "href", "link", "documentUrl", "document_url", "downloadUrl", "download_url"]),
      sourceUrl
    );

    if (!url) {
      return;
    }

    const descriptor = pickFirstValue(obj, ["name", "title", "type", "label", "documentType", "document_type"]);
    assignFromText(url, descriptor);
  });

  return links;
}

function normalizeCandidate(candidate, sourceUrl) {
  const rawDate =
    pickFirstValue(candidate, DATE_KEYS) ||
    pickMatchingKey(candidate, [
      (key, value) => {
        const hasDateishName =
          key.includes("date") || key.includes("time") || key.includes("start") || key.includes("when");
        if (!hasDateishName) {
          return false;
        }

        if (typeof value !== "string" && typeof value !== "number") {
          return false;
        }

        return parseDate(value) !== null;
      }
    ]);

  const parsedDate = parseDate(rawDate);
  if (!parsedDate) {
    return null;
  }

  const body =
    pickFirstValue(candidate, BODY_KEYS) ||
    pickMatchingKey(candidate, [(key) => key.includes("committee") || key.includes("board") || key.includes("category")]);
  const title =
    pickFirstValue(candidate, TITLE_KEYS) ||
    pickMatchingKey(candidate, [(key, value) => key.includes("title") || key.includes("name") || key.includes("subject")]);
  const fallback = pickFallbackLabel(candidate);

  if (!body && !title && !fallback) {
    return null;
  }

  const derivedLinks = collectAttachmentLinks(candidate, sourceUrl);

  const agendaUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(candidate, AGENDA_KEYS), sourceUrl) || derivedLinks.agendaUrl || null,
    "agenda"
  );
  const minutesUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(candidate, MINUTES_KEYS), sourceUrl) || derivedLinks.minutesUrl || null,
    "minutes"
  );
  const packetUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(candidate, PACKET_KEYS), sourceUrl) || derivedLinks.packetUrl || null,
    "packet"
  );
  const meetingUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(candidate, DETAILS_KEYS), sourceUrl) || derivedLinks.meetingUrl || null,
    "meeting"
  );
  const mediaUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(candidate, MEDIA_KEYS), sourceUrl) || derivedLinks.mediaUrl || null,
    "media"
  );

  return {
    id: pickFirstValue(candidate, ID_KEYS),
    sourceId: pickFirstValue(candidate, ID_KEYS),
    dateTime: parsedDate.toISOString(),
    body: body || title || fallback,
    title: title || fallback || null,
    status: pickFirstValue(candidate, STATUS_KEYS),
    location: pickFirstValue(candidate, LOCATION_KEYS),
    agendaUrl,
    minutesUrl,
    packetUrl,
    meetingUrl,
    mediaUrl,
    sourceUrl
  };
}

function dedupeMeetings(meetings) {
  const seen = new Set();
  const deduped = [];

  meetings.forEach((meeting) => {
    const key = `${meeting.dateTime}|${`${meeting.body || ""}`.toLowerCase()}|${`${meeting.title || ""}`.toLowerCase()}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    deduped.push(meeting);
  });

  return deduped;
}

function sortMeetings(meetings) {
  return [...meetings].sort((a, b) => {
    const left = new Date(a.dateTime).getTime();
    const right = new Date(b.dateTime).getTime();

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

function extractMeetingsFromAnchors(html, sourceUrl) {
  const anchorRegex = /<a\b[^>]*href=["']([^"']*\/event\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const linkRegex = /href=["']([^"']+)["']/gi;
  const dateRegex =
    /\b((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:am|pm))?|\d{1,2}\/\d{1,2}\/\d{2,4}(?:\s+\d{1,2}:\d{2}\s*(?:am|pm))?)\b/i;

  const meetings = [];
  let match;
  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[1];
    const rawLabel = match[2];
    const meetingUrl = absoluteUrl(href, sourceUrl);
    if (!meetingUrl) {
      continue;
    }

    const label = decodeHtmlEntities(stripTags(rawLabel));
    if (!label) {
      continue;
    }

    const contextStart = Math.max(0, match.index - 1200);
    const contextEnd = Math.min(html.length, match.index + match[0].length + 1200);
    const context = html.slice(contextStart, contextEnd);
    const contextText = decodeHtmlEntities(stripTags(context));

    const dateMatch = contextText.match(dateRegex);
    const parsedDate = parseDate(dateMatch ? dateMatch[1] : null);
    if (!parsedDate) {
      continue;
    }

    const links = {
      agendaUrl: null,
      minutesUrl: null,
      packetUrl: null
    };
    let linkMatch;
    while ((linkMatch = linkRegex.exec(context)) !== null) {
      const raw = linkMatch[1];
      const resolved = absoluteUrl(raw, sourceUrl);
      if (!resolved) {
        continue;
      }

      const lowered = raw.toLowerCase();
      if (!links.agendaUrl && lowered.includes("agenda")) {
        links.agendaUrl = resolved;
      } else if (!links.minutesUrl && lowered.includes("minute")) {
        links.minutesUrl = resolved;
      } else if (!links.packetUrl && (lowered.includes("packet") || lowered.includes("backup"))) {
        links.packetUrl = resolved;
      }
    }

    meetings.push({
      id: null,
      sourceId: null,
      dateTime: parsedDate.toISOString(),
      body: label,
      title: label,
      status: null,
      location: null,
      agendaUrl: links.agendaUrl,
      minutesUrl: links.minutesUrl,
      packetUrl: links.packetUrl,
      meetingUrl,
      sourceUrl
    });
  }

  return sortMeetings(dedupeMeetings(meetings));
}

function summarizeCandidateKeys(candidates) {
  const keyCounts = new Map();
  candidates.slice(0, 3000).forEach((candidate) => {
    Object.keys(candidate).forEach((key) => {
      keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
    });
  });

  return [...keyCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 20)
    .map(([key, count]) => ({ key, count }));
}

function extractMeetingsFromJsonBlobs(jsonBlobs, sourceUrl) {
  const candidates = [];

  jsonBlobs.forEach((blob) => {
    walkObjects(blob, (obj) => {
      candidates.push(obj);
    });
  });

  const normalized = candidates
    .map((candidate) => normalizeCandidate(candidate, sourceUrl))
    .filter(Boolean);

  return {
    meetings: sortMeetings(dedupeMeetings(normalized)),
    candidateObjectCount: candidates.length,
    topKeys: summarizeCandidateKeys(candidates)
  };
}

function normalizeKnownApiEvent(event, categoryNameById, sourceUrl) {
  if (!event || typeof event !== "object") {
    return null;
  }

  const rawDate = pickFirstValue(event, [
    "startDateTime",
    "startDate",
    "meetingDate",
    "dateTime",
    "date",
    "start"
  ]);
  const normalizedDateTime = normalizeKnownApiDateTime(rawDate);
  const parsedDate = parseDate(normalizedDateTime);
  if (!parsedDate) {
    return null;
  }

  const categoryId = pickFirstValue(event, ["categoryId", "eventCategoryId", "categoryID"]);
  const categoryName =
    pickFirstValue(event, ["categoryName", "eventCategoryName", "committeeName", "boardName"]) ||
    (categoryId !== null && categoryId !== undefined ? categoryNameById.get(Number(categoryId)) : null);
  const title =
    pickFirstValue(event, ["eventName", "meetingName", "title", "name", "subject"]) ||
    categoryName ||
    "Meeting";

  const derivedLinks = collectAttachmentLinks(event, sourceUrl);
  const eventId = pickFirstValue(event, ["eventId", "id", "eventID"]);

  let meetingUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(event, ["eventUrl", "meetingUrl", "detailUrl"]), sourceUrl) || derivedLinks.meetingUrl || null,
    "meeting"
  );

  if (!meetingUrl && eventId) {
    meetingUrl = sanitizeMeetingResourceUrl(absoluteUrl(`/event/${eventId}`, sourceUrl), "meeting");
  }

  const agendaUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(event, ["agendaUrl", "agendaPacketUrl", "agendaDocumentUrl"]), sourceUrl) ||
      derivedLinks.agendaUrl ||
      null,
    "agenda"
  );
  const minutesUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(event, ["minutesUrl", "minutesDocumentUrl"]), sourceUrl) ||
      derivedLinks.minutesUrl ||
      null,
    "minutes"
  );
  const packetUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(pickFirstValue(event, ["packetUrl", "backupUrl", "supportingDocumentUrl"]), sourceUrl) ||
      derivedLinks.packetUrl ||
      null,
    "packet"
  );
  const mediaUrl = sanitizeMeetingResourceUrl(
    absoluteUrl(
      pickFirstValue(event, [
        "mediaUrl",
        "videoUrl",
        "streamUrl",
        "playbackUrl",
        "eventMediaUrl",
        "eventMediaLink"
      ]),
      sourceUrl
    ) || derivedLinks.mediaUrl || null,
    "media"
  );

  return {
    id: eventId || null,
    sourceId: eventId || null,
    dateTime: normalizedDateTime,
    body: categoryName || "Meeting",
    title,
    status: pickFirstValue(event, ["status", "eventStatus", "meetingStatus"]) || null,
    location: deriveMeetingLocation(event, derivedLinks, sourceUrl),
    agendaUrl,
    minutesUrl,
    packetUrl,
    meetingUrl,
    mediaUrl,
    sourceUrl
  };
}

function classifyMeetingLink(url, text) {
  const lowered = `${url || ""} ${text || ""}`.toLowerCase();
  if (
    lowered.includes("video") ||
    lowered.includes("media") ||
    lowered.includes("watch") ||
    lowered.includes("youtube") ||
    lowered.includes("vimeo") ||
    lowered.includes(".mp4") ||
    lowered.includes(".m3u8")
  ) {
    return "media";
  }

  if (lowered.includes("agenda")) {
    return "agenda";
  }

  if (lowered.includes("minute")) {
    return "minutes";
  }

  if (lowered.includes("packet") || lowered.includes("backup") || lowered.includes("/stream/")) {
    return "packet";
  }

  return null;
}

function extractAnchorLinks(html, baseUrl) {
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links = [];
  let match;
  while ((match = anchorRegex.exec(html)) !== null) {
    const resolved = absoluteUrl(match[1], baseUrl);
    if (!resolved) {
      continue;
    }

    links.push({
      url: resolved,
      text: decodeHtmlEntities(stripTags(match[2]))
    });
  }

  return links;
}

function extractLocationFromDetailHtml(html, links) {
  const zoomLink = links.find((link) => inferVirtualPlatform(link.url || link.text));
  if (zoomLink) {
    const platform = inferVirtualPlatform(zoomLink.url || zoomLink.text);
    if (platform) {
      return platform;
    }
  }

  const text = decodeHtmlEntities(stripTags(html));
  const locationPatterns = [
    /location\s*[:\-]\s*([A-Za-z0-9&'.,()#\-/ ]{3,120})/i,
    /where\s*[:\-]\s*([A-Za-z0-9&'.,()#\-/ ]{3,120})/i
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const normalized = normalizeLocationLabel(match[1]);
      if (normalized) {
        return normalized;
      }
    }
  }

  const platform = inferVirtualPlatform(text);
  if (platform) {
    return platform;
  }

  return null;
}

function mergeMeetingLink(meeting, kind, url) {
  if (!url) {
    return;
  }

  if (kind === "agenda" && !meeting.agendaUrl) {
    meeting.agendaUrl = sanitizeMeetingResourceUrl(url, "agenda");
  }
  if (kind === "minutes" && !meeting.minutesUrl) {
    meeting.minutesUrl = sanitizeMeetingResourceUrl(url, "minutes");
  }
  if (kind === "packet" && !meeting.packetUrl) {
    meeting.packetUrl = sanitizeMeetingResourceUrl(url, "packet");
  }
  if (kind === "media" && !meeting.mediaUrl) {
    meeting.mediaUrl = sanitizeMeetingResourceUrl(url, "media");
  }
}

async function enrichMeetingsFromDetailPages(meetings, sourceUrl, debug = false) {
  const diagnostics = {
    attempted: 0,
    fetched: 0,
    enrichedLocationCount: 0,
    enrichedAgendaCount: 0,
    enrichedMinutesCount: 0,
    enrichedPacketCount: 0,
    enrichedMediaCount: 0,
    errors: []
  };

  for (const meeting of meetings) {
    const meetingUrl =
      sanitizeMeetingResourceUrl(meeting.meetingUrl, "meeting") ||
      (meeting.id ? sanitizeMeetingResourceUrl(absoluteUrl(`/event/${meeting.id}`, sourceUrl), "meeting") : null);

    if (!meetingUrl || (meeting.location && meeting.agendaUrl && meeting.minutesUrl && meeting.packetUrl && meeting.mediaUrl)) {
      continue;
    }

    diagnostics.attempted += 1;
    try {
      const response = await fetch(meetingUrl, {
        headers: {
          "user-agent": "BF-meeting-sync/1.0",
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
      });

      if (!response.ok) {
        if (debug) {
          diagnostics.errors.push({ meetingId: meeting.id, meetingUrl, status: response.status });
        }
        continue;
      }

      diagnostics.fetched += 1;
      const html = await response.text();
      const links = extractAnchorLinks(html, sourceUrl);

      const before = {
        location: Boolean(meeting.location),
        agenda: Boolean(meeting.agendaUrl),
        minutes: Boolean(meeting.minutesUrl),
        packet: Boolean(meeting.packetUrl),
        media: Boolean(meeting.mediaUrl)
      };

      if (!meeting.location) {
        const extractedLocation = extractLocationFromDetailHtml(html, links);
        if (extractedLocation) {
          meeting.location = extractedLocation;
        }
      }

      links.forEach((link) => {
        const kind = classifyMeetingLink(link.url, link.text);
        if (kind) {
          mergeMeetingLink(meeting, kind, link.url);
        }
      });

      if (!before.location && meeting.location) diagnostics.enrichedLocationCount += 1;
      if (!before.agenda && meeting.agendaUrl) diagnostics.enrichedAgendaCount += 1;
      if (!before.minutes && meeting.minutesUrl) diagnostics.enrichedMinutesCount += 1;
      if (!before.packet && meeting.packetUrl) diagnostics.enrichedPacketCount += 1;
      if (!before.media && meeting.mediaUrl) diagnostics.enrichedMediaCount += 1;
    } catch (error) {
      if (debug) {
        diagnostics.errors.push({ meetingId: meeting.id, meetingUrl, error: error.message });
      }
    }
  }

  return diagnostics;
}

async function enrichMeetingsFromKnownApiMedia(meetings, sourceUrl, debug = false) {
  const diagnostics = {
    attempts: [],
    extractedRows: 0,
    enrichedLocationCount: 0,
    enrichedMediaCount: 0,
    enrichedAgendaCount: 0,
    enrichedMinutesCount: 0,
    enrichedPacketCount: 0
  };

  const eventIds = unique(
    meetings
      .map((meeting) => Number(meeting.id))
      .filter((value) => Number.isInteger(value) && value > 0)
  );
  if (!eventIds.length) {
    return diagnostics;
  }

  const headers = buildKnownApiHeaders(sourceUrl);
  const requestUrls = [
    `${KNOWN_API_BASE}/EventsMedia?$top=1000`,
    `${KNOWN_API_BASE}/EventsMedia?$filter=eventId in (${eventIds.join(",")})&$top=1000`
  ];

  const byId = new Map(meetings.map((meeting) => [Number(meeting.id), meeting]));

  for (const requestUrl of requestUrls) {
    const attempt = { url: requestUrl };
    try {
      const response = await fetch(requestUrl, { headers });
      attempt.status = response.status;
      if (!response.ok) {
        diagnostics.attempts.push(attempt);
        continue;
      }

      const payload = await response.json();
      const rows = extractArrayPayload(payload);
      attempt.rowCount = rows.length;
      diagnostics.extractedRows = Math.max(diagnostics.extractedRows, rows.length);
      diagnostics.attempts.push(attempt);

      rows.forEach((row) => {
        const eventId = Number(pickFirstValue(row, ["eventId", "eventID", "id"]));
        if (!Number.isInteger(eventId) || !byId.has(eventId)) {
          return;
        }

        const meeting = byId.get(eventId);
        const rawUrl = absoluteUrl(
          pickFirstValue(row, [
            "url",
            "href",
            "mediaUrl",
            "videoUrl",
            "streamUrl",
            "playbackUrl",
            "fileUrl",
            "documentUrl",
            "eventMediaUrl"
          ]),
          sourceUrl
        );
        const label = pickFirstValue(row, ["title", "name", "type", "label"]);
        const kind = classifyMeetingLink(rawUrl, label);
        const url = sanitizeMeetingResourceUrl(rawUrl, kind || "media");
        if (!url) {
          return;
        }

        const before = {
          location: Boolean(meeting.location),
          agenda: Boolean(meeting.agendaUrl),
          minutes: Boolean(meeting.minutesUrl),
          packet: Boolean(meeting.packetUrl),
          media: Boolean(meeting.mediaUrl)
        };

        if (kind) {
          mergeMeetingLink(meeting, kind, url);
        }

        if (!kind && !meeting.mediaUrl) {
          meeting.mediaUrl = sanitizeMeetingResourceUrl(url, "media");
        }

        if (!meeting.location) {
          const locationFromRow = normalizeLocationLabel(
            pickFirstStringValue(row, [
              ...LOCATION_KEYS,
              "platform",
              "platformName",
              "description",
              "name",
              "title"
            ])
          );
          const locationFromUrl = inferVirtualPlatform(url);
          meeting.location = locationFromRow || locationFromUrl || null;
        }

        if (!before.location && meeting.location) diagnostics.enrichedLocationCount += 1;
        if (!before.agenda && meeting.agendaUrl) diagnostics.enrichedAgendaCount += 1;
        if (!before.minutes && meeting.minutesUrl) diagnostics.enrichedMinutesCount += 1;
        if (!before.packet && meeting.packetUrl) diagnostics.enrichedPacketCount += 1;
        if (!before.media && meeting.mediaUrl) diagnostics.enrichedMediaCount += 1;
      });

      if (diagnostics.enrichedMediaCount > 0) {
        break;
      }
    } catch (error) {
      attempt.error = error.message;
      diagnostics.attempts.push(attempt);
    }
  }

  if (!debug) {
    diagnostics.attempts = diagnostics.attempts.slice(0, 3);
  }

  return diagnostics;
}

async function extractMeetingsFromKnownApi(sourceUrl, debug = false) {
  const headers = buildKnownApiHeaders(sourceUrl);
  const categoryIds = parseCategoryIdsFromSource(sourceUrl);
  const diagnostics = {
    baseUrl: KNOWN_API_BASE,
    categories: categoryIds,
    categoryRequest: null,
    categoryCount: 0,
    eventRequests: [],
    matchedRequest: null,
    extractedCount: 0
  };

  const categoryNameById = new Map();
  try {
    const categoryUrl = `${KNOWN_API_BASE}/EventCategories`;
    const response = await fetch(categoryUrl, { headers });
    diagnostics.categoryRequest = {
      url: categoryUrl,
      status: response.status,
      contentType: response.headers.get("content-type") || null
    };

    if (response.ok) {
      const payload = await response.json();
      const rows = extractArrayPayload(payload);
      diagnostics.categoryCount = rows.length;
      rows.forEach((row) => {
        const id = pickFirstValue(row, ["categoryId", "id", "eventCategoryId"]);
        const name = pickFirstValue(row, ["categoryName", "name", "title"]);
        if (id !== null && id !== undefined && name) {
          categoryNameById.set(Number(id), `${name}`.trim());
        }
      });
    }
  } catch (error) {
    diagnostics.categoryRequest = {
      url: `${KNOWN_API_BASE}/EventCategories`,
      error: error.message
    };
  }

  const today = formatDateForApiFilter(new Date());
  const filterParts = [];
  if (categoryIds.length) {
    filterParts.push(`categoryId in (${categoryIds.join(",")})`);
  }

  const candidateFilters = [];
  if (filterParts.length) {
    candidateFilters.push(`startDateTime ge ${today} and ${filterParts.join(" and ")}`);
    candidateFilters.push(`startDateTime gt ${today} and ${filterParts.join(" and ")}`);
    candidateFilters.push(filterParts.join(" and "));
    candidateFilters.push(`startDateTime lt ${today} and ${filterParts.join(" and ")}`);
  } else {
    candidateFilters.push(`startDateTime ge ${today}`);
    candidateFilters.push(`startDateTime gt ${today}`);
    candidateFilters.push(`startDateTime lt ${today}`);
  }

  const orderings = [
    "startDateTime asc, eventName asc",
    "startDateTime desc, eventName desc"
  ];

  let bestMeetings = [];
  let bestRequest = null;

  const eventRequestUrls = [];
  candidateFilters.forEach((filterValue) => {
    orderings.forEach((orderValue) => {
      const params = new URLSearchParams();
      params.set("$filter", filterValue);
      params.set("$orderby", orderValue);
      params.set("$top", "500");
      eventRequestUrls.push(`${KNOWN_API_BASE}/Events?${params.toString()}`);
    });
  });

  for (const requestUrl of unique(eventRequestUrls)) {
    const requestDiag = { url: requestUrl };
    try {
      const response = await fetch(requestUrl, { headers });
      requestDiag.status = response.status;
      requestDiag.contentType = response.headers.get("content-type") || null;

      if (!response.ok) {
        diagnostics.eventRequests.push(requestDiag);
        continue;
      }

      const payload = await response.json();
      const rows = extractArrayPayload(payload);
      requestDiag.rowCount = rows.length;
      const normalized = rows
        .map((row) => normalizeKnownApiEvent(row, categoryNameById, sourceUrl))
        .filter(Boolean);
      const deduped = sortMeetings(dedupeMeetings(normalized));
      requestDiag.normalizedCount = deduped.length;
      diagnostics.eventRequests.push(requestDiag);

      if (deduped.length > bestMeetings.length) {
        bestMeetings = deduped;
        bestRequest = requestUrl;
      }

      if (deduped.length >= 20) {
        break;
      }
    } catch (error) {
      requestDiag.error = error.message;
      diagnostics.eventRequests.push(requestDiag);
    }
  }

  diagnostics.matchedRequest = bestRequest;
  diagnostics.extractedCount = bestMeetings.length;

  if (bestMeetings.length) {
    diagnostics.mediaApiEnrichment = await enrichMeetingsFromKnownApiMedia(bestMeetings, sourceUrl, debug);
    diagnostics.detailPageEnrichment = await enrichMeetingsFromDetailPages(bestMeetings, sourceUrl, debug);
  }

  if (!debug) {
    diagnostics.eventRequests = diagnostics.eventRequests.slice(0, 6);
  }

  return { meetings: bestMeetings, diagnostics };
}

function extractMeetings(html, sourceUrl) {
  const jsonBlobs = extractEmbeddedJson(html);
  const fromJsonResults = extractMeetingsFromJsonBlobs(jsonBlobs, sourceUrl);
  const fromJson = fromJsonResults.meetings;
  const fromAnchors = fromJson.length ? [] : extractMeetingsFromAnchors(html, sourceUrl);
  const meetings = fromJson.length ? fromJson : fromAnchors;

  return {
    meetings,
    diagnostics: {
      jsonBlobCount: jsonBlobs.length,
      candidateObjectCount: fromJsonResults.candidateObjectCount,
      normalizedFromJsonCount: fromJson.length,
      normalizedFromAnchorCount: fromAnchors.length,
      topKeys: fromJsonResults.topKeys
    }
  };
}

async function extractMeetingsFromBundleEndpoints(scriptSources, sourceUrl, debug = false) {
  const origin = getSourceOrigin(sourceUrl);
  const bundleSources = unique(
    scriptSources.filter((scriptSource) => {
      try {
        const parsed = new URL(scriptSource);
        return parsed.origin === origin && parsed.pathname.includes("/static/js/");
      } catch {
        return false;
      }
    })
  ).slice(0, 5);

  const diagnostics = {
    bundleSourceCount: bundleSources.length,
    bundleFetches: [],
    endpointCandidateCount: 0,
    endpointCandidates: [],
    endpointRequestCount: 0,
    requestAttempts: [],
    matchedEndpoint: null,
    extractedFromEndpointCount: 0
  };

  if (!bundleSources.length) {
    return { meetings: [], diagnostics };
  }

  const endpointCandidates = [...FALLBACK_ENDPOINT_PATHS.map((pathValue) => absoluteUrl(pathValue, sourceUrl)).filter(Boolean)];

  for (const bundleSource of bundleSources) {
    try {
      const response = await fetch(bundleSource, {
        headers: {
          "user-agent": "BF-meeting-sync/1.0",
          accept: "text/javascript,application/javascript,text/plain,*/*"
        }
      });

      if (!response.ok) {
        diagnostics.bundleFetches.push({
          url: bundleSource,
          ok: false,
          status: response.status
        });
        continue;
      }

      const body = await response.text();
      diagnostics.bundleFetches.push({
        url: bundleSource,
        ok: true,
        status: response.status,
        bodyLength: body.length
      });

      endpointCandidates.push(...extractEndpointCandidatesFromBundle(body, sourceUrl));
    } catch (error) {
      diagnostics.bundleFetches.push({
        url: bundleSource,
        ok: false,
        error: error.message
      });
    }
  }

  const uniqueEndpointCandidates = unique(endpointCandidates).slice(0, 80);
  diagnostics.endpointCandidateCount = uniqueEndpointCandidates.length;
  diagnostics.endpointCandidates = uniqueEndpointCandidates.slice(0, 30);

  const endpointRequests = unique(
    uniqueEndpointCandidates.flatMap((endpointCandidate) => buildEndpointRequestUrls(endpointCandidate, sourceUrl))
  ).slice(0, 120);
  diagnostics.endpointRequestCount = endpointRequests.length;

  let bestMeetings = [];
  let bestRequest = null;

  for (const requestUrl of endpointRequests) {
    let attempt = {
      url: requestUrl,
      ok: false
    };

    try {
      const response = await fetch(requestUrl, {
        headers: {
          "user-agent": "BF-meeting-sync/1.0",
          accept: "application/json,text/plain,*/*"
        }
      });

      attempt.status = response.status;
      attempt.contentType = response.headers.get("content-type") || null;

      if (!response.ok) {
        if (debug) {
          diagnostics.requestAttempts.push(attempt);
        }
        continue;
      }

      const body = await response.text();
      attempt.bodyLength = body.length;
      const payloads = parsePotentialJsonPayloads(body);

      if (!payloads.length) {
        if (debug) {
          diagnostics.requestAttempts.push({ ...attempt, parseableJsonPayloads: 0 });
        }
        continue;
      }

      const extracted = extractMeetingsFromJsonBlobs(payloads, sourceUrl);
      attempt.parseableJsonPayloads = payloads.length;
      attempt.extractedMeetings = extracted.meetings.length;

      if (debug) {
        diagnostics.requestAttempts.push(attempt);
      }

      if (extracted.meetings.length > bestMeetings.length) {
        bestMeetings = extracted.meetings;
        bestRequest = requestUrl;
      }

      if (bestMeetings.length >= 10) {
        break;
      }
    } catch (error) {
      if (debug) {
        diagnostics.requestAttempts.push({ ...attempt, error: error.message });
      }
    }
  }

  diagnostics.matchedEndpoint = bestRequest;
  diagnostics.extractedFromEndpointCount = bestMeetings.length;
  return { meetings: bestMeetings, diagnostics };
}

async function atomicWriteJson(filePath, data) {
  const tempPath = `${filePath}.tmp`;
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(tempPath, content, "utf8");
  await fs.rename(tempPath, filePath);
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return;
  }

  if (!args.sourceUrl) {
    throw new Error("--source requires a URL value.");
  }

  const diagnostics = {};
  const knownApiResults = await extractMeetingsFromKnownApi(args.sourceUrl, args.debug);
  diagnostics.knownApi = knownApiResults.diagnostics;

  let meetings = knownApiResults.meetings;

  if (!meetings.length) {
    let response;
    try {
      response = await fetch(args.sourceUrl, {
        headers: {
          "user-agent": "BF-meeting-sync/1.0"
        }
      });
    } catch (error) {
      throw new Error(`Failed to fetch source URL: ${args.sourceUrl}. ${error.message}`);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch source (${response.status} ${response.statusText}).`);
    }

    const html = await response.text();
    const extracted = extractMeetings(html, args.sourceUrl);
    meetings = extracted.meetings;
    Object.assign(diagnostics, extracted.diagnostics);

    const scriptSources = extractScriptSources(html, args.sourceUrl);
    const interestingLinks = extractInterestingLinks(html, args.sourceUrl);
    diagnostics.page = {
      status: response.status,
      finalUrl: response.url,
      htmlLength: html.length,
      title: extractPageTitle(html),
      scriptSourceCount: scriptSources.length,
      scriptSources: scriptSources.slice(0, 15),
      interestingLinks: interestingLinks.slice(0, 20),
      signals: detectPageSignals(html)
    };

    if (!meetings.length && scriptSources.length) {
      const bundleResults = await extractMeetingsFromBundleEndpoints(scriptSources, args.sourceUrl, args.debug);
      diagnostics.bundle = bundleResults.diagnostics;
      if (bundleResults.meetings.length) {
        meetings = bundleResults.meetings;
        diagnostics.normalizedFromBundleCount = bundleResults.meetings.length;
      }
    }
  }

  const meta = {
    sourceUrl: args.sourceUrl,
    lastUpdated: new Date().toISOString(),
    count: meetings.length
  };

  if (args.dryRun) {
    console.log(`Dry run complete. Parsed ${meetings.length} meetings.`);
    if (args.diagFile) {
      await fs.mkdir(path.dirname(args.diagFile), { recursive: true });
      await fs.writeFile(args.diagFile, `${JSON.stringify(diagnostics, null, 2)}\n`, "utf8");
      console.log(`Wrote diagnostics to ${args.diagFile}`);
    }
    if (args.debug || !meetings.length) {
      console.log("Diagnostics:");
      console.log(JSON.stringify(diagnostics, null, 2));
    }
    console.log("Sample output:");
    console.log(JSON.stringify(meetings.slice(0, 3), null, 2));
    return;
  }

  if (!meetings.length && !args.allowEmpty) {
    throw new Error(
      "No meetings were extracted. Existing files were not modified. Run with --dry-run --debug for diagnostics or --allow-empty to force write."
    );
  }

  await fs.mkdir(args.outDir, { recursive: true });

  const meetingsPath = path.join(args.outDir, "meetings.json");
  const metaPath = path.join(args.outDir, "meetings_meta.json");

  await atomicWriteJson(meetingsPath, meetings);
  await atomicWriteJson(metaPath, meta);

  console.log(`Synced ${meetings.length} meetings.`);
  console.log(`Wrote ${meetingsPath}`);
  console.log(`Wrote ${metaPath}`);
}

run().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
