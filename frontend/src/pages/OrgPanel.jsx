import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import Heatmap from "@/components/Heatmap";
import { api, formatApiError } from "@/lib/api";

export default function OrgPanel() {
  const [members, setMembers] = useState([]);
  const [agg, setAgg] = useState(null);
  const [form, setForm] = useState({ email: "", name: "", role: "employee" });
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const refresh = async () => {
    try {
      const m = await api.get("/org/members");
      setMembers(m.data);
      const a = await api.get("/org/aggregate");
      setAgg(a.data);
    } catch (e) {
      setErr(formatApiError(e));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const invite = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");
    try {
      const { data } = await api.post("/org/invite", form);
      setOkMsg(`Invited ${data.email}. Temporary password: ${data.temporary_password}`);
      setForm({ email: "", name: "", role: "employee" });
      refresh();
    } catch (e) {
      setErr(formatApiError(e));
    }
  };

  return (
    <DashboardShell>
      <div className="p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Team panel</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }}>
          Organization overview
        </h1>

        {agg && (
          <div className="grid md:grid-cols-3 gap-0 mt-8 border border-[#E5E5E5]" data-testid="org-kpis">
            <div className="p-8 bg-white border-r border-[#E5E5E5]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">Members</div>
              <div className="font-black text-5xl mt-2" style={{ fontFamily: "Chivo" }}>{agg.members}</div>
            </div>
            <div className="p-8 bg-white border-r border-[#E5E5E5]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">Submissions</div>
              <div className="font-black text-5xl mt-2" style={{ fontFamily: "Chivo" }}>{agg.submissions}</div>
            </div>
            <div className="p-8 bg-white">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">Avg AIM Index</div>
              <div className="font-black text-5xl mt-2 text-[#002FA7]" style={{ fontFamily: "Chivo" }}>
                {agg.overall_score || "—"}
              </div>
            </div>
          </div>
        )}

        {agg?.dimensions?.length > 0 && (
          <div className="mt-10">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">
              — Team maturity heatmap
            </div>
            <Heatmap rows={agg.dimensions.map((d) => ({ name: d.name, score: d.avg_score }))} />
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="border border-[#E5E5E5] bg-white p-8">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">— Invite member</div>
            <form onSubmit={invite} className="space-y-5" data-testid="invite-form">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Full name</div>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-testid="invite-name-input"
                  className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none"
                />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Email</div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  data-testid="invite-email-input"
                  className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none"
                />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Role</div>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  data-testid="invite-role-select"
                  className="w-full border border-[#E5E5E5] bg-white px-3 py-2 focus:border-[#002FA7] focus:outline-none"
                >
                  <option value="employee">Employee</option>
                  <option value="org_admin">Org admin</option>
                </select>
              </div>
              {err && <div className="text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3">{err}</div>}
              {okMsg && <div className="text-sm text-[#16A34A] border-l-2 border-[#16A34A] pl-3" data-testid="invite-success">{okMsg}</div>}
              <button
                type="submit"
                data-testid="invite-submit-btn"
                className="bg-[#002FA7] text-white px-6 py-3 hover:bg-[#00227A] transition-colors"
              >
                Send invite →
              </button>
            </form>
          </div>

          <div className="border border-[#E5E5E5] bg-white p-0">
            <div className="p-6 border-b border-[#E5E5E5]">
              <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Members</div>
            </div>
            <div className="divide-y divide-[#E5E5E5] max-h-[420px] overflow-auto" data-testid="member-list">
              {members.map((m) => (
                <div key={m.id} className="p-5 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-[#52525B]">{m.email}</div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#002FA7] font-bold">
                    {m.role.replace("_", " ")}
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="p-6 text-sm text-[#52525B]">No members yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
