export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. 定义通用的 CORS 头
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // 生产环境建议将 * 改为你的前端域名
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. 优先处理 OPTIONS 预检请求 (解决 Failed to fetch 的关键)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // 只处理 /api/check 路径
    if (url.pathname === "/api/check") {
      const username = url.searchParams.get("u");
      
      if (!username) {
        return new Response(JSON.stringify({ error: "Missing username" }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders // <--- 必须加上
          }
        });
      }

      const targetUrl = `https://t.me/${username}`;

      try {
        // 伪装 User-Agent，防止被 t.me 拦截
        const tgResponse = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });

        const html = await tgResponse.text();

        // 逻辑判断
        let exists = false;

        // 检查点 1
        if (html.includes(`tg://resolve?domain=${username}`)) {
            exists = true;
        }

        // 检查点 2 (保留你原本的逻辑)
        if (html.includes('tgme_page_title')) {
            // 页面加载成功逻辑
        } else {
            exists = false;
        }

        return new Response(JSON.stringify({ 
          username: username, 
          exists: exists 
        }), {
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders // <--- 必须加上
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: "Check failed", details: error.message }), {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders // <--- 必须加上
          }
        });
      }
    }

    // 对于其他请求，直接返回 404 或静态资源（由 CF Pages 处理）
    // 注意：如果是静态资源也需要跨域，env.ASSETS.fetch 默认是不带 CORS 的
    // 如果需要，你也得拦截这个响应并添加 Header，但一般 API 解决了就行
    return env.ASSETS.fetch(request);
  }
};