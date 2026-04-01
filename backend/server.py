from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from datetime import datetime, timedelta
from typing import Optional
import asyncio
import yaml
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("github-monitor")

app = FastAPI(title="GitHub Monitor API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.yaml")

MONITOR_KEYWORDS = ["ai", "agent", "claw", "claude", "skill", "智能体"]

_cache: dict = {"trending": [], "new": [], "orgs": [], "devs": []}
_cache_time: dict = {"trending": None, "new": None, "orgs": None, "devs": None}
CACHE_DURATION = 300


def load_config():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {"keywords": MONITOR_KEYWORDS}


def get_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers


async def fetch_trending_repos(keyword: str):
    url = "https://api.github.com/search/repositories"
    query = f"{keyword} created:>{(datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d')} stars:>5"
    params = {
        "q": query,
        "sort": "stars",
        "order": "desc",
        "per_page": 15,
    }
    logger.info(f"Fetching trending for '{keyword}': {query}")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                url, params=params, headers=get_headers(), timeout=30
            )
            if resp.status_code == 200:
                data = resp.json()
                total = data.get("total_count", 0)
                items = data.get("items", [])
                logger.info(f"  -> Found {total} total, returning {len(items)} repos")
                return items
            else:
                logger.error(f"  -> HTTP {resp.status_code}: {resp.text[:200]}")
                return []
    except Exception as e:
        logger.error(f"  -> Error fetching trending for '{keyword}': {e}")
        return []


async def fetch_new_repos(keyword: str):
    url = "https://api.github.com/search/repositories"
    query = f"{keyword} created:>{(datetime.now() - timedelta(days=14)).strftime('%Y-%m-%d')}"
    params = {
        "q": query,
        "sort": "created",
        "order": "desc",
        "per_page": 15,
    }
    logger.info(f"Fetching new for '{keyword}': {query}")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                url, params=params, headers=get_headers(), timeout=30
            )
            if resp.status_code == 200:
                data = resp.json()
                total = data.get("total_count", 0)
                items = data.get("items", [])
                logger.info(f"  -> Found {total} total, returning {len(items)} repos")
                return items
            else:
                logger.error(f"  -> HTTP {resp.status_code}: {resp.text[:200]}")
                return []
    except Exception as e:
        logger.error(f"  -> Error fetching new for '{keyword}': {e}")
        return []


async def fetch_org_repos(org: str):
    url = f"https://api.github.com/orgs/{org}/repos"
    params = {
        "sort": "updated",
        "direction": "desc",
        "per_page": 10,
        "type": "public",
    }
    logger.info(f"Fetching repos for org '{org}'")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                url, params=params, headers=get_headers(), timeout=30
            )
            if resp.status_code == 200:
                items = resp.json()
                # Filter to AI-related repos
                ai_items = [
                    r
                    for r in items
                    if any(
                        kw in (r.get("description") or "").lower()
                        or kw in r.get("name", "").lower()
                        for kw in [
                            "ai",
                            "agent",
                            "llm",
                            "ml",
                            "model",
                            "claude",
                            "gpt",
                            "chat",
                            "bot",
                            "智能",
                        ]
                    )
                ]
                for r in ai_items:
                    r["_source"] = org
                    r["_type"] = "org"
                return ai_items[:5]
            else:
                logger.error(f"  -> HTTP {resp.status_code} for org {org}")
                return []
    except Exception as e:
        logger.error(f"  -> Error fetching org {org}: {e}")
        return []


async def fetch_dev_repos(dev: str):
    url = f"https://api.github.com/users/{dev}/repos"
    params = {
        "sort": "updated",
        "direction": "desc",
        "per_page": 10,
        "type": "public",
    }
    logger.info(f"Fetching repos for dev '{dev}'")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                url, params=params, headers=get_headers(), timeout=30
            )
            if resp.status_code == 200:
                items = resp.json()
                ai_items = [
                    r
                    for r in items
                    if any(
                        kw in (r.get("description") or "").lower()
                        or kw in r.get("name", "").lower()
                        for kw in [
                            "ai",
                            "agent",
                            "llm",
                            "ml",
                            "model",
                            "claude",
                            "gpt",
                            "chat",
                            "bot",
                            "智能",
                        ]
                    )
                ]
                for r in ai_items:
                    r["_source"] = dev
                    r["_type"] = "dev"
                return ai_items[:5]
            else:
                logger.error(f"  -> HTTP {resp.status_code} for dev {dev}")
                return []
    except Exception as e:
        logger.error(f"  -> Error fetching dev {dev}: {e}")
        return []

# 输入你的api 开启ai速读
NIM_API_KEY = os.getenv(
    "NIM_API_KEY",
    "",
)
NIM_API_URL = ""
NIM_MODEL = ""


@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


@app.get("/api/config")
async def get_config():
    config = load_config()
    return {
        "keywords": config.get("keywords", MONITOR_KEYWORDS),
        "organizations": config.get("organizations", []),
        "developers": config.get("developers", []),
    }


