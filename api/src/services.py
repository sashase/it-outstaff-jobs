import fastapi as _fastapi
from fastapi.responses import JSONResponse

import openai as _openai
import sqlalchemy.orm as _orm

import configparser

import database as _database
from database import session_factory as _session_factory

from datetime import datetime

import models as _models
import schemas as _schemas

import posts_parser as _parser

config = configparser.ConfigParser()
config.read("config.ini")

_openai.api_key = config['openai']['api_key']


session = _orm.scoped_session(_session_factory)

def get_structured_text(text: str):
    result = _openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user",
                "content": f"analyze job proposition or request, put results in a strictly formatted string (see brackets for more info) - '[type (available/looking for)],[programming language (official name, without any additional details, like JavaScript not JS/Node, and not a framework name)],[seniority(use only Junior, Middle or Senior)],[rate(in dollars)],[location(only country)],[english level(use only Basic, Intermediate or Fluent)]'. Separate it with comma if not applicable put a zero. If there are two or more titles - return two or more strings separate them using vertical line '|'. If it's not in english, translate to english. If there are some frameworks in stack, skip it and keep only language. Don't put any extra spaces between commas or lines. Don't provide any free text in your answer - #available #outstaff #team #fulltime #UIUX #Flutter #Java #QA\n\nHi everybody,\nAvailable for outstaff and as a team at ProArea are:\n\n📌Middle Flutter Developers, location Poland\n\n📌Middle UI/UX Designer, location Ukraine\n\n📌Middle QAs, location Ukraine\n\n📌Senior Java Developer, location Ukraine\n\n📌Middle Java Developer, location France\n\nEnglish: B2\n\nNo RF, No RB ❌\nDM for CVs and rates."},
            {"role": "assistant", "content": "Available,Flutter,Middle,0,Poland,Intermediate|Available,UI/UX Designer,Middle,0,Ukraine,Intermediate|Available,QA,Middle,0,Ukraine,Intermediate|Available,Java,Senior,0,Ukraine,Intermediate|Available,Java,Middle,0,France,Intermediate"},
            {"role": "user", "content": "analyze as before: #available #outstaff #flutter #rust #java #dotnet #flutter #react #reactnative #xamarin #gamedev #angular #qa #gamedev #ui #ux #devops ❗️❗️ доступні на аутстаф ❗️❗️ ✅ Senior Java ✅ Senior Rust ✅ Senior Full-Stack (.net+React) ✅ Senior Xamarin ✅ Senior Flutter ✅ Senior Angular ✅ Senior Delphi ✅ Senior C# ✅ Lead AQA ✅ Senior React, React Native ✅ Senior GameDev, UI Gamedev ✅ Senior React ✅ Senior UI/UX ✅ Senior .net ✅ Senior DevOps. Всі з хорошою англ, доступні ASAP."},
            {"role": "assistant", "content": "Available,Java,Senior,0,0,Intermediate|Available,Rust,Senior,0,0,Intermediate|Available,.Net,Senior,0,0,Intermediate|Available,React,Senior,0,0,Intermediate|Available,Xamarin,Senior,0,0,Intermediate|Available,Flutter,Senior,0,0,Intermediate|Available,Angular,Senior,0,0,Intermediate|Available,Delphi,Senior,0,0,Intermediate|Available,C#,Senior,0,0,Intermediate|Available,AQA,Lead,0,0,Intermediate|Available,React,Senior,0,0,Intermediate|Available,React Native,Senior,0,0,Intermediate|Available,Gamedev,Senior,0,0,Intermediate|Available,React,Senior,0,0,Intermediate|Available,UI/UX,Senior,0,0,Intermediate|Available,.Net,Senior,0,0,Intermediate|Available,DevOps,Senior,0,0,Intermediate"},
            {"role": "user", "content": f"analyze as before: {text}"},
        ]

    )
    structured_text = result.choices[0].message.content
    return structured_text

