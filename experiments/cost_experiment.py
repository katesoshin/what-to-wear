"""Cost-cutting experiment: does lowering the model's reasoning effort hurt the outfits?

    python experiments/cost_experiment.py            # ~15 plans + 15 judge calls, about $0.03

Runs the same 5 occasions at reasoning effort none / low / medium, records tokens, cost, time and guard
retries, then asks a blind judge (gpt-6-luna, shuffled, setting hidden) to score each plan 1–5.
Writes experiments/results.json and experiments/results.md.
"""

import asyncio
import json
import random
import statistics
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))

from pydantic import BaseModel, Field  # noqa: E402
from pydantic_ai import Agent  # noqa: E402
from pydantic_ai.models.openai import OpenAIResponsesModelSettings  # noqa: E402

import app  # noqa: E402

EFFORTS = ["none", "low", "medium"]
OCCASIONS = [
    "First date tomorrow, 7pm at a wine bar",
    "Coffee chat with a consulting firm at 10am",
    "Lunch with my partner's parents on Sunday",
    "Friend's garden wedding, ceremony at 4pm",
    "Job interview at a tech company, 2pm",
]
DATE = "2026-10-28"
EXPERIMENT_USER = "u_00000000000e0e01"  # its own empty space: no fit profile, sample closet


class Score(BaseModel):
    fits_occasion: int = Field(ge=1, le=5, description="Do the looks hit the right dress code and effort?")
    distinct_looks: int = Field(ge=1, le=5, description="Are the three looks clearly different and each wearable?")
    explanations: int = Field(ge=1, le=5, description="Are the reasons specific, kind, and useful?")
    note: str = Field(description="One sentence")


JUDGE = Agent(app.build_model(), output_type=Score, model_settings=OpenAIResponsesModelSettings(
    max_tokens=2000, openai_reasoning_effort="low"), instructions=(
    "You are a strict senior fashion stylist grading an AI stylist's answer. You see the occasion and three "
    "suggested looks. Score honestly; 5 is rare. You do not know which version of the AI made it."))


def use_effort(effort: str) -> None:
    app.REASONING_EFFORT = effort
    app.MODEL_SETTINGS = OpenAIResponsesModelSettings(max_tokens=6_000, openai_reasoning_effort=effort)
    app.decoder_agent.cache_clear()
    app.stylist_agent.cache_clear()


async def main() -> None:
    rows = []
    for effort in EFFORTS:
        use_effort(effort)
        for occasion in OCCASIONS:
            r = await app.plan_day(app.PlanRequest(text=occasion, date=DATE), EXPERIMENT_USER)
            usage = r.get("usage", {})
            tot = lambda k: sum(a.get(k, 0) for a in usage.values())  # noqa: E731
            rows.append({
                "effort": effort, "occasion": occasion, "outcome": r["outcome"],
                "input_tokens": tot("input_tokens"), "cached_input_tokens": tot("cached_input_tokens"),
                "output_tokens": tot("output_tokens"), "cost_usd": r["cost_usd"], "seconds": r["seconds"],
                "guard_rejections": r.get("guard_rejections", 0),
                "looks": [{k: l[k] for k in ("vibe", "headline", "why", "effortless_because", "shoes_tip")}
                          | {"pieces": [p["name"] for p in l["pieces"]]} for l in r.get("options", {}).get("looks", [])],
                "brief": [{k: e[k] for k in ("title", "dress_code", "effort")} for e in r.get("events", [])],
            })
            print(f"{effort:6} {r['outcome']:8} ${r['cost_usd']:.5f} {r['seconds']:5.1f}s  {occasion}", flush=True)

    # Blind judging, shuffled so the order gives nothing away.
    judge_cost = 0.0
    for row in random.Random(409).sample(rows, len(rows)):
        if row["outcome"] != "ok":
            continue
        res = await JUDGE.run(json.dumps({"occasion": row["occasion"], "brief": row["brief"], "looks": row["looks"]}))
        row["score"] = res.output.model_dump()
        judge_cost += app.usage_dict(res.usage)["cost_usd"]

    summary = {}
    for effort in EFFORTS:
        rs = [r for r in rows if r["effort"] == effort]
        ok = [r for r in rs if r["outcome"] == "ok"]
        mean = lambda xs: round(statistics.mean(xs), 2) if xs else None  # noqa: E731
        summary[effort] = {
            "plans": len(rs), "ok": len(ok),
            "avg_input_tokens": mean([r["input_tokens"] for r in ok]),
            "avg_cached_input_tokens": mean([r["cached_input_tokens"] for r in ok]),
            "avg_output_tokens": mean([r["output_tokens"] for r in ok]),
            "avg_cost_usd": round(statistics.mean([r["cost_usd"] for r in ok]), 6) if ok else None,
            "avg_seconds": mean([r["seconds"] for r in ok]),
            "guard_retries": sum(r["guard_rejections"] for r in rs),
            "score_fits_occasion": mean([r["score"]["fits_occasion"] for r in ok if "score" in r]),
            "score_distinct_looks": mean([r["score"]["distinct_looks"] for r in ok if "score" in r]),
            "score_explanations": mean([r["score"]["explanations"] for r in ok if "score" in r]),
        }
    (HERE / "results.json").write_text(json.dumps({"summary": summary, "judge_cost_usd": round(judge_cost, 6),
                                                   "rows": rows}, indent=1, ensure_ascii=False))
    head = "| effort | ok | avg in | avg cached | avg out | avg cost | avg time | guard retries | fits | distinct | explain |"
    lines = [head, "|" + "---|" * 11]
    for e, s in summary.items():
        lines.append(f"| {e} | {s['ok']}/{s['plans']} | {s['avg_input_tokens']} | {s['avg_cached_input_tokens']} | "
                     f"{s['avg_output_tokens']} | ${s['avg_cost_usd']} | {s['avg_seconds']}s | {s['guard_retries']} | "
                     f"{s['score_fits_occasion']} | {s['score_distinct_looks']} | {s['score_explanations']} |")
    (HERE / "results.md").write_text("# Reasoning-effort experiment\n\n" + "\n".join(lines)
                                     + f"\n\nJudge cost: ${judge_cost:.5f}. Scores are 1–5 from a blind judge.\n")
    print("\n".join(lines))


if __name__ == "__main__":
    asyncio.run(main())
