// pages/api/prismic/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Validação do token via header
  const secret =
    (req.headers["x-prismic-secret"] as string | undefined) ??
    (req.headers["X-Prismic-Secret"] as string | undefined);

  if (!secret || secret !== process.env.PRISMIC_ACCESS_TOKEN) {
    res.status(401).json({
      error: "Acesso negado, o token não foi passado ou está incorreto.",
    });
    return;
  }

  try {
    // Aqui você pode escolher as rotas a revalidar manualmente
    // Por exemplo, apenas a homepage e o blog:
    await res.revalidate('/')
    await res.revalidate('/egressos')
    await res.revalidate('/fazaginforma')
    await res.revalidate('/cursos/')

    res.status(200).json({
      revalidated: true,
      paths: ["/", "/egressos", "/fazaginforma", "/cursos/"],
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha ao revalidar";
    res.status(500).json({ revalidated: false, error: message });
  }
}