# **Telegram Username Checker API**

这是一个基于 [Cloudflare Workers](https://workers.cloudflare.com/) (或 Cloudflare Pages Advanced Mode) 的轻量级 API。它用于检测指定的 Telegram 用户名是否已经被注册或存在。

该脚本通过请求 t.me 页面并分析返回的 HTML 内容来判断用户名的有效性，同时内置了完整的 CORS 支持，方便前端项目直接调用。

## **✨ 功能特性**

* **⚡️ 快速检测**: 直接通过边缘网络请求 Telegram 服务器。  
* **🌐 CORS 支持**: 内置 Access-Control-Allow-Origin，支持前端跨域调用。  
* **🛡️ 伪装请求**: 设置了 User-Agent 以防止被目标服务器拦截。  
* **📄 JSON 响应**: 返回简洁的 JSON 格式结果。  
* **🔧 预检支持**: 自动处理 OPTIONS 请求，解决跨域 "Failed to fetch" 问题。

## **🚀 部署方法**

此代码设计为 Cloudflare Pages 的 **Advanced Mode** (\_worker.js) 或独立的 Cloudflare Worker。

### **方式一：Cloudflare Pages (推荐)**

1. 在你的项目根目录下创建一个名为 \_worker.js 的文件。  
2. 将代码粘贴到该文件中。  
3. 将项目部署到 Cloudflare Pages。  
4. 部署完成后，API 将在 https://你的域名.pages.dev/api/check 可用。

### **方式二：Cloudflare Workers (Wrangler)**

1. 确保你的 wrangler.toml 配置正确。  
2. 将代码复制到 src/index.js (或你的入口文件)。  
3. 使用 wrangler deploy 发布。

## **📚 API 文档**

### **检查用户名**

检测某个 Telegram 用户名是否存在。

* **URL**: /api/check  
* **Method**: GET  
* **Content-Type**: application/json

#### **请求参数 (Query Params)**

| 参数名 | 类型 | 必填 | 描述 |
| :---- | :---- | :---- | :---- |
| u | string | 是 | 需要检测的 Telegram 用户名 (不带 @) |

#### **请求示例**
测试 API：访问 https://你的名字.workers.dev/check?u=durov (具体路径请参考 API 项目文档)，确认能返回 JSON 数据。

#### **响应示例**

**1\. 用户存在 (200 OK)**

{  
  "username": "durov",  
  "exists": true  
}

**2\. 用户不存在 (200 OK)**

{  
  "username": "non\_existent\_user\_123",  
  "exists": false  
}

**3\. 缺少参数 (400 Bad Request)**

{  
  "error": "Missing username"  
}

**4\. 服务器/网络错误 (500 Internal Server Error)**

{  
  "error": "Check failed",  
  "details": "错误详细信息..."  
}

## **⚙️ 配置说明**

### **CORS 配置**

在 \_worker.js 文件顶部，你可以修改 CORS 策略以限制允许的域名（生产环境建议修改）：

const corsHeaders \= {  
  // 建议将 '\*' 改为你的前端域名，例如 '\[https://www.example.com\](https://www.example.com)'  
  "Access-Control-Allow-Origin": "\*",   
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",  
  "Access-Control-Allow-Headers": "Content-Type",  
};

### **静态资源回退**

代码包含以下逻辑：如果请求路径不是 /api/check，它将尝试从 Cloudflare Pages 的静态资产中获取内容。

return env.ASSETS.fetch(request);

## **⚠️ 免责声明**

本项目仅供学习和技术研究使用。代码逻辑依赖于解析 Telegram 网页版的 HTML 结构，如果 Telegram 修改了网页结构或反爬虫策略，本 API 可能会失效。请勿用于大规模滥用或恶意扫描。

## **📄 License**

MIT部，你可以修改 CORS 策略以限制允许的域名（生产环境建议修改）：const corsHeaders = {
  // 建议将 '*' 改为你的前端域名，例如 '[https://www.example.com](https://www.example.com)'
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
静态资源回退代码包含以下逻辑：如果请求路径不是 /api/check，它将尝试从 Cloudflare Pages 的静态资产中获取内容。return env.ASSETS.fetch(request);
⚠️ 免责声明本项目仅供学习和技术研究使用。代码逻辑依赖于解析 Telegram 网页版的 HTML 结构，如果 Telegram 修改了网页结构或反爬虫策略，本 API 可能会失效。请勿用于大规模滥用或恶意扫描。📄 LicenseMIT
