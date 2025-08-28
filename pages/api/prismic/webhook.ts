// pages/api/prismic/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";

/** Payloads possíveis do webhook (ajuste conforme seu uso no Prismic) */
type PrismicWebhookBody =
  | { type?: string; documents?: string[]; secret?: string; [k: string]: unknown }
  | { paths?: string[]; [k: string]: unknown };

/** Garante parse seguro mesmo se o body vier como string */
function parseBody<T = unknown>(input: unknown): T {
  if (typeof input === "string") {
    try {
      return JSON.parse(input) as T;
    } catch {
      return {} as T;
    }
  }
  return (input ?? {}) as T;
}

/** Opcional: mapeia IDs/UIDs do Prismic para paths do seu site */
function mapPrismicToPaths(body: PrismicWebhookBody): string[] {
  // Se o seu webhook já manda { paths: [...] }, respeite-os:
  if (Array.isArray((body as any).paths)) {
    return ((body as any).paths as unknown[])
      .filter((p): p is string => typeof p === "string")
      .map((p) => (p.startsWith("/") ? p : `/${p}`));
  }

  // Exemplo: caso venha info padrão do Prismic, derive rotas aqui.
  // Ajuste esta lógica para o seu projeto (ex.: consultar o Prismic para UID -> path).
  // const docs = Array.isArray(body.documents) ? body.documents : [];
  // return docs.map((id) => `/blog/${id}`);

  return [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Validação do token de segurança
  const headerSecret =
    (req.headers["x-prismic-secret"] as string | undefined) ??
    (req.headers["X-Prismic-Secret"] as string | undefined);

  if (!headerSecret || headerSecret !== process.env.PRISMIC_ACCESS_TOKEN) {
    res
      .status(401)
      .json({ error: "Acesso negado, o token não foi passado ou está incorreto." });
    return;
  }

  const body = parseBody<PrismicWebhookBody>(req.body);

  // Deriva paths a revalidar
  const derivedPaths = mapPrismicToPaths(body);
  const fallbackPaths = ["/"]; // ajuste com rotas principais do seu site
  const pathsToRevalidate = derivedPaths.length > 0 ? derivedPaths : fallbackPaths;

  try {
    await Promise.all(pathsToRevalidate.map((p) => res.revalidate(p)));

    res.status(200).json({
      revalidated: true,
      paths: pathsToRevalidate,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao revalidar";
    res.status(500).json({ revalidated: false, error: message });
  }
}

/**
 * Se você precisa validar assinatura usando o "raw body" do webhook,
 * descomente o config abaixo e trate o corpo como Buffer em parseBody.
 */
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };