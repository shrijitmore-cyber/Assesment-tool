import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "@/components/DashboardShell";
import { api, formatApiError } from "@/lib/api";

export default function ConsultantView() {
  const [orgs, setOrgs] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/consultant/orgs").then((r) => setOrgs(r.data)).catch((e) => setErr(formatApiError(e)));
  }, []);

  const pick = async (org) => {
    setSelected(org);
    try {
      const { data } = await api.get(`/consultant/orgs/${org.id}/responses`);
      setResponses(data);
    } catch (e) {
      setErr(formatApiError(e));
    }
  };

  return (
    <DashboardShell>
      <div className="p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Client orgs</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }}>
          Your clients
        </h1>
        {err && <div className="mt-6 text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3">{err}</div>}

        <div className="grid md:grid-cols-12 gap-8 mt-10">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-[#52525B] font-bold mb-4">Organizations</div>
            <div className="border border-[#E5E5E5] bg-white divide-y divide-[#E5E5E5]" data-testid="consultant-org-list">
              {orgs.map((o) => (
                <button
                  key={o.id}
                  onClick={() => pick(o)}
                  data-testid={`consultant-org-${o.id}`}
                  className={`w-full text-left p-5 hover:bg-[#F4F4F5] transition-colors ${
                    selected?.id === o.id ? "bg-[#F4F4F5]" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <div className="font-bold text-lg tracking-tight" style={{ fontFamily: "Chivo" }}>{o.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[#002FA7] font-bold">
                      {o.submission_count} submissions
                    </div>
                  </div>
                  <div className="text-xs text-[#52525B] mt-1">{o.member_count} members</div>
                </button>
              ))}
              {orgs.length === 0 && <div className="p-6 text-sm text-[#52525B]">No assigned organizations.</div>}
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="text-xs uppercase tracking-[0.3em] text-[#52525B] font-bold mb-4">
              {selected ? `Submissions · ${selected.name}` : "Pick an organization"}
            </div>
            <div className="border border-[#E5E5E5] bg-white divide-y divide-[#E5E5E5]" data-testid="consultant-responses">
              {responses.map((r) => (
                <div key={r.id} className="p-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{r.user_name}</div>
                    <div className="text-xs text-[#52525B]">{r.user_email}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">Index</div>
                      <div className="font-black text-2xl text-[#002FA7]" style={{ fontFamily: "Chivo" }}>
                        {r.results?.overall_score}
                      </div>
                    </div>
                    <Link
                      to={`/responses/${r.id}/results`}
                      className="text-sm underline-offset-4 hover:underline"
                      data-testid={`view-response-${r.id}`}
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
              {selected && responses.length === 0 && (
                <div className="p-6 text-sm text-[#52525B]">No submissions yet.</div>
              )}
              {!selected && <div className="p-6 text-sm text-[#52525B]">Select an organization on the left.</div>}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
