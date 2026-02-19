export function esc(v: unknown) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function safeUrl(u?: string) {
  return esc(u || "");
}

export function clamp4<T>(arr: T[] | undefined, filler: T) {
  const a = Array.isArray(arr) ? [...arr] : [];
  while (a.length < 4) a.push(filler);
  return a.slice(0, 4);
}

export function wrapDocument(opts: {
  title: string;
  body: string;
  includeTailwindCdn?: boolean;
  fragment?: boolean;
  extraCss?: string;
}) {
  const { title, body, includeTailwindCdn = true, fragment = false, extraCss = "" } = opts;

  if (fragment) return body;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  ${includeTailwindCdn ? `<script src="https://cdn.tailwindcss.com"></script>` : ""}
  ${extraCss ? `<style>${extraCss}</style>` : ""}
</head>
<body>
${body}
</body>
</html>`;
}
