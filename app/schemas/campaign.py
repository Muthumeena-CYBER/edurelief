from pydantic import BaseModel
from typing import Optional

class CampaignCreate(BaseModel):
    title: str
    description: str
    goal_amount: int

class CampaignResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    goal_amount: int
    current_amount: int
    owner_id: str
    is_verified: bool
    is_active: bool

    class Config:
        from_attributes = True

class DonationCreate(BaseModel):
    amount: int
