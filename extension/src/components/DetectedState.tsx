import { useState } from "react";
import { JobData } from "../lib/types";
import { PopupHeader } from "./PopupHeader";

function SparkleIcon() {
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
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
    </svg>
  );
}

const inputClass =
  "w-full box-border border border-[#e2e8f0] rounded-[8px] py-[9px] px-[11px] text-[13px] text-slate-900 font-geist outline-none focus:border-[#059669] focus:shadow-[0_0_0_3px_rgba(5,150,105,.12)] transition-shadow";

interface DetectedStateProps {
  jobData: JobData;
  onSubmit: (data: JobData) => void;
}

export function DetectedState({ jobData, onSubmit }: DetectedStateProps) {
  const [title, setTitle] = useState(jobData.title);
  const [company, setCompany] = useState(jobData.company);
  const [description, setDescription] = useState(jobData.description);

  function handleSubmit() {
    onSubmit({ title, company, description });
  }

  return (
    <div className="w-[380px] bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(15,23,42,.1)]">
      <PopupHeader statusText="Vaga detectada nesta página" statusColor="green" />

      <div className="p-4 flex flex-col gap-[14px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[12px] font-medium text-slate-600">
            Título da vaga
          </label>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[12px] font-medium text-slate-600">
            Empresa
          </label>
          <input
            className={inputClass}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-slate-600">
              Descrição da vaga
            </label>
            <span className="text-[11px] text-slate-400">editável</span>
          </div>
          <textarea
            className={`${inputClass} resize-none leading-[1.5] text-slate-700 text-[12.5px]`}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
          className="mt-[2px] w-full inline-flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white border-none rounded-[10px] py-3 text-[13.5px] font-semibold font-geist cursor-pointer shadow-[0_2px_6px_rgba(5,150,105,.32)] transition-colors"
        >
          <SparkleIcon />
          Adicionar vaga
        </button>
      </div>
    </div>
  );
}
