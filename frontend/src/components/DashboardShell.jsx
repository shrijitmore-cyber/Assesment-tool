import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NAV_BY_ROLE = {
  super_admin: [
    { to: "/dashboard", label: "Overview" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/orgs", label: "Organizations" },
    { to: "/consultant", label: "All Orgs" },
  ],
  org_admin: [
    { to: "/dashboard", label: "Overview" },
    { to: "/assessments", label: "Assessments" },
    { to: "/org", label: "Team" },
  ],
  consultant: [
    { to: "/dashboard", label: "Overview" },
    { to: "/consultant", label: "Client Orgs" },
  ],
  employee: [
    { to: "/dashboard", label: "Overview" },
    { to: "/assessments", label: "Assessments" },
  ],
  individual: [
    { to: "/dashboard", label: "Overview" },
    { to: "/assessments", label: "Assessments" },
  ],
};

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const links = NAV_BY_ROLE[user?.role] || [];

  const doLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#0A0A0A] flex">
      <aside className="w-[240px] min-h-screen bg-[#0A0A0A] text-white flex flex-col sticky top-0" data-testid="sidebar">
        <div className="p-6 border-b border-[#1f1f22]">
          <Link to="/" className="block">
            <div className="font-black text-xl tracking-tighter" style={{ fontFamily: "Chivo" }}>
              i4SKILLS<span className="text-[#7A91D8]">/</span>AIM
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mt-1">
              AI Impact & Maturity
            </div>
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/dashboard"}
              data-testid={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `block px-6 py-3 text-sm border-l-2 transition-colors ${
                  isActive
                    ? "border-white bg-white/5 text-white"
                    : "border-transparent text-white/60 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[#1f1f22] p-6">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
            Signed in as
          </div>
          <div className="text-sm font-medium truncate" data-testid="sidebar-user-name">{user?.name}</div>
          <div className="text-xs text-white/50 truncate">{user?.email}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#7A91D8] mt-1">
            {user?.role?.replace("_", " ")}
          </div>
          <button
            onClick={doLogout}
            data-testid="logout-btn"
            className="mt-4 w-full text-xs uppercase tracking-[0.2em] border border-white/20 py-2 hover:bg-white hover:text-black transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
