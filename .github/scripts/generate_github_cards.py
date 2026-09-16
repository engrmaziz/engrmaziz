#!/usr/bin/env python3
"""Render GitHub stats cards as local SVGs so the profile README never hits Vercel 402s."""

from __future__ import annotations

import json
import os
import subprocess
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets" / "ragx"
USER = os.environ.get("RAGX_USER") or os.environ.get("GITHUB_REPOSITORY_OWNER") or "engrmaziz"
FONT = "Consolas, 'Courier New', monospace"


def gh_graphql(query: str, **variables):
    cmd = ["gh", "api", "graphql", "-f", "query=" + " ".join(query.split())]
    for key, value in variables.items():
        cmd.extend(["-F", f"{key}={value}"])
    raw = subprocess.check_output(cmd, text=True)
    payload = json.loads(raw)
    if payload.get("errors"):
        raise RuntimeError(payload["errors"])
    return payload["data"]


def esc(text: str) -> str:
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def fmt(n: int) -> str:
    if n >= 1000:
        return f"{n:,}"
    return str(n)


def fetch_user():
    data = gh_graphql(
        """
        query($login:String!){
          user(login:$login){
            name login
            followers{totalCount}
            repositories(ownerAffiliations:OWNER, isFork:false){totalCount}
            pullRequests{totalCount}
            issues{totalCount}
            contributionsCollection{
              totalCommitContributions
              restrictedContributionsCount
              contributionCalendar{
                totalContributions
                weeks{contributionDays{date contributionCount}}
              }
            }
          }
        }
        """,
        login=USER,
    )
    return data["user"]


def fetch_repos():
    query = """
    query($login:String!, $endCursor:String){
      user(login:$login){
        repositories(first:100, after:$endCursor, ownerAffiliations:OWNER, isFork:false, privacy:PUBLIC){
          pageInfo{hasNextPage endCursor}
          nodes{
            stargazerCount
            forkCount
            languages(first:10, orderBy:{field:SIZE, direction:DESC}){
              edges{size node{name color}}
            }
          }
        }
      }
    }
    """
    nodes = []
    cursor = None
    while True:
        kwargs = {"login": USER}
        if cursor:
            kwargs["endCursor"] = cursor
        page = gh_graphql(query, **kwargs)["user"]["repositories"]
        nodes.extend(page["nodes"])
        if not page["pageInfo"]["hasNextPage"]:
            break
        cursor = page["pageInfo"]["endCursor"]
    return nodes


