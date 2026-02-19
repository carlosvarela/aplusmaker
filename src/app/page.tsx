"use client";

import { useEffect, useMemo, useState } from "react";

type TemplateId = "trust-office" | "gxtrust";

const SAMPLE_TRUST_OFFICE = {
  pageTitle: "Trust Office A+",
  brand: { name: "Trust", accentColor: "#2563eb", website: "trust.com" },
  product: {
    title: "Mouse inalámbrico silencioso",
    subtitle: "Trabajo cómodo y productivo con clic silencioso y diseño compacto.",
  },
  hero: {
    image: { url: "https://placehold.co/1200x900", alt: "Producto" },
    badges: ["Silencioso", "Compacto", "Confortable"],
  },
  blocks: [
    {
      title: "Silencio para foco total",
      text: "Clics silenciosos que ayudan a mantener la concentración en casa o en la oficina.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloque 1" },
    },
    {
      title: "Diseño compacto y cómodo",
      text: "Forma cómoda para el día a día, ideal para mochila, escritorio o viajes.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloque 2" },
    },
    {
      title: "Conexión estable",
      text: "Conexión inalámbrica confiable para una experiencia fluida en cualquier tarea.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloque 3" },
    },
    {
      title: "Eficiente y práctico",
      text: "Bajo consumo y uso simple para mantener tu rutina sin interrupciones.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloque 4" },
    },
  ],
  video: { url: "" },
  specsTitle: "Especificações",
  specs: {
    Conectividad: "2.4 GHz",
    "Clic silencioso": "Sí",
    Batería: "AA",
    Compatibilidad: "Windows, macOS",
  },
  sustainabilityImages: [{ url: "https://placehold.co/1600x700", alt: "Sustentabilidad" }],
};

