import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import { api, formatApiError } from "@/lib/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  const load = () => {
    api.get("/admin/users").then((r) => setUsers(r.data)).catch((e) => setErr(formatApiError(e)));
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role?role=${role}`);
      load();
    } catch (e) {
      setErr(formatApiError(e));
    }
  };

  return (
    <DashboardShell>
      <div className="p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">— Super admin</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }}>
          Users
        </h1>

        {err && <div className="mt-6 text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3">{err}</div>}

        <div className="mt-10 border border-[#E5E5E5] bg-white" data-testid="admin-users-table">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E5E5E5] text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold">
            <div className="col-span-4">Name / Email</div>
            <div className="col-span-3">Organization</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Change role</div>
          </div>
          {users.map((u) => (
            <div key={u.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#E5E5E5] last:border-b-0 items-center">
              <div className="col-span-4">
                <div className="text-sm font-medium">{u.name}</div>
                <div className="text-xs text-[#52525B]">{u.email}</div>
              </div>
              <div className="col-span-3 text-xs text-[#52525B]">
                {u.organization_id ? u.organization_id.slice(0, 8) : "—"}
              </div>
              <div className="col-span-3 text-[10px] uppercase tracking-[0.25em] text-[#002FA7] font-bold">
                {u.role.replace("_", " ")}
              </div>
              <div className="col-span-2">
                <select
                  defaultValue={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  data-testid={`role-select-${u.id}`}
                  className="w-full border border-[#E5E5E5] bg-white px-2 py-1 text-xs"
                >
                  <option value="super_admin">super_admin</option>
                  <option value="org_admin">org_admin</option>
                  <option value="consultant">consultant</option>
                  <option value="employee">employee</option>
                  <option value="individual">individual</option>
                </select>
              </div>
            </div>
          ))}
          {users.length === 0 && <div className="p-6 text-sm text-[#52525B]">No users.</div>}
        </div>
      </div>
    </DashboardShell>
  );
}
