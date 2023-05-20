import sqlalchemy as _sql
import sqlalchemy.orm as _orm

import database as _database


class Source(_database.Base):
    __tablename__ = "sources"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    name = _sql.Column(_sql.String(255), index=True)
    link = _sql.Column(_sql.String(255))

    posts = _orm.relationship("Post", back_populates="source")


class Post(_database.Base):
    __tablename__ = "posts"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    text = _sql.Column(_sql.Text(1000))
    structured_text = _sql.Column(_sql.Text(1000))
    author = _sql.Column(_sql.String(255))
    date = _sql.Column(_sql.DateTime)
    post_link = _sql.Column(_sql.String(255))
    source_id = _sql.Column(_sql.Integer, _sql.ForeignKey("sources.id"))

    source = _orm.relationship("Source", back_populates="posts")


class Job(_database.Base):
    __tablename__ = "jobs"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    post_id = _sql.Column(_sql.Integer)
    source_id = _sql.Column(_sql.Integer)
    type = _sql.Column(_sql.String(255))
    stack = _sql.Column(_sql.String(255))
    seniority = _sql.Column(_sql.String(255))
    rate = _sql.Column(_sql.Integer)
    location = _sql.Column(_sql.String(255))
    english_level = _sql.Column(_sql.String(255))