const SAMPLE_GXTRUST = {
  pageTitle: "GXTrust A+",
  brand: {
    name: "GXTrust",
    accentColor: "#e0201b",
    fonts: {
      primaryName: "tt_norms_proregular",
      secondaryName: "tt_norms_probold",
      primaryWoff2: "/fonts/tt_norms_pro_regular-webfont.woff2",
      primaryWoff: "/fonts/tt_norms_pro_regular-webfont.woff",
      secondaryWoff2: "/fonts/tt_norms_pro_bold-webfont.woff2",
      secondaryWoff: "/fonts/tt_norms_pro_bold-webfont.woff",
    },
  },
  product: {
    topCode: "GXT 999",
    name: "NOVA PRO",
    subtitle: "Performance competitiva com design agressivo e conforto para longas sessões.",
  },
  hero: {
    topImage: { url: "https://placehold.co/1920x700", alt: "GXTrust header" },
  },
  blocks: [
    {
      title: "Formato compacto para movimentos rápidos",
      text: "Mais espaço na mesa para controle e precisão em jogos competitivos.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloco 1" },
    },
    {
      title: "Resposta precisa e consistente",
      text: "Desempenho estável para ações rápidas e controle total durante a partida.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloco 2" },
    },
    {
      title: "RGB personalizável",
      text: "Efeitos e modos para combinar com seu setup e sua identidade.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloco 3" },
    },
    {
      title: "Construção sólida",
      text: "Projetado para durar, com foco em conforto e durabilidade.",
      image: { url: "https://placehold.co/1200x900", alt: "Bloco 4" },
    },
  ],
  video: { url: "" },
  specsTitle: "Especificações",
  specs: {
    Sensor: "High performance",
    DPI: "Até 16000",
    Iluminação: "RGB",
    Conectividade: "USB",
  },
  sustainabilityImages: [
    { url: "https://placehold.co/1600x700", alt: "Sustentabilidade" },
    { url: "https://placehold.co/1600x700", alt: "EcoVadis" },
  ],
  footer: {
    logos: { url: "https://placehold.co/1600x250", alt: "Logos" },
  },
};

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Page() {
  const [template, setTemplate] = useState<TemplateId>("trust-office");
  const [jsonText, setJsonText] = useState<string>(() => JSON.stringify(SAMPLE_TRUST_OFFICE, null, 2));
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fragment, setFragment] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const storageKey = useMemo(() => "aplus-generator:v1", []);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const v = JSON.parse(raw);
      if (v.template) setTemplate(v.template);
      if (v.jsonText) setJsonText(v.jsonText);
      if (typeof v.fragment === "boolean") setFragment(v.fragment);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ template, jsonText, fragment }));
  }, [template, jsonText, fragment, storageKey]);

  async function onGenerate() {
    setError("");
    setLoading(true);
    try {
      const data = JSON.parse(jsonText);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ template, data, options: { fragment } }),
      });

      const out = await res.json();
      if (!res.ok) {
        const msg = out?.error || "Error";
        const issues = Array.isArray(out?.issues) ? out.issues : [];
        const details = issues.length ? "\n" + issues.map((i: any) => `${i.path}: ${i.message}`).join("\n") : "";
        setHtml("");
        setError(msg + details);
        return;
      }

      setHtml(out.html || "");
    } catch {
      setHtml("");
      setError("JSON inválido");
    } finally {
      setLoading(false);
    }
  }

  function loadSample(t: TemplateId) {
    setTemplate(t);
    setError("");
    setHtml("");
    setJsonText(JSON.stringify(t === "gxtrust" ? SAMPLE_GXTRUST : SAMPLE_TRUST_OFFICE, null, 2));
  }

  function exportJson() {
    downloadFile(`aplus-${template}.json`, jsonText, "application/json");
  }

  function exportHtml() {
    if (!html) return;
    downloadFile(`aplus-${template}.html`, html, "text/html");
  }

  async function copyHtml() {
    if (!html) return;
    await navigator.clipboard.writeText(html);
  }

  function onImportFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setError("");
      setHtml("");
      setJsonText(String(reader.result || ""));
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">A+ Generator</h1>
              <p className="text-white/70 text-sm mt-1">Trust Office y GXTrust, import/export JSON, generate HTML</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                onClick={() => loadSample("trust-office")}
              >
                Load Trust Office sample
              </button>
              <button
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                onClick={() => loadSample("gxtrust")}
              >
                Load GXTrust sample
              </button>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-sm font-semibold text-white/80">Template</label>
                  <select
                    className="rounded-xl border border-white/15 bg-neutral-950 px-3 py-2 text-sm"
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as TemplateId)}
                  >
                    <option value="trust-office">Trust Office</option>
                    <option value="gxtrust">GXTrust</option>
                  </select>

                  <label className="ml-2 inline-flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={fragment}
                      onChange={(e) => setFragment(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-neutral-950"
                    />
                    Fragment
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10">
                    Import JSON
                    <input
                      type="file"
                      accept="application/json,.json"
                      className="hidden"
                      onChange={(e) => onImportFile(e.target.files?.[0] || null)}
                    />
                  </label>

                  <button
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    onClick={exportJson}
                  >
                    Export JSON
                  </button>

                  <button
                    className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-neutral-950 hover:opacity-90 disabled:opacity-60"
                    onClick={onGenerate}
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate HTML"}
                  </button>
                </div>
              </div>

              {error ? (
                <pre className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200 whitespace-pre-wrap">
                  {error}
                </pre>
              ) : null}

              <div className="mt-4">
                <label className="text-sm font-semibold text-white/80">JSON</label>
                <textarea
                  className="mt-2 h-[520px] w-full resize-none rounded-2xl border border-white/12 bg-neutral-950 p-4 font-mono text-xs text-white/90 outline-none focus:border-white/25"
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/5 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white/80">Preview</div>
                  <div className="text-xs text-white/60 mt-1">El HTML generado se renderiza aquí</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
                    onClick={copyHtml}
                    disabled={!html}
                  >
                    Copy HTML
                  </button>
                  <button
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
                    onClick={exportHtml}
                    disabled={!html}
                  >
                    Download HTML
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border border-white/12 bg-neutral-950">
                <iframe
                  title="preview"
                  className="h-[640px] w-full bg-white"
                  srcDoc={html || "<div style='padding:24px;font-family:Arial'>Generate HTML para ver el preview</div>"}
                />
              </div>

              <div className="mt-4">
                <label className="text-sm font-semibold text-white/80">HTML</label>
                <textarea
                  className="mt-2 h-[240px] w-full resize-none rounded-2xl border border-white/12 bg-neutral-950 p-4 font-mono text-xs text-white/90 outline-none focus:border-white/25"
                  value={html}
                  readOnly
                  spellCheck={false}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
