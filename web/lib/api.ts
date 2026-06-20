const API_BASE = "http://localhost:8000";

export type JobStatus =
  | "salva"
  | "aplicada"
  | "em_processo"
  | "oferta"
  | "arquivada";

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  url: string | null;
  status: JobStatus;
  created_at: string;
  adapted_resume: string | null;
}

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/jobs`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
  return res.json();
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
  return res.json();
}

export function downloadResume(jobId: string, company: string): void {
  const link = document.createElement("a");
  link.href = `${API_BASE}/jobs/${jobId}/resume/download`;
  link.download = `Curriculo_${company.replace(/\s+/g, "_")}.pdf`;
  link.click();
}
