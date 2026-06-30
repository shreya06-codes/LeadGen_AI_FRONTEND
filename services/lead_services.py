leads = []


def create_lead(data):

    lead = {
        "id": len(leads) + 1,
        "company_name": data["company_name"],
        "website": data["website"],
        "email": data["email"],
        "phone": data["phone"],
        "industry": data["industry"],
        "company_size": data["company_size"],
        "lead_quality": data["lead_quality"],
        "score": data["score"],
        "status": "New"
    }

    leads.append(lead)

    return lead


def get_all_leads():
    return leads


def get_lead(lead_id):

    for lead in leads:
        if lead["id"] == lead_id:
            return lead

    return None


def delete_lead(lead_id):

    for lead in leads:
        if lead["id"] == lead_id:
            leads.remove(lead)
            return True

    return False