import type { NextApiRequest, NextApiResponse } from "next";

function sanitizeHeaders(h: NextApiRequest["headers"]) {
  const clone: Record<string, string | string[] | undefined> = { ...h };
  if (clone.authorization) clone.authorization = "[redacted]";
  if (clone["x-prismic-secret"]) clone["x-prismic-secret"] = "[redacted]";
  if (clone.cookie) clone.cookie = "[redacted]";
  return clone;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const info = {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: sanitizeHeaders(req.headers),
    bodyType: typeof req.body,
    body: req.body, // pode ser objeto, string ou undefined
    now: Date.now(),
  };

  console.log("[debug-webhook]", info);

  return res.status(200).json(info);
}