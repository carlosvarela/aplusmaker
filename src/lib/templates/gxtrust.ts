import type { BaseData } from "@/lib/schema";
import { clamp4, esc, safeUrl, wrapDocument } from "@/lib/html";

function buildFontCss(brand?: BaseData["brand"]) {
  const f = brand?.fonts;
  const primaryName = f?.primaryName || "tt_norms_proregular";
  const secondaryName = f?.secondaryName || "tt_norms_probold";

  const facePrimary =
    f?.primaryWoff2 || f?.primaryWoff
      ? `@font-face{
  font-family:'${esc(primaryName)}';
  src:${f?.primaryWoff2 ? `url('${esc(f.primaryWoff2)}') format('woff2')` : ""}${f?.primaryWoff2 && f?.primaryWoff ? "," : ""}${
          f?.primaryWoff ? `url('${esc(f.primaryWoff)}') format('woff')` : ""
        };
  font-weight:400;
  font-style:normal;
}`
      : "";

  const faceSecondary =
    f?.secondaryWoff2 || f?.secondaryWoff
      ? `@font-face{
  font-family:'${esc(secondaryName)}';
  src:${f?.secondaryWoff2 ? `url('${esc(f.secondaryWoff2)}') format('woff2')` : ""}${f?.secondaryWoff2 && f?.secondaryWoff ? "," : ""}${
          f?.secondaryWoff ? `url('${esc(f.secondaryWoff)}') format('woff')` : ""
        };
  font-weight:700;
  font-style:normal;
}`
      : "";

  const accent = brand?.accentColor || "#e0201b";

  return `
${facePrimary}
${faceSecondary}
:root{
  --gx-accent:${esc(accent)};
  --gx-font-primary:'${esc(primaryName)}', Arial, sans-serif;
  --gx-font-secondary:'${esc(secondaryName)}', Arial, sans-serif;
}
body{ font-family:var(--gx-font-primary); }
.gx-title{ font-family:var(--gx-font-secondary); letter-spacing:-.5px; }
`;
}

function hero(d: BaseData) {
  const product = d.product || {};
  const hero = d.hero || {};
  const accent = d.brand?.accentColor || "#e0201b";

  const topCode = product.topCode || "";
  const name = product.name || product.title || "";
  const subtitle = product.subtitle || "";

  return `
<section class="w-full">
  ${hero.topImage?.url ? `
  <div class="w-full">
    <img class="w-full h-auto block" src="${safeUrl(hero.topImage.url)}" alt="${esc(hero.topImage.alt || "GXTrust")}" loading="lazy" />
  </div>` : ""}

  <div class="mx-auto w-full max-w-6xl px-4 pt-8 pb-2">
    <h1 class="gx-title text-center uppercase leading-[1.05] px-2 md:px-16">
      ${topCode ? `<span class="font-light" style="color:${esc(accent)}">${esc(topCode)}</span><br />` : ""}
      <span class="text-white text-[42px] md:text-[64px]">${esc(name)}</span>
    </h1>

    ${subtitle ? `<p class="mt-4 text-center text-white/90 text-base md:text-xl px-2 md:px-24">${esc(subtitle)}</p>` : ""}
  </div>
</section>`;
}

function blockAlt(block: any, idx: number, accent: string) {
  const reverse = idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row";
  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-8">
  <div class="flex flex-col ${reverse} items-center gap-0">
    <div class="w-full md:w-1/2">
      <img class="w-full h-auto block" src="${safeUrl(block.image?.url)}" alt="${esc(block.image?.alt || block.title || "GXTrust")}" loading="lazy" />
    </div>
    <div class="w-full md:w-1/2 p-6 md:p-10">
      <h2 class="gx-title uppercase text-[22px] md:text-[28px] leading-tight">${esc(block.title || "")}</h2>
      <div class="mt-3 h-[2px] w-[110px]" style="background:${esc(accent)}"></div>
      <p class="mt-4 text-white/90 text-base md:text-lg leading-relaxed">${esc(block.text || "")}</p>
    </div>
  </div>
</section>`;
}

function video(v?: BaseData["video"]) {
  if (!v?.url) return "";
  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10">
  <div class="overflow-hidden rounded-2xl border border-white/15 bg-black/30">
    <div class="aspect-video">
      <iframe class="w-full h-full" src="${safeUrl(v.url)}" title="${esc(v.title || "Video")}" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</section>`;
}

function specsAccordion(specs?: Record<string, string>, accent?: string, title?: string) {
  const entries = specs ? Object.entries(specs) : [];
  if (!entries.length) return "";

  const items = entries
    .map(([k, v]) => `<li class="text-white/90"><span class="font-semibold text-white">${esc(k)}:</span> ${esc(v)}</li>`)
    .join("");

  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10">
  <details class="rounded-xl border border-white/15 bg-white/5 p-5 md:p-6">
    <summary class="gx-title cursor-pointer list-none uppercase text-base md:text-lg" style="color:${esc(accent || "#e0201b")}">
      ${esc(title || "Especificações")}
    </summary>
    <ul class="mt-4 list-disc pl-5 space-y-2">${items}</ul>
  </details>
</section>`;
}

function imageStack(images?: Array<{ url: string; alt?: string }>) {
  const list = (images || []).filter((x) => x?.url);
  if (!list.length) return "";

  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10">
  <div class="overflow-hidden rounded-2xl border border-white/10">
    ${list.map((x) => `<img class="w-full h-auto block" src="${safeUrl(x.url)}" alt="${esc(x.alt || "Imagem")}" loading="lazy" />`).join("")}
  </div>
</section>`;
}

function footerLogos(footer?: BaseData["footer"]) {
  if (!footer?.logos?.url) return "";
  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10 pb-14">
  <img class="w-full h-auto block" src="${safeUrl(footer.logos.url)}" alt="${esc(footer.logos.alt || "Logos")}" loading="lazy" />
</section>`;
}

export function renderGXTrust(d: BaseData, opts?: { fragment?: boolean }) {
  const accent = d.brand?.accentColor || "#e0201b";
  const filler = { title: "", text: "", image: { url: "", alt: "" } };
  const blocks = clamp4(d.blocks, filler);

  const body = `
<main class="min-h-screen bg-[linear-gradient(45deg,_rgba(106,103,156,1)_0%,_rgba(14,12,56,1)_20%)] text-white">
  ${hero(d)}
  ${blocks.map((b, i) => blockAlt(b, i, accent)).join("")}
  ${video(d.video)}
  ${specsAccordion(d.specs, accent, d.specsTitle)}
  ${imageStack(d.sustainabilityImages)}
  ${footerLogos(d.footer)}
</main>`;

  return wrapDocument({
    title: d.pageTitle || d.product?.title || "GXTrust A+",
    body,
    includeTailwindCdn: true,
    fragment: !!opts?.fragment,
    extraCss: buildFontCss(d.brand),
  });
}
