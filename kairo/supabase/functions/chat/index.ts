type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type GeminiContent = {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
    status?: string;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const jsonResponse = (
  body: Record<string, unknown>,
  status: number,
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.role === 'user' || value.role === 'assistant') &&
    typeof value.content === 'string' &&
    value.content.trim().length > 0
  );
};

const parseGeminiResponse = (value: unknown): GeminiResponse => {
  if (!isRecord(value)) {
    return {};
  }

  return value as GeminiResponse;
};

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch (error) {
    console.error('Failed to parse request JSON:', error);
    return jsonResponse({ error: 'Request body must be valid JSON' }, 400);
  }

  if (!isRecord(requestBody) || typeof requestBody.message !== 'string') {
    return jsonResponse(
      { error: 'The request must include a message string' },
      400,
    );
  }

  const message = requestBody.message.trim();

  if (!message) {
    return jsonResponse({ error: 'Message cannot be empty' }, 400);
  }

  const rawHistory = requestBody.history;
  const history: ChatMessage[] = rawHistory === undefined
    ? []
    : Array.isArray(rawHistory)
      ? rawHistory.filter(isChatMessage).slice(-20)
      : [];

  if (rawHistory !== undefined && !Array.isArray(rawHistory)) {
    return jsonResponse({ error: 'History must be an array' }, 400);
  }

  if (Array.isArray(rawHistory) && rawHistory.some((item) => !isChatMessage(item))) {
    return jsonResponse(
      { error: 'Each history item must contain a valid role and content' },
      400,
    );
  }

  const configuredApiKey =
    Deno.env.get('GEMINI_API_KEY') ??
    Deno.env.get('GEMINI_FREE_MODEL') ??
    '';
  const apiKey = configuredApiKey.trim();
  const configuredModel = Deno.env.get('GEMINI_MODEL')?.trim();
  const model = configuredModel || 'gemini-3.8-flash';

  if (!apiKey) {
    console.error('Neither GEMINI_API_KEY nor GEMINI_FREE_MODEL is configured');
    return jsonResponse(
      { error: 'Gemini API key is not configured' },
      500,
    );
  }

  const contents: GeminiContent[] = [
    ...history.map((item): GeminiContent => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  let geminiResponse: Response;

  try {
    geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
          },
        }),
        signal: controller.signal,
      },
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Gemini request timed out');
      return jsonResponse({ error: 'Gemini request timed out' }, 504);
    }

    console.error('Gemini network request failed:', error);
    return jsonResponse({ error: 'Unable to reach Gemini' }, 502);
  } finally {
    clearTimeout(timeout);
  }

  const responseText = await geminiResponse.text();
  let result: GeminiResponse;

  try {
    result = parseGeminiResponse(JSON.parse(responseText) as unknown);
  } catch (error) {
    console.error('Gemini returned invalid JSON:', error);
    return jsonResponse(
      { error: 'Gemini returned an invalid response' },
      502,
    );
  }

  if (!geminiResponse.ok) {
    console.error('Gemini API error:', {
      status: geminiResponse.status,
      providerStatus: result.error?.status,
      message: result.error?.message,
    });

    return jsonResponse(
      {
        error: 'Gemini API request failed',
        providerStatus: geminiResponse.status,
        providerError: result.error?.message ?? null,
      },
      502,
    );
  }

  const reply = result.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!reply) {
    console.error('Gemini response did not contain text');
    return jsonResponse({ error: 'Gemini returned an empty response' }, 502);
  }

  return jsonResponse({ reply }, 200);
});
