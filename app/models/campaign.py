import uuid
from sqlalchemy import Column, String, Integer, Text, Boolean
from app.db.base import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text)
    goal_amount = Column(Integer, nullable=False)
    current_amount = Column(Integer, default=0)
    owner_id = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
