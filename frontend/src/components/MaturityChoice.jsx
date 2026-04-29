/**
 * MaturityChoice — 5-row vertical maturity-stage selector.
 * Each option = one maturity level with a descriptive statement.
 * Used by the Individual assessment (replaces Likert for that flow).
 */
export default function MaturityChoice({
  levels,
  options,
  value,
  onChange,
  testIdPrefix = "mc",
}) {
  return (
    <div className="border border-[#E5E5E5] bg-white" data-testid={testIdPrefix}>
      {options.map((desc, idx) => {
        const v = idx + 1;
        const active = value === v;
        const levelLabel = levels?.[idx] || `Level ${v}`;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(v)}
            data-testid={`${testIdPrefix}-opt-${v}`}
            className={`w-full text-left flex items-stretch border-b border-[#E5E5E5] last:border-b-0 transition-colors ${
              active
                ? "bg-[#002FA7] text-white"
                : "bg-white text-[#0A0A0A] hover:bg-[#F4F4F5]"
            }`}
          >
            <div
              className={`w-16 md:w-20 flex flex-col items-center justify-center py-4 border-r ${
                active ? "border-white/20" : "border-[#E5E5E5]"
              }`}
            >
              <div
                className={`text-[10px] uppercase tracking-[0.25em] ${
                  active ? "text-white/70" : "text-[#A1A1AA]"
                }`}
              >
                Lvl
              </div>
              <div
                className="font-black text-2xl tabular-nums mt-0.5"
                style={{ fontFamily: "Chivo" }}
              >
                {v}
              </div>
            </div>
            <div className="flex-1 p-4 md:p-5">
              <div
                className={`text-[10px] uppercase tracking-[0.25em] font-bold ${
                  active ? "text-white/70" : "text-[#002FA7]"
                }`}
              >
                {levelLabel}
              </div>
              <div
                className={`mt-1 text-sm md:text-base font-medium leading-snug ${
                  active ? "text-white" : "text-[#0A0A0A]"
                }`}
              >
                {desc}
              </div>
            </div>
            <div
              className={`w-12 flex items-center justify-center text-lg ${
                active ? "text-white" : "text-transparent"
              }`}
            >
              ●
            </div>
          </button>
        );
      })}
    </div>
  );
}
