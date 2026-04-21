import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardShell from "@/components/DashboardShell";
import { api } from "@/lib/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [orgAgg, setOrgAgg] = useState(null);

  useEffect(() => {
    api.get("/assessments/my").then((r) => setResponses(r.data)).catch(() => {});
    if (user?.role === "org_admin") {
      api.get("/org/aggregate").then((r) => setOrgAgg(r.data)).catch(() => {});
    }
  }, [user]);

  const submitted = responses.filter((r) => r.status === "submitted");
  const inProgress = responses.filter((r) => r.status !== "submitted");

  const latest = submitted[0];

  return (
    <DashboardShell>
      <div className="p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">
          — Overview · {user?.role?.replace("_", " ")}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }} data-testid="dashboard-title">
          Welcome back, {user?.name?.split(" ")[0]}.
        </h1>
        <p className="text-[#52525B] mt-2 max-w-xl">
          Your AIM Diagnostic hub. Track assessments, review your roadmap, and benchmark against peers.
        </p>

        <div className="grid md:grid-cols-3 gap-0 mt-10 border border-[#E5E5E5]" data-testid="dashboard-kpis">
          <div className="p-8 border-r border-[#E5E5E5] bg-white">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">Latest AIM Index</div>
            <div className="font-black text-6xl mt-3 text-[#002FA7]" style={{ fontFamily: "Chivo" }}>
              {latest ? latest.results?.overall_score ?? "—" : "—"}
            </div>
            <div className="text-sm uppercase tracking-[0.2em] mt-2 font-bold">
              {latest ? latest.results?.stage?.name : "Not yet assessed"}
            </div>
          </div>
          <div className="p-8 border-r border-[#E5E5E5] bg-white">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">Submitted</div>
            <div className="font-black text-6xl mt-3" style={{ fontFamily: "Chivo" }}>{submitted.length}</div>
            <div className="text-sm text-[#52525B] mt-2">Completed diagnostics</div>
          </div>
          <div className="p-8 bg-white">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">In progress</div>
            <div className="font-black text-6xl mt-3" style={{ fontFamily: "Chivo" }}>{inProgress.length}</div>
            <div className="text-sm text-[#52525B] mt-2">Resume anytime</div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="border border-[#E5E5E5] bg-white p-8">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Quick start</div>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-3" style={{ fontFamily: "Chivo" }}>
              Launch a new diagnostic
            </h2>
            <p className="text-sm text-[#52525B] mt-2">
              Pick between the full Organizational AIM or the quick Individual readiness check.
            </p>
            <Link
              to="/assessments"
              data-testid="dashboard-launch-assessment-btn"
              className="inline-block mt-6 bg-[#002FA7] text-white px-6 py-3 hover:bg-[#00227A] transition-colors"
            >
              Choose a diagnostic →
            </Link>
          </div>

          {user?.role === "org_admin" && orgAgg && (
            <div className="border border-[#E5E5E5] bg-white p-8" data-testid="dashboard-org-agg">
              <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Team maturity</div>
              <h2 className="text-2xl font-black tracking-tight mt-3" style={{ fontFamily: "Chivo" }}>
                {orgAgg.submissions} submission{orgAgg.submissions !== 1 ? "s" : ""} from {orgAgg.members} members
              </h2>
              <div className="font-black text-5xl mt-4 text-[#002FA7]" style={{ fontFamily: "Chivo" }}>
                {orgAgg.overall_score || "—"}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#52525B] mt-1">Avg. AIM Index</div>
              <Link to="/org" className="inline-block mt-4 text-sm underline" data-testid="dashboard-goto-team">
                View team panel →
              </Link>
            </div>
          )}

          <div className="border border-[#E5E5E5] bg-white p-8 md:col-span-2">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">— Recent activity</div>
            {responses.length === 0 && (
              <div className="text-sm text-[#52525B]">No assessments yet. Start your first diagnostic.</div>
            )}
            <div className="divide-y divide-[#E5E5E5]" data-testid="dashboard-recent-list">
              {responses.slice(0, 6).map((r) => (
                <div key={r.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{r.template_slug === "organizational" ? "Organizational AIM Diagnostic" : "Individual Readiness"}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#52525B] mt-1">
                      {r.status === "submitted" ? `Score ${r.results?.overall_score} · ${r.results?.stage?.name}` : "In progress"}
                    </div>
                  </div>
                  <Link
                    to={r.status === "submitted" ? `/responses/${r.id}/results` : `/responses/${r.id}/take`}
                    data-testid={`dashboard-response-${r.id}`}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {r.status === "submitted" ? "View results →" : "Resume →"}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
