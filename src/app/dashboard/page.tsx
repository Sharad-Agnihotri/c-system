"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import PageHeader from "@/components/shared/PageHeader";
import {
  Newspaper,
  ExternalLink,
  Clock,
  RefreshCw,
  AlertCircle,
  ImageOff,
  TrendingUp,
} from "lucide-react";

/* ── Topic Configuration ─────────────────────────────────── */

const NEWS_TOPICS = [
  { value: "technology", label: "Technology", emoji: "💻" },
  { value: "artificial intelligence", label: "AI & ML", emoji: "🤖" },
  { value: "business", label: "Business", emoji: "📈" },
  { value: "science", label: "Science", emoji: "🔬" },
  { value: "health", label: "Health", emoji: "🏥" },
  { value: "sports", label: "Sports", emoji: "⚽" },
  { value: "entertainment", label: "Entertainment", emoji: "🎬" },
  { value: "politics", label: "Politics", emoji: "🏛️" },
  { value: "finance stock market", label: "Finance", emoji: "💰" },
  { value: "cybersecurity", label: "Cybersecurity", emoji: "🔒" },
  { value: "startups venture capital", label: "Startups", emoji: "🚀" },
  { value: "climate change environment", label: "Climate", emoji: "🌍" },
  { value: "space exploration NASA", label: "Space", emoji: "🪐" },
  { value: "gaming esports", label: "Gaming", emoji: "🎮" },
  { value: "cryptocurrency bitcoin", label: "Crypto", emoji: "₿" },
  { value: "education learning", label: "Education", emoji: "📚" },
  { value: "electric vehicles Tesla", label: "EV & Auto", emoji: "🚗" },
  { value: "world news international", label: "World", emoji: "🌐" },
  { value: "real estate housing", label: "Real Estate", emoji: "🏠" },
  { value: "food recipe cooking", label: "Food", emoji: "🍕" },
  { value: "fashion lifestyle", label: "Fashion", emoji: "👗" },
  { value: "travel tourism", label: "Travel", emoji: "✈️" },
  { value: "bollywood india", label: "Bollywood", emoji: "🎭" },
  { value: "cricket IPL", label: "Cricket", emoji: "🏏" },
];

/* ── Types ────────────────────────────────────────────────── */

interface Article {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
  topic: string;
  nextRefresh: number;
  cached?: boolean;
  error?: string;
}

/* ── Helpers ──────────────────────────────────────────────── */

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatRefreshTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return isToday ? `Today at ${timeStr}` : `Tomorrow at ${timeStr}`;
}

