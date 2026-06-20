from sqlalchemy.orm import Session
from models.company import Company
from schemas.company import CompanyCreate


def create_company(db: Session, company_data: CompanyCreate):
    new_company = Company(
        name=company_data.name,
        domain_url=company_data.domain_url
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return new_company


def get_companies(db: Session):
    return db.query(Company).all()


def get_company_by_id(db: Session, company_id: str):
    return db.query(Company).filter(Company.id == company_id).first()