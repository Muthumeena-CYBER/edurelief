from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import SessionLocal
from app.models.campaign import Campaign
from app.core.dependencies import role_required
from app.models.user import UserRole
from app.schemas.campaign import CampaignCreate, CampaignResponse, DonationCreate

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=dict)
def create_campaign(
    data: CampaignCreate,
    db: Session = Depends(get_db),
    user=Depends(role_required([UserRole.STUDENT, UserRole.PARENT]))
):
    campaign = Campaign(
        title=data.title,
        description=data.description,
        goal_amount=data.goal_amount,
        owner_id=user.id,
        is_verified=True # Auto-verify for testing/demo purposes as requested by UX
    )
    db.add(campaign)
    db.commit()
    return {"message": "Campaign created", "id": campaign.id}

@router.get("/me", response_model=List[CampaignResponse])
def list_my_campaigns(
    db: Session = Depends(get_db),
    user=Depends(role_required([UserRole.STUDENT, UserRole.PARENT]))
):
    return db.query(Campaign).filter(Campaign.owner_id == user.id).all()

@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: str,
    db: Session = Depends(get_db),
    user=Depends(role_required([UserRole.STUDENT, UserRole.PARENT]))
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.owner_id == user.id).first()
    if not campaign:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Campaign not found or unauthorized")
    db.delete(campaign)
    db.commit()
    return {"message": "Campaign deleted"}

@router.get("/", response_model=List[CampaignResponse])
def list_campaigns(db: Session = Depends(get_db)):
    return db.query(Campaign).filter(Campaign.is_active == True).all() # Only show active campaigns to donors

@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(campaign_id: str, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/{campaign_id}/donate")
def donate_to_campaign(
    campaign_id: str,
    data: DonationCreate,
    db: Session = Depends(get_db)
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if not campaign.is_active:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="This campaign has reached its goal and is no longer active.")
    
    campaign.current_amount += data.amount
    
    # Automatically deactivate if goal reached
    if campaign.current_amount >= campaign.goal_amount:
        campaign.is_active = False
        
    db.commit()
    db.refresh(campaign)
    return {"message": "Donation successful", "current_amount": campaign.current_amount, "is_active": campaign.is_active}