def save_structured_text(structured_text: str, post_id: int, source_id: int, db: _orm.session):
    titles = structured_text.split("|")
    fields = []
    for title in titles:
        fields = title.split(",")
        session()
        db_job = _models.Job(post_id=post_id, source_id=source_id, type=fields[0], stack=fields[1], seniority=fields[2], rate=fields[3], location=fields[4], english_level=fields[5])
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        session.close()


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.session_factory()
    try:
        yield db
    finally:
        db.close()


async def get_source_by_link(link: str, db: _orm.session):
    return db.query(_models.Source).filter(_models.Source.link == link).first()


async def create_source(source: _schemas.SourceCreate, db: _orm.session):
    db_source = _models.Source(name=source.name, link=source.link)
    db.add(db_source)
    db.commit()
    db.refresh(db_source)
    return db_source


async def get_sources(db: _orm.session):
    session()
    sources = db.query(_models.Source).all()
    if not sources:
        session.close()
        raise _fastapi.HTTPException(
            status_code=404, detail="Sources not found!")
    session.close()
    return sources


async def delete_source(id: int, db: _orm.session):
    not_empty = db.query(_models.Post).filter(
        _models.Post.source_id == id).first()
    if not_empty:
        raise _fastapi.HTTPException(
            status_code=400, detail="Source has some posts, delete them firstly!"
        )
    success = db.query(_models.Source).filter(_models.Source.id == id).delete()
    if not success:
        raise _fastapi.HTTPException(
            status_code=404, detail="Source not found!")
    db.commit()
    return JSONResponse(status_code=200, content={"message": "Source was successfully deleted"})


async def get_posts(db: _orm.session):
    session()
    posts = db.query(_models.Post).all()
    session.close()
    if not posts:
        raise _fastapi.HTTPException(
            status_code=404, detail="Posts not found!")
    return posts

async def get_one_post(source_id: int, id: int, db: _orm.session):
    session()
    post = db.query(_models.Post).filter(_models.Post.id == id, _models.Post.source_id == source_id).first()
    session.close()
    if not post:
        raise _fastapi.HTTPException(
            status_code=404, detail="Post not found!")
    return post
    

async def update_posts(source_id: int, db: _orm.session):
    session()
    source = db.query(_models.Source).filter(
        _models.Source.id == source_id).first()
    if not source:
        raise _fastapi.HTTPException(
            status_code=404, detail="Source not found!")
    last_post = db.query(_models.Post).filter(_models.Post.source_id == source_id).order_by(_models.Post.id).first()
    last_post_date = datetime.now()
    if last_post:
        last_post_date = last_post.date
    posts = await _parser.update_messages(source.link, last_post_date.date())
    try:
        for post in posts:
            post = post
            db_post = db.query(_models.Post).filter(
                _models.Post.id == post["id"]).first()
            if db_post == None:
                structured_text = get_structured_text(post["text"])
                post["structured_text"] = structured_text
                db_post = _models.Post(id=post["id"], source_id=source_id, date=post["date"],
                                    author=post["author"], text=post["text"], structured_text=post["structured_text"], post_link=f"https://t.me/{source.link}/{post['id']}")
                db.add(db_post)
                db.commit()
                db.refresh(db_post)
                session.close()
                save_structured_text(structured_text, post["id"], source_id, db)
        return JSONResponse(status_code=200, content={"message": "Posts were successfully updated"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=200, content={"message": "Posts were successfully updated"})


async def delete_posts(source_id: int, db: _orm.session):
    success = db.query(_models.Post).filter(
        _models.Post.source_id == source_id).delete()
    if not success:
        raise _fastapi.HTTPException(
            status_code=404, detail="Posts not found!")
    db.commit()
    return JSONResponse(status_code=200, content={"message": "Posts was successfully deleted"})


async def get_jobs(db: _orm.session):
    jobs = db.query(_models.Job).all()
    if not jobs:
        raise _fastapi.HTTPException(
            status_code=404, detail="Jobs not found!")
    return jobs

async def get_one_job(source_id: int, post_id: int, db: _orm.session):
    session()
    job = db.query(_models.Job).filter(_models.Job.source_id == source_id, _models.Job.post_id == post_id).all()
    session.close()
    if not job:
        raise _fastapi.HTTPException(
            status_code=404, detail="Job not found!")
    return job