function CheckIcon() {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

interface PopupHeaderProps {
  statusText: string;
  statusColor: "green" | "gray";
  onClose?: () => void;
}

export function PopupHeader({
  statusText,
  statusColor,
  onClose,
}: PopupHeaderProps) {
  return (
    <div className="flex items-center gap-[10px] px-4 py-[14px] border-b border-[#f1f5f9]">
      <div className="w-7 h-7 rounded-[8px] bg-[#059669] flex items-center justify-center text-white flex-none">
        <CheckIcon />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-space-grotesk font-semibold text-[14px] text-slate-900">
          me emprega
        </span>
        <span
          className="text-[11px] font-medium mt-[2px]"
          style={{ color: statusColor === "green" ? "#10b981" : "#64748b" }}
        >
          {statusText}
        </span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-slate-300 hover:text-slate-400 flex"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}
