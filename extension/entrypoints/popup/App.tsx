import { useState, useEffect } from "react";
import type { JobData, JobResponse } from "../../src/lib/types";
import { createJob } from "../../src/lib/api";
import { extractJobFromCurrentTab } from "../../src/utils/extract";
import { DetectedState } from "../../src/components/DetectedState";
import { LoadingState } from "../../src/components/LoadingState";
import { SuccessState } from "../../src/components/SuccessState";

type PopupState =
  | { type: "extracting" }
  | { type: "detected"; jobData: JobData }
  | { type: "loading"; jobData: JobData }
  | { type: "success"; jobData: JobData; jobResponse: JobResponse }
  | { type: "error"; message: string };

export default function App() {
  const [state, setState] = useState<PopupState>({ type: "extracting" });

  useEffect(() => {
    extractJobFromCurrentTab()
      .then((jobData) => setState({ type: "detected", jobData }))
      .catch((e) => {
        console.warn("Job extraction failed:", e);
        setState({
          type: "detected",
          jobData: { title: "", company: "", description: "" },
        });
      });
  }, []);

  async function handleSubmit(jobData: JobData) {
    setState({ type: "loading", jobData });
    try {
      const jobResponse = await createJob(jobData);
      setState({ type: "success", jobData, jobResponse });
    } catch (e) {
      setState({
        type: "error",
        message: e instanceof Error ? e.message : "Erro desconhecido",
      });
    }
  }

  function handleViewBoard() {
    chrome.tabs.create({ url: "http://localhost:3000" });
    window.close();
  }

  if (state.type === "extracting") {
    return (
      <div className="w-[380px] bg-white flex items-center justify-center py-8 text-[13px] text-slate-400 font-geist">
        Lendo a página…
      </div>
    );
  }

  if (state.type === "detected") {
    return (
      <DetectedState jobData={state.jobData} onSubmit={handleSubmit} />
    );
  }

  if (state.type === "loading") {
    return <LoadingState jobData={state.jobData} />;
  }

  if (state.type === "success") {
    return (
      <SuccessState
        jobData={state.jobData}
        jobResponse={state.jobResponse}
        onViewBoard={handleViewBoard}
      />
    );
  }

  // error state
  return (
    <div className="w-[380px] bg-white p-4 flex flex-col gap-3 font-geist">
      <p className="text-[13px] text-red-500">{state.message}</p>
      <button
        onClick={() => {
          setState({ type: "extracting" });
          extractJobFromCurrentTab()
            .then((jobData) => setState({ type: "detected", jobData }))
            .catch(() =>
              setState({
                type: "detected",
                jobData: { title: "", company: "", description: "" },
              })
            );
        }}
        className="text-[12px] text-slate-500 hover:text-slate-700 underline"
      >
        Tentar novamente
      </button>
    </div>
  );
}