@app.get("/api/trending")
async def get_trending(
    keyword: Optional[str] = Query(None),
    force: bool = Query(False),
):
    global _cache, _cache_time

    now = datetime.now()
    if (
        not force
        and _cache_time["trending"]
        and (now - _cache_time["trending"]).seconds < CACHE_DURATION
    ):
        logger.info("Returning cached trending data")
        return {"data": _cache["trending"], "cached": True}

    config = load_config()
    keywords = [keyword] if keyword else config.get("keywords", MONITOR_KEYWORDS)
    logger.info(f"Fetching trending data for keywords: {keywords}")

    tasks = [fetch_trending_repos(kw) for kw in keywords]
    results = await asyncio.gather(*tasks)

    all_repos = {}
    for kw, repos in zip(keywords, results):
        for repo in repos:
            repo_id = repo["id"]
            if repo_id not in all_repos:
                repo["matched_keywords"] = []
                all_repos[repo_id] = repo
            all_repos[repo_id]["matched_keywords"].append(kw)

    sorted_repos = sorted(
        all_repos.values(), key=lambda x: x.get("stargazers_count", 0), reverse=True
    )

    _cache["trending"] = sorted_repos[:50]
    _cache_time["trending"] = now
    logger.info(f"Total unique trending repos: {len(sorted_repos[:50])}")

    return {"data": sorted_repos[:50], "cached": False}


@app.get("/api/new")
async def get_new(
    keyword: Optional[str] = Query(None),
    force: bool = Query(False),
):
    global _cache, _cache_time

    now = datetime.now()
    if (
        not force
        and _cache_time["new"]
        and (now - _cache_time["new"]).seconds < CACHE_DURATION
    ):
        logger.info("Returning cached new data")
        return {"data": _cache["new"], "cached": True}

    config = load_config()
    keywords = [keyword] if keyword else config.get("keywords", MONITOR_KEYWORDS)
    logger.info(f"Fetching new data for keywords: {keywords}")

    tasks = [fetch_new_repos(kw) for kw in keywords]
    results = await asyncio.gather(*tasks)

    all_repos = {}
    for kw, repos in zip(keywords, results):
        for repo in repos:
            repo_id = repo["id"]
            if repo_id not in all_repos:
                repo["matched_keywords"] = []
                all_repos[repo_id] = repo
            all_repos[repo_id]["matched_keywords"].append(kw)

    sorted_repos = sorted(
        all_repos.values(), key=lambda x: x.get("created_at", ""), reverse=True
    )

    _cache["new"] = sorted_repos[:50]
    _cache_time["new"] = now
    logger.info(f"Total unique new repos: {len(sorted_repos[:50])}")

    return {"data": sorted_repos[:50], "cached": False}


@app.get("/api/watched")
async def get_watched(
    force: bool = Query(False),
):
    global _cache, _cache_time

    now = datetime.now()
    if (
        not force
        and _cache_time["orgs"]
        and (now - _cache_time["orgs"]).seconds < CACHE_DURATION
    ):
        logger.info("Returning cached watched data")
        return {
            "organizations": _cache["orgs"],
            "developers": _cache["devs"],
            "cached": True,
        }

    config = load_config()
    orgs = config.get("organizations", [])
    devs = config.get("developers", [])
    logger.info(f"Fetching watched data: {len(orgs)} orgs, {len(devs)} devs")

    org_tasks = [fetch_org_repos(o) for o in orgs]
    dev_tasks = [fetch_dev_repos(d) for d in devs]
    org_results, dev_results = await asyncio.gather(
        asyncio.gather(*org_tasks), asyncio.gather(*dev_tasks)
    )

    org_repos = [r for group in org_results for r in group]
    dev_repos = [r for group in dev_results for r in group]

    _cache["orgs"] = org_repos
    _cache["devs"] = dev_repos
    _cache_time["orgs"] = now
    _cache_time["devs"] = now
    logger.info(
        f"Watched repos: {len(org_repos)} from orgs, {len(dev_repos)} from devs"
    )

    return {
        "organizations": org_repos,
        "developers": dev_repos,
        "cached": False,
    }


@app.post("/api/summarize")
async def summarize_repo(body: dict):
    full_name = body.get("full_name", "")
    description = body.get("description", "")
    language = body.get("language", "")
    topics = body.get("topics", [])
    readme_url = body.get("readme_url", "")

    logger.info(f"Summarizing repo: {full_name}")

    system_prompt = """你是一个专业的 GitHub 项目分析师。请用通俗易懂的中文白话总结这个项目：

1. 这个项目是什么？（用大白话解释，不要技术术语堆砌）
2. 它有什么用？（能解决什么实际问题，适合谁用）
3. 有什么亮点？（技术特色、创新之处）

要求：
- 语言要通俗易懂，像给朋友介绍一样
- 简洁明了，控制在 200 字以内
- 重点突出实用价值"""

    user_prompt = f"请总结这个 GitHub 项目：\n\n项目名称：{full_name}\n描述：{description or '无'}\n语言：{language or '未知'}\n标签：{', '.join(topics) if topics else '无'}"

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                NIM_API_URL,
                json={
                    "model": NIM_MODEL,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "max_tokens": 1024,
                    "temperature": 0.3,
                },
                headers={
                    "Authorization": f"Bearer {NIM_API_KEY}",
                    "Content-Type": "application/json",
                },
                timeout=60,
            )
            if resp.status_code == 200:
                data = resp.json()
                summary = (
                    data.get("choices", [{}])[0].get("message", {}).get("content", "")
                )
                return {"summary": summary}
            else:
                logger.error(f"NIM API error: {resp.status_code} {resp.text[:200]}")
                return {
                    "summary": f"AI 总结失败 (HTTP {resp.status_code})，请稍后重试。"
                }
    except Exception as e:
        logger.error(f"Summarize error: {e}")
        return {"summary": f"AI 总结出错：{str(e)}，请稍后重试。"}


@app.post("/api/cache/clear")
async def clear_cache():
    global _cache, _cache_time
    _cache = {"trending": [], "new": [], "orgs": [], "devs": []}
    _cache_time = {"trending": None, "new": None, "orgs": None, "devs": None}
    return {"status": "cleared"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
