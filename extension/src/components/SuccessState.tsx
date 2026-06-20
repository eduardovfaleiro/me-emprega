import { JobData, JobResponse } from "../lib/types";
import { downloadResume } from "../lib/api";
import { PopupHeader } from "./PopupHeader";

function CheckCircleIcon() {
  return (
    <svg
      width="24"
      height="24"
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

function FileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

interface SuccessStateProps {
  jobData: JobData;
  jobResponse: JobResponse;
  onViewBoard: () => void;
}

export function SuccessState({
  jobData,
  jobResponse,
  onViewBoard,
}: SuccessStateProps) {
  const filename = `Curriculo_${(jobData.company || "curriculo").replace(/\s+/g, "_")}_${jobData.title.split(" ").slice(0, 2).join("_")}.pdf`;

  return (
    <div className="w-[380px] bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(15,23,42,.1)]">
      <PopupHeader statusText="Vaga adicionada ao quadro" statusColor="green" />

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* Success hero */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[#059669]">
            <CheckCircleIcon />
          </div>
          <div className="font-space-grotesk font-semibold text-[16px] text-slate-900">
            Currículo adaptado!
          </div>
          <div className="text-[12.5px] text-slate-500 max-w-[250px] leading-[1.5]">
            Otimizado para a vaga de{" "}
            <span className="text-slate-700 font-medium">{jobData.title}</span>
            {jobData.company && (
              <>
                {" "}
                na{" "}
                <span className="text-slate-700 font-medium">
                  {jobData.company}
                </span>
              </>
            )}{" "}
            e salvo na coluna{" "}
            <span className="text-slate-700 font-semibold">Aplicando</span>.
          </div>
        </div>

        {/* PDF file preview */}
        <div className="flex items-center gap-3 border border-[#e2e8f0] rounded-[11px] px-3 py-[11px]">
          <div className="w-[34px] h-[42px] rounded-[6px] bg-[#ecfdf5] flex items-center justify-center text-[#059669] flex-none">
            <FileIcon />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12.5px] font-semibold text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
              {filename}
            </span>
            <span className="text-[11.5px] text-slate-400">
              PDF · adaptado agora
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => downloadResume(jobResponse.id, jobData.company || "curriculo")}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] text-white border-none rounded-[10px] py-3 text-[13.5px] font-semibold font-geist cursor-pointer shadow-[0_2px_6px_rgba(5,150,105,.32)] transition-colors"
          >
            <DownloadIcon />
            Baixar PDF
          </button>
          <button
            onClick={onViewBoard}
            className="w-full bg-transparent border-none text-slate-500 hover:text-slate-700 text-[12.5px] font-medium font-geist cursor-pointer py-1 transition-colors"
          >
            Ver no quadro
          </button>
        </div>
      </div>
    </div>
  );
}
