"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { fetchJobs, updateJobStatus, Job, JobStatus } from "@/lib/api";
import { KanbanColumn } from "./column";
import { JobDrawer } from "./job-drawer";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const COLUMNS: JobStatus[] = [
  "salva",
  "aplicada",
  "em_processo",
  "oferta",
  "arquivada",
];

function groupByStatus(jobs: Job[]): Record<JobStatus, Job[]> {
  const groups = Object.fromEntries(
    COLUMNS.map((s) => [s, [] as Job[]])
  ) as Record<JobStatus, Job[]>;
  for (const job of jobs) {
    if (groups[job.status]) groups[job.status].push(job);
  }
  return groups;
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function KanbanBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;
    const job = jobs.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) return;

    const previousJobs = jobs;
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      await updateJobStatus(jobId, newStatus);
    } catch {
      setJobs(previousJobs);
      toast.error("Erro ao mover vaga", {
        description:
          "Não foi possível salvar a alteração. Tente novamente.",
      });
    }
  }

  const grouped = groupByStatus(jobs);

  return (
    <div className="w-full min-h-screen bg-white">
      <Toaster />
      <div className="mx-auto max-w-[1388px] px-6 py-8">
        <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,.06)]">
          {/* Topbar */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-[#f1f5f9] bg-white">
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] rounded-[9px] bg-[#059669] flex items-center justify-center text-white flex-none">
                <CheckIcon />
              </div>
              <span className="font-space-grotesk font-semibold text-[17px] text-slate-900 tracking-tight">
                me emprega
              </span>
            </div>
            <span className="w-px h-[22px] bg-[#e5e7eb]" />
            <span className="text-[13.5px] text-slate-500 font-medium">
              Minhas vagas
            </span>
            <div className="ml-auto flex items-center gap-[10px]">
              <div className="flex items-center gap-2 w-[230px] border border-[#e5e7eb] rounded-[9px] px-[11px] py-2 text-slate-400 bg-white cursor-default">
                <SearchIcon />
                <span className="text-[13px]">Buscar vaga ou empresa</span>
              </div>
              <button
                disabled
                title="Adicione vagas pela extensão do navegador"
                className="inline-flex items-center gap-[7px] bg-[#059669] text-white rounded-[9px] px-[14px] py-[9px] text-[13.5px] font-semibold cursor-not-allowed opacity-80"
              >
                <PlusIcon />
                Nova vaga
              </button>
            </div>
          </div>

          {/* Board area */}
          <div className="bg-[#f8fafc] p-[22px_24px]">
            {loading && (
              <p className="text-sm text-slate-500 text-center py-12">
                Carregando vagas…
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500 text-center py-12">
                Erro ao carregar vagas: {error}
              </p>
            )}
            {!loading && !error && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="flex gap-4 items-start overflow-x-auto pb-2">
                  {COLUMNS.map((status) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      jobs={grouped[status]}
                      onSelectJob={setSelectedJob}
                    />
                  ))}
                </div>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      <JobDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
