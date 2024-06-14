""" Base """
import os
from datetime import datetime as dt

import pandas as pd

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy import text

from dotenv import load_dotenv

load_dotenv()


class Connector(object):
    """ Connector Class """

    @staticmethod
    def connect_to_postgre(config: object) -> object:
        """ Connection """

        class Postgre_Connection(object):
            """ Postgre_Connection Class """
            
            def __init__(self, config: object) -> None:
                super().__init__()

                self.engine = create_engine(
                f'postgresql+psycopg2://{config.user}:{config.pwd}@{config.host}:{config.port}/{config.db}',
                client_encoding='utf8',
                echo=False
                )
                self.connection = self.engine.connect()
                self.session = sessionmaker(bind=self.engine)

        pager = Postgre_Connection(config=config)

        return pager

def get_emails(pager):
    """ smth """
    t0 = float(dt.now().timestamp())
    table_name = "email"
    query = f"""select * from public.{table_name}"""
    session = Session(pager.engine)
    data = session.execute(text(query))
    df = pd.DataFrame(data, columns=data.keys())
    session.close()
    t1 = round(float(float(dt.now().timestamp()) - t0) / 60, 2)
    print(f"get_df: {t1}")
    return df

class DB:
    """ DB Class """
    host     = os.getenv('POSTGRES_HOST')
    port     = os.getenv('POSTGRES_PORT')
    user     = os.getenv('POSTGRES_USER')
    pwd      = os.getenv('POSTGRES_PASSWORD')
    db       = os.getenv('POSTGRES_DB')


