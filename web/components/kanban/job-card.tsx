"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Job } from "@/lib/api";
import { formatDate, getInitials, getAvatarColor } from "@/lib/utils";

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export function JobCard({ job, onSelect }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    border: job.status === "oferta" ? "1px solid #bbf7d0" : "1px solid #e8edf2",
    boxShadow:
      job.status === "oferta"
        ? "0 1px 3px rgba(16,185,129,.12)"
        : "0 1px 2px rgba(15,23,42,.04)",
    opacity: isDragging ? 0.5 : job.status === "arquivada" ? 0.7 : 1,
  };

  const initials = getInitials(job.company);
  const color = getAvatarColor(job.company);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-[11px] p-[14px] flex flex-col gap-[13px] cursor-grab active:cursor-grabbing select-none"
      onClick={() => onSelect(job)}
      {...listeners}
      {...attributes}
    >
      <div className="flex gap-[10px] items-start">
        <div
          className={`w-9 h-9 rounded-[9px] ${color.bg} ${color.text} flex items-center justify-center font-space-grotesk font-bold text-[13px] flex-none`}
        >
          {initials}
        </div>
        <div className="flex flex-col gap-[2px] min-w-0">
          <div className="font-semibold text-[13.5px] text-slate-900 leading-[1.3] truncate">
            {job.title}
          </div>
          <div className="text-[12.5px] text-slate-500 truncate">{job.company}</div>
        </div>
      </div>
      <div className="flex items-center gap-[5px] text-[11.5px] text-slate-400">
        <CalendarIcon />
        {formatDate(job.created_at)}
      </div>
    </div>
  );
}
