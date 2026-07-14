import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

type Bucket = "hour" | "day";

function validDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function bucketKey(date: Date, bucket: Bucket) {
  const copy = new Date(date);
  if (bucket === "day") copy.setUTCHours(0, 0, 0, 0);
  else copy.setUTCMinutes(0, 0, 0);
  return copy.toISOString();
}

function namedCount<T extends string | null>(rows: { name: T; count: number }[]) {
  return rows
    .map(({ name, count }) => ({ name: name || "Unknown", count }))
    .sort((a, b) => b.count - a.count);
}

export async function GET(request: NextRequest) {
  const session = await requireSectionAccess("ANALYTICS");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const from = validDate(params.get("from"));
  const to = validDate(params.get("to"));
  const bucket: Bucket = params.get("bucket") === "hour" ? "hour" : "day";

  if (!from || !to || from >= to) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }
  if (to.getTime() - from.getTime() > 90 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Date range cannot exceed 90 days" }, { status: 400 });
  }

  const where = { ts: { gte: from, lt: to } };
  const liveSince = new Date(Date.now() - 5 * 60 * 1000);

  const [pageEvents, active, live, topPageViews, pageEngagement, sources, deviceTypes, browsers, systems, countries, cities] =
    await Promise.all([
      prisma.analyticsEvent.findMany({
        where: { ...where, event: "page_view" },
        select: { ts: true, visitorId: true },
        orderBy: { ts: "asc" },
      }),
      prisma.analyticsEvent.aggregate({ where, _sum: { activeSeconds: true } }),
      prisma.analyticsEvent.groupBy({
        by: ["visitorId"],
        where: { ts: { gte: liveSince }, event: { in: ["page_view", "heartbeat"] } },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["path"], where: { ...where, event: "page_view" }, _count: { path: true },
        orderBy: { _count: { path: "desc" } }, take: 12,
      }),
      prisma.analyticsEvent.groupBy({
        by: ["path"], where: { ...where, event: "heartbeat" }, _sum: { activeSeconds: true }, _count: { path: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["utmSource"], where: { ...where, event: "page_view" }, _count: { utmSource: true },
      }),
      prisma.analyticsEvent.groupBy({ by: ["deviceType"], where: { ...where, event: "page_view" }, _count: { deviceType: true } }),
      prisma.analyticsEvent.groupBy({ by: ["browser"], where: { ...where, event: "page_view" }, _count: { browser: true } }),
      prisma.analyticsEvent.groupBy({ by: ["os"], where: { ...where, event: "page_view" }, _count: { os: true } }),
      prisma.analyticsEvent.groupBy({ by: ["country"], where: { ...where, event: "page_view" }, _count: { country: true } }),
      prisma.analyticsEvent.groupBy({ by: ["city"], where: { ...where, event: "page_view" }, _count: { city: true } }),
    ]);

  const visitors = new Set(pageEvents.map((event) => event.visitorId));
  const buckets = new Map<string, { visitors: Set<string>; pageViews: number }>();
  for (const event of pageEvents) {
    const key = bucketKey(event.ts, bucket);
    const current = buckets.get(key) ?? { visitors: new Set<string>(), pageViews: 0 };
    current.visitors.add(event.visitorId);
    current.pageViews += 1;
    buckets.set(key, current);
  }

  const engagementByPath = new Map(pageEngagement.map((row) => [row.path, row]));
  const activeTimeSec = active._sum.activeSeconds ?? 0;

  return NextResponse.json({
    kpis: {
      visitors: visitors.size,
      pageViews: pageEvents.length,
      activeTimeSec,
      avgActiveTimeSec: visitors.size ? Math.round(activeTimeSec / visitors.size) : 0,
      liveUsers: live.length,
    },
    series: Array.from(buckets, ([t, value]) => ({ t, visitors: value.visitors.size, pageViews: value.pageViews })),
    topPages: topPageViews.map((row) => {
      const engagement = engagementByPath.get(row.path);
      return {
        path: row.path,
        views: row._count.path,
        avgActiveTimeSec: engagement?._count.path
          ? Math.round((engagement._sum.activeSeconds ?? 0) / engagement._count.path)
          : 0,
      };
    }),
    sources: namedCount(sources.map((row) => ({ name: row.utmSource, count: row._count.utmSource }))),
    devices: {
      deviceType: namedCount(deviceTypes.map((row) => ({ name: row.deviceType, count: row._count.deviceType }))),
      browser: namedCount(browsers.map((row) => ({ name: row.browser, count: row._count.browser }))),
      os: namedCount(systems.map((row) => ({ name: row.os, count: row._count.os }))),
    },
    geo: {
      enabled: countries.some((row) => Boolean(row.country)),
      countries: namedCount(countries.map((row) => ({ name: row.country, count: row._count.country }))),
      cities: namedCount(cities.map((row) => ({ name: row.city, count: row._count.city }))),
    },
  });
}
