import { JobData } from "../lib/types";
import { PopupHeader } from "./PopupHeader";

function getInitials(company: string): string {
  return (company || "?")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface LoadingStateProps {
  jobData: JobData;
}

export function LoadingState({ jobData }: LoadingStateProps) {
  return (
    <div className="w-[380px] bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(15,23,42,.1)]">
      <PopupHeader statusText="Processando…" statusColor="gray" />

      <div className="px-4 py-[22px] pb-6 flex flex-col items-center gap-[18px]">
        {/* Job summary chip */}
        <div className="w-full flex items-center gap-[9px] bg-[#f8fafc] border border-[#f1f5f9] rounded-[9px] px-[11px] py-[9px]">
          <div className="w-7 h-7 rounded-[7px] bg-purple-100 text-purple-700 flex items-center justify-center font-space-grotesk font-bold text-[11px] flex-none">
            {getInitials(jobData.company)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12.5px] font-semibold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
              {jobData.title}
            </span>
            <span className="text-[11.5px] text-slate-400">
              {jobData.company || "Empresa"}
            </span>
          </div>
        </div>

        {/* Spinner */}
        <div
          className="w-11 h-11 rounded-full border-[3px] border-[#ecfdf5] border-t-[#059669]"
          style={{ animation: "spin .8s linear infinite" }}
        />

        {/* Message */}
        <div className="text-center flex flex-col gap-1">
          <span className="font-space-grotesk font-semibold text-[14.5px] text-slate-900">
            Adaptando seu currículo com IA
          </span>
          <span className="text-[12px] text-slate-500">
            Ajustando experiências para a vaga…
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[6px] rounded-full bg-[#ecfdf5] overflow-hidden">
          <div
            className="h-full w-[30%] rounded-full bg-[#059669]"
            style={{ animation: "indet 1.4s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
