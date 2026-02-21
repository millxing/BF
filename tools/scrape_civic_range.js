#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULTS = {
  apiBase: "https://brooklinema.api.civicclerk.com/v1",
  portalBase: "https://brooklinema.portal.civicclerk.com",
  categories: [28, 59, 144, 87, 26],
  startDate: "2026-01-01",
  endDate: "2026-03-31",
  outDir: path.resolve(__dirname, "..", "civic")
};

function parseArgs(argv) {
  const args = {
    ...DEFAULTS
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--start-date") {
      args.startDate = next;
      index += 1;
      continue;
    }

    if (arg === "--end-date") {
      args.endDate = next;
      index += 1;
      continue;
    }

    if (arg === "--categories") {
      args.categories = `${next || ""}`
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value > 0);
      index += 1;
      continue;
    }

    if (arg === "--out") {
      args.outDir = path.resolve(next);
      index += 1;
      continue;
    }

    if (arg === "--api-base") {
      args.apiBase = `${next || ""}`.trim().replace(/\/+$/, "");
      index += 1;
      continue;
    }

    if (arg === "--portal-base") {
      args.portalBase = `${next || ""}`.trim().replace(/\/+$/, "");
      index += 1;
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

function usage() {
  return `Usage: node tools/scrape_civic_range.js [options]

Options:
  --start-date YYYY-MM-DD   Start date (inclusive). Default: ${DEFAULTS.startDate}
  --end-date YYYY-MM-DD     End date (inclusive). Default: ${DEFAULTS.endDate}
  --categories 1,2,3        Category IDs. Default: ${DEFAULTS.categories.join(",")}
  --out DIR                 Output directory. Default: ${DEFAULTS.outDir}
  --api-base URL            API base URL. Default: ${DEFAULTS.apiBase}
  --portal-base URL         Portal base URL. Default: ${DEFAULTS.portalBase}
  --help                    Show this help message.
`;
}

function assertDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${label} must be YYYY-MM-DD. Received: ${value}`);
  }
}

function toStartIso(dateValue) {
  return `${dateValue}T00:00:00Z`;
}

function toEndExclusiveIso(dateValue) {
  const date = new Date(`${dateValue}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid end date: ${dateValue}`);
  }
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().replace(".000", "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function absoluteUrl(rawValue, portalBase) {
  if (!rawValue || typeof rawValue !== "string") {
    return null;
  }

  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed, portalBase).toString();
  } catch {
    return null;
  }
}

function cleanText(value) {
  if (value === undefined || value === null) {
    return null;
  }
  const text = `${value}`.replace(/\s+/g, " ").trim();
  return text || null;
}

function extractLocation(event) {
  if (!event || typeof event !== "object" || !event.eventLocation) {
    return null;
  }

  const location = event.eventLocation;
  const parts = [location.address1, location.address2, location.city, location.state, location.zipCode]
    .map((item) => cleanText(item))
    .filter(Boolean);

  if (!parts.length) {
    return null;
  }

  return parts.join(", ");
}

function classifyFileType(typeValue) {
  const lowered = `${typeValue || ""}`.toLowerCase();
  if (lowered.includes("agenda packet") || lowered.includes("packet")) {
    return "agendaPacket";
  }
  if (lowered.includes("agenda")) {
    return "agenda";
  }
  if (lowered.includes("minute")) {
    return "minutes";
  }
  if (lowered.includes("media") || lowered.includes("video") || lowered.includes("stream")) {
    return "media";
  }
  return "other";
}

function normalizeFiles(rawFiles, portalBase, apiBase) {
  const files = Array.isArray(rawFiles) ? rawFiles : [];
  const buckets = {
    agenda: [],
    agendaPacket: [],
    minutes: [],
    media: [],
    other: []
  };

  const normalized = files
    .map((file) => {
      const fileId = Number(file.fileId);
      const derivedFileUrl =
        Number.isInteger(fileId) && fileId > 0
          ? `${apiBase}/Meetings/GetMeetingFile(fileId=${fileId},plainText=false)`
          : null;
      const derivedStreamUrl =
        Number.isInteger(fileId) && fileId > 0
          ? `${apiBase}/Meetings/GetMeetingFileStream(fileId=${fileId},plainText=false)`
          : null;

      const url = derivedFileUrl || absoluteUrl(file.url, portalBase);
      const streamUrl = derivedStreamUrl || absoluteUrl(file.streamUrl, portalBase);
      const type = cleanText(file.type);
      const kind = classifyFileType(type);
      const record = {
        type,
        kind,
        name: cleanText(file.name),
        publishOn: cleanText(file.publishOn),
        fileId: Number.isInteger(fileId) && fileId > 0 ? fileId : null,
        fileType: file.fileType ?? null,
        url,
        streamUrl
      };

      const link = streamUrl || url;
      if (link) {
        buckets[kind].push(link);
      }

      return record;
    })
    .filter((file) => file.url || file.streamUrl || file.name || file.type);

  return {
    files: normalized,
    agendaUrls: unique(buckets.agenda),
    agendaPacketUrls: unique(buckets.agendaPacket),
    minutesUrls: unique(buckets.minutes),
    mediaUrls: unique(buckets.media),
    otherUrls: unique(buckets.other)
  };
}

function normalizeEvent(event, portalBase, apiBase) {
  const links = normalizeFiles(event.publishedFiles, portalBase, apiBase);
  const externalMediaUrl = absoluteUrl(event.externalMediaUrl, portalBase);
  const mediaUrls = unique([externalMediaUrl, ...links.mediaUrls]);

  return {
    id: event.id ?? null,
    dateTime: cleanText(event.startDateTime),
    categoryId: event.categoryId ?? null,
    categoryName: cleanText(event.categoryName || event.eventCategoryName),
    title: cleanText(event.eventName),
    description: cleanText(event.eventDescription),
    location: extractLocation(event),
    hasAgenda: Boolean(event.hasAgenda),
    hasMedia: Boolean(event.hasMedia),
    meetingUrl: event.id ? `${portalBase}/event/${event.id}` : null,
    mediaUrl: mediaUrls[0] || null,
    agendaUrl: links.agendaUrls[0] || null,
    agendaPacketUrl: links.agendaPacketUrls[0] || null,
    minutesUrl: links.minutesUrls[0] || null,
    mediaUrls,
    agendaUrls: links.agendaUrls,
    agendaPacketUrls: links.agendaPacketUrls,
    minutesUrls: links.minutesUrls,
    otherUrls: links.otherUrls,
    publishedFiles: links.files
  };
}

async function fetchEvents(args) {
  const startIso = toStartIso(args.startDate);
  const endExclusiveIso = toEndExclusiveIso(args.endDate);
  const filter = `categoryId in (${args.categories.join(",")}) and startDateTime ge ${startIso} and startDateTime lt ${endExclusiveIso}`;

  const params = new URLSearchParams();
  params.set("$filter", filter);
  params.set("$orderby", "startDateTime asc, id asc");
  params.set("$top", "500");

  let url = `${args.apiBase}/Events?${params.toString()}`;
  const events = [];
  let pages = 0;

  while (url) {
    const response = await fetch(url, {
      headers: {
        accept: "application/json, text/plain, */*",
        "user-agent": "BF-civic-scrape/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url} (${response.status} ${response.statusText})`);
    }

    const payload = await response.json();
    const pageRows = Array.isArray(payload.value) ? payload.value : [];
    events.push(...pageRows);
    pages += 1;
    url = payload["@odata.nextLink"] || null;
  }

  return {
    startIso,
    endExclusiveIso,
    pages,
    events
  };
}

