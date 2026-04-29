import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatApiError } from "@/lib/api";
import MaturityRadar from "@/components/MaturityRadar";
import Heatmap from "@/components/Heatmap";
import UpskillingMatrix from "@/components/UpskillingMatrix";

export default function Results() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [template, setTemplate] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .get(`/assessments/responses/${id}`)
      .then((res) => {
        setR(res.data);
        return api.get(`/assessments/templates/${res.data.template_id}`);
      })
      .then((res) => {
        if (res) setTemplate(res.data.template);
      })
      .catch((e) => setErr(formatApiError(e)));
  }, [id]);

  if (err) return <div className="min-h-screen p-12 text-[#DC2626]">{err}</div>;
  if (!r) return <div className="min-h-screen p-12 text-[#52525B]">Loading…</div>;

  const res = r.results;
  if (!res)
    return (
      <div className="min-h-screen p-12">
        <div className="text-[#52525B]">Results are not available yet.</div>
      </div>
    );

  const stage = res.stage;

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#0A0A0A] print:bg-white">
      <header className="border-b border-[#E5E5E5] bg-white print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/dashboard" className="text-xs uppercase tracking-[0.3em] text-[#52525B] hover:text-[#002FA7]" data-testid="results-back">
            ← Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            data-testid="results-print-btn"
            className="border border-[#0A0A0A] px-5 py-2 text-sm hover:bg-[#0A0A0A] hover:text-white transition-all"
          >
            Export PDF
          </button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 md:px-10 py-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">
          — AIM Roadmap Report
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }} data-testid="results-title">
          {r.template_slug === "organizational" ? "Organizational AIM Diagnostic" : "Individual Readiness"}
        </h1>
        <div className="text-sm text-[#52525B] mt-2">
          Completed {new Date(r.submitted_at).toLocaleDateString()} · Participant: {r.user_name}
        </div>

        {/* Hero score */}
        <div className="grid md:grid-cols-3 gap-0 mt-12 border border-[#E5E5E5]" data-testid="results-hero">
          <div className="p-10 bg-white border-r border-[#E5E5E5]">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">AIM Index</div>
            <div className="font-black text-7xl md:text-8xl mt-3 text-[#002FA7]" style={{ fontFamily: "Chivo" }}>
              {res.overall_score}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#52525B] mt-2">out of 100</div>
          </div>
          <div className="p-10 bg-white border-r border-[#E5E5E5]">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">Maturity Stage</div>
            <div className="font-black text-4xl mt-3 tracking-tight" style={{ fontFamily: "Chivo" }}>
              {stage.name}
            </div>
            <div className="text-sm text-[#52525B] mt-3 leading-relaxed">{stage.blurb}</div>
          </div>
          <div className="p-10 bg-[#0A0A0A] text-white">
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-bold">Next stage</div>
            {(() => {
              const stages = r.template_slug === "organizational" ? ["Foundational","Emerging","Structured","Operational","Transformational"] : ["Awareness","Working Knowledge","Practitioner","Leader / Innovator","Mastery & Scale"];
              const idx = stages.indexOf(stage.name);
              const nextName = idx < stages.length - 1 ? stages[idx + 1] : "Transformational";
              return (
                <>
                  <div className="font-black text-4xl mt-3 tracking-tight" style={{ fontFamily: "Chivo" }}>
                    {nextName}
                  </div>
                  <div className="text-sm text-white/70 mt-3">
                    Follow your personalized roadmap below to progress.
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Radar + heatmap */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="border border-[#E5E5E5] bg-white p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">
              — Dimension radar
            </div>
            <MaturityRadar data={res.dimension_scores} />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">
              — Maturity heatmap
            </div>
            <Heatmap rows={res.dimension_scores.map((d) => ({ name: d.name, score: d.score }))} />
          </div>
        </div>

        {/* Upskilling matrix — individual only */}
        {template && r.audience === "individual" && (
          <div className="mt-12">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">
              — Your upskilling roadmap
            </div>
            <div className="text-sm text-[#52525B] mb-6 max-w-2xl">
              Cells highlighted in cobalt show <strong>your current level</strong> on each track.
              Cells to the right of "You" are your next-stage growth targets.
            </div>
            <UpskillingMatrix template={template} dimensionScores={res.dimension_scores} />
          </div>
        )}

        {/* Benchmarks */}
        <div className="mt-12 border border-[#E5E5E5] bg-white p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-6">
            — Peer benchmark
          </div>
          <div className="space-y-6" data-testid="benchmark-bars">
            {res.dimension_scores.map((d) => (
              <div key={d.id}>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#52525B]">
                    You {d.score} · Peers {d.benchmark}
                  </div>
                </div>
                <div className="relative h-2 bg-[#F4F4F5]">
                  <div className="absolute top-0 h-2 bg-[#002FA7]" style={{ width: `${d.score}%` }} />
                  <div
                    className="absolute top-[-4px] h-4 w-[2px] bg-[#0A0A0A]"
                    style={{ left: `${d.benchmark}%` }}
                    title={`Peer avg ${d.benchmark}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & blockers */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="border border-[#E5E5E5] bg-white p-8" data-testid="strengths-card">
            <div className="text-xs uppercase tracking-[0.3em] text-[#16A34A] font-bold mb-4">
              — Strengths
            </div>
            {res.strengths.map((s) => (
              <div key={s.id} className="py-4 border-t border-[#E5E5E5] first:border-t-0">
                <div className="flex items-baseline justify-between">
                  <div className="text-base font-bold tracking-tight" style={{ fontFamily: "Chivo" }}>{s.name}</div>
                  <div className="font-black text-2xl text-[#16A34A]" style={{ fontFamily: "Chivo" }}>{s.score}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-[#E5E5E5] bg-white p-8" data-testid="blockers-card">
            <div className="text-xs uppercase tracking-[0.3em] text-[#D97706] font-bold mb-4">
              — Blockers
            </div>
            {res.blockers.map((s) => (
              <div key={s.id} className="py-4 border-t border-[#E5E5E5] first:border-t-0">
                <div className="flex items-baseline justify-between">
                  <div className="text-base font-bold tracking-tight" style={{ fontFamily: "Chivo" }}>{s.name}</div>
                  <div className="font-black text-2xl text-[#D97706]" style={{ fontFamily: "Chivo" }}>{s.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="mt-12 border border-[#E5E5E5] bg-white">
          <div className="p-8 border-b border-[#E5E5E5]">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">
              — AIM Roadmap · 30 / 60 / 90 days
            </div>
            <h2 className="text-3xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }}>
              Your next moves
            </h2>
          </div>
          <div data-testid="roadmap-items">
            {res.roadmap.map((item, i) => (
              <div key={item.dimension_id} className="p-8 border-b border-[#E5E5E5] last:border-b-0">
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="font-black text-5xl text-[#002FA7]" style={{ fontFamily: "Chivo" }}>
                    0{i + 1}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-[#52525B]">
                      {item.dimension_name} · current score {item.current_score}
                    </div>
                    <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Chivo" }}>
                      {item.title}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-0 border border-[#E5E5E5] mt-4">
                  {[
                    { k: "30 days", v: item.actions_30 },
                    { k: "60 days", v: item.actions_60 },
                    { k: "90 days", v: item.actions_90 },
                  ].map((c, ci) => (
                    <div key={c.k} className={`p-6 ${ci < 2 ? "border-r border-[#E5E5E5]" : ""}`}>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#002FA7] font-bold">
                        {c.k}
                      </div>
                      <div className="text-sm mt-2 text-[#0A0A0A] leading-relaxed">{c.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-xs uppercase tracking-[0.2em] text-[#52525B] text-center">
          © i4SKILLS / Indifour Consult · Confidential
        </div>
      </main>
    </div>
  );
}
