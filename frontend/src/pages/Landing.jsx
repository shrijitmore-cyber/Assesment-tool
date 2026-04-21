import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const LOGO_URLS = [
  "https://images.unsplash.com/photo-1588333238936-10973c74118f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxjb21wYW55JTIwbG9nbyUyMGJsYWNrJTIwYW5kJTIwd2hpdGUlMjBtaW5pbWFsaXN0fGVufDB8fHx8MTc3Njc1NTg4OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1543441235-e8c913dea2d7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxjb21wYW55JTIwbG9nbyUyMGJsYWNrJTIwYW5kJTIwd2hpdGUlMjBtaW5pbWFsaXN0fGVufDB8fHx8MTc3Njc1NTg4OXww&ixlib=rb-4.1.0&q=85",
];

const HERO_IMG =
  "https://static.prod-images.emergentagent.com/jobs/b7dc9aa9-c54d-427d-8f6f-7958b15ad824/images/17a6bfad5bafbbe11b7d546d4eb8f49997a1a74e73bdf568d707e26618cc1573.png";

const FEATURE_IMG =
  "https://static.prod-images.emergentagent.com/jobs/b7dc9aa9-c54d-427d-8f6f-7958b15ad824/images/055a97b565b3e265178babb400979cb210f4b2e2fad6633f0fb58f95aaa6e274.png";

