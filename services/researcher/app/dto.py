from typing import Any, Callable, Dict, List, Union
from pydantic import BaseModel


type PromptParams = Dict[str, Any]


class ResearchRequest(BaseModel):
    dummyApi: bool
    openAiKey: str
    tavilyApiKey: str
    reportTopic: str
    promptParams: PromptParams


class ResearchResult:
    params: PromptParams
    markdown: str


class PromptGeneratorResult:
    prompt: str
    extra_sources: Union[List[str], None] = None


type PromptGenerator = Callable[[PromptParams], PromptGeneratorResult]

type PromptExecutor = Callable[[PromptGenerator, ResearchRequest], ResearchResult]
