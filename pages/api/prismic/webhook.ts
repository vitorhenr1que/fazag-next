// pages/api/prismic/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import * as prismic from "@prismicio/client";
import { PrismicDocument } from "@prismicio/types";
import { getClient } from "../../../services/prismic";

type PrismicTrigger = {
  type?: string; // "api-update"
  masterRef?: string;
  apiUrl?: string; // ex.: "https://fazag.prismic.io/api"
  domain?: string; // ex.: "fazag"
  documents?: string[]; // IDs dos docs
  secret?: string; // o secret enviado pelo Prismic (se configurado)
  [k: string]: unknown;
};

type Result = {
  revalidated: boolean;
  ok: string[];
  failed: Array<{ path: string; error: string }>;
  docs: string[];
  now: number;
};

// ---- ajuste o linkResolver para o seu projeto ----
function linkResolver(doc: PrismicDocument): string {

   if (doc.type === "posts" && doc.uid) return `/fazaginforma/${doc.uid}`;
   if (doc.type === "courses" && doc.uid) return `/cursos/${doc.uid}`;
   if (doc.type === "images" && doc.uid) return `/`;

  return "/"; // ajuste isso!
}

function getSecret(req: NextApiRequest): string | undefined {
  // GET geralmente passa via query string
  const qsSecret =
    (typeof req.query.secret === "string" && req.query.secret) ||
    (typeof req.query["x-prismic-secret"] === "string" && req.query["x-prismic-secret"]);
  if (qsSecret) return qsSecret;

  // fallback para header
  return (req.headers["x-prismic-secret"] as string | undefined) ??
         (req.headers["X-Prismic-Secret"] as string | undefined);
}

function parseDocsFromQuery(req: NextApiRequest): string[] {
  // aceita ?docs=id1,id2,id3 ou ?docs=id1&docs=id2
  const raw = req.query.docs;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.flatMap((s) => s.split(",")).filter(Boolean);
  return raw.split(",").filter(Boolean);
}

// GET não costuma trazer body, mas deixamos a função caso você acione manualmente (ex.: curl com -d no GET)
function parseTrigger(input: unknown): PrismicTrigger {
  if (typeof input === "string") {
    try {
      return JSON.parse(input) as PrismicTrigger;
    } catch {
      return {};
    }
  }
  return (input ?? {}) as PrismicTrigger;
}

async function fetchPathsFromPrismic(
  repoEndpoint: string,
  docIds: string[],
  ref?: string
): Promise<string[]> {
  if (docIds.length === 0) return [];


  // Se o webhook manda masterRef e você quer garantir a leitura daquela ref específica:
  // (normalmente o client já usa a ref master current; defina explicitamente se preferir)
  // const repository = await client.getRepository();
  // const master = ref ?? repository.refs.find(r => r.isMasterRef)?.ref;

  // Busca os docs por ID em lote
  const results = await getClient().getAllByIDs(docIds /*, { ref: master }*/);

  // Mapeia para URLs do site via linkResolver
  const paths = results
    .map((doc) => linkResolver(doc as unknown as PrismicDocument))
    .filter((p) => typeof p === "string" && p.startsWith("/"));

  // Remove duplicados
  return Array.from(new Set(paths));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result | { error: string }>
): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // 1) valida secret
  const secret = getSecret(req);
  if (!secret || secret !== process.env.PRISMIC_ACCESS_TOKEN) {
    res.status(401).json({ error: "Acesso negado, o token não foi passado ou está incorreto." });
    return;
  }

  // 2) lê docs IDs: prioriza query (?docs=...), senão tenta payload (se houver)
  const fromQuery = parseDocsFromQuery(req);
  const trigger = parseTrigger(req.body); // normalmente vazio em GET
  const fromBody = Array.isArray((trigger as any)?.documents) ? (trigger as any).documents as string[] : [];
  const docIds = fromQuery.length ? fromQuery : fromBody;

  // 3) determina endpoint do repositório
  const repoEndpoint = (typeof trigger.apiUrl === "string" && trigger.apiUrl.replace(/\/api\/?$/, "")) || (typeof trigger.domain === "string" ? `https://${trigger.domain}.prismic.io` : "");

  if (!repoEndpoint) {
    res.status(500).json({ error: "PRISMIC_REPO_ENDPOINT ausente e apiUrl/domain não presentes no trigger." });
    return;
  }

  // 4) caminhos a revalidar
  let paths: string[] = [];
  try {
    const resolved = await fetchPathsFromPrismic(repoEndpoint, docIds, trigger.masterRef);
    paths = resolved.length > 0 ? resolved : ["/"]; // fallback: homepage
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Falha ao buscar docs no Prismic";
    res.status(500).json({ error: msg });
    return;
  }

  // 5) revalida cada path e reporta sucesso/erro granular
  const ok: string[] = [];
  const failed: Array<{ path: string; error: string }> = [];

  for (const p of paths) {
    try {
      await res.revalidate(p);
      ok.push(p);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha desconhecida em res.revalidate";
      failed.push({ path: p, error: msg });
    }
  }

  const payload: Result = {
    revalidated: failed.length === 0,
    ok,
    failed,
    docs: docIds,
    now: Date.now(),
  };

  res.status(failed.length ? 207 /* Multi-Status */ : 200).json(payload);
}