/* ── Component ────────────────────────────────────────────── */

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [selectedTopic, setSelectedTopic] = useState("technology");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextRefresh, setNextRefresh] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const fetchNews = useCallback(async (topic: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/news?topic=${encodeURIComponent(topic)}&pageSize=20`
      );
      const data: NewsResponse = await res.json();

      if (data.error) {
        setError(data.error);
        setArticles([]);
      } else {
        setArticles(data.articles || []);
        setNextRefresh(data.nextRefresh || null);
      }
    } catch {
      setError("Failed to fetch news. Please try again later.");
      setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch news on topic change
  useEffect(() => {
    fetchNews(selectedTopic);
  }, [selectedTopic, fetchNews]);

  // Auto-refresh at 12 PM
  useEffect(() => {
    if (!nextRefresh) return;
    const msUntilRefresh = nextRefresh - Date.now();
    if (msUntilRefresh <= 0) return;

    const timeout = setTimeout(() => {
      fetchNews(selectedTopic);
    }, msUntilRefresh);

    return () => clearTimeout(timeout);
  }, [nextRefresh, selectedTopic, fetchNews]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews(selectedTopic);
  };

  const handleImageError = (url: string) => {
    setFailedImages((prev) => new Set(prev).add(url));
  };

  const handleTopicChange = (topicValue: string) => {
    setSelectedTopic(topicValue);
    setFailedImages(new Set());
  };

  const currentTopic =
    NEWS_TOPICS.find((t) => t.value === selectedTopic) || NEWS_TOPICS[0];

  return (
    <div className="max-w-screen-2xl mx-auto">
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] || "there"}`}
        description="Your personalized daily news briefing"
      />

      {/* ── Topic Chips ───────────────────────────────────── */}
      <div className="animate-fade-in" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Choose a Topic
          </h2>

          {/* Refresh + Next refresh info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {nextRefresh && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                }}
              >
                <Clock className="w-3 h-3" />
                Refreshes: {formatRefreshTime(nextRefresh)}
              </span>
            )}
            <button
              id="refresh-news-btn"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                background: "transparent",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-full)",
                color: "var(--color-text-muted)",
                fontSize: "12px",
                cursor: refreshing || loading ? "not-allowed" : "pointer",
                opacity: refreshing || loading ? 0.5 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <RefreshCw
                className="w-3 h-3"
                style={{
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                }}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Scrollable chips container */}
        <div
          className="no-scrollbar"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {NEWS_TOPICS.map((topic) => {
            const isActive = selectedTopic === topic.value;
            return (
              <button
                key={topic.value}
                id={`topic-chip-${topic.value.replace(/\s+/g, "-")}`}
                onClick={() => handleTopicChange(topic.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: isActive
                    ? "var(--color-accent)"
                    : "var(--color-bg-card)",
                  border: `1px solid ${isActive ? "var(--color-accent)" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-full)",
                  color: isActive ? "#000000" : "var(--color-text-secondary)",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "15px" }}>{topic.emoji}</span>
                {topic.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Topic Header ───────────────────────────── */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <TrendingUp
          className="w-5 h-5"
          style={{ color: "var(--color-accent)" }}
        />
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {currentTopic.emoji} {currentTopic.label} News
        </h2>
        {!loading && (
          <span className="badge badge-accent" style={{ marginLeft: "4px" }}>
            {articles.length} articles
          </span>
        )}
      </div>

      {/* ── Loading Skeletons ─────────────────────────────── */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`card animate-fade-in stagger-${i + 1}`}
              style={{ overflow: "hidden" }}
            >
              <div
                className="animate-shimmer"
                style={{ height: "200px" }}
              />
              <div style={{ padding: "20px" }}>
                <div
                  className="animate-shimmer"
                  style={{
                    height: "14px",
                    borderRadius: "6px",
                    marginBottom: "10px",
                    width: "60%",
                  }}
                />
                <div
                  className="animate-shimmer"
                  style={{
                    height: "18px",
                    borderRadius: "6px",
                    marginBottom: "12px",
                    width: "90%",
                  }}
                />
                <div
                  className="animate-shimmer"
                  style={{
                    height: "12px",
                    borderRadius: "6px",
                    width: "100%",
                    marginBottom: "6px",
                  }}
                />
                <div
                  className="animate-shimmer"
                  style={{
                    height: "12px",
                    borderRadius: "6px",
                    width: "75%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error State ───────────────────────────────────── */}
      {error && !loading && (
        <div
          className="card animate-fade-in"
          style={{ padding: "48px", textAlign: "center" }}
        >
          <AlertCircle
            className="w-12 h-12"
            style={{ color: "var(--color-danger)", margin: "0 auto 16px" }}
          />
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            Unable to Load News
          </h3>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "14px",
              maxWidth: "400px",
              margin: "0 auto 20px",
            }}
          >
            {error}
          </p>
          <button className="btn-primary" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {/* ── Empty State ───────────────────────────────────── */}
      {!loading && !error && articles.length === 0 && (
        <div
          className="card animate-fade-in"
          style={{ padding: "48px", textAlign: "center" }}
        >
          <Newspaper
            className="w-12 h-12"
            style={{ color: "var(--color-text-muted)", margin: "0 auto 16px" }}
          />
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          >
            No Articles Found
          </h3>
          <p
            style={{
              color: "var(--color-text-muted)",
              fontSize: "14px",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            No news articles found for &quot;{currentTopic.label}&quot;. Try
            selecting a different topic.
          </p>
        </div>
      )}

      {/* ── News Grid ─────────────────────────────────────── */}
      {!loading && !error && articles.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {articles.map((article, i) => (
            <a
              key={`${article.url}-${i}`}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`card group animate-fade-in stagger-${Math.min(i + 1, 6)}`}
              id={`news-article-${i}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  height: "200px",
                  overflow: "hidden",
                  background: "var(--color-bg-elevated)",
                }}
              >
                {article.urlToImage &&
                !failedImages.has(article.urlToImage) ? (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    onError={() =>
                      article.urlToImage &&
                      handleImageError(article.urlToImage)
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    className="group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <ImageOff
                      className="w-8 h-8"
                      style={{
                        color: "var(--color-text-muted)",
                        opacity: 0.4,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-muted)",
                        opacity: 0.4,
                      }}
                    >
                      No image
                    </span>
                  </div>
                )}

                {/* Source badge overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    padding: "4px 10px",
                    background: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--color-accent)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {article.source.name}
                </div>
              </div>

              {/* Content */}
              <div
                style={{
                  padding: "20px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Time + Author */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                    fontSize: "12px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo(article.publishedAt)}</span>
                  {article.author && (
                    <>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span
                        style={{
                          maxWidth: "160px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {article.author}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: 1.5,
                    marginBottom: "10px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    transition: "color 0.2s ease",
                  }}
                  className="group-hover:text-[var(--color-accent)]"
                >
                  {article.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "var(--color-text-secondary)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flex: 1,
                  }}
                >
                  {article.description}
                </p>

                {/* Read More */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--color-accent)",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                  className="group-hover:opacity-100"
                >
                  Read full article
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* ── Footer ────────────────────────────────────────── */}
      {!loading && !error && articles.length > 0 && (
        <div
          className="animate-fade-in"
          style={{
            textAlign: "center",
            padding: "32px 0",
            fontSize: "12px",
            color: "var(--color-text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Newspaper className="w-3.5 h-3.5" />
          Powered by NewsAPI · Refreshes daily at 12:00 PM
        </div>
      )}
    </div>
  );
}
