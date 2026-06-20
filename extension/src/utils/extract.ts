import type { JobData } from "../lib/types";

export function extractJobFromPage(): {
  title: string;
  company: string;
  description: string;
} {
  const qs = (sel: string) =>
    document.querySelector(sel)?.textContent?.trim() ?? "";

  // LinkedIn
  const liTitle = qs(".job-details-jobs-unified-top-card__job-title");
  if (liTitle) {
    return {
      title: liTitle,
      company: qs(".job-details-jobs-unified-top-card__company-name"),
      description: qs(".jobs-description__content").slice(0, 3000),
    };
  }

  // Gupy
  const gupyTitle = qs('[data-testid="job-title"]');
  if (gupyTitle) {
    return {
      title: gupyTitle,
      company: qs('[data-testid="company-name"]'),
      description: qs('[data-testid="job-description"]').slice(0, 3000),
    };
  }

  // Generic fallback
  const h1 = qs("h1") || document.title;
  const desc =
    qs('[class*="description"]') ||
    qs('[class*="job-desc"]') ||
    qs("article") ||
    qs("main");

  return {
    title: h1.slice(0, 200),
    company: "",
    description: desc.slice(0, 3000),
  };
}

export async function extractJobFromCurrentTab(): Promise<JobData> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) throw new Error("No active tab");

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractJobFromPage,
  });

  const data = results[0]?.result;
  if (!data) throw new Error("Could not extract job data from page");
  return data;
}
