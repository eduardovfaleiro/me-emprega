"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Job, downloadResume } from "@/lib/api";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  salva: "Salva",
  aplicada: "Aplicada",
  em_processo: "Em processo",
  oferta: "Oferta",
  arquivada: "Arquivada",
};

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

interface JobDrawerProps {
  job: Job | null;
  onClose: () => void;
}

export function JobDrawer({ job, onClose }: JobDrawerProps) {
  const [maximized, setMaximized] = useState(false);

  function handleOpenChange(open: boolean) {
    if (!open) {
      onClose();
      setMaximized(false);
    }
  }

  return (
    <Sheet open={!!job} onOpenChange={handleOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] flex flex-col p-0 gap-0 overflow-hidden">
        {job && (
          <>
            <SheetHeader className="px-6 py-5 border-b border-slate-100 flex-none">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 min-w-0">
                  <SheetTitle className="text-[15.5px] font-semibold text-slate-900 leading-snug">
                    {job.title}
                  </SheetTitle>
                  <span className="text-[13px] text-slate-500">{job.company}</span>
                </div>
                <Badge variant="secondary" className="flex-none mt-1">
                  {STATUS_LABELS[job.status] ?? job.status}
                </Badge>
              </div>
            </SheetHeader>

            {!maximized && (
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col gap-3 flex-none">
                <div className="flex items-center gap-[6px] text-[12.5px] text-slate-500">
                  <CalendarIcon />
                  {formatDate(job.created_at)}
                </div>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] text-blue-600 hover:underline truncate"
                  >
                    {job.url}
                  </a>
                )}
                <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            )}

            <div className="px-6 py-4 flex flex-col gap-3 flex-1 min-h-0">
              <div className="flex items-center justify-between flex-none">
                <span className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide">
                  Currículo adaptado
                </span>
                {job.adapted_resume && (
                  <button
                    onClick={() => setMaximized((m) => !m)}
                    className="text-[12px] text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {maximized ? "Minimizar" : "Maximizar"}
                  </button>
                )}
              </div>

              {!job.adapted_resume ? (
                <p className="text-[13px] text-slate-400">
                  Currículo ainda não gerado.
                </p>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {job.adapted_resume}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <Button
                    onClick={() => downloadResume(job.id, job.company)}
                    variant="outline"
                    className="w-full flex-none gap-2"
                  >
                    <DownloadIcon />
                    Baixar PDF
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
