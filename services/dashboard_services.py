from app.api.crawler import crawler_jobs


def get_dashboard_summary():

    total_crawls = len(crawler_jobs)

    completed = sum(
        1 for job in crawler_jobs
        if job["status"] == "Completed"
    )

    running = sum(
        1 for job in crawler_jobs
        if job["status"] == "Running"
    )

    stopped = sum(
        1 for job in crawler_jobs
        if job["status"] == "Stopped"
    )

    success_rate = (
        round((completed / total_crawls) * 100, 2)
        if total_crawls else 0
    )

    return {
        "total_crawls": total_crawls,
        "completed": completed,
        "running": running,
        "stopped": stopped,
        "success_rate": f"{success_rate}%"
    }