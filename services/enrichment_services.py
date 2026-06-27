def enrich_company(company_name: str, website: str):

    website = website.lower()

    industry = "Unknown"
    category = "Unknown"
    company_size = "Unknown"

    if "ai" in website:
        industry = "Artificial Intelligence"
        category = "AI Software"
        company_size = "1000+"

    elif "tech" in website:
        industry = "Technology"
        category = "Software"
        company_size = "500-1000"

    elif "health" in website:
        industry = "Healthcare"
        category = "Health Services"
        company_size = "200-500"

    elif "finance" in website:
        industry = "Finance"
        category = "Financial Services"
        company_size = "500-1000"

    return {
        "company_name": company_name,
        "website": website,
        "industry": industry,
        "business_category": category,
        "company_size": company_size,
        "ai_summary": f"{company_name} operates in the {industry} industry.",
        "confidence": 0.90
    }