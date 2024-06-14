"""
    Общий PipeLine кейса НЛМК через GPTResearcher
"""
import os
import ssl
import json
import smtplib
import asyncio
import pandas as pd
from email.message import EmailMessage

# Local Imports
from gen_table import gen_from_json
from email_recievers import RECIEVER_EMAILS
from functions import get_report
from prompt import PROMPT, REPORT_TYPE
from links import foreign_news_links, russian_news_links


if __name__ == "__main__":
    LINKS = foreign_news_links + russian_news_links
    report = asyncio.run(get_report(PROMPT, REPORT_TYPE, LINKS))

    # Email - Settings
    SENDER_EMAIL = 'dipnersi@gmail.com'
    EMAIL_PASSWORD = os.environ['EMAIL_PASSWORD']
    EMAIL_TITLE = f"(НЛМК) Дайджест новостей за последнюю неделю"

    # -- read news json + make full html --
    data = json.loads(report)
    news = pd.DataFrame.from_dict(data['news'])
    html_2 = gen_from_json(news)
    with open(r"./email_part1.html", "r", encoding='utf-8') as f:
        html_1 = f.read()
    with open(r"./email_part3.html", "r", encoding='utf-8') as f:
        html_3 = f.read()
    gen = html_1 + html_2 + html_3
    # -- end --

    for EMAIL in RECIEVER_EMAILS:
        em = EmailMessage()
        em['To'] = EMAIL
        em['From'] = SENDER_EMAIL
        em['Subject'] = EMAIL_TITLE
        em.set_content(gen, subtype='html')

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
            smtp.login(SENDER_EMAIL, EMAIL_PASSWORD)
            smtp.sendmail(SENDER_EMAIL, EMAIL, em.as_string())
