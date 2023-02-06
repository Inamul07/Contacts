from fastapi import FastAPI
import db
import models

app = FastAPI()


@app.get("/")
def root():
    return {"Message": "Hello World!!"}


@app.post("/create-contact")
async def create_contact(data: models.Contact):
    return await db.create(data)


@app.get("/contacts", response_model=None)
async def get_all_contacts():
    data = await db.get_all()
    return {"data": data}


@app.delete("/delete-contact")
async def delete_contact(phone):
    return await db.delete(phone)
