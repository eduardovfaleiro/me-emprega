import type { JobData, JobResponse } from "./types";

const API_BASE = "http://localhost:8000";

export async function createJob(data: JobData): Promise<JobResponse> {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Falha ao criar vaga: ${res.status} ${detail}`);
  }
  return res.json();
}

export function downloadResume(jobId: string, company: string): void {
  const filename = `Curriculo_${company.replace(/\s+/g, "_")}.pdf`;
  chrome.downloads.download({
    url: `${API_BASE}/jobs/${jobId}/resume/download`,
    filename,
    saveAs: false,
  });
}
