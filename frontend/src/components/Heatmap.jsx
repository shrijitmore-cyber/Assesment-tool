const HEATMAP_SCALE = ["#F4F4F5", "#E0E7FF", "#A5B4FC", "#6366F1", "#3730A3"];

function bucket(score) {
  if (score < 40) return 0;
  if (score < 55) return 1;
  if (score < 70) return 2;
  if (score < 85) return 3;
  return 4;
}

export default function Heatmap({ rows }) {
  // rows: [{ name, score }]
  return (
    <div className="border border-[#E5E5E5] bg-white" data-testid="heatmap">
      {rows.map((r, i) => {
        const b = bucket(r.score);
        const color = HEATMAP_SCALE[b];
        const textColor = b >= 3 ? "#FFFFFF" : "#0A0A0A";
        return (
          <div
            key={r.name + i}
            className="flex items-stretch border-b border-[#E5E5E5] last:border-b-0"
          >
            <div className="flex-1 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#A1A1AA]">0{i + 1}</div>
              <div className="text-sm font-medium text-[#0A0A0A]">{r.name}</div>
            </div>
            <div
              className="w-40 flex items-center justify-center font-black text-2xl"
              style={{ background: color, color: textColor, fontFamily: "Chivo" }}
            >
              {r.score.toFixed(0)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
