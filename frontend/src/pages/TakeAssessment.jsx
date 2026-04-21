import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, formatApiError } from "@/lib/api";
import LikertScale from "@/components/LikertScale";

export default function TakeAssessment() {
  const { id } = useParams();
  const nav = useNavigate();
  const [response, setResponse] = useState(null);
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [dimIdx, setDimIdx] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/assessments/responses/${id}`);
        setResponse(r.data);
        setAnswers(r.data.answers || {});
        const t = await api.get(`/assessments/templates/${r.data.template_id}`);
        setTemplate(t.data.template);
      } catch (e) {
        setErr(formatApiError(e));
      }
    })();
  }, [id]);

  const dim = template?.dimensions[dimIdx];

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = useMemo(
    () => (template ? template.dimensions.reduce((a, d) => a + d.questions.length, 0) : 0),
    [template]
  );
  const progress = totalQuestions ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  const setAns = (key, v) => setAnswers((a) => ({ ...a, [key]: v }));

  const saveProgress = async () => {
    try {
      await api.patch(`/assessments/responses/${id}`, { answers, submit: false });
    } catch (e) {
      setErr(formatApiError(e));
    }
  };

  const next = async () => {
    await saveProgress();
    if (dimIdx < template.dimensions.length - 1) {
      setDimIdx(dimIdx + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prev = () => {
    if (dimIdx > 0) {
      setDimIdx(dimIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      const { data } = await api.patch(`/assessments/responses/${id}`, { answers, submit: true });
      nav(`/responses/${data.id}/results`);
    } catch (e) {
      setErr(formatApiError(e));
      setBusy(false);
    }
  };

  if (!template || !response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8] text-[#52525B]">
        <div className="text-xs uppercase tracking-[0.2em]">Loading…</div>
      </div>
    );
  }

  const dimAllAnswered = dim.questions.every((_q, i) => answers[`${dim.id}_${i}`] != null);
  const isLast = dimIdx === template.dimensions.length - 1;
  const allAnswered = template.dimensions.every((d) =>
    d.questions.every((_q, i) => answers[`${d.id}_${i}`] != null)
  );

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#0A0A0A]">
      <header className="border-b border-[#E5E5E5] bg-white sticky top-0 z-10" data-testid="assessment-header">
        <div className="max-w-[960px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#52525B]">{template.title}</div>
            <div className="text-sm font-bold tracking-tight" style={{ fontFamily: "Chivo" }}>
              {dim.overline} · {dim.name}
            </div>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#52525B]" data-testid="assessment-progress-label">
            {totalAnswered}/{totalQuestions} · {progress}%
          </div>
        </div>
        <div className="h-[3px] bg-[#E5E5E5]">
          <div
            className="h-full bg-[#002FA7] transition-all"
            style={{ width: `${progress}%` }}
            data-testid="assessment-progress-bar"
          />
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-6 md:px-10 py-12">
        <div className="flex flex-wrap gap-1 mb-10" data-testid="dimension-tabs">
          {template.dimensions.map((d, i) => {
            const done = d.questions.every((_q, qi) => answers[`${d.id}_${qi}`] != null);
            const active = i === dimIdx;
            return (
              <button
                key={d.id}
                onClick={() => setDimIdx(i)}
                data-testid={`dim-tab-${i}`}
                className={`px-3 py-2 text-[10px] uppercase tracking-[0.2em] border ${
                  active
                    ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                    : done
                    ? "bg-white text-[#002FA7] border-[#002FA7]"
                    : "bg-white text-[#52525B] border-[#E5E5E5] hover:border-[#0A0A0A]"
                }`}
              >
                {d.overline}
              </button>
            );
          })}
        </div>

        <div className="text-xs uppercase tracking-[0.3em] text-[#002FA7] font-bold">
          Dimension {dimIdx + 1} / {template.dimensions.length}
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mt-3" style={{ fontFamily: "Chivo" }}>
          {dim.name}
        </h1>
        <p className="text-[#52525B] mt-2 max-w-2xl">{dim.description}</p>

        <div className="mt-10 space-y-12">
          {dim.questions.map((q, i) => {
            const key = `${dim.id}_${i}`;
            return (
              <div key={key} data-testid={`question-${key}`}>
                <div className="flex items-baseline gap-3">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA] font-bold">
                    Q{i + 1}
                  </div>
                  <div className="text-lg font-medium leading-relaxed">{q}</div>
                </div>
                <div className="mt-4">
                  <LikertScale
                    value={answers[key]}
                    onChange={(v) => setAns(key, v)}
                    testIdPrefix={`likert-${key}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {err && <div className="mt-8 text-sm text-[#DC2626] border-l-2 border-[#DC2626] pl-3">{err}</div>}

        <div className="mt-14 flex flex-wrap gap-4 items-center justify-between border-t border-[#E5E5E5] pt-8">
          <button
            onClick={prev}
            disabled={dimIdx === 0}
            data-testid="assessment-prev-btn"
            className="border border-[#0A0A0A] px-6 py-3 font-medium hover:bg-[#0A0A0A] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#0A0A0A]"
          >
            ← Previous
          </button>
          <div className="flex gap-3">
            <button
              onClick={saveProgress}
              data-testid="assessment-save-btn"
              className="text-sm uppercase tracking-[0.2em] text-[#52525B] hover:text-[#002FA7]"
            >
              Save progress
            </button>
            {!isLast ? (
              <button
                onClick={next}
                disabled={!dimAllAnswered}
                data-testid="assessment-next-btn"
                className="bg-[#002FA7] text-white px-6 py-3 font-medium hover:bg-[#00227A] transition-colors disabled:opacity-50"
              >
                Next dimension →
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!allAnswered || busy}
                data-testid="assessment-submit-btn"
                className="bg-[#002FA7] text-white px-6 py-3 font-medium hover:bg-[#00227A] transition-colors disabled:opacity-50"
              >
                {busy ? "Scoring…" : "Submit & get results →"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
