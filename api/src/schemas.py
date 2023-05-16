from typing import List
import datetime as _dt
import pydantic as _pydantic


class _PostBase(_pydantic.BaseModel):
    text: str
    structured_text: str
    author: str


class Post(_PostBase):
    id: int
    source_id: int
    date: _dt.datetime

    class Config:
        orm_mode = True


class _SourceBase(_pydantic.BaseModel):
    name: str
    link: str


class SourceCreate(_SourceBase):
    pass


class Source(_SourceBase):
    id: int
    posts: List[Post] = []
