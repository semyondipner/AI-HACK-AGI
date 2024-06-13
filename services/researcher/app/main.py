import os

os.environ["USER_AGENT"] = (
    "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) "
    + "AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19"
)

from fastapi import FastAPI, HTTPException

from dto import PromptExecutor, PromptGenerator, ResearchRequest

import prompt_executors.dummy
import prompt_executors.gptr

import prompt_generators.innovation_news
import prompt_generators.competitor_review


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/research")
def read_item(request: ResearchRequest):
    # Choose prompt executor
    prompt_executor: PromptExecutor
    if request.dummyApi:
        prompt_executor = prompt_executors.dummy.execute_prompt
    else:
        prompt_executor = prompt_executors.gptr.execute_prompt
        # raise HTTPException(status_code=400, detail="Can not choose prompt executor")

    # Choose prompt generator
    prompt_generator: PromptGenerator

    if request.reportTopic == "INNOVATION_NEWS":
        prompt_generator = prompt_generators.innovation_news.generate_prompt
    elif request.reportTopic == "COMPETITOR_REVIEW":
        prompt_generator = prompt_generators.competitor_review.generate_prompt
    else:
        raise HTTPException(status_code=400, detail="Can not choose prompt generator")

    # Execute prompt
    ret = prompt_executor(prompt_generator, request)
    ret.params = request.promptParams

    return ret
