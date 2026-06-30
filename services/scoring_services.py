def calculate_score(data):

    score = 0
    reasons = []

    if data.get("company_name"):
        score += 20
        reasons.append("Company identified")

    if data.get("email"):
        score += 20
        reasons.append("Email found")

    if data.get("phone"):
        score += 20
        reasons.append("Phone found")

    if data.get("linkedin"):
        score += 20
        reasons.append("LinkedIn found")

    if data.get("industry") and data.get("industry") != "Unknown":
        score += 20
        reasons.append("Industry identified")

    if score >= 80:
        priority = "Hot"
    elif score >= 50:
        priority = "Warm"
    else:
        priority = "Cold"

    return {
        "lead_score": score,
        "priority": priority,
        "reasons": reasons
    }