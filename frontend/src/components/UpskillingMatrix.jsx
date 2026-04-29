/**
 * UpskillingMatrix — 7-row × 5-column maturity matrix for the Individual results.
 * Mirrors the source upskilling-roadmap image; highlights the user's level per dimension.
 */
export default function UpskillingMatrix({ template, dimensionScores }) {
  const levels = template.question_levels || [];

  // Map dim id -> user level (1..5) from 0-100 score
  const dimLevel = {};
  for (const d of dimensionScores) {
    const lvl = Math.max(1, Math.min(5, Math.round((d.score / 100) * 4 + 1)));
    dimLevel[d.id] = lvl;
  }

  return (
    <div className="border border-[#E5E5E5] bg-white overflow-x-auto" data-testid="upskilling-matrix">
      <div className="min-w-[1100px]">
        {/* Header row */}
        <div className="grid grid-cols-[220px_repeat(5,_minmax(0,1fr))] border-b border-[#E5E5E5] bg-[#F4F4F5]">
          <div className="p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">
              — Track
            </div>
            <div className="text-xs text-[#52525B] mt-1">vs. maturity →</div>
          </div>
          {levels.map((l, i) => (
            <div key={l} className="p-4 border-l border-[#E5E5E5] text-center">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA]">
                Lvl {i + 1}
              </div>
              <div
                className="text-sm font-bold tracking-tight mt-1"
                style={{ fontFamily: "Chivo" }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>

        {/* Dimension rows */}
        {template.dimensions.map((dim) => {
          const userLvl = dimLevel[dim.id];
          return (
            <div
              key={dim.id}
              className="grid grid-cols-[220px_repeat(5,_minmax(0,1fr))] border-b border-[#E5E5E5] last:border-b-0"
            >
              <div className="p-4 bg-[#0A0A0A] text-white flex flex-col justify-center">
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                  {dim.overline}
                </div>
                <div
                  className="text-sm font-bold tracking-tight mt-1 leading-snug"
                  style={{ fontFamily: "Chivo" }}
                >
                  {dim.name}
                </div>
              </div>
              {levels.map((_, li) => {
                const lvl = li + 1;
                const active = userLvl === lvl;
                const q0 = dim.questions?.[0]?.options?.[li];
                const q1 = dim.questions?.[1]?.options?.[li];
                return (
                  <div
                    key={lvl}
                    data-testid={`matrix-${dim.id}-${lvl}${active ? "-active" : ""}`}
                    className={`p-3 border-l border-[#E5E5E5] text-xs leading-snug relative ${
                      active
                        ? "bg-[#002FA7] text-white"
                        : "bg-white text-[#52525B]"
                    }`}
                  >
                    {active && (
                      <div className="absolute top-2 right-2 text-[9px] uppercase tracking-[0.2em] text-white/80 font-bold">
                        You
                      </div>
                    )}
                    {q0 && (
                      <div
                        className={`${
                          active ? "text-white" : "text-[#0A0A0A]"
                        } font-medium`}
                      >
                        {q0}
                      </div>
                    )}
                    {q1 && (
                      <div
                        className={`mt-2 pt-2 border-t ${
                          active
                            ? "border-white/20 text-white/90"
                            : "border-[#E5E5E5] text-[#52525B]"
                        }`}
                      >
                        {q1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
