""" OS """
import os
from dotenv import load_dotenv
from dbconnect import DB, Connector, get_emails

load_dotenv()


SENDER_EMAIL = 'dipnersi@gmail.com'
EMAIL_PASSWORD = os.environ['EMAIL_PASSWORD']
EMAIL_TITLE = f"(НЛМК) Дайджест новостей на за последнюю неделю"

config = DB()
pager = Connector.connect_to_postgre(config)
df_email = get_emails(pager)
RECIEVER_EMAILS = df_email.email.tolist()


# Change for Excel | Google Sheets | ClickHouse

# RECIEVER_EMAILS = [
#     'semyondipner@gmail.com',
#     "dipnsersi@gmail.com"
# ]
