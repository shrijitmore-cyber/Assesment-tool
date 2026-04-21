import { LIKERT } from "@/lib/likert";

export const LIKERT_OPTIONS = LIKERT;

export default function LikertScale({ value, onChange, testIdPrefix = "likert" }) {
  return (
    <div className="flex flex-col md:flex-row gap-0 border border-[#E5E5E5] bg-white" data-testid={testIdPrefix}>
      {LIKERT.map((opt, idx) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            data-testid={`${testIdPrefix}-opt-${opt.value}`}
            className={`flex-1 px-4 py-4 text-left md:text-center transition-colors border-b md:border-b-0 md:border-r border-[#E5E5E5] last:border-r-0 last:border-b-0 ${
              active
                ? "bg-[#002FA7] text-white"
                : "bg-white text-[#52525B] hover:bg-[#F4F4F5]"
            }`}
          >
            <div className={`text-xs uppercase tracking-[0.2em] ${active ? "text-white/70" : "text-[#A1A1AA]"}`}>
              0{idx + 1}
            </div>
            <div className={`mt-1 text-sm font-medium ${active ? "text-white" : "text-[#0A0A0A]"}`}>
              {opt.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
