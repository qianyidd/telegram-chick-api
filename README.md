这是一个轻量级的 Serverless API，部署于 **Cloudflare Pages** (Advanced Mode)。它主要用于检测 Telegram 用户名（Username）是否有效/存在。

该项目利用 Cloudflare Workers 的边缘计算能力，通过模拟请求分析 Telegram 公开页面 HTML，判断账号状态，并**完美支持 CORS 跨域调用**，可直接供前端项目使用。

## ✨ 特性 (Features)

* **⚡️ 极速响应**: 部署在 Cloudflare 全球边缘网络，低延迟。
* **🔓 CORS 支持**: 内置完整的跨域资源共享 (CORS) 处理，支持 `OPTIONS` 预检请求，前端 fetch/axios 可直接调用，解决了 "Failed to fetch" 问题。
* **🕵️‍♂️ 智能检测**: 通过分析页面元数据和 Deep Link (`tg://resolve`) 精准判断账号是否存在。
* **🛡️ 反爬虫伪装**: 包含 User-Agent 伪装，提高请求成功率。
* **无需服务器**: 纯代码 `_worker.js` 部署，无需购买 VPS。

## 🚀 快速开始 (Usage)

### 接口地址

```http
GET https://<你的域名>/api/check
请求参数参数名类型必填描述ustring是需要检测的 Telegram 用户名 (不带 @)调用示例1. 使用 cURLBashcurl "[https://your-project.pages.dev/api/check?u=durov](https://your-project.pages.dev/api/check?u=durov)"
2. 使用 JavaScript (前端 Fetch)由于已经配置了 CORS，你可以直接在浏览器控制台或前端代码中运行：JavaScript// 示例：检测用户名 'durov'
fetch('[https://your-project.pages.dev/api/check?u=durov](https://your-project.pages.dev/api/check?u=durov)')
  .then(res => res.json())
  .then(data => {
    if (data.exists) {
      console.log(`✅ 用户 ${data.username} 存在`);
    } else {
      console.log(`❌ 用户 ${data.username} 不存在`);
    }
  })
  .catch(err => console.error("请求失败:", err));
响应格式成功 (200 OK):JSON{
  "username": "durov",
  "exists": true
}
失败/不存在 (200 OK):注意：即使账号不存在，只要代码运行正常也会返回 200，状态在 exists 字段中体现。JSON{
  "username": "non_existent_user_123",
  "exists": false
}
错误 (400/500):JSON{
  "error": "Missing username" 
  // 或 "Check failed", "details": "..."
}
🛠 部署指南 (Deployment)本项目使用 Cloudflare Pages 的 Advanced Mode (单文件 Worker 模式)。准备文件: 确保你的仓库根目录下只有 _worker.js 文件（包含本项目代码）。创建项目:登录 Cloudflare Dashboard。进入 Pages -> Create a project -> Connect to Git。选择包含 _worker.js 的仓库。构建配置:Build command: (保持留空)Build output directory: (保持留空，或者填 /)Cloudflare 会自动识别 _worker.js 并启用 Worker 模式。部署: 点击 Save and Deploy。⚙️ 配置说明CORS 安全设置目前代码默认允许所有域名跨域 (Access-Control-Allow-Origin: *)。如果你希望仅限自己的网站调用，请修改 _worker.js 中的 corsHeaders 变量：JavaScriptconst corsHeaders = {
  // 将 * 修改为你自己的前端域名，例如 "[https://www.example.com](https://www.example.com)"
  "Access-Control-Allow-Origin": "[https://www.example.com](https://www.example.com)", 
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
⚠️ 免责声明 (Disclaimer)本项目仅供学习和研究使用。检测逻辑依赖于 Telegram 网页版的 HTML 结构，如果 Telegram 修改了页面结构，检测可能会失效。请勿用于大规模批量扫描，这可能导致你的 IP 被 Cloudflare 或 Telegram 封锁。
