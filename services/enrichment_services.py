import re

def enrich_company(parsed_data):

    title = (parsed_data.get("title") or "").lower()
    description = (parsed_data.get("meta_description") or "").lower()

    text = title + " " + description

    # ----------------------
    # Industry Detection
    # ----------------------

    industry = "Unknown"

    industry_keywords = {
        "Technology": [
            "software", "technology", "ai", "artificial intelligence",
            "cloud", "saas", "cybersecurity", "developer"
        ],

        "Healthcare": [
            "hospital", "medical", "health", "clinic",
            "doctor", "pharma"
        ],

        "Finance": [
            "bank", "finance", "investment",
            "insurance", "fintech"
        ],

        "Education": [
            "school", "college", "university",
            "education", "learning"
        ],

        "Manufacturing": [
            "factory", "manufacturing",
            "industrial", "production"
        ],

        "E-Commerce": [
            "shopping", "store",
            "ecommerce", "online shop"
        ]
    }

    for key, words in industry_keywords.items():

        if any(word in text for word in words):
            industry = key
            break

    # ----------------------
    # Company Size
    # ----------------------

    company_size = "Small"

    if any(word in text for word in [
        "enterprise",
        "global",
        "fortune",
        "multinational"
    ]):
        company_size = "Large"

    elif any(word in text for word in [
        "growing",
        "expanding",
        "national"
    ]):
        company_size = "Medium"

    # ----------------------
    # Business Category
    # ----------------------

    category = "Unknown"

    if "saas" in text:
        category = "SaaS"

    elif "agency" in text:
        category = "Agency"

    elif "startup" in text:
        category = "Startup"

    elif "consulting" in text:
        category = "Consulting"

    elif "manufacturer" in text:
        category = "Manufacturing"

    # ----------------------
    # Verification
    # ----------------------

    verified = (
        parsed_data.get("email") is not None and
        parsed_data.get("phone") is not None
    )

    # ----------------------
    # Confidence Score
    # ----------------------

    confidence = 0

    if parsed_data.get("company_name"):
        confidence += 15

    if parsed_data.get("email"):
        confidence += 20

    if parsed_data.get("phone"):
        confidence += 20

    if parsed_data.get("linkedin"):
        confidence += 20

    if parsed_data.get("meta_description"):
        confidence += 15

    if industry != "Unknown":
        confidence += 10

    confidence = min(confidence, 100)

    # ----------------------
    # Lead Quality
    # ----------------------

    if confidence >= 80:
        lead_quality = "High"

    elif confidence >= 60:
        lead_quality = "Medium"

    else:
        lead_quality = "Low"

    return {

        "industry": industry,

        "company_size": company_size,

        "business_category": category,

        "verified": verified,

        "confidence_score": confidence,

        "lead_quality": lead_quality
    }