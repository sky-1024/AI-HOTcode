# GitHub Monitor 🐙

监控 GitHub 上与 AI、Agent、Claw、Skill、智能体相关的热门与新发项目。

[![GitHub stars](https://img.shields.io/github/stars/sky-1024/AI-hot-code)](https://github.com/sky-1024/AI-hot-code)
[![License](https://img.shields.io/github/license/sky-1024/AI-hot-code)](https://github.com/sky-1024/AI-hot-code)

---

## 🎯 项目提示词

```
你是一个专业的 GitHub 项目分析师。请用通俗易懂的中文白话总结这个项目：
1. 这个项目是什么？（用大白话解释，不要技术术语堆砌）
2. 它有什么用？（能解决什么实际问题，适合谁用）
3. 有什么亮点？（技术特色、创新之处）
要求：语言要通俗易懂，像给朋友介绍一样；简洁明了，控制在 200 字以内；重点突出实用价值
```

> 🤖 点击任意项目卡片，使用 AI 智能总结项目内容

---

## ✨ 功能特性

### 📊 项目监控
| 功能 | 说明 |
|------|------|
| 热门项目 | 按 Star 数排序，筛选高热度项目 |
| 最新项目 | 按创建时间排序，发现新项目 |
| 关注列表 | 监控权威大机构和热门开发者的项目 |
| 关键词过滤 | ai, agent, claude, claw, skill, 智能体 |

### 🤖 AI 智能总结
- 点击项目卡片弹出详情
- 点击「AI 智能总结」按钮获取中文白话总结
- 总结包含：项目是什么、有什么用、亮点
- 支持导出为 Markdown 文件

### ⚡ 实用功能
- 自动刷新（5分钟间隔）
- 后端缓存，减少 API 调用
- 权威大机构列表（15+ 组织）
- 热门开发者列表（9+ 开发者）

---

## 🚀 快速开始

### 前置要求

| 组件 | 版本 | 安装方式 |
|------|------|----------|
| Python | 3.10+ | `winget install python` |
| Node.js | 18+ | `winget install nodejs` |
| uv | latest | `pip install uv` |

### 安装

```bash
# 克隆项目
git clone https://github.com/sky-1024/AI-hot-code.git
cd AI-hot-code

# 安装后端依赖
cd backend
uv sync

# 安装前端依赖
cd ../frontend
npm install
```

### 启动

```bash
# Windows 一键启动
start.bat

# 分别启动
# 终端 1: cd backend && uv run uvicorn server:app --host 0.0.0.0 --port 8000 --reload
# 终端 2: cd frontend && npm run dev
```

访问 **http://localhost:3000**

---

## ⚙️ 配置

### 监控关键词

编辑 `backend/config.yaml`:

```yaml
keywords:
  - ai
  - agent
  - claw
  - claude
  - skill
  - 智能体
```

### 关注的大机构

```yaml
organizations:
  - anthropic      # Anthropic (Claude)
  - openai         # OpenAI
  - google-deepmind # Google DeepMind
  - meta           # Meta AI
  - microsoft      # Microsoft
  - nvidia         # NVIDIA
  - bytedance      # 字节跳动
  - langchain-ai   # LangChain
  - huggingface    # Hugging Face
  - n8n-io         # n8n 工作流
  # 更多可添加...
```

### 关注的开发者

```yaml
developers:
  - karpathy       # Andrej Karpathy
  - swyx           # Shawn Wang
  - mshumer        # Matt Shumer
  - sigoden        # Sigma
  - e2b-dev        # E2B
  # 更多可添加...
```

### GitHub Token（可选）

提高 API 速率限制：

```bash
# 设置环境变量
export GITHUB_TOKEN=your_token_here
```

---

## 🛠️ API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/config` | 获取配置 |
| GET | `/api/trending` | 热门项目 |
| GET | `/api/new` | 最新项目 |
| GET | `/api/watched` | 关注列表（机构+开发者） |
| POST | `/api/summarize` | AI 总结（需 POST JSON） |
| POST | `/api/cache/clear` | 清除缓存 |

### AI 总结示例

```bash
curl -X POST http://localhost:8000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "karpathy/autoresearch",
    "description": "Automated research",
    "language": "Python",
    "topics": ["ai", "llm"]
  }'
```

---

## 🏗️ 技术栈

| 层 | 技术 |
|----|------|
| 后端 | FastAPI + httpx + uvicorn |
| 前端 | Next.js 15 + React 19 + Tailwind CSS |
| AI | NVIDIA NIM API (gpt-oss-120b) |
| 数据 | GitHub REST API v3 |

---

## 📁 项目结构

```
├── backend/
│   ├── server.py         # FastAPI 服务
│   ├── config.yaml       # 监控配置
│   ├── pyproject.toml    # Python 依赖
│   └── uv.lock
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # 主页面
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── header.tsx
│   │   │   ├── repo-card.tsx
│   │   │   ├── summary-modal.tsx
│   │   │   └── ui/           # UI 组件
│   │   └── types/
│   ├── package.json
│   └── tailwind.config.js
├── start.bat             # Windows 一键启动
└── README.md
```

---

## 📝 License

MIT License - 欢迎贡献和改进！

---

**Built with 🐙 by [sky-1024](https://github.com/sky-1024)**
