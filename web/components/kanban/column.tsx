import { useDroppable } from "@dnd-kit/core";
import { Job, JobStatus } from "@/lib/api";
import { JobCard } from "./job-card";

const STATUS_CONFIG: Record<JobStatus, { dotColor: string; label: string }> = {
  salva: { dotColor: "#94a3b8", label: "Salva" },
  aplicada: { dotColor: "#3b82f6", label: "Aplicada" },
  em_processo: { dotColor: "#f59e0b", label: "Em processo" },
  oferta: { dotColor: "#10b981", label: "Oferta" },
  arquivada: { dotColor: "#64748b", label: "Arquivada" },
};

interface KanbanColumnProps {
  status: JobStatus;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

export function KanbanColumn({ status, jobs, onSelectJob }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex-none w-[248px] flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <span
          className="w-2 h-2 rounded-full flex-none"
          style={{ background: config.dotColor }}
        />
        <span className="text-[13px] font-semibold text-slate-700">
          {config.label}
        </span>
        <span className="ml-auto text-[11.5px] font-semibold text-slate-500 bg-[#eef2f6] rounded-[6px] px-[7px] py-[2px]">
          {jobs.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-[10px] min-h-[80px] rounded-xl p-1 transition-colors ${
          isOver
            ? "bg-slate-100"
            : jobs.length === 0
            ? "border-2 border-dashed border-slate-200"
            : ""
        }`}
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onSelect={onSelectJob} />
        ))}
      </div>
    </div>
  );
}
