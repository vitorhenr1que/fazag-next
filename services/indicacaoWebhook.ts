import type { JunteSeANos } from '@prisma/client';

export async function notifyNovaIndicacao(indicacao: JunteSeANos): Promise<void> {
  const url = process.env.INDICACAO_WEBHOOK_URL;
  if (!url) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const token = process.env.INDICACAO_WEBHOOK_TOKEN;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': indicacao.id,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        event: 'indicacao.criada',
        data: indicacao,
      }),
      signal: controller.signal,
      redirect: 'error',
    });

    if (!response.ok) {
      console.error('Falha ao enviar webhook de indicação', {
        id: indicacao.id,
        status: response.status,
      });
    }
  } catch {
    console.error('Falha ao enviar webhook de indicação', { id: indicacao.id });
  } finally {
    clearTimeout(timeout);
  }
}
