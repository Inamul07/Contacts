from pydantic import BaseModel


class Contact(BaseModel):
    name: str
    phone: str

    class Config:
        schema_extra = {
            "example": {
                "name": "John Doe",
                "phone": "123456789",
            }
        }