function csvEscape(value) {
  const text = value === null || value === undefined ? "" : `${value}`;
  const escaped = text.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function toCsv(rows) {
  const columns = [
    "id",
    "dateTime",
    "categoryId",
    "categoryName",
    "title",
    "location",
    "meetingUrl",
    "mediaUrl",
    "agendaUrl",
    "agendaPacketUrl",
    "minutesUrl"
  ];

  const lines = [columns.join(",")];
  rows.forEach((row) => {
    lines.push(columns.map((column) => csvEscape(row[column])).join(","));
  });
  return `${lines.join("\n")}\n`;
}

function buildMeetingsDataScript(meetings, meta) {
  const meetingsJson = JSON.stringify(meetings, null, 2);
  const scriptMeta = {
    sourceUrl: meta.sourcePortalUrl,
    lastUpdated: meta.fetchedAt,
    count: meta.eventCount
  };
  const metaJson = JSON.stringify(scriptMeta, null, 2);
  return `window.MEETINGS_DATA = ${meetingsJson};\n\nwindow.MEETINGS_META = ${metaJson};\n`;
}

async function writeOutputs(args, payload) {
  const dedupedMap = new Map();
  payload.events.forEach((event) => {
    if (event && Number.isInteger(event.id)) {
      dedupedMap.set(event.id, event);
    }
  });

  const events = [...dedupedMap.values()].sort((left, right) => {
    const leftTime = new Date(left.startDateTime || 0).getTime();
    const rightTime = new Date(right.startDateTime || 0).getTime();
    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    return (left.id || 0) - (right.id || 0);
  });

  const normalized = events.map((event) => normalizeEvent(event, args.portalBase, args.apiBase));
  const withAgenda = normalized.filter((meeting) => meeting.agendaUrl).length;
  const withPacket = normalized.filter((meeting) => meeting.agendaPacketUrl).length;
  const withMedia = normalized.filter((meeting) => meeting.mediaUrl).length;

  const meta = {
    sourcePortalUrl: `${args.portalBase}/?category_id=${args.categories.join(",")}`,
    apiBase: args.apiBase,
    categories: args.categories,
    startDateInclusive: args.startDate,
    endDateInclusive: args.endDate,
    startIsoInclusive: payload.startIso,
    endIsoExclusive: payload.endExclusiveIso,
    fetchedAt: new Date().toISOString(),
    pagesFetched: payload.pages,
    eventCount: normalized.length,
    withAgendaCount: withAgenda,
    withAgendaPacketCount: withPacket,
    withMediaCount: withMedia
  };

  await fs.mkdir(args.outDir, { recursive: true });

  const rawPath = path.join(args.outDir, "events_raw.json");
  const meetingsPath = path.join(args.outDir, "meetings.json");
  const csvPath = path.join(args.outDir, "meetings.csv");
  const metaPath = path.join(args.outDir, "meta.json");
  const scriptPath = path.join(args.outDir, "meetings_data.js");

  await fs.writeFile(rawPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");
  await fs.writeFile(meetingsPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  await fs.writeFile(csvPath, toCsv(normalized), "utf8");
  await fs.writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
  await fs.writeFile(scriptPath, buildMeetingsDataScript(normalized, meta), "utf8");

  return {
    rawPath,
    meetingsPath,
    csvPath,
    metaPath,
    scriptPath,
    meta
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  assertDate(args.startDate, "start-date");
  assertDate(args.endDate, "end-date");
  if (!args.categories.length) {
    throw new Error("At least one category ID is required.");
  }

  const fetchPayload = await fetchEvents(args);
  const output = await writeOutputs(args, fetchPayload);

  console.log(`Fetched ${output.meta.eventCount} meetings from ${args.startDate} to ${args.endDate}.`);
  console.log(`With agenda: ${output.meta.withAgendaCount}`);
  console.log(`With agenda packet: ${output.meta.withAgendaPacketCount}`);
  console.log(`With media: ${output.meta.withMediaCount}`);
  console.log(`Wrote ${output.rawPath}`);
  console.log(`Wrote ${output.meetingsPath}`);
  console.log(`Wrote ${output.csvPath}`);
  console.log(`Wrote ${output.metaPath}`);
  console.log(`Wrote ${output.scriptPath}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
