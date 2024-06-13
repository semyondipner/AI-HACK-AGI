import os
from dto import PromptGenerator, ResearchRequest, ResearchResult
import asyncio
import datetime
from dto import ResearchRequest, ResearchResult
from gpt_researcher import GPTResearcher


def execute_prompt(
    prompt_generator: PromptGenerator, request: ResearchRequest
) -> ResearchResult:
    os.environ["OPENAI_API_KEY"] = request.openAiKey
    os.environ["TAVILY_API_KEY"] = request.tavilyApiKey

    prompt_result = prompt_generator(request.promptParams)

    sources = request.promptParams.get("sources", [])
    if prompt_result.extra_sources:
        sources += prompt_result.extra_sources

    report_type = "custom_report"  # research_report, resource_report, outline_report, custom_report, subtopic_report

    markdown = asyncio.run(get_report(prompt_result.prompt, report_type, sources))

    ret = ResearchResult()
    ret.markdown = markdown
    return ret


async def get_report(query: str, report_type: str, sources: list) -> str:
    researcher = GPTResearcher(
        query=query, report_type=report_type, source_urls=sources
    )
    await researcher.conduct_research()
    report = await researcher.write_report()
    return report
