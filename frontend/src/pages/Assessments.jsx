import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import { api, formatApiError } from "@/lib/api";

export default function Assessments() {
  const [templates, setTemplates] = useState([]);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    api.get("/assessments/templates").then((r) => setTemplates(r.data));
  }, []);

  const start = async (tid) => {
    setBusy(tid);
    setErr("");
    try {
      const { data } = await api.post("/assessments/start", { template_id: tid });
      nav(`/responses/${data.id}/take`);
    } catch (e) {
      setErr(formatApiError(e));
    } finally {
      setBusy("");
    }
  };

  return (
    <DashboardShell>
      <div className="p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Assessments</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }}>
          Choose your diagnostic
        </h1>
        <p className="text-[#52525B] mt-2 max-w-xl">
          Both diagnostics take under 10 minutes. Your results remain confidential.
        </p>

        {err && <div className="mt-6 text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3">{err}</div>}

        <div className="grid md:grid-cols-2 gap-0 mt-10 border border-[#E5E5E5]">
          {templates.map((t, idx) => (
            <div
              key={t.id}
              className={`p-8 bg-white ${idx === 0 ? "md:border-r border-[#E5E5E5]" : ""}`}
              data-testid={`template-card-${t.slug}`}
            >
              <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">
                — {t.audience === "organization" ? "For enterprises" : "For individuals"}
              </div>
              <h2 className="text-3xl font-black tracking-tight mt-3" style={{ fontFamily: "Chivo" }}>
                {t.title}
              </h2>
              <p className="text-sm text-[#52525B] mt-2 min-h-[48px]">{t.subtitle}</p>

              <div className="grid grid-cols-3 gap-0 mt-8 border border-[#E5E5E5]">
                <div className="p-4 border-r border-[#E5E5E5]">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">Duration</div>
                  <div className="font-black text-xl mt-1" style={{ fontFamily: "Chivo" }}>
                    {t.duration_minutes}m
                  </div>
                </div>
                <div className="p-4 border-r border-[#E5E5E5]">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">Dimensions</div>
                  <div className="font-black text-xl mt-1" style={{ fontFamily: "Chivo" }}>
                    {t.dimension_count}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">Questions</div>
                  <div className="font-black text-xl mt-1" style={{ fontFamily: "Chivo" }}>
                    {t.question_count}
                  </div>
                </div>
              </div>

              <button
                onClick={() => start(t.id)}
                disabled={busy === t.id}
                data-testid={`start-${t.slug}-btn`}
                className="mt-8 bg-[#002FA7] text-white px-6 py-3 hover:bg-[#00227A] transition-colors disabled:opacity-50"
              >
                {busy === t.id ? "Starting…" : "Start diagnostic →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
