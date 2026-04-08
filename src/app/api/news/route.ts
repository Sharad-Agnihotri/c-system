import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = "26f92baa3951417d955fa50f8b139ff0";
const NEWS_API_BASE = "https://newsapi.org/v2";

// In-memory cache: topic -> { data, fetchedAt }
const cache: Record<string, { data: unknown; fetchedAt: number }> = {};

function getNextRefreshTime(): number {
  const now = new Date();
  const today12PM = new Date(now);
  today12PM.setHours(12, 0, 0, 0);

  // If it's past 12 PM today, next refresh is tomorrow at 12 PM
  if (now.getTime() >= today12PM.getTime()) {
    today12PM.setDate(today12PM.getDate() + 1);
  }

  return today12PM.getTime();
}

function isCacheValid(fetchedAt: number): boolean {
  const now = Date.now();
  const today12PM = new Date();
  today12PM.setHours(12, 0, 0, 0);

  // If fetched before today's 12 PM and we're now past 12 PM, cache is stale
  if (fetchedAt < today12PM.getTime() && now >= today12PM.getTime()) {
    return false;
  }

  // If fetched after today's 12 PM and we're still before tomorrow's 12PM, cache is valid
  // Also valid if fetched today before 12 PM and we're still before 12 PM
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic") || "technology";
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "20";

    const cacheKey = `${topic}_${page}_${pageSize}`;

    // Check cache
    if (cache[cacheKey] && isCacheValid(cache[cacheKey].fetchedAt)) {
      return NextResponse.json({
        ...(cache[cacheKey].data as object),
        cached: true,
        nextRefresh: getNextRefreshTime(),
      });
    }

    // Fetch from NewsAPI — use "everything" endpoint for topic-based search
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const fromDate = yesterday.toISOString().split("T")[0];

    const url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(topic)}&from=${fromDate}&sortBy=publishedAt&language=en&pageSize=${pageSize}&page=${page}&apiKey=${NEWS_API_KEY}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "CareerEcosystem/1.0",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: errorData.message || "Failed to fetch news",
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filter out articles with "[Removed]" title
    const filteredArticles = (data.articles || []).filter(
      (article: { title: string; description: string; urlToImage: string }) =>
        article.title !== "[Removed]" &&
        article.description &&
        article.urlToImage
    );

    const responseData = {
      status: data.status,
      totalResults: filteredArticles.length,
      articles: filteredArticles,
      topic,
      nextRefresh: getNextRefreshTime(),
    };

    // Cache the response
    cache[cacheKey] = {
      data: responseData,
      fetchedAt: Date.now(),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
