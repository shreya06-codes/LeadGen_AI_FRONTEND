from bs4 import BeautifulSoup
import re

def parse_html(url: str, html: str):

    soup = BeautifulSoup(html, "html.parser")

    company_name = None

    if soup.title and soup.title.string:
        company_name = soup.title.string.strip()

    og_site = soup.find("meta", property="og:site_name")
    if og_site:
        company_name = og_site.get("content")

    meta_description = None
    meta = soup.find("meta", attrs={"name": "description"})
    if meta:
        meta_description = meta.get("content")

    logo = None
    icon = soup.find("link", rel=lambda x: x and "icon" in x.lower())
    if icon:
        logo = icon.get("href")

    email_match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        html
    )
    email = email_match.group(0) if email_match else None

    phone_match = re.search(
        r"\+?\d[\d\s\-\(\)]{8,}\d",
        html
    )
    phone = phone_match.group(0) if phone_match else None

    linkedin = None
    facebook = None
    twitter = None
    instagram = None
    contact_page = None

    for link in soup.find_all("a", href=True):

        href = link["href"]

        if "linkedin.com" in href:
            linkedin = href

        elif "facebook.com" in href:
            facebook = href

        elif "twitter.com" in href or "x.com" in href:
            twitter = href

        elif "instagram.com" in href:
            instagram = href

        elif "contact" in href.lower():
            contact_page = href

    confidence = 0

    if company_name:
        confidence += 20
    if email:
        confidence += 20
    if phone:
        confidence += 20
    if linkedin:
        confidence += 20
    if meta_description:
        confidence += 20

    confidence /= 100

    return {
        "company_name": company_name,
        "website": url,
        "title": company_name,
        "meta_description": meta_description,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "facebook": facebook,
        "twitter": twitter,
        "instagram": instagram,
        "contact_page": contact_page,
        "logo": logo,
        "address": None,
        "confidence": confidence
    }