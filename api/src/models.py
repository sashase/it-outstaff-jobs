import sqlalchemy as _sql
import sqlalchemy.orm as _orm

import database as _database


class Source(_database.Base):
    __tablename__ = "sources"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    name = _sql.Column(_sql.String, index=True)
    link = _sql.Column(_sql.String)

    posts = _orm.relationship("Post", back_populates="source")


class Post(_database.Base):
    __tablename__ = "posts"
    id = _sql.Column(_sql.Integer, primary_key=True, index=True)
    text = _sql.Column(_sql.String, index=True)
    structured_text = _sql.Column(_sql.String, index=True)
    author = _sql.Column(_sql.String)
    date = _sql.Column(_sql.DateTime)
    post_link = _sql.Column(_sql.String)
    source_id = _sql.Column(_sql.Integer, _sql.ForeignKey("sources.id"))

    source = _orm.relationship("Source", back_populates="posts")
