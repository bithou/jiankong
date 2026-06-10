export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 拦截发往 UptimeRobot API 的请求
    if (url.pathname.startsWith('/v2/') || url.hostname === 'api.uptimerobot.com') {
      const body = await request.text();

      const response = await fetch('https://api.uptimerobot.com' + url.pathname, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

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
    }

    // OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 其他请求走 Pages 静态文件
    return env.ASSETS.fetch(request);
  },
};
