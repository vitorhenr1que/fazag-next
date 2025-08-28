import type { NextApiRequest, NextApiResponse } from "next";

function sanitizeHeaders(h: NextApiRequest["headers"]) {
  const clone: Record<string, string | string[] | undefined> = { ...h };
  // Remova/mascare possíveis segredos:
  if (clone.authorization) clone.authorization = "[redacted]";
  if (clone["x-prismic-secret"]) clone["x-prismic-secret"] = "[redacted]";
  if (clone.cookie) clone.cookie = "[redacted]";
  return clone;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const info = {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: sanitizeHeaders(req.headers),
    // Se o Prismic enviar POST + JSON, isso virá preenchido
    body: typeof req.body === "string" ? req.body : req.body ?? null,
    now: Date.now(),
  };

  // Loga nos logs do servidor (Vercel/Node)
  console.log("[debug-webhook]", JSON.stringify(info, null, 2));

  // Retorna sem segredos
  return res.status(200).json(info);
}