export default function Landing() {
  const { user } = useAuth();
  const primaryHref = user ? "/dashboard" : "/register";
  const primaryLabel = user ? "Go to dashboard" : "Start the AIM diagnostic";

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#0A0A0A]">
      {/* Top bar */}
      <header className="border-b border-[#E5E5E5] bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="brand-logo">
            <div className="w-8 h-8 bg-[#002FA7]" />
            <div>
              <div className="font-black tracking-tighter text-lg" style={{ fontFamily: "Chivo" }}>
                i4SKILLS<span className="text-[#002FA7]">/</span>AIM
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">
                AI Impact &amp; Maturity
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-4 md:gap-8 text-sm">
            <a href="#how" className="hidden md:inline text-[#52525B] hover:text-black transition-colors">How it works</a>
            <a href="#why" className="hidden md:inline text-[#52525B] hover:text-black transition-colors">Why it matters</a>
            {user ? (
              <Link to="/dashboard" data-testid="header-dashboard-link" className="text-sm font-medium">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" data-testid="header-login-link" className="text-sm font-medium">
                  Log in
                </Link>
                <Link
                  to="/register"
                  data-testid="header-cta-btn"
                  className="bg-[#002FA7] text-white hover:bg-[#00227A] px-5 py-2.5 text-sm transition-colors"
                >
                  Start diagnostic
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-6">
            — AIM Index · Maturity Diagnostic
          </div>
          <h1
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]"
            style={{ fontFamily: "Chivo" }}
          >
            Discover your AI&nbsp;readiness.{" "}
            <span className="text-[#002FA7]">In minutes.</span>
          </h1>
          <p className="mt-8 text-lg text-[#52525B] leading-relaxed max-w-xl">
            The i4SKILLS AIM Diagnostic benchmarks your organization&apos;s AI
            maturity across 6 executive dimensions and delivers a personalised
            roadmap to scale impact. Built for C-suite leaders, HR strategists,
            and individuals alike.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to={primaryHref}
              data-testid="hero-primary-cta"
              className="bg-[#002FA7] text-white hover:bg-[#00227A] px-8 py-4 font-medium transition-colors"
            >
              {primaryLabel} →
            </Link>
            <a
              href="#how"
              data-testid="hero-secondary-cta"
              className="border border-[#0A0A0A] px-8 py-4 font-medium hover:bg-[#0A0A0A] hover:text-white transition-all"
            >
              See how it works
            </a>
          </div>
          <div className="mt-10 flex gap-8 text-sm text-[#52525B]">
            <div>
              <div className="font-black text-3xl text-[#0A0A0A]" style={{ fontFamily: "Chivo" }}>10min</div>
              <div className="text-xs uppercase tracking-[0.2em] mt-1">Avg. completion</div>
            </div>
            <div>
              <div className="font-black text-3xl text-[#0A0A0A]" style={{ fontFamily: "Chivo" }}>6</div>
              <div className="text-xs uppercase tracking-[0.2em] mt-1">Org dimensions</div>
            </div>
            <div>
              <div className="font-black text-3xl text-[#0A0A0A]" style={{ fontFamily: "Chivo" }}>5</div>
              <div className="text-xs uppercase tracking-[0.2em] mt-1">Maturity stages</div>
            </div>
          </div>
        </div>
        <div className="md:col-span-5">
          <div className="relative">
            <img
              src={HERO_IMG}
              alt="AIM data visualization"
              className="w-full aspect-square object-cover border border-[#E5E5E5]"
            />
            <div className="absolute -bottom-6 -left-6 bg-white border border-[#E5E5E5] p-6 max-w-[240px]">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">AIM Index</div>
              <div className="font-black text-5xl mt-1" style={{ fontFamily: "Chivo" }}>72.4</div>
              <div className="text-xs uppercase tracking-[0.2em] mt-1 text-[#002FA7] font-bold">Operational</div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo marquee */}
      <section className="border-y border-[#E5E5E5] bg-white py-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-xs uppercase tracking-[0.3em] text-[#52525B] mb-6">
            Trusted by leaders across industries
          </div>
          <div className="flex items-center gap-12 flex-wrap opacity-70">
            {[...LOGO_URLS, ...LOGO_URLS, ...LOGO_URLS].map((u, i) => (
              <img key={i} src={u} alt="logo" className="h-8 object-contain grayscale" />
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section id="why" className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">— Why AIM</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight" style={{ fontFamily: "Chivo" }}>
              Find your highest-ROI AI&nbsp;bets.
            </h2>
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
            {[
              { n: "01", t: "Clarity in minutes", d: "Identify your AIM Index score and Maturity Stage against 5 levels." },
              { n: "02", t: "Benchmark with peers", d: "Compare your AI adoption to your industry peers across dimensions." },
              { n: "03", t: "Actionable guidance", d: "Receive tailored 30 / 60 / 90-day next steps to scale AI impact." },
              { n: "04", t: "Dual-level assessment", d: "Organizational readiness and individual digital capability in one place." },
            ].map((p) => (
              <div key={p.n} className="bg-[#F4F4F5] p-8 min-h-[220px] flex flex-col justify-between">
                <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">{p.n}</div>
                <div>
                  <div className="font-bold text-xl tracking-tight" style={{ fontFamily: "Chivo" }}>{p.t}</div>
                  <div className="text-sm text-[#52525B] mt-2">{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-[#E5E5E5] bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <img src={FEATURE_IMG} alt="AIM Roadmap report" className="w-full object-cover border border-[#E5E5E5]" />
          </div>
          <div className="md:col-span-7">
            <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold mb-4">— How it works</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight" style={{ fontFamily: "Chivo" }}>
              From diagnostic to&nbsp;roadmap.
            </h2>
            <div className="mt-10 space-y-0 border-t border-[#E5E5E5]">
              {[
                { n: "01", t: "Complete the free diagnostic", d: "Less than 10 minutes. 100% confidential — individual results are kept private." },
                { n: "02", t: "Receive instant results", d: "Your AIM Index, Maturity Stage, peer benchmark, strengths and blockers." },
                { n: "03", t: "Act on the AIM Roadmap", d: "Tailored 30 / 60 / 90-day next steps across your weakest dimensions." },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-8 py-6 border-b border-[#E5E5E5]">
                  <div className="font-black text-4xl text-[#002FA7]" style={{ fontFamily: "Chivo" }}>{s.n}</div>
                  <div>
                    <div className="font-bold text-xl" style={{ fontFamily: "Chivo" }}>{s.t}</div>
                    <div className="text-sm text-[#52525B] mt-1 max-w-lg">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#0A0A0A] text-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[#7A91D8] font-bold mb-4">— Ready to begin</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95]" style={{ fontFamily: "Chivo" }}>
              See your AIM Index&nbsp;today.
            </h2>
          </div>
          <div className="flex md:justify-end">
            <Link
              to={primaryHref}
              data-testid="footer-cta-btn"
              className="bg-white text-[#0A0A0A] px-8 py-4 font-medium hover:bg-[#002FA7] hover:text-white transition-colors"
            >
              {primaryLabel} →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E5E5] bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 text-xs uppercase tracking-[0.2em] text-[#52525B] flex items-center justify-between">
          <div>© i4SKILLS / Indifour Consult Pvt Ltd</div>
          <div>v1.0 · AIM Diagnostic</div>
        </div>
      </footer>
    </div>
  );
}
