from motor import motor_asyncio
import urllib3

client = motor_asyncio.AsyncIOMotorClient(
    "mongodb+srv://adminajax:adminajax@contacts-app.hr1hes3.mongodb.net/?retryWrites=true&w=majority")

db = client.contacts_app
collection = db.contacts


async def create(data):
    data = dict(data)
    try:
        await collection.insert_one(data)
        return {"Inserted": True}
    except:
        return {"Inserted": False}


async def get_all():
    response = collection.find({}, {"_id": 0})
    data = []
    async for i in response:
        # i["_id"] = str(i["_id"])
        data.append(i)
    return data


async def delete(phone):
    try:
        await collection.delete_one({"phone": phone})
        return {"Deleted": True}
    except:
        return {"Deleted": False}

    