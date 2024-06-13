from dto import PromptGenerator, ResearchRequest, ResearchResult


def execute_prompt(
    prompt_generator: PromptGenerator, request: ResearchRequest
) -> ResearchResult:
    prompt_result = prompt_generator(request.promptParams)

    sources_list = request.promptParams.get("sources", [])
    if prompt_result.extra_sources:
        sources_list += prompt_result.extra_sources

    ret = ResearchResult()
    ret.markdown = f"""
# Эмуляция исследования

## Промпт

```
{prompt_result.prompt}
```

***
## Источники

{"- " + "\n - ".join(sources_list) + "\n"}

"""
    return ret
