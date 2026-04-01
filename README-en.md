# GitHub Monitor 🐙

Monitor trending and new GitHub projects related to AI, Agent, Claw, Skill, and Intelligent Agents.

[![GitHub stars](https://img.shields.io/github/stars/sky-1024/AI-hot-code)](https://github.com/sky-1024/AI-hot-code)
[![License](https://img.shields.io/github/license/sky-1024/AI-hot-code)](https://github.com/sky-1024/AI-hot-code)

📺 Project Reference: Douyin @32571643812

---

## 🎯 Project Prompt

```
You are a professional GitHub project analyst. Please summarize this project in plain Chinese:

1. What is this project? (Explain in simple terms, avoid technical jargon)
2. What is it for? (What real-world problems does it solve, who is it for?)
3. What are its highlights? (Technical features, innovations)

Requirements:
- Use plain, conversational language like explaining to a friend
- Keep it concise within 200 words
- Highlight practical value
```

> 🤖 Click any project card to use AI to summarize the project content

---

## ✨ Features

### 📊 Project Monitoring
| Feature | Description |
|---------|-------------|
| Trending Projects | Sort by Star count, filter high-popularity projects |
| New Projects | Sort by creation time, discover new projects |
| Watched List | Monitor projects from authoritative organizations and popular developers |
| Keyword Filter | ai, agent, claude, claw, skill, 智能体 |

### 🤖 AI Summary
- Click project card to open details
- Click "AI Summary" button to get a plain Chinese summary
- Summary includes: What is the project, What is it for, Highlights
- Support export as Markdown file

### ⚡ Practical Features
- Auto-refresh (5-minute interval)
- Backend caching to reduce API calls
- Authoritative organization list (15+ organizations)
- Popular developer list (9+ developers)

---

## 🚀 Quick Start

### Prerequisites

| Component | Version | Installation |
|-----------|---------|--------------|
| Python | 3.10+ | `winget install python` |
| Node.js | 18+ | `winget install nodejs` |
| uv | latest | `pip install uv` |

### Installation

```bash
# Clone project
git clone https://github.com/sky-1024/AI-hot-code.git
cd AI-hot-code

# Install backend dependencies
cd backend
uv sync

# Install frontend dependencies
cd ../frontend
npm install
```

### Start

```bash
# Windows one-click start
start.bat

# Start separately
# Terminal 1: cd backend && uv run uvicorn server:app --host 0.0.0.0 --port 8000 --reload
# Terminal 2: cd frontend && npm run dev
```

Visit **http://localhost:3000**

---

## ⚙️ Configuration

### Monitoring Keywords

Edit `backend/config.yaml`:

```yaml
keywords:
  - ai
  - agent
  - claw
  - claude
  - skill
  - 智能体
```

### Watched Organizations

```yaml
organizations:
  - anthropic      # Anthropic (Claude)
  - openai         # OpenAI
  - google-deepmind # Google DeepMind
  - meta           # Meta AI
  - microsoft      # Microsoft
  - nvidia         # NVIDIA
  - bytedance      # ByteDance
  - langchain-ai   # LangChain
  - huggingface    # Hugging Face
  - n8n-io         # n8n Workflow
  # More can be added...
```

### Watched Developers

```yaml
developers:
  - karpathy       # Andrej Karpathy
  - swyx           # Shawn Wang
  - mshumer        # Matt Shumer
  - sigoden        # Sigma
  - e2b-dev        # E2B
  # More can be added...
```

### GitHub Token (Optional)

Increase API rate limit:

```bash
# Set environment variable
export GITHUB_TOKEN=your_token_here
```

---

## 🛠️ API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/config` | Get configuration |
| GET | `/api/trending` | Trending projects |
| GET | `/api/new` | New projects |
| GET | `/api/watched` | Watched list (organizations + developers) |
| POST | `/api/summarize` | AI summary (requires POST JSON) |
| POST | `/api/cache/clear` | Clear cache |

### AI Summary Example

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

## 🤖 AI Summary Configuration (IMPORTANT)

To enable the AI summary feature, you need to configure the API credentials in `backend/server.py`:

### Step 1: Configure API Credentials

Open `backend/server.py` and modify **lines 202-208**:

```python
# Line 202-208: Configure your AI API credentials
NIM_API_KEY = os.getenv(
    "NIM_API_KEY",
    "your-api-key-here",  # Replace with your API key
)
NIM_API_URL = "https://api.your-provider.com/v1/chat/completions"  # Replace with your API URL
NIM_MODEL = "gpt-4o"  # Replace with your model name
```

### Step 2: Set Environment Variables (Recommended)

Instead of hardcoding, set environment variables:

```bash
# Windows
set NIM_API_KEY=your-api-key-here
set NIM_API_URL=https://api.your-provider.com/v1/chat/completions
set NIM_MODEL=your-model-name

# Linux/Mac
export NIM_API_KEY=your-api-key-here
export NIM_API_URL=https://api.your-provider.com/v1/chat/completions
export NIM_MODEL=your-model-name
```

### Supported API Providers

The AI summary feature supports any OpenAI-compatible API, including:
- OpenAI API (GPT-4, GPT-4o, GPT-3.5 Turbo)
- Anthropic API (Claude)
- Azure OpenAI
- Ollama (local)
- LM Studio (local)
- Other OpenAI-compatible APIs

### Summary Endpoint

The AI summary feature is implemented in **lines 360-416** (`/api/summarize` endpoint):
- Accepts POST requests with project details
- Returns Chinese summary of the project
- Includes error handling for API failures

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI + httpx + uvicorn |
| Frontend | Next.js 15 + React 19 + Tailwind CSS |
| AI | OpenAI API (any model) |
| Data | GitHub REST API v3 |

---

## 📁 Project Structure

```
├── backend/
│   ├── server.py         # FastAPI service
│   ├── config.yaml       # Monitoring configuration
│   ├── pyproject.toml    # Python dependencies
│   └── uv.lock
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx      # Main page
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── header.tsx
│   │   │   ├── repo-card.tsx
│   │   │   ├── summary-modal.tsx
│   │   │   └── ui/           # UI components
│   │   └── types/
│   ├── package.json
│   └── tailwind.config.js
├── start.bat             # Windows one-click start
└── README.md
```

---

## 📝 License

MIT License - Contributions and improvements welcome!

---

**Built with 🐙 by [sky-1024](https://github.com/sky-1024)**