import type { BaseData } from "@/lib/schema";
import { clamp4, esc, safeUrl, wrapDocument } from "@/lib/html";

function hero(d: BaseData) {
  const product = d.product || {};
  const hero = d.hero || {};
  const accent = d.brand?.accentColor || "#2563eb";

  const title = product.title || "";
  const subtitle = product.subtitle || "";
  const badges = (hero.badges || []).slice(0, 6);

  return `
<section class="mx-auto w-full max-w-6xl px-4 pt-10">
  <div class="grid gap-6 md:grid-cols-2 md:items-center">
    <div>
      ${badges.length ? `
      <div class="flex flex-wrap gap-2">
        ${badges.map((b) => `<span class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">${esc(b)}</span>`).join("")}
      </div>` : ""}

      <h1 class="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
        ${esc(title)}
      </h1>

      ${subtitle ? `<p class="mt-3 text-base md:text-lg leading-7 text-slate-600">${esc(subtitle)}</p>` : ""}

      <div class="mt-6 flex gap-3">
        <span class="inline-flex items-center rounded-2xl px-5 py-3 text-sm font-extrabold text-white" style="background:${esc(accent)}">
          ${esc("Ver destaques")}
        </span>
        ${d.brand?.name ? `<span class="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800">${esc(d.brand.name)}</span>` : ""}
      </div>
    </div>

    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,.10)]">
      <img class="w-full h-auto block object-cover" src="${safeUrl(hero.image?.url)}" alt="${esc(hero.image?.alt || title || "Producto")}" loading="lazy" />
    </div>
  </div>
</section>`;
}

function blockAlt(block: any, idx: number, accent: string) {
  const reverse = idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row";
  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10">
  <div class="flex flex-col ${reverse} gap-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,.10)] md:items-stretch">
    <div class="md:w-1/2">
      <img class="w-full h-full object-cover block" src="${safeUrl(block.image?.url)}" alt="${esc(block.image?.alt || block.title || "Imagem")}" loading="lazy" />
    </div>
    <div class="md:w-1/2 p-7 md:p-10">
      <h2 class="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">${esc(block.title || "")}</h2>
      <div class="mt-3 h-[3px] w-[90px] rounded-full" style="background:${esc(accent)}"></div>
      <p class="mt-4 text-slate-600 text-base leading-7">${esc(block.text || "")}</p>
    </div>
  </div>
</section>`;
}

function video(v?: BaseData["video"]) {
  if (!v?.url) return "";
  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10">
  <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,.10)]">
    <div class="aspect-video">
      <iframe class="w-full h-full" src="${safeUrl(v.url)}" title="${esc(v.title || "Video")}" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</section>`;
}

function specsTable(specs?: Record<string, string>, title?: string) {
  const entries = specs ? Object.entries(specs) : [];
  if (!entries.length) return "";

  const rows = entries
    .map(([k, v]) => {
      return `<tr class="border-b border-slate-200/70">
        <td class="py-3 pr-4 text-sm font-semibold text-slate-700 w-1/2">${esc(k)}</td>
        <td class="py-3 text-sm text-slate-600">${esc(v)}</td>
      </tr>`;
    })
    .join("");

  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10">
  <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,.10)] p-7 md:p-10">
    <h2 class="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">${esc(title || "Especificações")}</h2>
    <div class="mt-5 overflow-x-auto">
      <table class="w-full min-w-[520px] border-collapse">
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>
</section>`;
}

function imageStack(images?: Array<{ url: string; alt?: string }>) {
  const list = (images || []).filter((x) => x?.url);
  if (!list.length) return "";

  return `
<section class="mx-auto w-full max-w-6xl px-4 mt-10 pb-12">
  <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(2,6,23,.10)]">
    ${list.map((x) => `<img class="w-full h-auto block" src="${safeUrl(x.url)}" alt="${esc(x.alt || "Imagem")}" loading="lazy" />`).join("")}
  </div>
</section>`;
}

export function renderTrustOffice(d: BaseData, opts?: { fragment?: boolean }) {
  const accent = d.brand?.accentColor || "#2563eb";
  const filler = { title: "", text: "", image: { url: "", alt: "" } };
  const blocks = clamp4(d.blocks, filler);

  const body = `
<main class="min-h-screen bg-slate-50">
  ${hero(d)}
  ${blocks.map((b, i) => blockAlt(b, i, accent)).join("")}
  ${video(d.video)}
  ${specsTable(d.specs, d.specsTitle)}
  ${imageStack(d.sustainabilityImages)}
</main>`;

  return wrapDocument({
    title: d.pageTitle || d.product?.title || "Trust Office A+",
    body,
    includeTailwindCdn: true,
    fragment: !!opts?.fragment,
  });
}
