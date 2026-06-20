export interface JobData {
  title: string;
  company: string;
  description: string;
}

export interface JobResponse {
  id: string;
  title: string;
  company: string;
  status: string;
  created_at: string;
  adapted_resume: string | null;
}
