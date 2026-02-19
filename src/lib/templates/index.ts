import type { BaseData } from "@/lib/schema";
import { renderGXTrust } from "@/lib/templates/gxtrust";
import { renderTrustOffice } from "@/lib/templates/trustOffice";

export type TemplateId = "trust-office" | "gxtrust";

export function renderTemplate(template: TemplateId, data: BaseData, opts?: { fragment?: boolean }) {
  if (template === "gxtrust") return renderGXTrust(data, opts);
  return renderTrustOffice(data, opts);
}
