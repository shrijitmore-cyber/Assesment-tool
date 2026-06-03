import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const BG_IMG =
  "https://images.unsplash.com/photo-1769053225958-62ff8751aa4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHxjLXN1aXRlJTIwcHJvZmVzc2lvbmFsJTIwbW9kZXJuJTIwb2ZmaWNlJTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzc2NzU1ODc1fDA&ixlib=rb-4.1.0&q=85";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email, password);
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
        <div className="absolute inset-0 bg-[#0A0A0A]/20" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="text-xs uppercase tracking-[0.3em] font-bold mb-4">— Indi4 / AIM</div>
          <div className="text-4xl font-black tracking-tighter leading-tight max-w-md" style={{ fontFamily: "Chivo" }}>
            Benchmark your AI readiness. Build a roadmap that scales.
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 md:p-16 bg-[#F9F9F8]">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-[#52525B] hover:text-[#002FA7]" data-testid="back-to-home">
            ← Back
          </Link>
          <h1 className="mt-8 text-4xl font-black tracking-tighter" style={{ fontFamily: "Chivo" }}>
            Log in
          </h1>
          <p className="text-sm text-[#52525B] mt-2">Continue your AIM diagnostic.</p>

          <form onSubmit={submit} className="mt-10 space-y-6" data-testid="login-form">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Email</div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="login-email-input"
                className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B] font-bold mb-2">Password</div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="login-password-input"
                className="w-full border-b border-[#E5E5E5] bg-transparent px-0 py-2 focus:border-[#002FA7] focus:outline-none transition-colors"
              />
            </div>
            {err && (
              <div className="text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3" data-testid="login-error">
                {err}
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              data-testid="login-submit-btn"
              className="w-full bg-[#002FA7] text-white py-4 font-medium hover:bg-[#00227A] transition-colors disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Log in →"}
            </button>
          </form>

          <div className="mt-8 text-sm text-[#52525B]">
            New to AIM?{" "}
            <Link to="/register" data-testid="goto-register-link" className="text-[#002FA7] font-medium underline-offset-4 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
