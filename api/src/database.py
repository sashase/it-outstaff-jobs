import sqlalchemy as _sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as _orm

import configparser


config = configparser.ConfigParser()
config.read("config.ini")

SQLALCHEMY_DATABASE_URL = config['database']['database_url']

engine = _sql.create_engine(
    SQLALCHEMY_DATABASE_URL
)

session_factory = _orm.sessionmaker(
    autocommit=False, autoflush=False, bind=engine)

Base = _declarative.declarative_base()
