def calculate_score(data):

    score = 0
    reasons = []

    if data.company_name:
        score += 20
        reasons.append("Company identified")

    if data.email:
        score += 20
        reasons.append("Email found")

    if data.phone:
        score += 20
        reasons.append("Phone found")

    if data.linkedin:
        score += 20
        reasons.append("LinkedIn found")

    if data.industry and data.industry != "Unknown":
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