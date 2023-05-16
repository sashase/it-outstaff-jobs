import fastapi as _fastapi
import sqlalchemy.orm as _orm

import services as _services
import schemas as _schemas

app = _fastapi.FastAPI()

_services.create_database()


# SOURCES ENDPOINTS


@app.post("/sources/")
async def create_source(source: _schemas.SourceCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    db_source = await _services.get_source_by_link(source.link, db)
    if db_source:
        raise _fastapi.HTTPException(
            status_code=400, detail="The source already exists!")
    return await _services.create_source(source, db)


@app.get("/sources/")
async def get_sources(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_sources(db)


@app.delete("/sources/{id}")
async def delete_source(id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_source(id, db)

# POSTS ENDPOINTS


@app.get("/posts/")
async def get_posts(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.get_posts(db)


@app.get("/posts/update/{source_id}/")
async def update_posts(source_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.update_posts(source_id, db)


@app.delete("/posts/{source_id}")
async def delete_posts(source_id: int, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return await _services.delete_posts(source_id, db)
