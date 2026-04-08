import { NextRequest, NextResponse } from "next/server";
import { FALLBACK_JOBS, Job } from "@/lib/jobs-fallback";

const SCRAPINGDOG_API_KEY = process.env.SCRAPINGDOG_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "Frontend Development";
  
  // 1. Attempt Scrapingdog Fetch
  if (SCRAPINGDOG_API_KEY && SCRAPINGDOG_API_KEY !== "YOUR_API_KEY") {
    try {
      // Hyphenate role for Scrapingdog compatibility
      const jobTitle = role.replace(/\s+/g, "-");
      const url = `https://api.scrapingdog.com/linkedinjobs?api_key=${SCRAPINGDOG_API_KEY}&job_title=${jobTitle}&geoid=102713980`;

      const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
      
      if (response.ok) {
        const data = await response.json();
        
        // Normalize Scrapingdog data to our Job schema
        if (Array.isArray(data) && data.length > 0) {
          const normalizedJobs: Job[] = data.map((j: any, i: number) => ({
            id: `sd-${i}`,
            title: j.job_title || "Software Engineer",
            company: j.company_name || "Tech Company",
            location: j.location || "Remote",
            salary: j.salary || "Competitive",
            type: "Remote", // Defaulting as specific type info is sparse in primary API
            postedAt: j.post_date || "Recently",
            url: j.job_link || "https://www.linkedin.com/jobs",
            logo: `https://logo.clearbit.com/${(j.company_name || "tech").toLowerCase().replace(/\s+/g, "")}.com`,
            matchScore: 90 + Math.floor(Math.random() * 10),
          }));
          
          return NextResponse.json({ 
            success: true, 
            source: "live", 
            jobs: normalizedJobs 
          });
        }
      }
    } catch (error) {
      console.error("Scrapingdog API Error, falling back:", error);
    }
  }

  // 2. Fallback to Curated Simulated Data
  console.log(`Using fallback data for role: ${role}`);
  const fallbackJobs = FALLBACK_JOBS[role] || FALLBACK_JOBS["Frontend Development"];
  
  return NextResponse.json({
    success: true,
    source: "simulated",
    jobs: fallbackJobs
  });
}
