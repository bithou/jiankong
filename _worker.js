export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/v2/')) {
      const body = await request.text();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30秒超时

      try {
        const response = await fetch('https://api.uptimerobot.com' + url.pathname, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
          signal: controller.signal,
        });

        clearTimeout(timeout);
        const data = await response.text();

        return new Response(data, {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
      } catch (err) {
        clearTimeout(timeout);
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