def write(path: Path, svg: str) -> None:
    path.write_text(svg.strip() + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")


def hud_frame(width: int, height: int, title: str, body: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img">
  <title>{esc(title)}</title>
  <rect width="{width}" height="{height}" fill="#050a14"/>
  <rect x="10" y="10" width="{width - 20}" height="{height - 20}" fill="#07111f" stroke="#00D4FF" stroke-opacity="0.35"/>
  <path d="M10 34 L10 10 L34 10" fill="none" stroke="#7DF9FF" stroke-width="2"/>
  <path d="M{width - 34} 10 L{width - 10} 10 L{width - 10} 34" fill="none" stroke="#7DF9FF" stroke-width="2"/>
  {body}
</svg>'''


def stats_svg(user: dict, stars: int) -> str:
    commits = user["contributionsCollection"]["totalCommitContributions"]
    contrib = user["contributionsCollection"]["contributionCalendar"]["totalContributions"]
    rows = [
        ("STARS", stars),
        ("COMMITS / YR", commits),
        ("CONTRIBUTIONS", contrib),
        ("REPOS", user["repositories"]["totalCount"]),
        ("ISSUES", user["issues"]["totalCount"]),
        ("PULL REQUESTS", user["pullRequests"]["totalCount"]),
    ]
    lines = [
        f'<text x="28" y="36" fill="#8BA0B5" font-family="{FONT}" font-size="11" letter-spacing="2.2">RAGX // GITHUB STATS</text>',
        f'<text x="467" y="36" text-anchor="end" fill="#3DFF9A" font-family="{FONT}" font-size="11" letter-spacing="1.6">{esc(user["login"].upper())}</text>',
    ]
    for i, (label, value) in enumerate(rows):
        y = 70 + i * 28
        lines.append(
            f'<text x="28" y="{y}" fill="#8BA0B5" font-family="{FONT}" font-size="12" letter-spacing="1.4">{esc(label)}</text>'
        )
        lines.append(
            f'<text x="467" y="{y}" text-anchor="end" fill="#7DF9FF" font-family="{FONT}" font-size="16">{fmt(value)}</text>'
        )
    return hud_frame(495, 255, "GitHub Stats", "\n  ".join(lines))


def langs_svg(repos: list[dict]) -> str:
    sizes: dict[str, int] = defaultdict(int)
    colors: dict[str, str] = {}
    for repo in repos:
        total = sum(edge["size"] for edge in repo["languages"]["edges"])
        if total > 8_000_000:
            continue
        for edge in repo["languages"]["edges"]:
            name = edge["node"]["name"]
            sizes[name] += edge["size"]
            colors[name] = edge["node"].get("color") or "#00D4FF"
    ranked = sorted(sizes.items(), key=lambda item: item[1], reverse=True)[:6]
    total = sum(size for _, size in ranked) or 1
    lines = [
        f'<text x="28" y="36" fill="#8BA0B5" font-family="{FONT}" font-size="11" letter-spacing="2.2">RAGX // TOP LANGUAGES</text>',
        f'<text x="467" y="36" text-anchor="end" fill="#C9A227" font-family="{FONT}" font-size="11" letter-spacing="1.6">PUBLIC REPOS</text>',
    ]
    for i, (name, size) in enumerate(ranked):
        y = 68 + i * 30
        pct = size / total
        bar = max(18, int(360 * pct))
        color = colors.get(name, "#00D4FF")
        lines.append(f'<text x="28" y="{y}" fill="#C9D6E3" font-family="{FONT}" font-size="13">{esc(name)}</text>')
        lines.append(f'<rect x="28" y="{y + 6}" width="360" height="6" rx="3" fill="#0a1628"/>')
        lines.append(f'<rect x="28" y="{y + 6}" width="{bar}" height="6" rx="3" fill="{color}"/>')
        lines.append(
            f'<text x="467" y="{y}" text-anchor="end" fill="#7DF9FF" font-family="{FONT}" font-size="12">{pct * 100:.1f}%</text>'
        )
    return hud_frame(495, 255, "Top Languages", "\n  ".join(lines))


def graph_svg(user: dict) -> str:
    days = [
        day
        for week in user["contributionsCollection"]["contributionCalendar"]["weeks"]
        for day in week["contributionDays"]
    ]
    weeks = []
    for i in range(0, len(days), 7):
        chunk = days[i : i + 7]
        if not chunk:
            continue
        weeks.append(
            {
                "date": chunk[0]["date"],
                "count": sum(day["contributionCount"] for day in chunk),
            }
        )
    counts = [week["count"] for week in weeks]
    peak = max(counts) if counts else 1
    left, right, top, bottom = 48, 1060, 72, 230
    width = right - left
    height = bottom - top
    pts = []
    for i, count in enumerate(counts):
        x = left + (i / max(len(counts) - 1, 1)) * width
        y = bottom - (count / peak) * height
        pts.append((x, y, count))
    poly = " ".join(f"{x:.1f},{y:.1f}" for x, y, _ in pts)
    area = f"{left:.1f},{bottom} " + poly + f" {right:.1f},{bottom}"
    circles = "\n  ".join(
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.4" fill="#C9A227"/>' for x, y, count in pts if count > 0
    )
    start = weeks[0]["date"] if weeks else ""
    end = weeks[-1]["date"] if weeks else ""
    total = sum(counts)
    body = f'''
  <text x="28" y="36" fill="#8BA0B5" font-family="{FONT}" font-size="11" letter-spacing="2.2">RAGX // COMMIT TELEMETRY</text>
  <text x="1072" y="36" text-anchor="end" fill="#00D4FF" font-family="{FONT}" font-size="11" letter-spacing="1.6">{total} EVENTS / 12M</text>
  <line x1="{left}" y1="{bottom}" x2="{right}" y2="{bottom}" stroke="#00D4FF" stroke-opacity="0.2"/>
  <line x1="{left}" y1="{top}" x2="{left}" y2="{bottom}" stroke="#00D4FF" stroke-opacity="0.2"/>
  <polygon points="{area}" fill="#00D4FF" fill-opacity="0.12"/>
  <polyline points="{poly}" fill="none" stroke="#00D4FF" stroke-width="2"/>
  {circles}
  <text x="{left}" y="252" fill="#8BA0B5" font-family="{FONT}" font-size="11">{esc(start)}</text>
  <text x="{right}" y="252" text-anchor="end" fill="#8BA0B5" font-family="{FONT}" font-size="11">{esc(end)}</text>
'''
    return hud_frame(1100, 280, "Commit telemetry graph", body)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    user = fetch_user()
    repos = fetch_repos()
    stars = sum(repo["stargazerCount"] for repo in repos)
    write(OUT / "github-stats.svg", stats_svg(user, stars))
    write(OUT / "top-langs.svg", langs_svg(repos))
    write(OUT / "commit-graph.svg", graph_svg(user))
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    print(f"generated cards for {USER} at {stamp}")


if __name__ == "__main__":
    main()
