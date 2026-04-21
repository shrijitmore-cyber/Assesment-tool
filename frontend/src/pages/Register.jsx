import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const BG_IMG =
  "https://images.unsplash.com/photo-1769053225958-62ff8751aa4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxjLXN1aXRlJTIwcHJvZmVzc2lvbmFsJTIwbW9kZXJuJTIwb2ZmaWNlJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzc2NzU1ODc1fDA&ixlib=rb-4.1.0&q=85";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    account_type: "individual",
    organization_name: "",
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const payload = { ...form };
      if (payload.account_type !== "organization") delete payload.organization_name;
      await register(payload);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      <div className="hidden md:block relative">
        <img src={BG_IMG} alt="architecture" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0A0A0A]/30" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="text-xs uppercase tracking-[0.3em] font-bold mb-4">— Start free</div>
          <div className="text-4xl font-black tracking-tighter leading-tight max-w-md" style={{ fontFamily: "Chivo" }}>
            Your first AIM Index in under 10 minutes.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 md:p-16 bg-[#F9F9F8]">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-[#52525B] hover:text-[#002FA7]" data-testid="back-to-home">
            ← Back
          </Link>
          <h1 className="mt-8 text-4xl font-black tracking-tighter" style={{ fontFamily: "Chivo" }}>
            Create account
          </h1>
          <p className="text-sm text-[#52525B] mt-2">Individual user or organization — your choice.</p>

          <div className="mt-8 grid grid-cols-2 border border-[#E5E5E5]" data-testid="account-type-toggle">
            {[
              { k: "individual", l: "Individual" },
              { k: "organization", l: "Organization" },
            ].map((o) => (
              <button
                key={o.k}
                type="button"
                onClick={() => set("account_type", o.k)}
                data-testid={`account-type-${o.k}`}
                className={`py-3 text-sm uppercase tracking-[0.2em] transition-colors ${
                  form.account_type === o.k
                    ? "bg-[#002FA7] text-white"
                    : "bg-white text-[#52525B] hover:bg-[#F4F4F5]"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-8 space-y-6" data-testid="register-form">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Full name</div>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                data-testid="register-name-input"
                className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none"
              />
            </div>
            {form.account_type === "organization" && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Organization name</div>
                <input
                  required
                  value={form.organization_name}
                  onChange={(e) => set("organization_name", e.target.value)}
                  data-testid="register-org-input"
                  className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none"
                />
              </div>
            )}
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Work email</div>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                data-testid="register-email-input"
                className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none"
              />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Password</div>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                data-testid="register-password-input"
                className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none"
              />
            </div>

            {err && (
              <div className="text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3" data-testid="register-error">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              data-testid="register-submit-btn"
              className="w-full bg-[#002FA7] text-white py-4 font-medium hover:bg-[#00227A] transition-colors disabled:opacity-50"
            >
              {busy ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <div className="mt-8 text-sm text-[#52525B]">
            Already have an account?{" "}
            <Link to="/login" data-testid="goto-login-link" className="text-[#002FA7] font-medium underline-offset-4 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
