import { NextResponse } from "next/server";
import { BaseDataSchema } from "@/lib/schema";
import { renderTemplate, type TemplateId } from "@/lib/templates";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const template = String(body?.template || "") as TemplateId;
    const fragment = !!body?.options?.fragment;

    if (template !== "trust-office" && template !== "gxtrust") {
      return NextResponse.json({ error: "Template inválido" }, { status: 400 });
    }

    const parsed = BaseDataSchema.safeParse(body?.data);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "JSON inválido",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const html = renderTemplate(template, parsed.data, { fragment });
    return NextResponse.json({ html }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "No fue posible generar el HTML" }, { status: 500 });
  }
}
