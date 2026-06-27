import csv
import io
from app.api.crawler import crawler_jobs


def export_json():

    return crawler_jobs


def export_csv():

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "ID",
        "URL",
        "Status",
        "Status Code",
        "Title"
    ])

    for job in crawler_jobs:
        writer.writerow([
            job.get("id"),
            job.get("url"),
            job.get("status"),
            job.get("status_code"),
            job.get("title")
        ])

    output.seek(0)

    return output.getvalue()