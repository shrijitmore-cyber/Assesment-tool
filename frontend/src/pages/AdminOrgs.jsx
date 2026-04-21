import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api, formatApiError } from "@/lib/api";

export default function AdminOrgs() {
  const [orgs, setOrgs] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/admin/orgs").then((r) => setOrgs(r.data)).catch((e) => setErr(formatApiError(e)));
  }, []);

  return (
    <DashboardShell>
      <div className="p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Super admin</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }}>
          Organizations
        </h1>
        {err && <div className="mt-6 text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3">{err}</div>}

        <div className="grid md:grid-cols-2 gap-0 mt-10 border border-[#E5E5E5]" data-testid="admin-orgs-list">
          {orgs.map((o, i) => (
            <div
              key={o.id}
              className={`p-8 bg-white border-b border-[#E5E5E5] ${i % 2 === 0 ? "md:border-r" : ""}`}
            >
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">
                {new Date(o.created_at).toLocaleDateString()}
              </div>
              <div className="text-2xl font-black tracking-tight mt-1" style={{ fontFamily: "Chivo" }}>
                {o.name}
              </div>
              <div className="text-xs text-[#52525B] mt-1">{o.owner_email}</div>
              <div className="grid grid-cols-2 gap-0 mt-4 border border-[#E5E5E5]">
                <div className="p-3 border-r border-[#E5E5E5]">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">Members</div>
                  <div className="font-black text-2xl" style={{ fontFamily: "Chivo" }}>{o.member_count}</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">Submissions</div>
                  <div className="font-black text-2xl text-[#002FA7]" style={{ fontFamily: "Chivo" }}>{o.submission_count}</div>
                </div>
              </div>
            </div>
          ))}
          {orgs.length === 0 && <div className="p-6 text-sm text-[#52525B]">No organizations yet.</div>}
        </div>
      </div>
    </DashboardShell>
  );
}
