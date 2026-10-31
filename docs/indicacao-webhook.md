# Webhook de nova indicação

Após salvar uma indicação em `POST /api/junte-se-a-nos/create`, o servidor envia
um POST JSON ao destino definido nas variáveis de ambiente:

```dotenv
INDICACAO_WEBHOOK_URL=https://seu-servidor.example/webhooks/indicacoes
# Opcional: enviado no cabeçalho Authorization: Bearer <token>
INDICACAO_WEBHOOK_TOKEN=
```

Configure essas variáveis no servidor e reinicie a aplicação. Sem URL configurada,
o envio fica desativado. As variáveis são exclusivas do servidor.

Os campos são enviados diretamente na raiz do JSON. Exemplo de corpo enviado:

```json
{
  "id": "uuid-da-indicacao",
  "nome_aluno": "Maria Silva",
  "curso_aluno": "Administração",
  "cpf_aluno": "01234567890",
  "numero_matricula": "000123",
  "nome_indicado": "João Souza",
  "curso_indicado": "Direito",
  "telefone_indicado": "75999999999",
  "data": "2026-10-31T12:00:00.000Z"
}
```

O cabeçalho `Idempotency-Key` contém o ID da indicação e pode ser usado pelo
destinatário para evitar processamento duplicado.
O cabeçalho `X-Webhook-Event` identifica o evento como `indicacao.criada`.

O destinatário deve responder com status 2xx em até 5 segundos. Há uma tentativa
por indicação, sem reenvio automático. Falhas são registradas no log com ID e,
quando disponível, status HTTP; a indicação continua salva e a API retorna 201.
O envio é aguardado antes da resposta da API e pode acrescentar até 5 segundos
ao tempo de resposta. Redirecionamentos não são seguidos.
