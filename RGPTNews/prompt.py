"""
    Prompting Module
"""

# DateTime
from datetime import datetime as dt
from datetime import timedelta as td

# Settings
date1 = dt.today() - td(days=7)
date2 = dt.today()
DATE_FORMAT = "%Y-%m-%d"
WEEK_RANGE = date1.strftime(DATE_FORMAT) + " - " + date2.strftime(DATE_FORMAT)


NEWS_AMOUNT = "20"
REPORT_TYPE = "custom_report"
COMPANY_NAME = "Novolipetsk Iron and Steel Works (NLMK Group)"
COMPANY_FIELDS = "industry, metallurgy, application of artificial intelligence in industry"
CRITERIAS = f"""
Criteria for generating the final output:
1. A total of {NEWS_AMOUNT} news items were taken for research. No more and no less.
2. News should be presented in a list sorted in descending order of importance.
3. Categorization. The articles are divided into relevant topics.

Criteria for assessing the importance of news:
1. Novelty and relevance of the news. Only news for the last week is taken: {WEEK_RANGE}.
2. The news is dedicated to the use of Artificial Intelligence in the processes of industrial companies.
3. News must be relevant to topics such as {COMPANY_FIELDS}.
4. Impact on the industry and market (news about major transactions, changes in legislation, etc.
will have a higher score than news about local events)
5. Source authority (news from reputable sources such as Forbes, Bloomberg and
etc., will have a higher score than news from less authoritative sources)
"""

DETALIZATION_SETTINGS = "You should be able to describe the importance in 1-2 sentences. Short and clear."
OUTPUT_STRUCTURE = r"""
{
    "title": "Article title",
    "date_time": "Publication date",
    "article_name": "Link to publication",
    "source_name": "Title of the publication of the article",
    "source_link": "Publisher service link",
    "category": "Article category",
    "summary": "Brief summary of the article",
    "importance": "The significance of the information from the article for the enterprise"
}

Пример:
{
    "news": [
        {
            "title": "Shoptalk Europe 2024: Currys bets big on generative AI",
            "date_time": "2024-06-08",
            "article_name": "https://www.retailtechnology.co.uk/news/8217/shoptalk-europe-2024:-currys-bets-big-on-generative-ai/",
            "source_name": "Retail Technology News",
            "source_link": "https://www.retailtechnology.co.uk",
            "category": "ИИ, Розничная торговля",
            "summary": "Currys использует искусственный интеллект и облачные технологии для улучшения качества обслуживания клиентов после продажи и предоставления персонализированных рекомендаций.  Ритейлер фокусируется на  улучшении онлайн-услуг, развитии своего кредитного бизнеса и расширении услуг по ремонту и реконструкции, чтобы повысить лояльность и цикличность своей бизнес-модели.",
            "importance": "Твой текст про важность новости."
        },
        {
            "title": "Shoptalk Europe 2024: Currys bets big on generative AI",
            "date_time": "2024-06-08",
            "article_name": "https://www.retailtechnology.co.uk/news/8217/shoptalk-europe-2024:-currys-bets-big-on-generative-ai/",
            "source_name": "Retail Technology News",
            "source_link": "https://www.retailtechnology.co.uk",
            "category": "ИИ, Розничная торговля",
            "summary": "Currys использует искусственный интеллект и облачные технологии для улучшения качества обслуживания клиентов после продажи и предоставления персонализированных рекомендаций.  Ритейлер фокусируется на  улучшении онлайн-услуг, развитии своего кредитного бизнеса и расширении услуг по ремонту и реконструкции, чтобы повысить лояльность и цикличность своей бизнес-модели.",
            "importance": "Твой текст про важность новости."
        },
        ...
    ]
}
"""

PROMPT = f"""Provide full and comprehensive news summury over the last week that sutisfy this criterias {CRITERIAS}.
Structure: {OUTPUT_STRUCTURE}. Respond in Russian Language. For each news you added you must do fact checking. 
Return as json string file (no ```json) and nothing else. Don't forget close brackets. It's very important!!!"""
