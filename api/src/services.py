import fastapi as _fastapi

from fastapi.responses import JSONResponse

import sqlalchemy.orm as _orm

import database as _database
import models as _models
import schemas as _schemas

import posts_parser as _parser


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
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
    sources = db.query(_models.Source).all()
    if not sources:
        raise _fastapi.HTTPException(
            status_code=404, detail="Sources not found!")
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
    posts = db.query(_models.Post).all()
    if not posts:
        raise _fastapi.HTTPException(
            status_code=404, detail="Posts not found!")
    return posts


async def update_posts(source_id: int, db: _orm.session):
    source = db.query(_models.Source).filter(
        _models.Source.id == source_id).first()
    if not source:
        raise _fastapi.HTTPException(
            status_code=404, detail="Source not found!")
    posts = await _parser.update_messages(source.link)
    for post in posts:
        db_post = db.query(_models.Post).filter(
            _models.Post.id == post["id"]).first()
        if db_post == None:
            post["structured_text"] = post["text"]  # TEMP
            db_post = _models.Post(id=post["id"], source_id=source_id, date=post["date"],
                                   author=post["author"], text=post["text"], structured_text=post["structured_text"], post_link=f"https://t.me/{source.link}/{post['id']}")
            db.add(db_post)
            db.commit()
            db.refresh(db_post)
    return JSONResponse(status_code=200, content={"message": "Posts were successfully updated"})


async def delete_posts(source_id: int, db: _orm.session):
    success = db.query(_models.Post).filter(
        _models.Post.source_id == source_id).delete()
    if not success:
        raise _fastapi.HTTPException(
            status_code=404, detail="Posts not found!")
    db.commit()
    return JSONResponse(status_code=200, content={"message": "Posts was successfully deleted"})
