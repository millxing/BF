#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const DEFAULT_SOURCE_URL =
  "https://brooklinema.portal.civicclerk.com/?category_id=28,59,144,87,26";
const DEFAULT_OUT_DIR = path.resolve(__dirname, "..", "data");
const API_BASE = "https://brooklinema.api.civicclerk.com/v1";

function usage() {
  return `Usage: node tools/sync_meetings.js [options]

Options:
  --source URL         Portal URL with category_id query param.
  --categories 1,2,3   Override categories.
  --since YYYY-MM-DD   Start date (inclusive). Default: Jan 1 of current year.
  --end YYYY-MM-DD     End date (inclusive). Default: Dec 31 of next year.
  --out DIR            Output directory. Default: data
  --help               Show this message.
`;
}

function getDefaultSinceDate() {
  const now = new Date();
  return `${now.getFullYear()}-01-01`;
}

function getDefaultEndDate() {
  const now = new Date();
  return `${now.getFullYear() + 1}-12-31`;
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(`${value || ""}`);
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
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0);
  } catch {
    return [];
  }
}

function parseArgs(argv) {
  const args = {
    sourceUrl: DEFAULT_SOURCE_URL,
    categories: null,
    sinceDate: getDefaultSinceDate(),
    endDate: getDefaultEndDate(),
    outDir: DEFAULT_OUT_DIR
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--source") {
      args.sourceUrl = `${next || ""}`.trim();
      index += 1;
      continue;
    }

    if (arg === "--categories") {
      args.categories = `${next || ""}`
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isInteger(item) && item > 0);
      index += 1;
      continue;
    }

    if (arg === "--since") {
      args.sinceDate = `${next || ""}`.trim();
      index += 1;
      continue;
    }

    if (arg === "--end") {
      args.endDate = `${next || ""}`.trim();
      index += 1;
      continue;
    }

    if (arg === "--out") {
      args.outDir = path.resolve(next || "");
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

async function writeMeetingsMeta(outDir, sinceDate, endDate) {
  const metaPath = path.join(outDir, "meta.json");
  const meetingsMetaPath = path.join(outDir, "meetings_meta.json");

  const rawMeta = await fs.readFile(metaPath, "utf8");
  const meta = JSON.parse(rawMeta);

  const meetingsMeta = {
    sourceUrl: meta.sourcePortalUrl || DEFAULT_SOURCE_URL,
    lastUpdated: meta.fetchedAt || new Date().toISOString(),
    count: Number.isFinite(meta.eventCount) ? meta.eventCount : 0,
    sinceDate,
    endDate
  };

  await fs.writeFile(meetingsMetaPath, `${JSON.stringify(meetingsMeta, null, 2)}\n`, "utf8");
  return meetingsMeta;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  if (!args.sourceUrl) {
    throw new Error("--source requires a URL.");
  }
  if (!isIsoDate(args.sinceDate)) {
    throw new Error("--since must use YYYY-MM-DD.");
  }
  if (!isIsoDate(args.endDate)) {
    throw new Error("--end must use YYYY-MM-DD.");
  }

  const source = new URL(args.sourceUrl);
  const categories = (args.categories && args.categories.length ? args.categories : parseCategoryIdsFromSource(args.sourceUrl));

  if (!categories.length) {
    throw new Error("No categories found. Pass --categories or include category_id in --source.");
  }

  const scraperPath = path.resolve(__dirname, "scrape_civic_range.js");
  const scraperArgs = [
    scraperPath,
    "--portal-base",
    source.origin,
    "--api-base",
    API_BASE,
    "--categories",
    categories.join(","),
    "--start-date",
    args.sinceDate,
    "--end-date",
    args.endDate,
    "--out",
    args.outDir
  ];

  const result = spawnSync(process.execPath, scraperArgs, {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }

  const meetingsMeta = await writeMeetingsMeta(args.outDir, args.sinceDate, args.endDate);
  console.log(`Wrote ${path.join(args.outDir, "meetings_meta.json")}`);
  console.log(`Synced ${meetingsMeta.count} meetings.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
