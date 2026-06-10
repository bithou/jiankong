export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 只代理 /api/uptimerobot 路径
    if (url.pathname === '/api/uptimerobot') {
      // 读取原始请求体
      const body = await request.text();

      // 转发请求到 UptimeRobot API
      const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const data = await response.text();

      // 返回结果，添加 CORS 头
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

    // 其他请求正常走 Pages 静态文件
    return env.ASSETS.fetch(request);
  },
};
